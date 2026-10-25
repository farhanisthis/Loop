import { useEffect, useState } from "react";
import { ImagePlus, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/PostContext";

const CreatePost = () => {
  const { createPost } = usePosts();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

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

    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    try {
      await createPost({
        imageFile,
        caption: caption.trim(),
      });

      setImageFile(null);
      setCaption("");
      e.target.reset();

      navigate("/");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Could not create the post. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a post</h1>
        <p className="mt-1 text-sm text-gray-500">
          Share a moment with your community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="post-image"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Select an image
          </label>

          <input
            id="post-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />

          {!previewUrl ? (
            <label
              htmlFor="post-image"
              className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-purple-400 hover:bg-purple-50"
            >
              <ImagePlus size={42} className="mb-3 text-purple-600" />

              <span className="font-semibold text-gray-800">
                Click to upload an image
              </span>

              <span className="mt-1 text-sm text-gray-500">
                PNG, JPG or other image formats · Max 5 MB
              </span>
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <img
                src={previewUrl}
                alt="Selected post preview"
                className="max-h-[450px] w-full object-contain"
              />

              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  document.getElementById("post-image").value = "";
                }}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                aria-label="Remove selected image"
              >
                <X size={18} />
              </button>

              <label
                htmlFor="post-image"
                className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white hover:bg-black/80"
              >
                Change image
              </label>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="post-caption"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Caption
          </label>

          <textarea
            id="post-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something about this moment..."
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {caption.length}/500
          </p>
        </div>

        <button
          type="submit"
          disabled={!imageFile}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={18} />
          Share post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
