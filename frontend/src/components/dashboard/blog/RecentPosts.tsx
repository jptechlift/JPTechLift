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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hôm nay";
    if (diffInDays === 1) return "Hôm qua";
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    return `${Math.floor(diffInDays / 30)} tháng trước`;
  };

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
      {/* Header với design cải tiến */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
        <div className="relative flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-tr from-[var(--color-primary)] to-blue-700 p-3 rounded-xl shadow-lg shadow-blue-500/25">
                <span className="material-icons-outlined text-white text-2xl">
                  history
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Bài viết gần đây
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Cập nhật liên tục</p>
            </div>
          </div>
          {!loading && !error && posts.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-200/50">
              <span className="text-xs font-semibold text-gray-600">
                {posts.length} bài
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent"></div>
              <span className="text-sm text-gray-500 font-medium">
                Đang tải bài viết mới nhất...
              </span>
            </div>
            {/* Loading skeletons */}
            <div className="space-y-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-outlined text-red-500 text-2xl">
                error_outline
              </span>
            </div>
            <p className="text-red-600 font-medium mb-2">
              Không thể tải bài viết
            </p>
            <p className="text-sm text-gray-500">Vui lòng thử lại sau</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-icons-outlined text-gray-400 text-3xl">
                article
              </span>
            </div>
            <h3 className="text-gray-800 font-semibold mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              Hãy tạo bài viết đầu tiên của bạn để bắt đầu chia sẻ những ý tưởng
              tuyệt vời
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post, index) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blogs/${post.slug}`)}
                className="group relative p-5 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-300 ease-out cursor-pointer border border-transparent hover:border-gray-200/50"
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--color-primary)]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-start gap-4">
                  {/* Post indicator with enhanced design */}
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] transition-all duration-300 group-hover:scale-150 group-hover:bg-[var(--color-primary)]"></div>
                    {index < posts.length - 1 && (
                      <div className="w-px h-8 bg-gradient-to-b from-gray-200 to-transparent mt-2"></div>
                    )}
                  </div>

                  {/* Content area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors duration-200 line-clamp-2 text-base leading-snug pr-2">
                        {post.title}
                      </h3>
                      <div className="w-4 h-4 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                        <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent"></div>
                      </div>
                    </div>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {post.topic && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-200">
                          <span className="material-icons-outlined text-xs">
                            local_offer
                          </span>
                          {post.topic}
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="material-icons-outlined text-sm">
                          schedule
                        </span>
                        <span className="text-xs font-medium">
                          {getTimeAgo(post.createdDate)}
                        </span>
                        <span className="text-xs opacity-60">
                          ({formatDate(post.createdDate)})
                        </span>
                      </div>
                    </div>

                    {/* Reading indicator */}
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-medium">
                        <span className="material-icons-outlined text-sm">
                          visibility
                        </span>
                        <span>Nhấn để đọc bài viết</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      {posts.length > 0 && !loading && !error && (
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200/60">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Hiển thị {posts.length} bài viết gần nhất
                </p>
                <p className="text-xs text-gray-500">Được cập nhật tự động</p>
              </div>
            </div>

            <button className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gradient-to-r hover:from-[var(--color-primary)] hover:to-blue-600 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-200 transform hover:scale-105">
              <span>Xem tất cả</span>
              <div className="w-4 h-4 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent"></div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
