// AboutUsBanner.jsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "../../styles/pages/about-us-page/about-us-banner.module.scss";
import cityImg from "../../assets/images/city.jpg";

export default function AboutUsBanner() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className={styles.aboutBanner}>
      <div className={styles.aboutBanner__hero}>
        <img
          src={cityImg}
          className={styles.aboutBanner__heroImage}
          alt="City View"
        />
        <div
          className={styles.aboutBanner__heroText}
          data-aos="fade"
          data-aos-duration="1200"
        >
          Mỗi thang máy JPTechLift là
          <br />
          sự kết hợp giữa kỹ thuật hiện đại, tiết kiệm năng lượng
          <br />
          và thiết kế nâng tầm không gian.
        </div>
      </div>

      <div className={styles.aboutBanner__content}>
        <div
          className={styles.aboutBanner__card}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className={styles.aboutBanner__cardTitle}>Tầm Nhìn</h2>
          <div className={styles.aboutBanner__cardDivider}></div>
          <p className={styles.aboutBanner__cardText}>
            Chúng tôi trao cho mọi người quyền tự do kết nối và phát triển ở một
            thế giới cao hơn, nhanh hơn và thông minh hơn.
          </p>
        </div>

        <div
          className={styles.aboutBanner__card}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className={styles.aboutBanner__cardTitle}>Sứ mệnh</h2>
          <div className={styles.aboutBanner__cardDivider}></div>
          <p className={styles.aboutBanner__cardText}>
            Trở thành một công ty đẳng cấp thế giới. Lấy khách hàng làm trung
            tâm và hướng tới dịch vụ.
          </p>
        </div>

        <div
          className={styles.aboutBanner__card}
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h2 className={styles.aboutBanner__cardTitle}>Giá Trị</h2>
          <div className={styles.aboutBanner__cardDivider}></div>
          <p className={styles.aboutBanner__cardText}>
            Chúng tôi đặt con người làm trung tâm trong mọi việc.
            <br />
            Chúng tôi đáng tin cậy, thông minh và tập trung vào tương lai.
            <br />
            Chúng tôi đang tạo ra một thế giới kết nối và cá nhân hơn.
            <br />
            Chúng tôi sẵn sàng để hoàn thành điều đó.
          </p>
        </div>

        <div className={styles.aboutBanner__buttonWrapper}>
          <button className={styles.aboutBanner__button}>
            ĐỒNG HÀNH CÙNG JPTECHLIFT
          </button>
        </div>
      </div>
    </section>
  );
}