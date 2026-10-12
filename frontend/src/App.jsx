import React from "react";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/layout/Sidebar";

const App = () => {
  return (
    <div className="min-h-screen bg-[#faf7fb]">
      <Sidebar />

      <main className="min-h=screen md: ml-64">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Loop</h1>
          <p className="mt-2 text-gray-500">
            Share moments. Build Connections. Make progress
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
