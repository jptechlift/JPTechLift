// src/pages/BlogPage.tsx (hoặc components/BlogPage.tsx)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CountUp from 'react-countup';
import Header from "../Navbar/Navbar"; // Đảm bảo đường dẫn này đúng
import Footer from "../Footer/Footer";   // Đảm bảo đường dẫn này đúng

// ... (Các interface BlogData, RecentPost giữ nguyên)
interface BlogData {
  title: string;
  content: string;
  createdDate: string;
  author: string;
  viewCount: number;
}
interface RecentPost {
  slug: string;
  title: string;
  category: string;
}


// === Component Chính ===
const BlogTemplate: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... (Toàn bộ logic useEffect giữ nguyên)
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogResponse = await axios.get(`http://localhost:5000/api/blog/${slug}`);
        setBlog(blogResponse.data);

        setRecentPosts([
          { slug: 'cong-ty-lap-dat-thang-tai-hang', category: "Tin Tức", title: "Công ty lắp đặt thang tải hàng tại Đà Nẵng" },
          { slug: 'top-toa-nha-thang-may-an-tuong', category: "Tin Tức", title: "Top những toà nhà có hệ thống thang máy ấn tượng nhất thế giới" },
          { slug: 'thang-ghe-starlift-cho-nguoi-gia', category: "Tin Tức", title: "Thang ghế starlift cho người già - An toàn, tiện lợi" },
        ]);

      } catch (err) {
        setError('Không tìm thấy bài viết hoặc đã có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchBlogData();
    }
  }, [slug]);

  // --- PHẦN HIỂN THỊ TRẠNG THÁI LOADING/ERROR (Giữ nguyên) ---
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen"><p>Đang tải bài viết...</p></div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen"><p>{error}</p></div>
        <Footer />
      </>
    );
  }
  
  if (!blog) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen"><p>Không có dữ liệu bài viết.</p></div>
        <Footer />
      </>
    );
  }
  
  // --- PHẦN GIAO DIỆN CHÍNH ---
  return (
    // Sử dụng React.Fragment <>...</> để nhóm các thành phần lại
    <>
      <Header />
      
      {/* Toàn bộ nội dung trang blog cũ được đặt ở đây */}
      <div className="bg-white font-sans">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
            
            <main className="lg:col-span-2">
              <article>
                {/* Metadata */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-[#cba053] uppercase tracking-wider">
                    Tin Tức & Sự Kiện
                  </p>
                  <h1 className="text-4xl lg:text-5xl font-bold text-[#041E41] mt-2 leading-tight">
                    {blog.title}
                  </h1>
                  <div className="flex items-center flex-wrap space-x-4 text-sm text-gray-500 mt-4">
                    <span>Người viết: <strong>{blog.author}</strong></span>
                    <span>lúc {new Date(blog.createdDate).toLocaleDateString('vi-VN')}</span>
                    <span>-</span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <CountUp end={blog.viewCount} duration={1.5} /> Lượt xem
                    </span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>
              </article>
            </main>

            <aside>
              <div className="sticky top-8 bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-[#041E41] pb-4 border-b-2 border-[#cba053]">
                  BÀI VIẾT MỚI NHẤT
                </h2>
                <ul className="mt-6 space-y-6">
                  {recentPosts.map((post, index) => (
                    <li key={index}>
                      <div className="flex items-start space-x-4">
                        <span className="text-4xl font-bold text-gray-300 mt-[-2px]">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-[#cba053] uppercase tracking-wider">
                            {post.category}
                          </p>
                          <Link to={`/blog/${post.slug}`} className="text-lg font-semibold text-[#041E41] hover:text-[#cba053] transition-colors duration-200 leading-tight block mt-1">
                            {post.title}
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default BlogTemplate;