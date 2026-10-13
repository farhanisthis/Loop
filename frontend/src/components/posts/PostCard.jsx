import {
  Heart,
  MessageCircle,
  MapPin,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");

  const likeCount = post.likes + (liked ? 1 : 0);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const text = commentText.trim();

    if (!text) return;

    setComments((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        username: "farhan",
        text,
      },
    ]);
    setCommentText("");
    setShowComments(true);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white my-2">
      <div className="flex items-center justify-between p-4">
        <div className="flex gap-3 items-center">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={post.avatar}
              alt={post.username}
              className="h-10 w-10  rounded-full object-cover"
            />
          </div>
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
        <button
          type="button"
          aria-label="More post options"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          <MoreHorizontal size={21} />
        </button>
      </div>

      <img
        src={post.image}
        alt={post.imageAlt || `Post by ${post.username}`}
        className="aspect-square w-full object-cover"
      />

      {/* post acitions */}
      <div className="flex flex-col items-center justify-between px-4 pt-3">
        <div className="flex w-full items-center gap-4">
          <button
            type="button"
            onClick={() => setLiked((current) => !current)}
            className={`transition-transform  flex items-center gap-1 ${liked ? "text-rose-500" : "text-gray-800 "} cursor-pointer`}
          >
            <Heart
              size={24}
              fill={liked ? "currentColor" : "none"}
              className="hover:scale-110"
            />
            <p className="text-sm font-semibold text-gray-900">
              {likeCount.toLocaleString()}
            </p>
          </button>
          <button
            type="button"
            onClick={() => setShowComments((current) => !current)}
            className="text-gray-800 transition-transform hover:scale-110 cursor-pointer"
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
            onClick={() => setSaved((current) => !current)}
            className={`transition-transform hover:scale-110 cursor-pointer ${saved ? "text-violet-600" : "text-gray-800  "}`}
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
        </form>
      </div>
    </article>
  );
};

export default PostCard;
