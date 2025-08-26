import { useEffect, useState } from "react";
import { blog, BlogPost } from "../services/blog";
import styles from "../styles/pages/blog-page/blog-page.module.scss";
import clsx from "clsx";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/DesktopFooter/DesktopFooter";
import { Eye } from "lucide-react";

const PAGE_SIZE = 9;

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

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

  // Filter and search logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    // Add filter logic here when categories are available
    return matchesSearch;
  });

  // Sort logic
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdDate || 0).getTime() - new Date(b.createdDate || 0).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const total = sortedPosts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const pagePosts = sortedPosts.slice(startIdx, endIdx);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Reset page when search/filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy, filterBy]);

  if (loading) {
    return (
      <div className={styles["blog-page__loading"]}>
        <div className={styles["blog-page__loader"]}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar/>
      <section className={styles["blog-page"]}>
        <div className={styles["blog-page__header"]}>
          <h1 className={styles["blog-page__title"]}>Blog</h1>
          <p className={styles["blog-page__subtitle"]}>
            Khám phá những bài viết mới nhất và hữu ích
          </p>
        </div>

        <div className={styles["blog-page__topbar"]}>
          <div className={styles["blog-page__result-section"]}>
            <p className={styles["blog-page__result-text"]}>
              {total > 0
                ? `Hiển thị ${startIdx + 1} – ${endIdx} trên ${total} bài viết`
                : "Không có bài viết nào"}
            </p>
            {searchTerm && (
              <p className={styles["blog-page__search-info"]}>
                Kết quả tìm kiếm cho: "<strong>{searchTerm}</strong>"
              </p>
            )}
          </div>
          
          <div className={styles["blog-page__controls"]}>
            <div className={styles["blog-page__search-wrapper"]}>
              <input
                type="search"
                placeholder="Tìm kiếm bài viết..."
                className={styles["blog-page__search"]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className={styles["blog-page__search-icon"]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            
            <select 
              className={styles["blog-page__select"]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="title">Theo tên</option>
            </select>
            
            <select 
              className={styles["blog-page__select"]}
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="featured">Nổi bật</option>
              <option value="recent">Gần đây</option>
            </select>
          </div>
        </div>

        {pagePosts.length > 0 ? (
          <div className={styles["blog-page__grid"]}>
            {pagePosts.map((post, index) => (
              <article
                key={post.id || post.slug}
                className={styles["blog-page__card"]}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles["blog-page__card-content"]}>
                  {post.imageUrl ? (
                    <div className={styles["blog-page__thumb-wrapper"]}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className={styles["blog-page__thumb"]}
                        loading="lazy"
                      />
                      <div className={styles["blog-page__thumb-overlay"]}></div>
                    </div>
                  ) : (
                    <div className={styles["blog-page__thumb-placeholder"]}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        />
                        <path 
                          d="M8.5 9.5C9.32843 9.5 10 8.82843 10 8C10 7.17157 9.32843 6.5 8.5 6.5C7.67157 6.5 7 7.17157 7 8C7 8.82843 7.67157 9.5 8.5 9.5Z" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        />
                        <path 
                          d="M21 15L16 10L5 21" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                  
                  <div className={styles["blog-page__card-body"]}>
                    <h3 className={styles["blog-page__card-title"]}>{post.title}</h3>
                    <p className={styles["blog-page__card-excerpt"]}>
                      {post.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                    </p>
                    
                    <div className={styles["blog-page__card-footer"]}>
                       <span className={styles["blog-page__view-count"]}>
                        <Eye size={16} /> {post.viewCount}
                      </span>
                      <a
                        href={`/blogs/${post.slug}`}
                        className={styles["blog-page__read-more"]}
                      >
                        Đọc thêm
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles["blog-page__empty"]}>
            <div className={styles["blog-page__empty-icon"]}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M14 2V8H20" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Không tìm thấy bài viết nào</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn</p>
            {searchTerm && (
              <button 
                className={styles["blog-page__clear-search"]}
                onClick={() => setSearchTerm("")}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <nav className={styles["blog-page__pagination-wrap"]} aria-label="Phân trang blog">
            <button
              className={styles["blog-page__page-btn"]}
              onClick={handlePrev}
              disabled={page === 1}
              aria-label="Trang trước"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M19 12H5M5 12L12 19M5 12L12 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              TRƯỚC
            </button>
            
            <div className={styles["blog-page__pagination"]}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => {
                  // Show first, last, current, and adjacent pages
                  return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                })
                .map((p, index, array) => (
                  <div key={p}>
                    {index > 0 && array[index - 1] < p - 1 && (
                      <span className={styles["blog-page__page-ellipsis"]}>...</span>
                    )}
                    <button
                      className={clsx(
                        styles["blog-page__page-number"],
                        p === page && styles["blog-page__page-number--active"]
                      )}
                      onClick={() => setPage(p)}
                      aria-label={`Trang ${p}`}
                      aria-current={p === page ? "page" : undefined}
                    >
                      {p}
                    </button>
                  </div>
                ))
              }
            </div>
            
            <button
              className={styles["blog-page__page-btn"]}
              onClick={handleNext}
              disabled={page === totalPages}
              aria-label="Trang sau"
            >
              SAU
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default BlogPage;