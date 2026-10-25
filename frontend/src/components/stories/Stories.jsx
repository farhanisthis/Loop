import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Plus, ImagePlus } from "lucide-react";
import { saveStoryImage, getStoryImage } from "../../utils/imageStorage";

const storiesData = [
  {
    id: 1,
    username: "alex",
    avatar: "https://i.pravatar.cc/150?img=1",
    image: "https://picsum.photos/seed/story1/600/1000",
  },
  {
    id: 2,
    username: "sarah",
    avatar: "https://i.pravatar.cc/150?img=5",
    image: "https://picsum.photos/seed/story2/600/1000",
  },
  {
    id: 3,
    username: "mike",
    avatar: "https://i.pravatar.cc/150?img=8",
    image: "https://picsum.photos/seed/story3/600/1000",
  },
  {
    id: 4,
    username: "emma",
    avatar: "https://i.pravatar.cc/150?img=9",
    image: "https://picsum.photos/seed/story4/600/1000",
  },
  {
    id: 5,
    username: "rohan",
    avatar: "https://i.pravatar.cc/150?img=11",
    image: "https://picsum.photos/seed/story5/600/1000",
  },
  {
    id: 6,
    username: "priya",
    avatar: "https://i.pravatar.cc/150?img=16",
    image: "https://picsum.photos/seed/story6/600/1000",
  },
  {
    id: 7,
    username: "liam",
    avatar: "https://i.pravatar.cc/150?img=12",
    image: "https://picsum.photos/seed/story7/600/1000",
  },
  {
    id: 8,
    username: "chloe",
    avatar: "https://i.pravatar.cc/150?img=20",
    image: "https://picsum.photos/seed/story8/600/1000",
  },
  {
    id: 9,
    username: "arjun",
    avatar: "https://i.pravatar.cc/150?img=14",
    image: "https://picsum.photos/seed/story9/600/1000",
  },
  {
    id: 10,
    username: "maya",
    avatar: "https://i.pravatar.cc/150?img=23",
    image: "https://picsum.photos/seed/story10/600/1000",
  },
];

const STORY_DURATION = 24 * 60 * 60 * 1000;

const removeExpiredStories = (stories) =>
  stories.filter(
    (story) => story.createdAt && Date.now() - story.createdAt < STORY_DURATION,
  );

const Stories = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [progress, setProgress] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  const [userStories, setUserStories] = useState(() => {
    try {
      return removeExpiredStories(
        JSON.parse(localStorage.getItem("loop-stories") || "[]"),
      );
    } catch {
      return [];
    }
  });

  const allStories = [...userStories, ...storiesData];

  const displayedStories = allStories.filter(
    (story, index, stories) =>
      stories.findIndex((item) => item.username === story.username) === index,
  );

  const activeStory = activeIndex === null ? null : allStories[activeIndex];

  const [showCreateStory, setShowCreateStory] = useState(false);
  const [storyPreview, setStoryPreview] = useState("");
  const [storyFile, setStoryFile] = useState(null);

  useEffect(() => {
    localStorage.setItem("loop-stories", JSON.stringify(userStories));
  }, [userStories]);

  useEffect(() => {
    let cancelled = false;
    const objectUrls = [];

    async function restoreImages() {
      const restoredStories = await Promise.all(
        userStories.map(async (story) => {
          if (!story.imageId) return story;

          const blob = await getStoryImage(story.imageId);
          if (!blob) return story;

          const imageUrl = URL.createObjectURL(blob);
          objectUrls.push(imageUrl);

          return { ...story, image: imageUrl };
        }),
      );

      if (!cancelled) {
        setUserStories(restoredStories);
      } else {
        objectUrls.forEach(URL.revokeObjectURL);
      }
    }

    restoreImages();

    return () => {
      cancelled = true;
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null || isPaused) return;

    const interval = setInterval(() => {
      setProgress((current) => {
        const next = current + 1;

        if (next >= 100) {
          setActiveIndex((index) =>
            index === allStories.length - 1 ? null : index + 1,
          );
          return 0;
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, allStories.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === allStories.length - 1 ? null : current + 1,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current === 0 ? 0 : current - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    setProgress(0);
    setIsPaused(false);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  const goNext = () => {
    setActiveIndex((current) =>
      current === allStories.length - 1 ? null : current + 1,
    );
    setProgress(0);
    setIsPaused(false);
  };

  const goPrevious = () => {
    setActiveIndex((current) => Math.max(0, current - 1));
    setProgress(0);
    setIsPaused(false);
  };

  return (
    <>
      {/* Story circles */}
      <div className="flex gap-4 overflow-x-auto px-1 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-none]">
        <button
          type="button"
          onClick={() => setShowCreateStory(true)}
          className="flex shrink-0 flex-col items-center gap-1.5 cursor-pointer"
        >
          <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-violet-600 p-0.5 text-white">
              <Plus size={16} />
            </span>
          </span>
          <span className="text-xs text-gray-700">Your Story</span>
        </button>

        {displayedStories.map((story, index) => (
          <button
            key={story.id}
            type="button"
            onClick={() => {
              const firstStoryIndex = allStories.findIndex(
                (item) => item.username === story.username,
              );

              setActiveIndex(firstStoryIndex);
            }}
            className="flex shrink-0 flex-col items-center gap-1.5 cursor-pointer"
          >
            <span className="rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-violet-600 p-0.75">
              <img
                src={story.avatar}
                alt=""
                className="h-14 w-14 rounded-full border-2 border-white object-cover"
              />
            </span>

            <span className="max-w-16 truncate text-xs text-gray-700">
              {story.username}
            </span>
          </button>
        ))}
      </div>

      {/* Full-screen story viewer */}
      {activeStory && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative h-[85dvh] w-full max-w-md overflow-hidden rounded-2xl bg-gray-900"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
            onPointerCancel={() => setIsPaused(false)}
            onPointerLeave={() => setIsPaused(false)}
          >
            <img
              src={activeStory.image}
              alt={`Story by ${activeStory.username}`}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-3">
              <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/40">
                <div
                  className="h-full bg-white transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={activeStory.avatar}
                  alt=""
                  className="h-9 w-9 rounded-full border border-white/60 object-cover"
                />

                <span className="flex-1 text-sm font-semibold text-white">
                  {activeStory.username}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close story"
                  className="rounded-full p-2 text-white hover:bg-white/20"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous story"
              className="absolute inset-y-16 left-0 z-10 flex w-1/4 items-center justify-start pl-2 text-white cursor-pointer"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next story"
              className="absolute inset-y-16 right-0 z-10 flex w-1/4 items-center justify-end pr-2 text-white cursor-pointer"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}

      {showCreateStory && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Create a story
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowCreateStory(false);
                  setStoryFile(null);
                  setStoryPreview("");
                }}
                aria-label="Close"
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:border-violet-400">
              {storyPreview ? (
                <img
                  src={storyPreview}
                  alt="Story preview"
                  className="max-h-72 rounded-lg object-contain"
                />
              ) : (
                <>
                  <ImagePlus size={40} className="mb-3 text-violet-600" />
                  <span className="font-semibold text-gray-800">
                    Choose a photo
                  </span>
                  <span className="mt-1 text-sm text-gray-500">
                    Select an image for your story
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  if (!file.type.startsWith("image/")) {
                    alert("Please select an image.");
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    alert("Image must be smaller than 5 MB.");
                    return;
                  }

                  setStoryFile(file);
                  setStoryPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            <button
              type="button"
              disabled={!storyFile}
              onClick={async () => {
                if (!storyFile) return;

                const storyId = crypto.randomUUID();

                await saveStoryImage(storyId, storyFile);

                const newStory = {
                  id: storyId,
                  imageId: storyId,
                  username: "Farhan",
                  avatar: "https://i.pravatar.cc/150?img=12",
                  image: URL.createObjectURL(storyFile),
                  createdAt: Date.now(),
                };

                setUserStories((current) => [newStory, ...current]);

                setShowCreateStory(false);
                setStoryFile(null);
                setStoryPreview("");
              }}
              className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              Share story
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
