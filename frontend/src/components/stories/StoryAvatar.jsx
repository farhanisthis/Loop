import React from "react";

const StoryAvatar = ({
  username,
  image,
  isOwnStory = false,
  hasUnseenStory = true,
}) => {
  return (
    <button className="flex w-20  shrink-0 flex-col items-center gap-2 hover:scale-103 cursor-pointer transition-all">
      <div
        className={`relative rounded-full p-0.75 ${hasUnseenStory ? "bg-linear-to-tr from amber-400 via pink-500 to-violet-600" : "bg-gray-200"}`}
      >
        <div className="rounded-full border-0.75 border-white">
          <img
            src={image}
            alt={`${username}'s story`}
            className="h-16 w-16 rounded-full object-cover "
          />
        </div>
        <div>
          {isOwnStory && (
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-sm text-white">
              +
            </span>
          )}
        </div>
      </div>
      <span className="w-full truncate text-center text-sm text-gray-700 capitalize font-semibold">
        {isOwnStory ? "Your Story" : username}
      </span>
    </button>
  );
};

export default StoryAvatar;
