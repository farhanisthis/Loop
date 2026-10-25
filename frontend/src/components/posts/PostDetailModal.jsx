import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  X,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import { usePosts } from "../../context/PostContext";
import StoredImage from "../common/StoredImage";

function PostDetailModal({ post, onClose }) {
  const {
    posts,
    toggleLike,
    addComment,
    updatePost,
    deletePost,
    deleteComment,
  } = usePosts();

  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption ?? "");
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
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-gray-700 shadow-sm transition hover:bg-white hover:text-gray-900 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Post image */}
        <div className="flex min-h-0 items-center justify-center bg-black md:w-[55%]">
          <StoredImage
            imageId={currentPost.imageId}
            fallbackSrc={currentPost.image}
            alt={currentPost.imageAlt || `Post by ${currentPost.username}`}
            className="max-h-[40dvh] w-full object-contain md:max-h-[85dvh]"
          />
        </div>

        {/* Post details */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:w-[45%]">
          {/* Author header */}
          <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
            <img
              src={currentPost.avatar}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {currentPost.username}
              </p>
              {currentPost.location && (
                <p className="truncate text-xs text-gray-400">
                  {currentPost.location}
                </p>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="More post options"
                onClick={() => setShowPostMenu((open) => !open)}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <MoreHorizontal size={20} />
              </button>

              {showPostMenu && (
                <div className="absolute right-0 top-full z-40 mt-1 w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedCaption(currentPost.caption ?? "");
                      setShowPostMenu(false);
                      setShowEditModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Pencil size={15} />
                    Edit caption
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPostMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete post
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Caption and comments */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
            <div className="flex items-start gap-3">
              <img
                src={currentPost.avatar}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />

              <p className="min-w-0 text-sm leading-relaxed text-gray-700">
                <span className="mr-1.5 font-semibold text-gray-900">
                  {currentPost.username}
                </span>
                {currentPost.caption}
                <span className="ml-2 text-xs text-gray-400">
                  {currentPost.timeAgo}
                </span>
              </p>
            </div>

            {comments.length === 0 ? (
              <div className="py-8 text-center">
                <MessageCircle
                  size={26}
                  className="mx-auto mb-2 text-gray-200"
                />
                <p className="text-sm font-medium text-gray-600">
                  No comments yet
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Start the conversation.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
                    {comment.username?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-gray-700">
                      <span className="mr-1.5 font-semibold text-gray-900">
                        {comment.username}
                      </span>
                      {comment.text}
                    </p>

                    {comment.timeAgo && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {comment.timeAgo}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteComment(post.id, comment.id)}
                    aria-label="Delete comment"
                    title="Delete comment"
                    className="shrink-0 rounded-lg p-1 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Actions and like count */}
          <div className="border-t border-gray-100 px-4 pt-3 pb-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleLike(currentPost.id)}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                aria-pressed={isLiked}
                className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                  isLiked
                    ? "text-rose-500"
                    : "text-gray-700 hover:text-rose-500"
                }`}
              >
                <Heart
                  size={22}
                  fill={isLiked ? "currentColor" : "none"}
                  className="transition-transform active:scale-90"
                />
              </button>

              <button
                type="button"
                aria-label="Comments"
                className="rounded-lg p-1.5 text-gray-700 transition-colors hover:text-violet-600 cursor-pointer"
              >
                <MessageCircle size={22} />
              </button>

              <button
                type="button"
                aria-label="Share post"
                className="rounded-lg p-1.5 text-gray-700 transition-colors hover:text-violet-600 cursor-pointer"
              >
                <Send size={21} />
              </button>
            </div>

            <p className="mt-1.5 text-sm font-semibold text-gray-900">
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
              placeholder="Add a comment…"
              aria-label="Write a comment"
              className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="shrink-0 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      </section>

      {showEditModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              updatePost(currentPost.id, {
                caption: editedCaption.trim(),
              });
              setShowEditModal(false);
            }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-base font-bold text-gray-900">Edit caption</h2>

            <textarea
              autoFocus
              value={editedCaption}
              onChange={(event) => setEditedCaption(event.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Write a caption..."
              className="mt-4 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="modal-delete-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="modal-delete-title"
              className="text-base font-bold text-gray-900"
            >
              Delete this post?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  await deletePost(currentPost.id);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetailModal;
