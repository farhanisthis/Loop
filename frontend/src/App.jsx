import React from "react";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/layout/Sidebar";
import StoryAvatar from "./components/stories/StoryAvatar";

const App = () => {
  return (
    <div className="min-h-screen bg-[#faf7fb]">
      <Sidebar />

      <main className="w-full md:ml-[235px] md:w-[calc(100%-235px)]">
        <HomePage />
      </main>
    </div>
  );
};

export default App;
