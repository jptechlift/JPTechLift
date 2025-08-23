import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from '../../styles/pages/blog-page/blog-page.module.scss';
import { blog, BlogPost } from '../../services/blog';

const BLOGS_PER_PAGE = 6;

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    blog.list().then(setBlogs).catch(() => {});
  }, []);

  const shownBlogs = blogs.slice((page - 1) * BLOGS_PER_PAGE, page * BLOGS_PER_PAGE);

  return (
    <div className={styles.blogWrap}>
      <h1 className={styles.title} data-aos="fade-up">
        BLOG THANG MÁY JP TECHLIFT
      </h1>

      <div className={styles.topBar} data-aos="fade-up" data-aos-delay="100">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchValue}
            onChange={handleSearchChange}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: 16,
              marginRight: 8
            }}
          />
          <div className={styles.resultText}>6 thẻ mỗi trang. Hiển thị kết quả 1 – 6</div>
        </div>
        <div className={styles.filterSort}>
          <select className={styles.select}>
            <option value="">Bộ lọc</option>
            <option value="kienthuc">Kiến thức</option>
            <option value="kythuat">Kỹ thuật</option>
            <option value="phongvan">Phỏng vấn</option>
          </select>
          <select className={styles.select}>
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {shownBlogs.map((blogItem, idx) => (
          <Link
            to={`/blogs/${blogItem.slug}`}
            key={blogItem.id}
            className={styles.card}
            data-aos="zoom-in-up"
            data-aos-delay={idx * 100}
          >
            {blogItem.imageUrl && (
              <img
                src={blogItem.imageUrl}
                alt={blogItem.title}
                className={styles.thumb}
              />
            )}
            <h3>{blogItem.title}</h3>
            <p>{blogItem.content}</p>
        </Link>
        ))}
      </div>

      <div className={styles.paginationWrap}>
        <span className={styles.pageNav}>TRƯỚC</span>
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={page === idx + 1 ? styles.active : ''}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <span className={styles.pageNav}>SAU</span>
      </div>
    </div>
  );
}