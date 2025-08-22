import { useEffect, useState } from "react";
import { blog } from "../../../services/blog";

interface RecentPost {
  id: number;
  title: string;
}

export default function RecentPosts() {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    blog
      .recent()
      .then((res) => {
        if (mounted) {
          setPosts(res.data);
          setError(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setPosts([]);
          setError(true);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Bài viết gần đây</h3>
            <p className="text-xs text-slate-500">Các bài viết mới nhất</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm text-slate-500">Đang tải...</span>
            </div>
            {/* Loading skeletons */}
            <div className="space-y-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-sm text-slate-600 font-medium">Không thể tải bài viết</p>
            <p className="text-xs text-slate-500 mt-1">Vui lòng thử lại sau</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-200"
            >
              Tải lại
            </button>
          </div>
        ) : !posts.length ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p className="text-slate-600 font-medium">Chưa có bài viết nào</p>
            <p className="text-sm text-slate-500 mt-1">Bài viết mới sẽ xuất hiện tại đây</p>
          </div>
        ) : (
          <div className="space-y-1">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="group p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-500 transition-colors duration-200"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-relaxed">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs text-slate-500">#{index + 1}</span>
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {posts.length > 0 && !loading && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Hiển thị {posts.length} bài viết gần đây
            </span>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center gap-1">
              Xem tất cả
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}