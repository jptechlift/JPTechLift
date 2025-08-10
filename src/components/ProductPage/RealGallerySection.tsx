import styles from "../../styles/pages/product-page/RealGallerySection.module.scss";
import { useNavigate } from "react-router-dom";

interface Props {
  images: string[];
}

export default function RealGallerySection({ images }: Props) {
  const navigate = useNavigate();
  return (
    <section id="real-gallery" className={styles["real-gallery"]}>
      <h2 className={styles["real-gallery__heading"]}>Hình ảnh thực tế</h2>

      <div className={styles["real-gallery__wrapper"]}>
        <div className={styles["real-gallery__gallery"]}>
          {images.map((src, i) => (
            <img key={i} src={src} alt={`Ảnh thực tế ${i + 1}`} />
          ))}
        </div>

        <div className={styles["real-gallery__text"]}>
          <h3>
            Trải Nghiệm Thực Tế <br />
            Lắp Đặt Thang Máy Chuyên Nghiệp
          </h3>

          <div className={styles["real-gallery__content"]}>
            <p>
              <strong>Từ ý tưởng đến hiện thực</strong> - Mỗi công trình là một câu chuyện riêng biệt. Chúng tôi đồng
              hành từ khảo sát, thiết kế, thi công cho đến vận hành và bảo trì.
            </p>

            <p>
              <strong>Tiêu chuẩn 3A:</strong> An toàn - Tối ưu - Thẩm mỹ. Đây là kim chỉ nam trong từng bước triển khai
              dự án của chúng tôi.
            </p>
            <div className={styles["real-gallery__highlights"]}>
              <div className={styles["highlight-item"]}>
                <span className={styles["highlight-icon"]}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </span>
                <span>Lắp đặt trong nhà</span>
              </div>
              <div className={styles["highlight-item"]}>
                <span className={styles["highlight-icon"]}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-.55 0-1 .45-1 1v2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-2v-2c0-.55-.45-1-1-1z" />
                  </svg>
                </span>
                <span>Lắp đặt ngoài trời</span>
              </div>
              <div className={styles["highlight-item"]}>
                <span className={styles["highlight-icon"]}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 16H5V5h14v14z" />
                  </svg>
                </span>
                <span>Thiết kế linh hoạt</span>
              </div>
            </div>

            <p className={styles["cta-text"]}>
              Bạn muốn tìm hiểu thêm về quy trình lắp đặt và các giải pháp thang máy? Khám phá thêm những chia sẻ chuyên
              sâu từ đội ngũ kỹ thuật của chúng tôi.
            </p>
          </div>

          <div className={styles["real-gallery__buttons"]}>
            <a
              href="https://zalo.me/3469899057771273254"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button>XEM THÊM ẢNH</button>
            </a>
            <button onClick={() => navigate("/tin-tuc-thang-may")}>TIN TỨC & KIẾN THỨC</button>
          </div>
        </div>
      </div>
    </section>
  );
}
