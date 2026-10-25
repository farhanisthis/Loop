import { usePosts } from "../context/PostContext";
import {
  Settings,
  Grid3X3,
  Camera,
  X,
  Moon,
  Sun,
  User,
  AtSign,
  FileText,
  Image,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PostDetailModal from "../components/posts/PostDetailModal";
import StoredImage from "../components/common/StoredImage";

const ProfilePage = () => {
  const {
    posts,
    currentUserAvatar,
    updateAvatar,
    userProfile,
    updateUserProfile,
    theme,
    toggleTheme,
  } = usePosts();

  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: userProfile?.name || "",
    username: userProfile?.username || "",
    bio: userProfile?.bio || "",
    avatar: userProfile?.avatar || "",
  });

  const avatarInputRef = useRef(null);

  const handleOpenEditModal = () => {
    setEditFormData({
      name: userProfile?.name || "",
      username: userProfile?.username || "",
      bio: userProfile?.bio || "",
      avatar: currentUserAvatar || userProfile?.avatar || "",
    });
    setShowEditModal(true);
  };

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEditModal(false);
        setShowSettingsModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const myPosts = posts.filter(
    (post) =>
      post.username.toLowerCase() ===
      (userProfile?.username || "farhan").toLowerCase(),
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

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const trimmedName = editFormData.name.trim();
    const trimmedUsername = editFormData.username.trim();
    const trimmedBio = editFormData.bio.trim();
    const trimmedAvatar = editFormData.avatar.trim();

    if (!trimmedUsername) {
      alert("Username cannot be empty.");
      return;
    }

    updateUserProfile({
      name: trimmedName || trimmedUsername,
      username: trimmedUsername,
      bio: trimmedBio,
      avatar: trimmedAvatar || currentUserAvatar,
    });

    setShowEditModal(false);
  };

  const activeAvatar = currentUserAvatar || userProfile?.avatar;
  const username = userProfile?.username || "Farhan";
  const displayName = userProfile?.name || username;
  const bio = userProfile?.bio || "Building things, learning every day.";

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 pb-20 sm:px-8 md:pb-8">
      {/* Profile Header */}
      <section className="flex flex-col gap-6 border-b border-gray-100 pb-8 sm:flex-row sm:items-center sm:gap-12">
        {/* Avatar with change-image overlay */}
        <div className="relative shrink-0 sm:ml-8">
          <img
            src={activeAvatar}
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
              onClick={handleOpenEditModal}
              className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 cursor-pointer"
            >
              Edit profile
            </button>

            <button
              type="button"
              aria-label="Settings"
              onClick={() => setShowSettingsModal(true)}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
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
            <p className="font-semibold text-gray-900">{displayName}</p>
            <p className="text-gray-500">{bio}</p>
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

            <h2 className="text-lg font-bold text-gray-900">
              Share your first post
            </h2>

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

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-theme bg-surface p-6 shadow-xl max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2
                id="edit-profile-title"
                className="text-lg font-bold text-gray-900"
              >
                Edit profile
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                aria-label="Close edit profile"
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700"
                >
                  <User size={13} className="text-gray-400" />
                  Display name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Your full name"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-username"
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700"
                >
                  <AtSign size={13} className="text-gray-400" />
                  Username
                </label>
                <input
                  id="edit-username"
                  type="text"
                  required
                  value={editFormData.username}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="username"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-bio"
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700"
                >
                  <FileText size={13} className="text-gray-400" />
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  rows={3}
                  value={editFormData.bio}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  placeholder="Tell us about yourself..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* <div>
                <label
                  htmlFor="edit-avatar"
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700"
                >
                  <Image size={13} className="text-gray-400" />
                  Avatar URL
                </label>
                <div className="mt-1.5 flex items-center gap-3">
                  <img
                    src={editFormData.avatar || activeAvatar}
                    alt="Preview"
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-violet-100"
                    onError={(e) => {
                      e.currentTarget.src = activeAvatar;
                    }}
                  />
                  <input
                    id="edit-avatar"
                    type="url"
                    value={editFormData.avatar}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, avatar: e.target.value }))
                    }
                    placeholder="https://example.com/avatar.jpg"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Tip: You can also click the photo directly on your profile to upload any image file.
                </p>
              </div> */}

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 cursor-pointer"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-theme bg-surface p-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-violet-600" />
                <h2
                  id="settings-title"
                  className="text-lg font-bold text-gray-900"
                >
                  Settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                aria-label="Close settings"
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Appearance / Theme setting */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Appearance
                </p>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-theme bg-subtle p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme bg-surface shadow-xs">
                      {theme === "dark" ? (
                        <Moon size={18} className="text-violet-600" />
                      ) : (
                        <Sun size={18} className="text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {theme === "dark" ? "Dark mode" : "Light mode"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {theme === "dark"
                          ? "Dark theme active"
                          : "Classic light theme"}
                      </p>
                    </div>
                  </div>

                  {/* Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={theme === "dark"}
                    aria-label="Toggle dark mode"
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      theme === "dark" ? "bg-violet-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        theme === "dark" ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Account summary */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account
                </p>
                <div className="mt-3 space-y-2 rounded-xl border border-theme bg-subtle p-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Signed in as</span>
                    <span className="font-semibold text-gray-900">
                      @{username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Display name</span>
                    <span className="font-semibold text-gray-900">
                      {displayName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Storage</span>
                    <span className="font-semibold text-gray-900">
                      IndexedDB + localStorage
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
