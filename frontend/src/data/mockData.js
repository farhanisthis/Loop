const posts = [
  {
    id: 1,
    username: "alex",
    avatar: "https://i.pravatar.cc/150?img=12",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Mountain lake surrounded by green hills",
    location: "Swiss Alps",
    likes: 1248,
    caption: "Somewhere between the mountains and the sky. 🏔️",
    timeAgo: "2 hours ago",
    comments: [
      {
        id: 1,
        username: "sarah",
        text: "This place looks unreal! 😍",
      },
      {
        id: 2,
        username: "mike",
        text: "Adding this to my travel list.",
      },
    ],
  },
  {
    id: 2,
    username: "sarah",
    avatar: "https://i.pravatar.cc/150?img=47",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Pink flowers in soft natural light",
    location: "Spring mornings",
    likes: 836,
    caption: "A little reminder to slow down. 🌸",
    timeAgo: "5 hours ago",
  },
  {
    id: 3,
    username: "mike",
    avatar: "https://i.pravatar.cc/150?img=13",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Scenic landscape with rolling hills",
    location: "Tuscany, Italy",
    likes: 2156,
    caption: "Collecting moments, not things. 🌿",
    timeAgo: "7 hours ago",
  },
  {
    id: 4,
    username: "priya",
    avatar: "https://i.pravatar.cc/150?img=44",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Coffee on a wooden cafe table",
    location: "My little corner",
    likes: 592,
    caption: "Coffee, good music, and a little peace. ☕",
    timeAgo: "9 hours ago",
  },
  {
    id: 5,
    username: "jordan",
    avatar: "https://i.pravatar.cc/150?img=11",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Ocean waves rolling toward the shore",
    location: "Pacific Coast",
    likes: 1789,
    caption: "Mentally, I'm still right here. 🌊",
    timeAgo: "12 hours ago",
  },
  {
    id: 6,
    username: "silvi",
    avatar: "https://i.pravatar.cc/150?img=15",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Open road through a scenic landscape",
    location: "Weekend escape",
    likes: 943,
    caption: "Sometimes you just need to take the long way. 🚗",
    timeAgo: "15 hours ago",
  },
  {
    id: 7,
    username: "Natlie",
    avatar: "https://i.pravatar.cc/150?img=47",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Snow-covered mountain under a starry sky",
    location: "Mountain nights",
    likes: 3107,
    caption: "Some views make you forget to check your phone. ✨",
    timeAgo: "1 day ago",
  },
];

export default posts;
