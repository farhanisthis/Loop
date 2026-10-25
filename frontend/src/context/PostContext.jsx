import { createContext, useContext, useEffect, useState } from "react";
import initialPosts from "../data/mockData";
import { saveImage } from "../utils/imageStorage";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
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
      username: "Farhan",
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
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem("loop-posts");
      return savedPosts ? JSON.parse(savedPosts) : initialPosts;
    } catch {
      return initialPosts;
    }
  });

  useEffect(() => {
    localStorage.setItem("loop-posts", JSON.stringify(posts));
  }, [posts]);

  const createPost = async ({ imageFile, caption }) => {
    const postId = crypto.randomUUID();

    // Save the image file in IndexedDB first
    await saveImage(postId, imageFile);

    const newPost = {
      id: postId,
      username: "Farhan",
      avatar: "https://i.pravatar.cc/150?img=12",

      // Store the image ID instead of a temporary URL
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

    // Remove the post from shared state first.
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId),
    );

    // Remove its stored image, if it has one.
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
