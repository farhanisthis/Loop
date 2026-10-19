import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, X, MoreHorizontal } from "lucide-react";
import { usePosts } from "../../context/PostContext";

function PostDetailModal({ post, onClose }) {
  const { posts, toggleLike, addComment } = usePosts();
  const [commentText, setCommentText] = useState("");

  // Always use the latest version of this post from Context.
  const currentPost = posts.find((item) => item.id === post.id) ?? post;

  const isLiked = currentPost.likedByCurrentUser ?? false;
  const comments = currentPost.comments ?? [];

  // Close the modal when Escape is pressed.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    const text = commentText.trim();

    if (!text) return;

    addComment(currentPost.id, text);
    setCommentText("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Post by ${currentPost.username}`}
        className="relative flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close post"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-gray-800 shadow-sm transition hover:bg-white cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Post image */}
        <div className="flex min-h-0 items-center justify-center bg-black md:w-[55%]">
          <img
            src={currentPost.image}
            alt={currentPost.imageAlt || `Post by ${currentPost.username}`}
            className="max-h-[40dvh] w-full object-contain md:max-h-[85dvh]"
          />
        </div>

        {/* Post details */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:w-[45%]">
          {/* Author header */}
          <header className="flex items-center gap-3 border-b border-gray-100 p-4">
            <img
              src={currentPost.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {currentPost.username}
              </p>
              {currentPost.location && (
                <p className="truncate text-xs text-gray-500">
                  {currentPost.location}
                </p>
              )}
            </div>

            <button
              type="button"
              aria-label="More post options"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <MoreHorizontal size={21} />
            </button>
          </header>

          {/* Caption and comments */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            <div className="flex items-start gap-3">
              <img
                src={currentPost.avatar}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />

              <p className="min-w-0 text-sm leading-6 text-gray-700">
                <span className="mr-2 font-semibold text-gray-900">
                  {currentPost.username}
                </span>
                {currentPost.caption}
                <span className="ml-2 text-xs text-gray-400">
                  {currentPost.timeAgo}
                </span>
              </p>
            </div>

            {comments.length === 0 ? (
              <div className="py-6 text-center cursor-pointer">
                <MessageCircle
                  size={28}
                  className="mx-auto mb-2 text-gray-300"
                />
                <p className="text-sm font-medium text-gray-700">
                  No comments yet
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Start the conversation.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                    {comment.username?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-gray-700">
                      <span className="mr-2 font-semibold text-gray-900">
                        {comment.username}
                      </span>
                      {comment.text}
                    </p>

                    {comment.timeAgo && (
                      <p className="mt-1 text-xs text-gray-400">
                        {comment.timeAgo}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions and like count */}
          <div className="border-t border-gray-100 px-4 pt-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => toggleLike(currentPost.id)}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                aria-pressed={isLiked}
                className={`transition-transform hover:scale-110 ${
                  isLiked ? "text-rose-500" : "text-gray-800"
                }`}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                aria-label="Comments"
                className="text-gray-800"
              >
                <MessageCircle size={23} />
              </button>

              <button
                type="button"
                aria-label="Share post"
                className="text-gray-800"
              >
                <Send size={22} />
              </button>
            </div>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              {(currentPost.likes ?? 0).toLocaleString()} likes
            </p>
          </div>

          {/* Add comment */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-gray-100 px-4 py-3"
          >
            <input
              type="text"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Add a comment..."
              aria-label="Write a comment"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="text-sm font-semibold text-violet-600 hover:text-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default PostDetailModal;
