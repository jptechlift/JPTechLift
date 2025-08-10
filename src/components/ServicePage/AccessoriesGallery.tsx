import { accessories } from '../../data/accessoriesData';
import styles from '../../styles/pages/services-page/Accessories.module.scss';

export default function AccessoriesGallery() {
  return (
    <section className={styles.productGallery}>
      <h2 className={styles.productGallery__title}>Danh mục Phụ kiện &amp; Vật tư</h2>
      <div className={styles.productGallery__grid}>
        {accessories.map((item) => (
          <div key={item.id} className={styles.productGallery__card}>
            <div className={styles.productGallery__imageWrapper}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.productGallery__image}
              />
              <div className={styles.productGallery__overlay}>
                <button className={styles.productGallery__quick}>Xem nhanh</button>
              </div>
            </div>
            <h3 className={styles.productGallery__name}>{item.title}</h3>
            <p className={styles.productGallery__desc}>{item.desc}</p>
            <p className={styles.productGallery__price}>
              {item.price ? `${item.price} VNĐ` : 'Liên hệ để nhận báo giá'}
            </p>
            <button className={styles.productGallery__cta}>Nhận báo giá</button>
          </div>
        ))}
      </div>
    </section>
  );
}
