import {
  Heart,
  MessageCircle,
  MapPin,
  Send,
  Bookmark,
  MoreHorizontal,
  Trash2,
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
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white my-2">
      <div className="relative flex items-center justify-between p-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={post.avatar}
            alt={post.username}
            className="h-10 w-10 rounded-full object-cover cursor-pointer"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 capitalize">
              {post.username}
            </p>
            <div className="flex items-center gap-1">
              <MapPin size={13} />
              <p className="text-xs text-gray-500">{post.location}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="More post options"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 cursor-pointer ml:hidden"
            onClick={() => setShowPostMenu((open) => !open)}
          >
            <MoreHorizontal size={21} />
          </button>

          {showPostMenu && (
            <div className="absolute right-0 top-full z-30 mt-1 w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setShowPostMenu(false);
                  setShowDeleteConfirm(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
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
                  className="text-lg font-bold text-gray-900"
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
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await deletePost(post.id);
                      setShowDeleteConfirm(false);
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
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

      {/* post acitions */}
      <div className="flex flex-col items-center justify-between px-4 pt-3">
        <div className="flex w-full items-center gap-4">
          <button
            type="button"
            onClick={() => toggleLike(post.id)}
            className={`transition-transform  flex items-center gap-1 ${post.likedByCurrentUser ? "text-rose-500" : "text-gray-800 "} cursor-pointer`}
          >
            <Heart
              size={24}
              fill={post.likedByCurrentUser ? "currentColor" : "none"}
              className="hover:scale-110"
            />
            <p className="text-sm font-semibold text-gray-900">
              {likeCount.toLocaleString()}
            </p>
          </button>
          <button
            type="button"
            className="text-gray-800 transition-transform hover:scale-110 cursor-pointer"
            onClick={onOpen}
          >
            <MessageCircle size={23} />
          </button>
          <button
            type="button"
            className="text-gray-800 transition-transform hover:scale-110 cursor-pointer"
          >
            <Send size={22} />
          </button>
          <button
            type="button"
            onClick={() => toggleBookmark(post.id)}
            aria-label={saved ? "Remove bookmark" : "Save post"}
            className={`transition-transform hover:scale-110 cursor-pointer ${
              saved ? "text-violet-600" : "text-gray-800"
            }`}
          >
            <Bookmark size={23} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        {/* Likes and captions */}

        <div className="w-full space-y-2 py-2 ">
          <p className="text-sm leading-6 text-gray-800">
            <span className="mr-2 font-semibold text-gray-900">
              {post.username}
            </span>
            {post.caption}
          </p>
          <p className="text-xs text-gray-400">{post.timeAgo}</p>
          {showComments && (
            <div className="space-y-3 border-t border-gray-100 px-4 py-3">
              {comments?.length ? (
                comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="mr-2 font-semibold text-gray-900">
                      {comment.username}
                    </span>
                    <span className="text-gray-700">{comment.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
          )}
        </div>
        <form
          onSubmit={handleCommentSubmit}
          className="flex items-center gap-2  border-t border-gray-100 pt-3 justify-start w-full"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-w-0 flex bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 w-1/2"
            placeholder="Add a comment"
          />
          <button
            disabled={!commentText.trim()}
            className="text-sm font-semibold text-violet-600 transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Post
          </button>

          <button
            type="button"
            onClick={() => {
              setEditedCaption(post.caption ?? "");
              setShowPostMenu(false);
              setShowEditModal(true);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <span>✏️</span>
            Edit caption
          </button>
        </form>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePost(post.id, { caption: editedCaption.trim() });
              setShowEditModal(false);
            }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-gray-900">Edit caption</h2>

            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Write a caption..."
              className="mt-4 w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
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
