import Stories from "../components/stories/Stories";
import PostCard from "../components/posts/PostCard";
import { usePosts } from "../context/PostContext";
import { useState } from "react";
import PostDetailModal from "../components/posts/PostDetailModal";

const HomePage = () => {
  const { posts } = usePosts();
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="mx-auto max-w-xl px-4 py-6 pb-20 md:pb-6">
      <Stories />
      <section className="mt-2 space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpen={() => setSelectedPost(post)}
          />
        ))}
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

export default HomePage;
