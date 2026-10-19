import { createContext, useContext, useState } from "react";
import initialPosts from "../data/mockData";

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
  const [posts, setPosts] = useState(initialPosts);

  const createPost = ({ imageFile, caption }) => {
    const newPost = {
      id: crypto.randomUUID(),
      username: "Farhan",
      avatar: "https://i.pravatar.cc/150?img=12",
      image: URL.createObjectURL(imageFile),
      imageAlt: "New post",
      location: "",
      likes: 0,
      caption,
      timeAgo: "Just Now",
      likedByCurrentUser: false,
      comments: [],
    };
    setPosts((currentPosts) => [newPost, ...currentPosts]);
  };
  return (
    <PostContext.Provider
      value={{ posts, createPost, toggleLike, addComment, toggleBookmark }}
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
