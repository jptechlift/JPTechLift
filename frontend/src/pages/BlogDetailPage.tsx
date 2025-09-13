import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  User,
  Calendar,
  Clock,
  Eye,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
// === SỬA LỖI QUAN TRỌNG: Chỉ import BlogPost từ service ===
import { blog, BlogPost } from "../services/blog"; 
import NotFound from "./NotFound";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/DesktopFooter/DesktopFooter";

// === SỬA LỖI QUAN TRỌNG: Xóa hoàn toàn interface BlogPost thừa ở đây ===
// Giao diện (interface) cho BlogPost sẽ được lấy trực tiếp từ file service
// để đảm bảo tính nhất quán và không còn xung đột.

const DetailBlogPage = () => {
  // Logic fetching data, state, memo...
  const { slug } = useParams<{ slug: string }>();
  // State `post` sẽ sử dụng đúng interface BlogPost đã được import
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recommended, setRecommended] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data: BlogPost = await blog.get(slug);
        setPost(data);
      } catch (err) {
        setError(true);
        console.error("Failed to fetch blog post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const fetchRecommended = async () => {
      try {
        const recent = await blog.recent(5);
        const suggestion = recent.find((b) => b.slug !== slug) || null;
        setRecommended(suggestion);
      } catch (err) {
        console.error("Failed to fetch recommended blog:", err);
      }
    };
    fetchRecommended();
  }, [post, slug]);

  const readingTime = useMemo(() => {
    if (!post || !post.content) return 0;
    const text = post.content.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [post]);

  if (error) return <NotFound />;

  if (loading || !post) {
    return (
      <>
        <NavBar />
        <div className="animate-pulse max-w-4xl mx-auto px-6 py-12 md:px-8 lg:px-12 lg:py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="bg-gray-300 h-10 w-3/4 mb-4 rounded"></div>
            <div className="bg-gray-300 h-8 w-1/2 mb-10 rounded"></div>
            <div className="bg-gray-200 h-5 w-full mb-4 rounded"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-4 w-full rounded"></div>
              <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const sanitizedContent = post.content ? DOMPurify.sanitize(post.content) : "";
  const formattedDate = new Date(post.createdDate).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = new Date(post.createdDate).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <NavBar />
      <article className="bg-texture-bg bg-texture-pattern py-12 lg:py-10">
        
        <div className="max-w-4xl mx-auto md:pt-2 md:pl-12 md:pr-12">
        
          <header className="mb-8 md:mb-10 border-b border-gray-200 pb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-inter mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-black font-nunito border-l-4 border-accent pl-4">
              <span>
                Đóng góp bởi <strong className="font-semibold text-black-900">{post.author}</strong>
              </span>
              <span>
                Cập nhật ngày {formattedDate}, lúc {formattedTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye size={14} />
                {post.viewCount || 0} lượt xem
              </span>
            </div>
          </header>

          <main>
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2 font-nunito">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              className="prose prose-lg max-w-none font-noto 
                         prose-p:text-black 
                         prose-li:text-black 
                         prose-ul:text-black 
                         prose-ol:text-black 
                         prose-blockquote:text-black
                         prose-strong:text-black"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg shadow-sm mt-16 mb-12 border border-gray-200">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.author
                )}&background=041e41&color=fff&font-size=0.5`}
                alt={post.author}
                className="w-20 h-20 rounded-full object-cover border-2 border-accent"
              />
              <div>
                <div className="text-xl font-bold text-primary font-inter">
                  {post.author}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed mt-1 font-nunito">
                  Thông tin tác giả đang được cập nhật.
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-10">
              {/* Nút chia sẻ */}
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg text-gray-500 italic mb-4 border border-gray-100 font-nunito">
              Tính năng bình luận sẽ sớm ra mắt.
            </div>
          </main>
        </div>

        {recommended && (
          <aside className="max-w-4xl mx-auto mt-12 px-6 md:px-0">
            <h3 className="text-2xl font-bold text-primary mb-6 font-inter">
              Bài viết khác
            </h3>
            <div className="bg-slate-50 p-8 rounded-lg shadow-xl">
              <Link
                to={`/blog/${recommended.slug}`}
                className="block text-accent hover:text-primary text-xl font-inter font-semibold"
              >
                {recommended.title}
              </Link>
              {recommended.metaDescription && (
                <p className="text-gray-500 text-base mt-3 font-nunito">
                  {recommended.metaDescription}
                </p>
              )}
            </div>
          </aside>
        )}

      </article>
      <Footer />
    </>
  );
};

export default DetailBlogPage;