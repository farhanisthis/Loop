import { useState } from "react";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/layout/Sidebar";
import CreatePost from "./components/posts/CreatePost";
import SavedPage from "./pages/SavedPage";
import MobileNav from "./components/layout/MobileNav";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import initialPosts from "./data/mockData";
import { PostProvider } from "./context/PostContext";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const [posts, setPosts] = useState(initialPosts);

  const handleCreatePost = ({ imageFile, caption }) => {
    const newPost = {
      id: crypto.randomUUID(),
      username: "farhan",
      avatar: "https://i.pravatar.cc/150?img=12",
      image: URL.createObjectURL(imageFile),
      imageAlt: "New post",
      location: "",
      likes: 0,
      caption,
      timeAgo: "Just now",
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
  };

  return (
    <PostProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#faf7fb]">
          <Sidebar />
          <MobileNav />

          <main className="w-full pb-[env(safe-area-inset-bottom)] md:ml-60 md:w-[calc(100%-15rem)]">
            <Routes>
              <Route path="/" element={<HomePage posts={posts} />} />

              <Route
                path="/create"
                element={<CreatePost onCreatePost={handleCreatePost} />}
              />

              <Route path="*" element={<Navigate to="/" replace />} />

              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/saved" element={<SavedPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </PostProvider>
  );
};

export default App;
