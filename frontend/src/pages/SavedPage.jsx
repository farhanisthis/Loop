import { useState } from "react";
import { Bookmark } from "lucide-react";
import { usePosts } from "../context/PostContext";
import PostDetailModal from "../components/posts/PostDetailModal";
import StoredImage from "../components/common/StoredImage";

const SavedPage = () => {
  const { posts } = usePosts();
  const [selectedPost, setSelectedPost] = useState(null);

  const savedPosts = posts.filter((post) => post.savedByCurrentUser ?? false);

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 pb-20 sm:px-8 md:pb-8">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
        <Bookmark size={22} className="text-gray-700" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Saved Posts</h1>
          <p className="text-xs text-gray-400">Posts you've bookmarked</p>
        </div>
      </div>

      {savedPosts.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-full border-2 border-gray-200 p-5">
            <Bookmark size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Save posts you love</h2>
          <p className="mt-1.5 text-sm text-gray-400">
            Posts you bookmark will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          {savedPosts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedPost(post)}
              aria-label={`Open saved post by ${post.username}`}
              className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
            >
              <StoredImage
                imageId={post.imageId}
                fallbackSrc={post.image}
                alt={post.imageAlt || post.caption || "Saved post"}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-black/0 p-3 opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100">
                <p className="line-clamp-3 text-xs font-medium text-white sm:text-sm">
                  {post.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default SavedPage;
