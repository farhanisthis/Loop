import { createContext, useContext, useEffect, useRef, useState } from "react";
import initialPosts from "../data/mockData";
import { saveImage, deleteImage, getAvatarImage, saveAvatarImage } from "../utils/imageStorage";

const PostContext = createContext();

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";
const DEFAULT_USER_PROFILE = {
  name: "Farhan Ali",
  username: "Farhan",
  bio: "Building things, learning every day.",
  avatar: DEFAULT_AVATAR,
};

export const PostProvider = ({ children }) => {
  // ── Posts persistence ──────────────────────────────────────────
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem("loop-posts");
      return savedPosts ? JSON.parse(savedPosts) : initialPosts;
    } catch {
      return initialPosts;
    }
  });

  // ── User profile ───────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("loop-user-profile");
      return saved
        ? { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) }
        : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // ── Theme (Light / Dark) ───────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("loop-theme");
      if (saved) return saved;
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("loop-theme", theme);
    } catch (err) {
      console.error("Failed to save theme to localStorage:", err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // ── Current-user avatar ────────────────────────────────────────
  const [currentUserAvatar, setCurrentUserAvatar] = useState(() => {
    try {
      const saved = localStorage.getItem("loop-user-profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.avatar) return parsed.avatar;
      }
    } catch {
      // fallback
    }
    return DEFAULT_AVATAR;
  });
  const avatarObjectUrlRef = useRef(null);

  // Load persisted avatar from IndexedDB on mount.
  useEffect(() => {
    let cancelled = false;

    async function loadAvatar() {
      try {
        const blob = await getAvatarImage();
        if (!blob || cancelled) {
          if (userProfile.avatar && userProfile.avatar !== DEFAULT_AVATAR) {
            setCurrentUserAvatar(userProfile.avatar);
          }
          return;
        }

        const url = URL.createObjectURL(blob);
        avatarObjectUrlRef.current = url;
        setCurrentUserAvatar(url);

        // Also patch any already-loaded posts so they show the right avatar.
        setPosts((current) =>
          current.map((post) =>
            post.username.toLowerCase() === userProfile.username.toLowerCase()
              ? { ...post, avatar: url }
              : post,
          ),
        );
      } catch (err) {
        console.error("Failed to load avatar:", err);
      }
    }

    loadAvatar();

    return () => {
      cancelled = true;
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
    };
  }, [userProfile.username]);

  // Update user profile fields and sync them across the app.
  const updateUserProfile = (updates) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("loop-user-profile", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save profile to localStorage:", err);
      }
      return updated;
    });

    // If avatar URL was modified, update currentUserAvatar and posts
    if (updates.avatar && updates.avatar !== currentUserAvatar) {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
        avatarObjectUrlRef.current = null;
      }
      setCurrentUserAvatar(updates.avatar);
      setPosts((current) =>
        current.map((post) =>
          post.username.toLowerCase() === (updates.username || userProfile.username).toLowerCase()
            ? { ...post, avatar: updates.avatar }
            : post,
        ),
      );
    }

    // If username changed, update author on posts authored by current user
    if (updates.username && updates.username !== userProfile.username) {
      setPosts((current) =>
        current.map((post) =>
          post.username.toLowerCase() === userProfile.username.toLowerCase()
            ? { ...post, username: updates.username }
            : post,
        ),
      );
    }
  };

  // Persist a new avatar file in IndexedDB and propagate it everywhere.
  const updateAvatar = async (file) => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    avatarObjectUrlRef.current = url;
    setCurrentUserAvatar(url);
    setUserProfile((prev) => {
      const updated = { ...prev, avatar: url };
      try {
        localStorage.setItem("loop-user-profile", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save avatar to localStorage:", err);
      }
      return updated;
    });

    // Update post.avatar on every post authored by the current user.
    setPosts((current) =>
      current.map((post) =>
        post.username.toLowerCase() === userProfile.username.toLowerCase()
          ? { ...post, avatar: url }
          : post,
      ),
    );

    try {
      await saveAvatarImage(file);
    } catch (err) {
      console.error("Failed to save avatar:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("loop-posts", JSON.stringify(posts));
  }, [posts]);

  // ── Post actions ───────────────────────────────────────────────
  const toggleLike = (postId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;
        const isLiked = post.likedByCurrentUser ?? false;

        return {
          ...post,
          likedByCurrentUser: !isLiked,
          likes: Math.max(0, post.likes + (isLiked ? -1 : 1)),
        };
      }),
    );
  };

  const toggleBookmark = (postId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              savedByCurrentUser: !(post.savedByCurrentUser ?? false),
            }
          : post,
      ),
    );
  };

  const addComment = (postId, text) => {
    const trimmedText = text.trim();

    if (!trimmedText) return;

    const newComment = {
      id: crypto.randomUUID(),
      username: userProfile.username,
      text: trimmedText,
      timeAgo: "Just now",
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments ?? []), newComment] }
          : post,
      ),
    );
  };

  const createPost = async ({ imageFile, caption }) => {
    const postId = crypto.randomUUID();

    await saveImage(postId, imageFile);

    const newPost = {
      id: postId,
      username: userProfile.username,
      avatar: currentUserAvatar,
      imageId: postId,
      imageAlt: "New post",
      location: "",
      likes: 0,
      caption,
      timeAgo: "Just now",
      likedByCurrentUser: false,
      savedByCurrentUser: false,
      comments: [],
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
  };

  const deletePost = async (postId) => {
    const postToDelete = posts.find((post) => post.id === postId);
    if (!postToDelete) return;

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId),
    );

    if (postToDelete.imageId) {
      try {
        await deleteImage(postToDelete.imageId);
      } catch (error) {
        console.error("Failed to delete stored image:", error);
      }
    }
  };

  const deleteComment = (postId, commentId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId,
              ),
            }
          : post,
      ),
    );
  };

  const updatePost = (postId, updates) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, ...updates } : post,
      ),
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        currentUserAvatar,
        updateAvatar,
        userProfile,
        updateUserProfile,
        theme,
        toggleTheme,
        createPost,
        toggleLike,
        addComment,
        toggleBookmark,
        deletePost,
        updatePost,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePosts must be used inside PostProvider");
  }

  return context;
};
