// src/pages/BlogDetailPage.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { User, Calendar, Clock, Eye, Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { blog, BlogPost } from "../services/blog";
import NotFound from "./NotFound";
import styles from "../styles/pages/blog-detail/blog-detail.module.scss";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/DesktopFooter/DesktopFooter";

// GỢI Ý 2: Tái cấu trúc thành component con để tái sử dụng
const MetaItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <span className={styles["post-detail__meta-item"]}>
    {icon} {children}
  </span>
);

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // GỢI Ý 3: Hiện đại hóa Data Fetching với async/await
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await blog.get(slug);
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

  const readingTime = useMemo(() => {
    if (!post) return 0;
    const text = post.content.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [post]);

  if (error) return <NotFound />;

  // GỢI Ý 1: Cải thiện UX khi loading bằng Skeleton Loader
  if (loading || !post) {
    return (
      <div>
        <NavBar />
        <div className="animate-pulse max-w-4xl mx-auto p-8">
          <div className="bg-gray-300 h-12 w-3/4 mb-4 rounded"></div>
          <div className="flex space-x-4 mb-8">
            <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
            <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
          </div>
          <div className="bg-gray-200 h-64 w-full mb-8 rounded-lg"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <article className={styles["post-detail"]}>
        <section className={styles["post-detail__hero"]}>
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className={styles["post-detail__hero-image"]} />
          )}
          <div className={styles["post-detail__hero-content"]}>
            <h1 className={styles["post-detail__title"]}>{post.title}</h1>
            <div className={styles["post-detail__meta"]}>
              {/* Sử dụng component con MetaItem */}
              <MetaItem icon={<User size={16} />}>{post.author}</MetaItem>
              <MetaItem icon={<Calendar size={16} />}>{new Date(post.createdDate).toLocaleDateString()}</MetaItem>
              <MetaItem icon={<Clock size={16} />}>{readingTime} phút đọc</MetaItem>
              <MetaItem icon={<Eye size={16} />}>{post.viewCount} lượt xem</MetaItem>
            </div>
          </div>
        </section>

        <div className={styles["post-detail__content"]}>
          {post.tags && post.tags.length > 0 && (
            <div className={styles["post-detail__tags"]}>
              {post.tags.map((tag) => (
                <button key={tag} className={styles["post-detail__tag"]} type="button">{tag}</button>
              ))}
            </div>
          )}
          
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />

          <div className={styles["post-detail__author"]}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=041E41&color=fff`}
              alt={post.author}
              className={styles["post-detail__author-avatar"]}
            />
            <div>
              <div className={styles["post-detail__author-name"]}>{post.author}</div>
              <div className={styles["post-detail__author-bio"]}>Thông tin tác giả đang được cập nhật.</div>
            </div>
          </div>

          <div className={styles["post-detail__share"]}>
            {/* Các nút chia sẻ có thể thêm logic onClick sau */}
            <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ Facebook" type="button"><Facebook size={18} /></button>
            <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ Twitter" type="button"><Twitter size={18} /></button>
            <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ Linkedin" type="button"><Linkedin size={18} /></button>
            <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ" type="button"><Share2 size={18} /></button>
          </div>

          <div className={styles["post-detail__comments"]}>Tính năng bình luận sẽ sớm ra mắt.</div>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;