import Stories from "../components/stories/Stories";
import PostCard from "../components/posts/PostCard";
import { usePosts } from "../context/PostContext";
import { useState } from "react";
import PostDetailModal from "../components/posts/PostDetailModal";

const HomePage = () => {
  const { posts } = usePosts();
  console.log(posts);
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-6 ">
        <Stories />
        <section className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpen={() => setSelectedPost(post)}
            />
          ))}
        </section>
      </div>
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
