import React, { useState, FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import các kiểu dữ liệu và SCSS
import { ConfiguratorItem, FinishingCategory, ElevatorConfiguration } from "../../data/aestheticModalData";
import styles from "../../styles/pages/products-page/productCabin.module.scss";

// --- Dữ liệu giả lập ---
import aes1 from "../../assets/images/productPage_img/AestheticModal/aes1.png";
import aes2 from "../../assets/images/productPage_img/AestheticModal/aes2.png";
import aes3 from "../../assets/images/productPage_img/AestheticModal/aes3.png";
import aes4 from "../../assets/images/productPage_img/AestheticModal/aes4.png";
import ce1 from "../../assets/images/productPage_img/AestheticModal/ceiling4Led.png";
import ce2 from "../../assets/images/productPage_img/AestheticModal/ceiling6Led.png";
import ce3 from "../../assets/images/productPage_img/AestheticModal/ceilingfullLightLed.png";
import ha1 from "../../assets/images/productPage_img/AestheticModal/handrailC1.png";
import ha2 from "../../assets/images/productPage_img/AestheticModal/handrailC2.png";
import ha3 from "../../assets/images/productPage_img/AestheticModal/handrailFlat.png";

const mockImages = {
  cabinSteel1: aes1,
  cabinStandard1: aes2,
  cabinPremium1: aes3,
  cabinPremium2: aes4,
  ceiling4Led: ce1,
  ceiling6Led: ce2,
  ceilingfullLightLed: ce3,
  handrailC1: ha1,
  handrailC2: ha2,
  handrailFlat: ha3,
};
const aestheticItems: ConfiguratorItem[] = [
  { id: 1, images: [mockImages.cabinSteel1], title: "Cabin thép", description: "Vách cabin được ốp thép dọc, có thể lựa chọn giữa thép không gỉ mờ, thép hoa văn hoặc lớp phủ sơn tĩnh điện cao cấp." },
  { id: 2, images: [mockImages.cabinStandard1], title: "Cabin tiêu chuẩn", description: "Vách cabin làm từ thép phủ laminate trực tiếp – đơn giản, hiệu quả, phù hợp nhiều công trình." },
  { id: 3, images: [mockImages.cabinPremium1], title: "Cabin cao cấp", description: "Vách cabin sử dụng tấm laminate chịu áp lực cao. Có thể lựa chọn các loại vân gỗ dán, màu đặc hoặc kết hợp thép không gỉ – mang đến vẻ sang trọng và bền bỉ." },
  { id: 4, images: [mockImages.cabinPremium2], title: "Cabin cao cấp 'Plus'", description: "Minh hoạ với chất liệu gỗ Mahogany tạo vân sang trọng, trần đèn 6 LED (FC-6) kết hợp thép không gỉ hoàn thiện. Tay vịn phẳng DH-155 làm từ thép xước tạo điểm nhấn hiện đại." },
];
const ceilingOptions: ConfiguratorItem[] = [
  { id: "c1", images: [mockImages.ceiling4Led], title: "Trần 4 đèn LED phẳng (FC-4)", description: "Hoàn thiện: sơn trắng, sơn đen hoặc thép không gỉ." },
  { id: "c2", images: [mockImages.ceiling6Led], title: "Trần 6 đèn LED dạng thả (FC-6)", description: "Hoàn thiện: sơn trắng, sơn đen hoặc thép không gỉ. Thiết kế nổi, tạo chiều sâu ánh sáng." },
  { id: "c3", images: [mockImages.ceilingfullLightLed], title: "Trần LED viền quanh (FC-10)", description: "Thiết kế ánh sáng viền bao quanh trần, mang lại hiệu ứng sang trọng. Hoàn thiện: sơn trắng, sơn đen hoặc thép không gỉ." },
];
const handrailOptions: ConfiguratorItem[] = [
  { id: "h1", images: [mockImages.handrailFlat], title: "Tay vịn phẳng (DH-155)", description: "Thanh ngang dạng phẳng, hoàn thiện bằng thép không gỉ xước." },
  { id: "h2", images: [mockImages.handrailC2], title: "Tay vịn tròn (DH-156)", description: "Tay vịn dạng ống tròn cổ điển, làm từ thép không gỉ xước." },
  { id: "h3", images: [mockImages.handrailC1], title: "Tay vịn oval (DH-157)", description: "Dạng elip mềm mại, tăng tính thẩm mỹ và dễ cầm nắm. Hoàn thiện bằng thép không gỉ xước." },
];
const finishingCategories: FinishingCategory[] = [
    {
    id: "premium-finish",
    title: "Hoàn Thiện Cao Cấp",
    items: [
      { id: "pf-918-3", code: "918-3", name: "Kingswood Walnut", colorHex: "#c8b7a6", imageUrl: "/images/finishes/kingswood-walnut.jpg" },
      { id: "pf-8220-38", code: "8220-38", name: "French Pear", colorHex: "#9a6a48", imageUrl: "/images/finishes/french-pear.jpg" },
      { id: "pf-7992-38", code: "7992-38", name: "Pinnacle Walnut", colorHex: "#6F4E37", imageUrl: "/images/finishes/pinnacle-walnut.jpg" },
      { id: "pf-5016-38", code: "5016-38", name: "French Linen", colorHex: "#4a5568", imageUrl: "/images/finishes/french-linen.jpg" },
      { id: "pf-5024-60", code: "5024-60", name: "Blackbird", colorHex: "#1a1a1a" },
      { id: "pf-5003-38", code: "5003-38", name: "White Cascade", colorHex: "#f5f5f5", imageUrl: "/images/finishes/white-cascade.jpg" },
      { id: "pf-8217-16", code: "8217-16", name: "Italian Silver Ash", colorHex: "#d1ccc2" },
      { id: "pf-7960-18", code: "7960-18", name: "Studio Teak", colorHex: "#b4835a" },
      { id: "pf-7949-38", code: "7949-38", name: "Asian Night", colorHex: "#2c3e50" },
      { id: "pf-5015-38", code: "5015-38", name: "Nordic Linen", colorHex: "#e4dcd3" },
      { id: "pf-4842-60", code: "4842-60", name: "Canyon Zephyr", colorHex: "#d2b48c" },
      { id: "pf-d439-60", code: "D439-60", name: "Wallaby", colorHex: "#85766c" },
      { id: "pf-7850-60", code: "7850-60", name: "Beigewood", colorHex: "#e1d4c0" },
      { id: "pf-7937-38", code: "7937-38", name: "River Cherry", colorHex: "#944545" },
      { id: "pf-7919-38", code: "7919-38", name: "Amber Cherry", colorHex: "#c56a39" },
      { id: "pf-4942-38", code: "4942-38", name: "Crisp Linen", colorHex: "#f7f4ed" },
      { id: "pf-4794-60", code: "4794-60", name: "Windswept Bronze", colorHex: "#a97e5d" },
      { id: "pf-d505-60", code: "D505-60", name: "Midnight", colorHex: "#000033" },
      { id: "pf-7040-60", code: "7040-60", name: "Figured Mahogany", colorHex: "#6e2f2f" },
      { id: "pf-7997-38", code: "7997-38", name: "Ebony Recon", colorHex: "#2d2d2d" },
      { id: "pf-8239-38", code: "8239-38", name: "Cenizo Cherry", colorHex: "#8b6b6b" },
      { id: "pf-5023-60", code: "5023-60", name: "Nightfall", colorHex: "#3d3d3d" },
      { id: "pf-d504-60", code: "D504-60", name: "Fossil Shale", colorHex: "#7e7a70" },
      { id: "pf-d90-60", code: "D90-60", name: "North Sea", colorHex: "#3b596a" },
    ],
  },
  {
    id: "steel-finish",
    title: "Hoàn Thiện Thép",
    items: [
      { id: "sf-ew-0", code: "EW-0", name: "Real White", colorHex: "#fdfdfd" },
      { id: "sf-en-1", code: "EN-1", name: "Flax", colorHex: "#edeacc" },
      { id: "sf-ew-5", code: "EW-5", name: "Black Pearl", colorHex: "#0a0a0a" },
      { id: "sf-brushed", code: "Brushed", name: "Brushed Stainless Steel", colorHex: "#c0c0c0", imageUrl: "/images/finishes/steel-brushed.jpg" },
      { id: "sf-patterned", code: "Patterned", name: "Patterned Stainless Steel", colorHex: "#a9a9a9", imageUrl: "/images/finishes/steel-patterned.jpg" },
    ],
  },
];

interface ContactDetails { email: string; phone: string; }
const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

// --- COMPONENT CON (Carousel) - Đã sửa lỗi ---
interface CarouselProps {
  title: string;
  items: ConfiguratorItem[];
  selectedItem: ConfiguratorItem;
  onSelectItem: (item: ConfiguratorItem) => void;
}
const Carousel: FC<CarouselProps> = ({ title, items, selectedItem, onSelectItem }) => {
  const currentIndex = items.findIndex((item) => item.id === selectedItem.id);
  const selectItemByIndex = (index: number) => {
    if (index >= 0 && index < items.length) {
      onSelectItem(items[index]);
    }
  };

  // Trả về một khối duy nhất để grid layout hoạt động
  return (
    <div className={styles.configurator__carousel}>
      <div className={styles["configurator__image-wrapper"]}>
        <img src={selectedItem.images[0]} alt={selectedItem.title} />
      </div>
      <div className={styles.configurator__content}>
        <h3 className={styles['configurator__carousel-title']}>{title}</h3>
        <h4>{selectedItem.title}</h4>
        <p>{selectedItem.description}</p>
      </div>
      <nav className={styles["configurator__item-nav"]}>
        <button
          className={styles["configurator__nav-button"]}
          onClick={() => selectItemByIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Lựa chọn trước"
        >
          <ChevronLeft size={20} />
        </button>
        <div className={styles["configurator__nav-dots"]}>
          {items.map((item, index) => (
            <button
              key={item.id}
              className={cx(styles["configurator__nav-dot"], index === currentIndex && styles["configurator__nav-dot--active"])}
              onClick={() => selectItemByIndex(index)}
              aria-label={`Chọn ${item.title}`}
            />
          ))}
        </div>
        <button
          className={styles["configurator__nav-button"]}
          onClick={() => selectItemByIndex(currentIndex + 1)}
          disabled={currentIndex === items.length - 1}
          aria-label="Lựa chọn kế tiếp"
        >
          <ChevronRight size={20} />
        </button>
      </nav>
    </div>
  );
};

// --- COMPONENT CHÍNH - Đã tái cấu trúc ---
const ElevatorConfigurator: FC = () => {
  const [configuration, setConfiguration] = useState<ElevatorConfiguration>({
    cabin: aestheticItems[0],
    ceiling: ceilingOptions[0],
    handrail: handrailOptions[0],
    finish: { "premium-finish": "fw1", "steel-finish": "sf4" },
  });
  const [contact, setContact] = useState<ContactDetails>({ email: "", phone: "" });

  const handleSelectFinish = (categoryId: string, finishId: string) => {
    setConfiguration((prev) => ({ ...prev, finish: { ...prev.finish, [categoryId]: finishId } }));
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { cabin, ceiling, handrail, finish } = configuration;
    const finishSummary = Object.entries(finish)
      .map(([catId, finishId]) => {
        const category = finishingCategories.find((c) => c.id === catId);
        const item = category?.items.find((i) => i.id === finishId);
        return `- ${category?.title}: ${item?.name || "N/A"} (${item?.code || "N/A"})`;
      })
      .join("\n");
    const emailBody = `Kính gửi bộ phận kinh doanh,\n\nMột khách hàng đã gửi yêu cầu tư vấn với thông tin liên hệ và cấu hình thang máy chi tiết như sau:\n\n-----------------------------------------------\nTHÔNG TIN LIÊN HỆ KHÁCH HÀNG:\n- Email: ${contact.email}\n- Điện thoại: ${contact.phone}\n-----------------------------------------------\n\nCHI TIẾT CẤU HÌNH ĐÃ CHỌN:\n- Loại Cabin: ${cabin.title}\n- Kiểu Trần: ${ceiling.title}\n- Tay Vịn: ${handrail.title}\n\nLỰA CHỌN HOÀN THIỆN:\n${finishSummary}\n-----------------------------------------------\n\nVui lòng liên hệ và tư vấn cho khách hàng này.\nTrân trọng cảm ơn.`.trim();
    const mailtoLink = `mailto:kinhdoanh@ten-cong-ty-cua-ban.com?subject=${encodeURIComponent("Yêu Cầu Tư Vấn Cấu Hình Thang Máy")}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className={styles.configurator}>
      <header className={styles.configurator__header}>
        <h1>Tùy Chỉnh Thang Máy Của Bạn</h1>
        <p>Lựa chọn từng chi tiết để tạo nên không gian hoàn hảo</p>
      </header>

      <main>
        {/* === PHẦN 1: CÁC LỰA CHỌN TRÊN CÙNG 1 HÀNG === */}
        <section className={styles.configurator__section}>
          <h2 className={styles["configurator__section-title"]}>1. Lựa chọn các thành phần chính</h2>
          <div className={styles["configurator__carousel-row"]}>
            <Carousel
              title="Thẩm Mỹ Cabin"
              items={aestheticItems}
              selectedItem={configuration.cabin}
              onSelectItem={(item) => setConfiguration((p) => ({ ...p, cabin: item }))}
            />
            <Carousel
              title="Kiểu Trần"
              items={ceilingOptions}
              selectedItem={configuration.ceiling}
              onSelectItem={(item) => setConfiguration((p) => ({ ...p, ceiling: item }))}
            />
            <Carousel
              title="Tay Vịn"
              items={handrailOptions}
              selectedItem={configuration.handrail}
              onSelectItem={(item) => setConfiguration((p) => ({ ...p, handrail: item }))}
            />
          </div>
        </section>
        
        {/* === PHẦN 2: LỰA CHỌN HOÀN THIỆN (Đầy đủ) === */}
        <section className={styles.configurator__section}>
          <h2 className={styles["configurator__section-title"]}>2. Lựa Chọn Hoàn Thiện</h2>
          <div className={styles.configurator__finishes}>
            {finishingCategories.map((category) => (
              <div key={category.id} className={styles["configurator__finish-category"]}>
                <h4>{category.title}</h4>
                <div className={styles["configurator__finish-grid"]}>
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={styles["configurator__finish-item"]}
                      onClick={() => handleSelectFinish(category.id, item.id)}
                    >
                      <div
                        className={cx(styles.configurator__swatch, configuration.finish[category.id] === item.id && styles["configurator__swatch--selected"])}
                        style={{ backgroundColor: item.colorHex, backgroundImage: `url(${item.imageUrl})` }}
                      />
                      <p className={styles.configurator__name}>{item.name}</p>
                      <p className={styles.configurator__code}>{item.code}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === PHẦN 3: TÓM TẮT VÀ FORM (Đầy đủ) === */}
        <section className={cx(styles.configurator__section, styles["configurator__form-section"])}>
            <h2 className={styles["configurator__section-title"]} style={{ color: "var(--color-primary)" }}>
            3. Hoàn Tất và Gửi Yêu Cầu
          </h2>
          <div className={styles.configurator__summary}>
            <h4 className={styles["configurator__summary-title"]}>Cấu Hình Của Bạn</h4>
            <ul className={styles["configurator__summary-list"]}>
              <li className={styles["configurator__summary-item"]}>
                <span>Loại Cabin</span>
                <strong>{configuration.cabin.title}</strong>
              </li>
              <li className={styles["configurator__summary-item"]}>
                <span>Kiểu Trần</span>
                <strong>{configuration.ceiling.title}</strong>
              </li>
              <li className={styles["configurator__summary-item"]}>
                <span>Tay Vịn</span>
                <strong>{configuration.handrail.title}</strong>
              </li>
              {Object.entries(configuration.finish).map(([catId, finishId]) => {
                const category = finishingCategories.find((c) => c.id === catId);
                const item = category?.items.find((i) => i.id === finishId);
                if (!category || !item) return null;
                return (
                  <li key={catId} className={styles["configurator__summary-item"]}>
                    <span>{category.title}</span>
                    <strong>{item.name}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
          <form className={styles.configurator__form} onSubmit={handleFormSubmit}>
            <p style={{ textAlign: "center", maxWidth: "600px", margin: "-16px auto 24px", color: "#fff" }}>
              Vui lòng nhập thông tin liên hệ để chúng tôi gửi báo giá cho cấu hình trên.
            </p>
            <div className={styles["configurator__form-group"]}>
              <label htmlFor="email" className={styles.configurator__label}>Địa chỉ Email</label>
              <input type="email" id="email" name="email" value={contact.email} className={styles.configurator__input} required onChange={handleFormChange} placeholder="vidu@gmail.com" />
            </div>
            <div className={styles["configurator__form-group"]}>
              <label htmlFor="phone" className={styles.configurator__label}>Số điện thoại</label>
              <input type="tel" id="phone" name="phone" value={contact.phone} className={styles.configurator__input} required onChange={handleFormChange} placeholder="09xxxxxxxx" />
            </div>
            <button type="submit" className={styles["configurator__submit-button"]}>Gửi Yêu Cầu Báo Giá</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ElevatorConfigurator;