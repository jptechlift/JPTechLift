import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { User, Calendar, Clock, Eye, Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { blog, BlogPost } from "../services/blog";
import NotFound from "./NotFound";
import styles from "../styles/pages/blog-detail/blog-detail.module.scss";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/DesktopFooter/DesktopFooter";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      blog
        .get(slug)
        .then(setPost)
        .catch(() => {
          setError(true);
        });
    }
  }, [slug]);

  const readingTime = useMemo(() => {
    if (!post) return 0;
    const text = post.content.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [post]);

  if (error) {
    return <NotFound />;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar/>
    <article className={styles["post-detail"]}>
      <section className={styles["post-detail__hero"]}>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className={styles["post-detail__hero-image"]}
          />
        )}
        <div className={styles["post-detail__hero-content"]}>
          <h1 className={styles["post-detail__title"]}>{post.title}</h1>
          <div className={styles["post-detail__meta"]}>
            <span className={styles["post-detail__meta-item"]}>
              <User size={16} /> {post.author}
            </span>
            <span className={styles["post-detail__meta-item"]}>
              <Calendar size={16} />
              {new Date(post.createdDate).toLocaleDateString()}
            </span>
            <span className={styles["post-detail__meta-item"]}>
              <Clock size={16} /> {readingTime} phút đọc
            </span>
            <span className={styles["post-detail__meta-item"]}>
              <Eye size={16} /> {post.viewCount} lượt xem
            </span>
          </div>
        </div>
      </section>

      <div className={styles["post-detail__content"]}>
        {post.tags && post.tags.length > 0 && (
          <div className={styles["post-detail__tags"]}>
            {post.tags.map((tag) => (
              <button key={tag} className={styles["post-detail__tag"]} type="button">
                {tag}
              </button>
            ))}
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        <div className={styles["post-detail__author"]}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}`}
            alt={post.author}
            className={styles["post-detail__author-avatar"]}
          />
          <div>
            <div className={styles["post-detail__author-name"]}>{post.author}</div>
            <div className={styles["post-detail__author-bio"]}>
              Thông tin tác giả đang được cập nhật.
            </div>
          </div>
        </div>

        <div className={styles["post-detail__share"]}>
          <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ Facebook" type="button">
            <Facebook size={18} />
          </button>
          <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ Twitter" type="button">
            <Twitter size={18} />
          </button>
          <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ Linkedin" type="button">
            <Linkedin size={18} />
          </button>
          <button className={styles["post-detail__share-button"]} aria-label="Chia sẻ" type="button">
            <Share2 size={18} />
          </button>
        </div>

        <div className={styles["post-detail__comments"]}>
          Tính năng bình luận sẽ sớm ra mắt.
        </div>
      </div>
    </article>
    <Footer/>
    </div>
  );
};

export default BlogDetailPage;