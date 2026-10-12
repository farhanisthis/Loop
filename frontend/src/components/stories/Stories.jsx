import React from "react";
import StoryAvatar from "./StoryAvatar";

const Stories = () => {
  const stories = [
    {
      id: 1,
      username: "alex",
      image: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      username: "sarah",
      image: "https://i.pravatar.cc/150?img=47",
    },
    {
      id: 3,
      username: "mike",
      image: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 4,
      username: "priya",
      image: "https://i.pravatar.cc/150?img=44",
    },
    {
      id: 5,
      username: "jordan",
      image: "https://i.pravatar.cc/150?img=11",
    },
  ];

  return (
    <section className="mb-6 w-full rounded-2xl border border-gray-100 bg-white p-3 sm:p-4">
      <div className="flex w-full gap-4 py-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <StoryAvatar
          username="farhan"
          image="https://i.pravatar.cc/150?img=68"
          isOwnStory
          hasUnseenStory={false}
        />

        {stories.map((story) => (
          <StoryAvatar key={story.id} {...story} />
        ))}
      </div>
    </section>
  );
};

export default Stories;
