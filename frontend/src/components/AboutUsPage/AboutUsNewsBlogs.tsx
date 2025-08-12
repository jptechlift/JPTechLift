import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, User, Eye } from "lucide-react";
import styles from "../../styles/pages/about-us-page/about-us-news-blogs.module.scss";
import { useNavigate } from "react-router-dom";

// Mock data - replace with your actual data
const newsData = {
  title: "Tin tức",
  description: "Cập nhật những thông tin mới nhất về công nghệ thang máy",
  image: "/src/assets/images/news.jpg", // Replace with your image path
  stats: { articles: 24, views: "12" },
  latestDate: "15/08/2025",
};

const blogData = {
  title: "Blogs",
  description: "Khám phá những bài viết chuyên sâu về ngành thang máy",
  image: "/src/assets/images/blog.jpg", // Replace with your image path
  stats: { articles: 18, views: "31" },
  latestDate: "12/08/2025",
};

interface CardProps {
  data: typeof newsData;
  path: string;
  delay?: number;
  isVisible: boolean;
  onNavigate: (path: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean;
}

const CardComponent: React.FC<CardProps> = ({
  data,
  path,
  delay = 0,
  isVisible,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
  isHovered,
}) => (
  <div
    className={`${styles.newsBlogs__card} ${isVisible ? styles["newsBlogs__card--visible"] : ""} ${
      isHovered ? styles["newsBlogs__card--hovered"] : ""
    }`}
    style={{ animationDelay: `${delay}ms` }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={() => onNavigate(path)}
  >
    <div className={styles.newsBlogs__imageContainer}>
      <img src={data.image} alt={data.title} className={styles.newsBlogs__image} />
      <div className={styles.newsBlogs__overlay}>
        <div className={styles.newsBlogs__overlayContent}>
          <ArrowRight className={styles.newsBlogs__overlayIcon} />
          <span className={styles.newsBlogs__overlayText}>Xem thêm</span>
        </div>
      </div>
    </div>

    <div className={styles.newsBlogs__content}>
      <div className={styles.newsBlogs__header}>
        <h3 className={styles.newsBlogs__title}>{data.title}</h3>
        <div className={styles.newsBlogs__underline}></div>
      </div>

      <p className={styles.newsBlogs__description}>{data.description}</p>

      <div className={styles.newsBlogs__stats}>
        <div className={styles.newsBlogs__stat}>
          <Calendar className={styles.newsBlogs__statIcon} />
          <span className={styles.newsBlogs__statText}>{data.latestDate}</span>
        </div>
        <div className={styles.newsBlogs__stat}>
          <User className={styles.newsBlogs__statIcon} />
          <span className={styles.newsBlogs__statText}>{data.stats.articles} bài viết</span>
        </div>
        <div className={styles.newsBlogs__stat}>
          <Eye className={styles.newsBlogs__statIcon} />
          <span className={styles.newsBlogs__statText}>{data.stats.views} lượt xem</span>
        </div>
      </div>

      <div className={styles.newsBlogs__action}>
        <span className={styles.newsBlogs__actionText}>Khám phá ngay</span>
        <ArrowRight className={styles.newsBlogs__actionIcon} />
      </div>
    </div>
  </div>
);

export default function AboutUsNewsBlogs() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("news-blogs-section");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <section id="news-blogs-section" className={styles.newsBlogs}>
      <div className={styles.newsBlogs__container}>
        <CardComponent
          data={newsData}
          path="/tin-tuc-thang-may"
          delay={0}
          isVisible={isVisible}
          onNavigate={handleNavigate}
          onMouseEnter={() => setHoveredCard(newsData.title)}
          onMouseLeave={() => setHoveredCard(null)}
          isHovered={hoveredCard === newsData.title}
        />
        <CardComponent
          data={blogData}
          path="/blog-thang-may"
          delay={200}
          isVisible={isVisible}
          onNavigate={handleNavigate}
          onMouseEnter={() => setHoveredCard(blogData.title)}
          onMouseLeave={() => setHoveredCard(null)}
          isHovered={hoveredCard === blogData.title}
        />
      </div>
    </section>
  );
}
