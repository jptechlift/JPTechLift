// AboutUsIntro.tsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "../../styles/pages/about-us-page/about-us-intro.module.scss";

export default function AboutUsIntro() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <section className={styles.aboutIntroSection}>
    <div className={styles.aboutIntro}>
      <h1
        className={styles.aboutIntro__title}
        data-aos="fade-zoom-in"
        data-aos-duration="1200"
      >
        GIỚI THIỆU CHUNG
        <span className={styles.aboutIntro__titleUnderline}></span>
      </h1>

      <div className={styles.aboutIntro__content}>
        <p 
          className={styles.aboutIntro__greeting} 
          data-aos="fade-up" 
          data-aos-delay="100"
        >
          Kính chào quý khách hàng.
        </p>
        
        <p 
          className={styles.aboutIntro__text}
          data-aos="fade-up" 
          data-aos-delay="200"
        >
          Lời đầu tiên, toàn thể đội ngũ JP TechLift xin gửi đến Quý doanh
          nghiệp lời chào trân trọng và lời chúc thành công!
        </p>
        
        <p 
          className={styles.aboutIntro__text}
          data-aos="fade-up" 
          data-aos-delay="300"
        >
          Trong kỷ nguyên số, JP TechLift tiên phong trong việc ứng dụng những
          công nghệ đột phá vào lĩnh vực thang máy. Sứ mệnh của chúng tôi là
          mang đến những giải pháp di chuyển thông minh, uy tín lâu dài, không
          chỉ đáp ứng nhu cầu đi lại mà còn nâng tầm trải nghiệm và tối ưu hóa
          vận hành cho tòa nhà. Vì vậy, mọi sản phẩm của JP TechLift đều được
          xây dựng trên nền tảng công nghệ tiên tiến, tuân thủ những tiêu chuẩn
          an toàn quốc tế khắt khe nhất.
        </p>
        
        <p 
          className={styles.aboutIntro__text}
          data-aos="fade-up" 
          data-aos-delay="400"
        >
          Với tôn chỉ "Đổi mới để dẫn đầu", chúng tôi không ngừng nghiên cứu và
          phát triển các dòng thang máy tích hợp tính năng thông minh và sở hữu
          thiết kế tinh tế. Hãy để JP TechLift đồng hành cùng Quý vị kiến tạo
          những không gian sống - làm việc hiện đại, tiện nghi đáp ứng đa dạng
          nhu cầu từ biệt thự, chung cư cao cấp, tòa nhà văn phòng, trung tâm
          thương mại, khách sạn, bệnh viện đến các khu công nghiệp.
        </p>
        
        <p 
          className={styles.aboutIntro__slogan} 
          data-aos="zoom-in" 
          data-aos-delay="500"
        >
          JP TechLift - An toàn là tối thượng, Chất lượng là danh dự.
        </p>

        <div
          className={styles.aboutIntro__signature}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className={styles.aboutIntro__signatureInner}>
            <p className={styles.aboutIntro__signatureText}>Trân trọng kính chào.</p>
            <p className={styles.aboutIntro__signatureRole}>Giám đốc</p>
            <p className={styles.aboutIntro__signatureName}>VŨ NGỌC MINH TUYẾT</p>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}