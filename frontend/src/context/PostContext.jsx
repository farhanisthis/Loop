import { createContext, useContext, useEffect, useRef, useState } from "react";
import initialPosts from "../data/mockData";
import { saveImage, deleteImage, getAvatarImage, saveAvatarImage } from "../utils/imageStorage";

const PostContext = createContext();

const CURRENT_USER = "Farhan";
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem("loop-posts");
      return savedPosts ? JSON.parse(savedPosts) : initialPosts;
    } catch {
      return initialPosts;
    }
  });

  // ── Current-user avatar ────────────────────────────────────────
  const [currentUserAvatar, setCurrentUserAvatar] = useState(DEFAULT_AVATAR);
  const avatarObjectUrlRef = useRef(null);

  // Load persisted avatar from IndexedDB on mount.
  useEffect(() => {
    let cancelled = false;

    async function loadAvatar() {
      try {
        const blob = await getAvatarImage();
        if (!blob || cancelled) return;

        const url = URL.createObjectURL(blob);
        avatarObjectUrlRef.current = url;
        setCurrentUserAvatar(url);

        // Also patch any already-loaded posts so they show the right avatar.
        setPosts((current) =>
          current.map((post) =>
            post.username.toLowerCase() === CURRENT_USER.toLowerCase()
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
  }, []);

  // Persist a new avatar and propagate it everywhere.
  const updateAvatar = async (file) => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    avatarObjectUrlRef.current = url;
    setCurrentUserAvatar(url);

    // Update post.avatar on every post authored by the current user.
    setPosts((current) =>
      current.map((post) =>
        post.username.toLowerCase() === CURRENT_USER.toLowerCase()
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

  // ── Posts persistence ──────────────────────────────────────────
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
      username: CURRENT_USER,
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
      username: CURRENT_USER,
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
