import { usePosts } from "../context/PostContext";
import { Settings, Grid3X3, Bookmark } from "lucide-react";
import { useState } from "react";
import PostDetailModal from "../components/posts/PostDetailModal";

const ProfilePage = () => {
  const { posts } = usePosts();
  const [selectedPost, setSelectedPost] = useState(null);
  const username = "Farhan";
  const avatar = "https://i.pravatar.cc/150?img=12";

  const myPosts = posts.filter(
    (post) => post.username.toLowerCase() === username.toLowerCase(),
  );

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-8">
      {/* Profile Header */}
      <section className="flex flex-col gap-8 border-b border-gray-200 pb-8 sm:flex-row sm:items-center sm:gap-14">
        <img
          src={avatar}
          alt={`${username}'s profile`}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-purple-100 sm:ml-8 sm:h-36 sm:w-36"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">{username}</h1>

            <button
              type="button"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200"
            >
              Edit profile
            </button>

            <button
              type="button"
              aria-label="Settings"
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="my-6 flex gap-6 text-sm sm:gap-10 sm:text-base">
            <p>
              <span className="font-bold">{myPosts.length}</span> posts
            </p>
            <p>
              <span className="font-bold">120</span> followers
            </p>
            <p>
              <span className="font-bold">180</span> following
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-gray-900">Farhan Ali</p>
            <p className="text-gray-600">
              Building things, learning every day.
            </p>
            <p className="font-medium text-purple-700">Full Stack Developer</p>
          </div>
        </div>
      </section>

      {/* Posts Grid Heading */}
      <section className="pt-6">
        <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-800">
          <Grid3X3 size={16} />
          Posts
        </div>

        {myPosts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 rounded-full border-2 border-gray-900 p-4">
              <Grid3X3 size={32} />
            </div>

            <h2 className="text-2xl font-bold">Share your first post</h2>

            <p className="mt-2 text-sm text-gray-500">
              Your photos will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-4">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
              >
                <img
                  src={post.image}
                  alt={post.imageAlt || post.caption || "Post"}
                  onClick={() => setSelectedPost(post)}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                {post.caption && (
                  <div className="absolute inset-0 flex items-end bg-black/0 p-3 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                    <p className="line-clamp-3 text-sm font-medium text-white">
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
