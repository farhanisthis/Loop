import {
  Heart,
  MessageCircle,
  MapPin,
  Send,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { usePosts } from "../../context/PostContext";
import StoredImage from "../common/StoredImage";

const PostCard = ({ post, onOpen }) => {
  const { toggleLike, addComment, toggleBookmark, deletePost, updatePost } =
    usePosts();
  const saved = post.savedByCurrentUser ?? false;
  const [showComments, setShowComments] = useState(false);

  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const comments = post.comments ?? [];
  const [commentText, setCommentText] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption ?? "");

  const likeCount = post.likes ?? 0;

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const text = commentText.trim();

    if (!text) return;

    addComment(post.id, text);
    setCommentText("");
    setShowComments(true);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Post header */}
      <div className="relative flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={post.avatar}
            alt={post.username}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 capitalize">
              {post.username}
            </p>
            {post.location && (
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin size={11} />
                <p className="text-xs">{post.location}</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="More post options"
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowPostMenu((open) => !open)}
          >
            <MoreHorizontal size={20} />
          </button>

          {showPostMenu && (
            <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setEditedCaption(post.caption ?? "");
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

          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-post-title"
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              >
                <h2
                  id="delete-post-title"
                  className="text-base font-bold text-gray-900"
                >
                  Delete this post?
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  This will remove the post from your feed and profile.
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
                      await deletePost(post.id);
                      setShowDeleteConfirm(false);
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
      </div>

      <StoredImage
        imageId={post.imageId}
        fallbackSrc={post.image}
        alt={post.imageAlt || `Post by ${post.username}`}
        className="aspect-square w-full object-cover cursor-pointer"
        onClick={onOpen}
      />

      {/* Action buttons */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggleLike(post.id)}
            aria-label={post.likedByCurrentUser ? "Unlike post" : "Like post"}
            aria-pressed={post.likedByCurrentUser ?? false}
            className={`flex items-center gap-1.5 rounded-lg p-1.5 transition-colors cursor-pointer ${
              post.likedByCurrentUser
                ? "text-rose-500"
                : "text-gray-700 hover:text-rose-500"
            }`}
          >
            <Heart
              size={22}
              fill={post.likedByCurrentUser ? "currentColor" : "none"}
              className="transition-transform active:scale-90"
            />
            {likeCount > 0 && (
              <span className="text-sm font-semibold text-gray-900">
                {likeCount.toLocaleString()}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="View comments"
            className="rounded-lg p-1.5 text-gray-700 transition-colors hover:text-violet-600 cursor-pointer"
            onClick={onOpen}
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

          <button
            type="button"
            onClick={() => toggleBookmark(post.id)}
            aria-label={saved ? "Remove bookmark" : "Save post"}
            aria-pressed={saved}
            className={`ml-auto rounded-lg p-1.5 transition-colors cursor-pointer ${
              saved ? "text-violet-600" : "text-gray-700 hover:text-violet-600"
            }`}
          >
            <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Caption and timestamp */}
        <div className="mt-2 space-y-1">
          <p className="text-sm leading-relaxed text-gray-800">
            <span className="mr-1.5 font-semibold text-gray-900">
              {post.username}
            </span>
            {post.caption}
          </p>
          <p className="text-xs text-gray-400">{post.timeAgo}</p>
        </div>

        {/* Inline comments preview */}
        {showComments && comments.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
            {comments.map((comment) => (
              <div key={comment.id} className="text-sm text-gray-700">
                <span className="mr-1.5 font-semibold text-gray-900">
                  {comment.username}
                </span>
                {comment.text}
              </div>
            ))}
          </div>
        )}

        {comments.length > 0 && !showComments && (
          <button
            type="button"
            className="mt-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => setShowComments(true)}
          >
            View all {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </button>
        )}

        {/* Add comment form */}
        <form
          onSubmit={handleCommentSubmit}
          className="mt-2 flex items-center gap-2 border-t border-gray-100 py-2.5"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder="Add a comment…"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="shrink-0 text-sm font-semibold text-violet-600 transition-opacity hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Post
          </button>
        </form>
      </div>

      {/* Edit caption modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePost(post.id, { caption: editedCaption.trim() });
              setShowEditModal(false);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-base font-bold text-gray-900">Edit caption</h2>

            <textarea
              autoFocus
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
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
    </article>
  );
};

export default PostCard;
