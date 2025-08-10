import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Logo from "../../logo/Logo";
import styles from "../../../styles/components/Navbar/MobieNavbar/MobileMenu.module.scss";
import AdvancedSearch from "../AdvancedSearch";

// Assets imports
import facebook from "../../../assets/images/header/Facebook_Icon_3.png";
import tiktok from "../../../assets/images/header/TikTok_Icon_3.png";
import linkendin from "../../../assets/images/header/Linkedin_Icon_3.png";
import search from "../../../assets/images/header/Search_Icon_2.png";
import XIcon from "../../../assets/images/header/X_Icon.png";
import youtube from "../../../assets/images/header/Youtube_Icon_3.png";
import backIcon from "../../../assets/images/header/Back_Icon.png";

// ===================================
// 📋 CONSTANTS & TYPES
// ===================================
const MENU_LEVELS = {
  MAIN: "main",
  PRODUCT: "product",
  SERVICE: "service",
  ABOUT: "about",
} as const;

type MenuLevel = (typeof MENU_LEVELS)[keyof typeof MENU_LEVELS];

// ===================================
// 📊 NAVIGATION DATA
// ===================================
const NAVIGATION_DATA = {
  products: [
    { label: "THANG MÁY GIA ĐÌNH", path: "/san-pham/thang-may-gia-dinh" },
    { label: "THANG MÁY HÀNH KHÁCH", path: "/san-pham/thang-may-hanh-khach" },
    { label: "THANG MÁY TẢI HÀNG", path: "/san-pham/thang-may-tai-hang" },
    { label: "THANG MÁY QUAN SÁT", path: "/san-pham/thang-may-quan-sat" },
    { label: "THANG MÁY BỆNH VIỆN", path: "/san-pham/thang-may-benh-vien" },
    { label: "THANG MÁY THỰC PHẨM", path: "/san-pham/thang-tai-thuc-pham" },
    { label: "THANG CUỐN", path: "/san-pham/thang-truot-thang-cuon" },
  ],
  services: [
    { label: "TƯ VẤN – THIẾT KẾ", path: "/dich-vu-thang-may/tu-van-thiet-ke" },
    { label: "BẢO TRÌ", path: "/dich-vu-thang-may/bao-tri-thang-may" },
    { label: "LẮP ĐẶT – VẬN HÀNH", path: "/dich-vu-thang-may/lap-dat-thang-may" },
    { label: "CẢI TẠO – SỬA CHỮA", path: "/dich-vu-thang-may/cai-tao-sua-chua" },
    { label: "VẬT TƯ – PHỤ KIỆN THANG MÁY", path: "/dich-vu-thang-may/vat-tu-phu-kien" },
  ],
  about: [
    { label: "VỀ CHÚNG TÔI", path: "/gioi-thieu" },
    { label: "BAN LÃNH ĐẠO", path: "/gioi-thieu/ban-lanh-dao" },
    { label: "NGUYÊN TẮC", path: "/gioi-thieu/nguyen-tac" },
    { label: "QUY TRÌNH DỰ ÁN", path: "/gioi-thieu/quy-trinh-du-an" },
  ],
  socials: [
    {
      href: "https://www.facebook.com/thangmayvietnam",
      icon: facebook,
      alt: "Facebook",
    },
    {
      href: "https://www.linkedin.com/company/thang-may-viet-nam",
      icon: linkendin,
      alt: "LinkedIn",
    },
    {
      href: "https://www.tiktok.com/@thangmayvietnam",
      icon: tiktok,
      alt: "TikTok",
    },
    {
      href: "https://x.com/ThangMayVN",
      icon: XIcon,
      alt: "X (Twitter)",
    },
    {
      href: "https://www.youtube.com/@thangmayvietnam",
      icon: youtube,
      alt: "YouTube",
    },
  ],
};

// ===================================
// 🎯 MAIN COMPONENT
// ===================================
const MobileMenu = () => {
  // ===================================
  // 🎛️ STATE MANAGEMENT
  // ===================================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuLevel, setActiveMenuLevel] = useState<MenuLevel>(MENU_LEVELS.MAIN);
  const [isSearchOpen, setShowSearch] = useState(false);

  // ===================================
  // 🚀 EVENT HANDLERS (Optimized with useCallback)
  // ===================================
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    if (isMenuOpen) {
      setActiveMenuLevel(MENU_LEVELS.MAIN);
    }
  }, [isMenuOpen]);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
    setActiveMenuLevel(MENU_LEVELS.MAIN);
  }, []);

  const handleMenuLevelChange = useCallback((level: MenuLevel) => {
    setActiveMenuLevel(level);
  }, []);

  // ===================================
  // 🎹 KEYBOARD & EFFECTS HANDLING
  // ===================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        handleMenuClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, handleMenuClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // ===================================
  // 🏗️ RENDER FUNCTIONS
  // ===================================
  const renderBackButton = (targetLevel: MenuLevel, label = "QUAY LẠI") => (
    <li className={`${styles.menu__item} ${styles["menu__item--back"]}`}>
      <button
        className={styles["menu__button"]}
        onClick={() => handleMenuLevelChange(targetLevel)}
        aria-label={`Quay lại ${label}`}
      >
        <span className={styles["menu__back-content"]}>
          <img src={backIcon} alt="Quay lại" className={styles["menu__back-icon"]} />
          <span>{label}</span>
        </span>
      </button>
    </li>
  );

  const renderMenuItems = (items: Array<{ label: string; path: string }>) => (
    <>
      {items.map((item, index) => (
        <li key={`${item.path}-${index}`} className={styles.menu__item}>
          <Link to={item.path} onClick={handleMenuClose} className={styles.menu__link} aria-label={item.label}>
            <span>{item.label}</span>
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </>
  );

  const renderSocialLinks = () => (
    <div className={styles.menu__socials} role="complementary" aria-label="Liên kết mạng xã hội">
      {NAVIGATION_DATA.socials.map((social, index) => (
        <a
          key={`${social.alt}-${index}`}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.menu__social_link}
          aria-label={`Theo dõi trên ${social.alt}`}
        >
          <img src={social.icon} alt={social.alt} className={styles.menu__social_icon} />
        </a>
      ))}
    </div>
  );

  const renderMainMenu = () => (
    <ul className={styles["menu__list"]} role="list">
      <li className={styles["menu__item"]}>
        <Link to="/" onClick={handleMenuClose} className={styles["menu__link"]}>
          <span>TRANG CHỦ</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </li>
      <li className={styles["menu__item"]}>
        <button
          className={styles["menu__button"]}
          onClick={() => handleMenuLevelChange(MENU_LEVELS.PRODUCT)}
          aria-label="Xem danh sách sản phẩm"
        >
          <span>SẢN PHẨM</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </li>
      <li className={styles["menu__item"]}>
        <button
          className={styles["menu__button"]}
          onClick={() => handleMenuLevelChange(MENU_LEVELS.SERVICE)}
          aria-label="Xem danh sách dịch vụ"
        >
          <span>DỊCH VỤ</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </li>
      <li className={styles["menu__item"]}>
        <button
          className={styles["menu__button"]}
          onClick={() => handleMenuLevelChange(MENU_LEVELS.ABOUT)}
          aria-label="Thông tin về công ty"
        >
          <span>CÔNG TY CHÚNG TÔI</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </li>
      <li className={styles["menu__item"]}>
        <Link to="/lien-he" onClick={handleMenuClose} className={styles["menu__link"]}>
          <span>LIÊN HỆ</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </li>
      <li className={styles["menu__item"]}>
        <Link to="/blog-thang-may" onClick={handleMenuClose} className={styles["menu__link"]}>
          <span>TIN TỨC</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );

  const renderSubMenu = (level: MenuLevel, data: Array<{ label: string; path: string }>) => (
    <ul className={styles["menu__list"]} role="list">
      {renderBackButton(MENU_LEVELS.MAIN)}
      {renderMenuItems(data)}
    </ul>
  );

  // ===================================
  // 🎨 MAIN RENDER
  // ===================================
  return (
    <header className={styles["mobile-navbar"]} role="banner">
      {/* ===================================
          🔶 HOTLINE BAR
          =================================== */}
      <div className={styles["mobile-navbar__hotline"]} role="banner">
        <p>
          Hotline: <a href="tel:+84777275384">(+84) 777 275 384</a>
        </p>
      </div>

      {/* ===================================
          🔵 MAIN HEADER BAR
          =================================== */}
      <div className={styles["mobile-navbar__header"]} role="navigation" aria-label="Thanh điều hướng chính">
        {/* Logo */}
        <Logo
          variant="white"
          className={`${styles["mobile-navbar__logo"]} ${isSearchOpen ? styles["mobile-navbar__logo--hidden"] : ""}`}
        />

        {/* Right side controls */}
        <div className={styles["mobile-navbar__controls"]}>
          {/* Advanced Search Component */}
          <AdvancedSearch isOpen={isSearchOpen} setIsOpen={setShowSearch} scrolled={false} />

          <div className={styles["mobile-navbar__actions"]}>
            {/* Search Toggle Button */}
            <button
              className={styles["mobile-navbar__search-toggle"]}
              onClick={() => setShowSearch(true)}
              aria-label="Tìm kiếm"
            >
              <img src={search} alt="Tìm kiếm" className={styles["mobile-navbar__search-icon"]} />
            </button>

            {/* Visual Divider */}
            <div className={styles["mobile-navbar__divider"]} aria-hidden="true"></div>

            {/* Hamburger Menu Toggle */}
            <button
              className={`${styles["mobile-navbar__menu-toggle"]} ${
                isMenuOpen ? styles["mobile-navbar__menu-toggle--active"] : ""
              }`}
              onClick={handleMenuToggle}
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================
          📂 DROPDOWN MENU PANEL
          =================================== */}
      <nav
        id="mobile-menu"
        className={`${styles["menu"]} ${isMenuOpen ? styles["menu--open"] : ""}`}
        role="navigation"
        aria-label="Menu điều hướng di động"
        aria-hidden={!isMenuOpen}
      >
        <div className={styles["menu__content"]}>
          {/* Dynamic Menu Level Rendering */}
          {activeMenuLevel === MENU_LEVELS.MAIN && renderMainMenu()}
          {activeMenuLevel === MENU_LEVELS.ABOUT && renderSubMenu(MENU_LEVELS.ABOUT, NAVIGATION_DATA.about)}
          {activeMenuLevel === MENU_LEVELS.SERVICE && renderSubMenu(MENU_LEVELS.SERVICE, NAVIGATION_DATA.services)}
          {activeMenuLevel === MENU_LEVELS.PRODUCT && renderSubMenu(MENU_LEVELS.PRODUCT, NAVIGATION_DATA.products)}
        </div>

        {/* Social Media Links */}
        {isMenuOpen && renderSocialLinks()}
      </nav>

      {/* ===================================
          🌑 OVERLAY FOR BACKDROP
          =================================== */}
      {isMenuOpen && <div className={styles["mobile-navbar__overlay"]} onClick={handleMenuClose} aria-hidden="true" />}
    </header>
  );
};

export default MobileMenu;
