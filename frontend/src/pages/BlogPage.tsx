import { useEffect, useState } from "react";
import { blog, BlogPost } from "../services/blog";
import styles from "../styles/pages/blog-page/blog-page.module.scss";
import clsx from "clsx";

const PAGE_SIZE = 9;

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blog
      .list()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const total = posts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const pagePosts = posts.slice(startIdx, endIdx);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles["blog-page"]}>
      <h2 className={styles["blog-page__title"]}>Blog</h2>
      <div className={styles["blog-page__topbar"]}>
        <p className={styles["blog-page__result-text"]}>
          {total > 0
            ? `Hiển thị kết quả ${startIdx + 1} – ${endIdx} trên ${total}`
            : "Không có bài viết"}
        </p>
        <div className={styles["blog-page__controls"]}>
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className={styles["blog-page__search"]}
          />
          <select className={styles["blog-page__select"]}>
            <option>Sắp xếp</option>
          </select>
          <select className={styles["blog-page__select"]}>
            <option>Lọc</option>
          </select>
        </div>
      </div>

      {pagePosts.length > 0 ? (
        <div className={styles["blog-page__grid"]}>
          {pagePosts.map((post) => (
            <article
              key={post.id || post.slug}
              className={styles["blog-page__card"]}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt=""
                  className={styles["blog-page__thumb"]}
                />
              )}
              <h3>{post.title}</h3>
              <p>{post.content.replace(/<[^>]+>/g, "").slice(0, 100)}...</p>
              <a
                href={`/blogs/${post.slug}`}
                className={styles["blog-page__read-more"]}
              >
                Đọc thêm
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles["blog-page__empty"]}>
          Không có kết quả nào được tìm thấy.
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles["blog-page__pagination-wrap"]}>
          <button
            className={styles["blog-page__page-btn"]}
            onClick={handlePrev}
            disabled={page === 1}
          >
            TRƯỚC
          </button>
          <div className={styles["blog-page__pagination"]}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={clsx(
                  styles["blog-page__page-number"],
                  p === page && styles["blog-page__page-number--active"]
                )}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            className={styles["blog-page__page-btn"]}
            onClick={handleNext}
            disabled={page === totalPages}
          >
            SAU
          </button>
        </div>
      )}
    </section>
  );
};

export default BlogPage;