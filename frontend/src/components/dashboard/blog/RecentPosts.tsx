import { useEffect, useState } from "react";
import { blog } from "../../../services/blog";

interface RecentPost {
  id: number;
  title: string;
}

export default function RecentPosts() {
  const [posts, setPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    let mounted = true;
    blog
      .recent()
      .then((res) => {
        if (mounted) setPosts(res.data);
      })
      .catch(() => setPosts([]));
    return () => {
      mounted = false;
    };
  }, []);

  if (!posts.length) {
    return (
      <div className="p-4 border rounded-xl">
        <p className="text-sm text-gray-500">No recent posts</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl">
      <h3 className="font-semibold mb-2">Recent Posts</h3>
      <ul className="space-y-1">
        {posts.map((p) => (
          <li key={p.id} className="text-sm text-blue-600 hover:underline cursor-pointer">
            {p.title}
          </li>
        ))}
      </ul>
    </div>
  );
}