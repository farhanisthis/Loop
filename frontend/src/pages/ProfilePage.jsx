import { usePosts } from "../context/PostContext";
import { Settings, Grid3X3, Camera } from "lucide-react";
import { useState, useRef } from "react";
import PostDetailModal from "../components/posts/PostDetailModal";
import StoredImage from "../components/common/StoredImage";

const ProfilePage = () => {
  const { posts, currentUserAvatar, updateAvatar } = usePosts();
  const [selectedPost, setSelectedPost] = useState(null);
  const avatarInputRef = useRef(null);
  const username = "Farhan";

  const myPosts = posts.filter(
    (post) => post.username.toLowerCase() === username.toLowerCase(),
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    await updateAvatar(file);
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 pb-20 sm:px-8 md:pb-8">
      {/* Profile Header */}
      <section className="flex flex-col gap-6 border-b border-gray-100 pb-8 sm:flex-row sm:items-center sm:gap-12">
        {/* Avatar with change-image overlay */}
        <div className="relative shrink-0 sm:ml-8">
          <img
            src={currentUserAvatar}
            alt={`${username}'s profile`}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-violet-100 sm:h-32 sm:w-32"
          />

          {/* Hover overlay */}
          <button
            type="button"
            aria-label="Change profile photo"
            onClick={() => avatarInputRef.current?.click()}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-full bg-black/0 text-transparent transition-all duration-200 hover:bg-black/40 hover:text-white"
          >
            <Camera size={18} strokeWidth={2} />
            <span className="text-[10px] font-semibold leading-none sm:text-xs">
              Change
            </span>
          </button>

          {/* Hidden file input */}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">{username}</h1>

            <button
              type="button"
              className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Edit profile
            </button>

            <button
              type="button"
              aria-label="Settings"
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Settings size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="my-5 flex gap-6 text-sm sm:gap-8">
            <p>
              <span className="font-bold text-gray-900">{myPosts.length}</span>{" "}
              <span className="text-gray-500">posts</span>
            </p>
            <p>
              <span className="font-bold text-gray-900">120</span>{" "}
              <span className="text-gray-500">followers</span>
            </p>
            <p>
              <span className="font-bold text-gray-900">180</span>{" "}
              <span className="text-gray-500">following</span>
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-0.5 text-sm">
            <p className="font-semibold text-gray-900">Farhan Ali</p>
            <p className="text-gray-500">
              Building things, learning every day.
            </p>
            <p className="font-medium text-violet-600">Full Stack Developer</p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pt-6">
        <div className="mb-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
          <Grid3X3 size={14} />
          Posts
        </div>

        {myPosts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 rounded-full border-2 border-gray-200 p-5">
              <Grid3X3 size={28} className="text-gray-400" />
            </div>

            <h2 className="text-lg font-bold text-gray-900">Share your first post</h2>

            <p className="mt-1.5 text-sm text-gray-400">
              Your photos will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
              >
                <StoredImage
                  imageId={post.imageId}
                  fallbackSrc={post.image}
                  alt={post.imageAlt || post.caption || "Post"}
                  onClick={() => setSelectedPost(post)}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                {post.caption && (
                  <div className="absolute inset-0 flex items-end bg-black/0 p-3 opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100">
                    <p className="line-clamp-3 text-xs font-medium text-white sm:text-sm">
                      {post.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
