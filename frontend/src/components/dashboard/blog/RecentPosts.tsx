import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blog } from "../../../services/blog";

interface RecentPost {
  id: number;
  title: string;
  slug: string;
  topic?: string;
  createdDate: string;
}

interface RecentPostsProps {
  refreshKey: number;
}

export default function RecentPosts({ refreshKey }: RecentPostsProps) {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    blog
      .recent()
      .then((posts) => {
        if (!mounted) return;
        const mappedPosts: RecentPost[] = posts.map((p) => ({
          id: Number(p.id),
          title: p.title,
          slug: p.slug,
          topic: p.topic,
          createdDate: p.createdDate,
        }));
        setPosts(mappedPosts);
        setError(false);
      })
      .catch(() => {
        if (!mounted) return;
        setPosts([]);
        setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-gray-200/50">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center p-4 sm:p-6 rounded-t-2xl border-b border-gray-200/80">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-tr from-[var(--color-primary)] to-blue-700 p-3 rounded-xl shadow-md shadow-blue-500/20">
            <span className="material-icons-outlined text-white text-2xl">history</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">Bài viết gần đây</h2>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--color-primary)]"></div>
            <span className="text-sm text-gray-500">Đang tải...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">Không thể tải bài viết</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có bài viết nào</p>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/blogs/${post.slug}`)}
                className="group block p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 transition-transform duration-300 group-hover:scale-125"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.topic && (
                      <p className="text-sm text-gray-500 mt-1">Chủ đề: {post.topic}</p>
                    )}
                    <div className="mt-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-medium">{post.createdDate.split("T")[0]}</span>
                      <span className="mx-1.5">•</span>
                      <span>Click để xem chi tiết</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {posts.length > 0 && !loading && !error && (
        <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-b-2xl border-t border-gray-200/80">
          <p className="text-sm text-gray-500">
            Hiển thị <span className="font-semibold text-gray-700">{posts.length}</span> bài viết
          </p>
          <button className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[var(--color-primary)] bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all">
            <span>Xem tất cả</span>
            <span className="material-icons-outlined text-base ml-1.5">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}