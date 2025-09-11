// src/pages/DetailBlogPage.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { User, Calendar, Clock, Eye, Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { blog } from "../services/blog"; // Đảm bảo đường dẫn này đúng
import NotFound from "./NotFound";
// Không còn import styles từ SCSS module nữa
// import styles from "../styles/pages/blog-detail/blog-detail.module.scss";
import NavBar from "../components/Navbar/Navbar"; // Đảm bảo đường dẫn này đúng
import Footer from "../components/Footer/DesktopFooter/DesktopFooter"; // Đảm bảo đường dẫn này đúng

// Định nghĩa interface BlogPost để TypeScript hiểu cấu trúc dữ liệu
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Nội dung HTML hoặc Markdown (đã được backend chuyển đổi thành HTML)
  author: string;
  createdDate: string; // ISO 8601 string, ví dụ: "2025-09-11T10:30:00Z"
  viewCount: number;
  imageUrl?: string; // URL của hình ảnh hero
  tags?: string[]; // Mảng các tag
  metaDescription?: string; // Meta description, có thể không hiển thị trực tiếp nhưng có trong dữ liệu
}

// Component con MetaItem đã được refactor với Tailwind CSS
const MetaItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1 text-gray-300 text-sm md:text-base">
    {/* Sử dụng React.cloneElement để thêm class vào icon từ Lucide */}
    {React.cloneElement(icon as React.ReactElement, { size: 16, className: "text-jp-blue-icon" })} {/* Sử dụng màu tùy chỉnh */}
    {children}
  </span>
);

const DetailBlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // GỢI Ý 3: Hiện đại hóa Data Fetching với async/await
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError(true); // Nếu không có slug, coi như lỗi
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Gọi service để lấy bài blog theo slug.
        // Giả định `blog.get(slug)` trả về Promise<BlogPost>
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

  // Tính toán thời gian đọc (Reading Time)
  const readingTime = useMemo(() => {
    if (!post || !post.content) return 0;
    // Strip HTML tags to get plain text for word count
    const text = post.content.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)); // 200 từ/phút là tốc độ đọc trung bình
  }, [post]);

  if (error) return <NotFound />;

  // GỢI Ý 1: Cải thiện UX khi loading bằng Skeleton Loader với Tailwind
  if (loading || !post) {
    return (
      <>
        <NavBar />
        <div className="animate-pulse max-w-4xl mx-auto px-6 py-12">
          {/* Skeleton cho tiêu đề */}
          <div className="bg-gray-300 h-10 w-3/4 mb-6 rounded mx-auto"></div>
          {/* Skeleton cho meta info */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-10">
            <div className="bg-gray-300 h-5 w-24 rounded"></div>
            <div className="bg-gray-300 h-5 w-32 rounded"></div>
            <div className="bg-gray-300 h-5 w-28 rounded"></div>
            <div className="bg-gray-300 h-5 w-24 rounded"></div>
          </div>
          {/* Skeleton cho hero image */}
          <div className="bg-gray-200 h-64 md:h-80 w-full mb-12 rounded-lg shadow-md"></div>
          {/* Skeleton cho nội dung */}
          <div className="space-y-4">
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Sanitize nội dung HTML để ngăn chặn XSS attacks
  const sanitizedContent = post.content ? DOMPurify.sanitize(post.content) : '';

  return (
    <>
      <NavBar />
      <article className="max-w-6xl mx-auto px-6 py-12 md:px-8 lg:px-12 lg:py-16">
        <section className="relative mb-12 md:mb-16 rounded-lg overflow-hidden bg-gray-100 shadow-xl">
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-72 md:h-96 object-cover block" 
            />
          )}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <MetaItem icon={<User />} >{post.author}</MetaItem>
              <MetaItem icon={<Calendar />} >{new Date(post.createdDate).toLocaleDateString("vi-VN")}</MetaItem>
              <MetaItem icon={<Clock />} >{readingTime} phút đọc</MetaItem>
              <MetaItem icon={<Eye />} >{post.viewCount || 0} lượt xem</MetaItem> {/* Đảm bảo viewCount không bị null/undefined */}
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Nội dung chính của bài blog */}
          <div className="flex-grow max-w-full lg:max-w-3xl xl:max-w-4xl">
            {post.tags && post.tags.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button 
                    key={tag} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200" 
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            
            {/* Sử dụng lớp 'prose' của Tailwind Typography Plugin để tạo kiểu dáng cho nội dung HTML */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif" // Thêm font-serif cho nội dung dễ đọc
              dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
            />

            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md mt-12 mb-10 border border-gray-100">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=jp-primary&color=fff`} // Sử dụng màu tùy chỉnh
                alt={post.author}
                className="w-20 h-20 rounded-full object-cover border-2 border-jp-blue-icon" // Sử dụng màu tùy chỉnh
              />
              <div>
                <div className="text-xl font-bold text-gray-900">{post.author}</div>
                <div className="text-sm text-gray-600 leading-relaxed">Thông tin tác giả đang được cập nhật.</div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-10">
              <button className="bg-gray-100 text-gray-600 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5" aria-label="Chia sẻ Facebook" type="button"><Facebook size={18} /></button>
              <button className="bg-gray-100 text-gray-600 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5" aria-label="Chia sẻ Twitter" type="button"><Twitter size={18} /></button>
              <button className="bg-gray-100 text-gray-600 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5" aria-label="Chia sẻ Linkedin" type="button"><Linkedin size={18} /></button>
              <button className="bg-gray-100 text-gray-600 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5" aria-label="Chia sẻ" type="button"><Share2 size={18} /></button>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg text-gray-500 italic mb-12 border border-gray-100">Tính năng bình luận sẽ sớm ra mắt.</div>
          </div>
          
          {/* Vùng sidebar tùy chọn cho các bài viết liên quan, quảng cáo, v.v. */}
          <aside className="w-full lg:w-80 xl:w-96 p-6 bg-white rounded-lg shadow-md mt-8 lg:mt-0 border border-gray-100 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3 border-gray-200">Bài viết liên quan</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="block text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium">
                  An toàn thang máy: Những điều cần biết
                </a>
                <p className="text-gray-500 text-sm mt-1">Tìm hiểu các mẹo an toàn để bảo vệ bạn và gia đình khi sử dụng thang máy.</p>
              </li>
              <li>
                <a href="#" className="block text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium">
                  Xu hướng công nghệ thang máy năm 2025
                </a>
                <p className="text-gray-500 text-sm mt-1">Khám phá các đổi mới công nghệ đang định hình tương lai của ngành thang máy.</p>
              </li>
              <li>
                <a href="#" className="block text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium">
                  Bảo trì thang máy: Tại sao nó lại quan trọng?
                </a>
                <p className="text-gray-500 text-sm mt-1">Tầm quan trọng của việc bảo trì định kỳ đối với hiệu suất và độ bền của thang máy.</p>
              </li>
            </ul>
          </aside>
        </div>
      </article>
      <Footer />
    </>
  );
};

export default DetailBlogPage;