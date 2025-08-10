// AboutUsNewsBlogs.tsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "../../styles/pages/about-us-page/about-us-news-blogs.module.scss";
import newsImg from "../../assets/images/news.jpg";
import blogImg from "../../assets/images/blog.jpg";

export default function AboutUsNewsBlogs() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <section className={styles.newsBlogs}>
      <div className={styles.newsBlogs__container}>
        <div
          className={styles.newsBlogs__card}
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-out"
          data-aos-duration="1200"
          data-aos-offset="100"
        >
          <img 
            src={newsImg} 
            alt="Tin tức" 
            className={styles.newsBlogs__cardImage} 
          />
          <div className={styles.newsBlogs__cardContent}>
            <div className={styles.newsBlogs__cardTitle}>Tin tức</div>
            <div className={styles.newsBlogs__cardUnderline}></div>
          </div>
        </div>

        <div
          className={styles.newsBlogs__card}
          data-aos="fade-zoom-in"
          data-aos-delay="300"
          data-aos-easing="ease-in-out"
          data-aos-duration="1200"
          data-aos-offset="100"
        >
          <img 
            src={blogImg} 
            alt="Blogs" 
            className={styles.newsBlogs__cardImage} 
          />
          <div className={styles.newsBlogs__cardContent}>
            <div className={styles.newsBlogs__cardTitle}>Blogs</div>
            <div className={styles.newsBlogs__cardUnderline}></div>
          </div>
        </div>
      </div>
    </section>
  );
}