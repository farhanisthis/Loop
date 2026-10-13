import Stories from "../components/stories/Stories";
import posts from "../data/mockData";
import PostCard from "../components/posts/PostCard";
const HomePage = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 ">
      <Stories />

      <section className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
};

export default HomePage;
