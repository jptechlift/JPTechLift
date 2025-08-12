import { PanelLeft, CircleDot, DoorOpen, Lightbulb, AlertCircle, Cog } from "lucide-react";
import styles from "../../styles/pages/services-page/accessories.module.scss";
import AccessoriesGallery from "./AccessoriesGallery";

const items = [
  { icon: PanelLeft, label: "Bảng điều khiển" },
  { icon: CircleDot, label: "Nút nhấn" },
  { icon: DoorOpen, label: "Cửa cabin" },
  { icon: Lightbulb, label: "Đèn LED hiển thị" },
  { icon: AlertCircle, label: "Đèn báo khẩn cấp" },
  { icon: Cog, label: "Máy kéo" },
];

export default function Accessories() {
  return (
    <div className={styles.accessories}>

      <h1 className={styles.accessories__heading}>Vật tư &amp; Phụ kiện Thang máy Cao cấp</h1>
      <p className={styles.accessories__intro}>
        Sử dụng vật tư chính hãng, bền bỉ là yếu tố quan trọng giúp hệ thống thang máy vận hành an toàn và ổn định. 
        Kho phụ kiện đa dạng tại JP TechLift giúp thiết bị hoạt động trơn tru và hạn chế tối đa thời gian ngừng hoạt động.
      </p>

      <section className={styles.accessorySection} id="vat-tu-phu-kien">
        <h2 className={styles.accessorySection__title}>Danh mục phụ kiện</h2>
        <div className={styles.accessoryGrid}>
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className={styles.accessoryGrid__item}>
              <Icon className={styles.accessoryGrid__icon} size={32} />
              <span className={styles.accessoryGrid__label}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <AccessoriesGallery />

      <section className={styles.whySection}>
        <h2 className={styles.whySection__title}>Vì sao chọn phụ kiện của chúng tôi?</h2>
        <ul className={styles.whySection__list}>
          <li className={styles.whySection__item}>Nhập khẩu từ các nhà sản xuất OEM uy tín</li>
          <li className={styles.whySection__item}>Kiểm soát chất lượng nghiêm ngặt và độ bền vượt trội</li>
          <li className={styles.whySection__item}>Tương thích với hầu hết các dòng thang máy phổ biến</li>
          <li className={styles.whySection__item}>Giao hàng nhanh, tư vấn kỹ thuật tận tâm</li>
        </ul>
      </section>

      <section className={styles.ctaBox}>
        <h3 className={styles.ctaBox__title}>Cần tìm phụ kiện cụ thể?</h3>
        <p className={styles.ctaBox__text}>Liên hệ ngay để nhận báo giá phù hợp với nhu cầu của bạn.</p>
        <button className={styles.ctaBox__button}>Nhận báo giá</button>
      </section>
    </div>
  );
}
