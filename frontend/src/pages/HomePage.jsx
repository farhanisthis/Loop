import React from "react";
import Sidebar from "../components/layout/Sidebar";
import StoryAvatar from "../components/stories/StoryAvatar";
import Stories from "../components/stories/Stories";

const HomePage = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 ">
      <Stories />
    </div>
  );
};

export default HomePage;
