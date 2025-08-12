import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import facebook from "../../../assets/images/header/Facebook_Icon.png";
import tiktok from "../../../assets/images/header/TikTok_Icon.png";
import linkendin from "../../../assets/images/header/Linkedin_Icon.png";
import search from "../../../assets/images/header/Search_Icon_2.png";
import styles from "../../../styles/components/Navbar/DesktopNavbar/desktopNav.module.scss";

import ProductServiceDropdown from "./ProductServiceDropdown";

interface MenuBarProps {
  scrolled: boolean;
  onSearchOpen: () => void;
  showSearch: boolean;
}

const MenuBar = ({ scrolled, onSearchOpen, showSearch }: MenuBarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeDropdown = () => setActiveDropdown(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  return (
    <div ref={menuRef} className={`${styles.menuWrapper} ${scrolled ? styles.menuBarScrolled : ""}`}>
      <div className={`${styles.menuBar} ${scrolled ? styles.menuBarScrolled : ""}`}>
        <div className={styles.menuBar__left}>
          <ul className={styles.menuBar__list}>
            <li className={styles.menuItem}>
              <Link to="/" className={styles.menuBar__link}>
                TRANG CHỦ
              </Link>
            </li>
            <li className={styles.menuItem}>
              <div className={styles.dropdownWrapper}>
                <button
                  className={styles.menuBar__link}
                  onClick={() => setActiveDropdown(activeDropdown === "product" ? null : "product")}
                >
                  SẢN PHẨM
                </button>
                {!showSearch && activeDropdown === "product" && (
                  <ProductServiceDropdown type="product" onClose={closeDropdown} />
                )}
              </div>
            </li>
            <li className={styles.menuItem}>
              <div className={styles.dropdownWrapper}>
                <button
                  className={styles.menuBar__link}
                  onClick={() => setActiveDropdown(activeDropdown === "service" ? null : "service")}
                >
                  DỊCH VỤ
                </button>
                {!showSearch && activeDropdown === "service" && (
                  <ProductServiceDropdown type="service" onClose={closeDropdown} />
                )}
              </div>
            </li>
            <li className={styles.menuItem}>
              <div className={styles.dropdownWrapper}>
                <button
                  className={styles.menuBar__link}
                  onClick={() => setActiveDropdown(activeDropdown === "about" ? null : "about")}
                >
                  CÔNG TY
                </button>
                {!showSearch && activeDropdown === "about" && (
                  <ProductServiceDropdown type="about" onClose={closeDropdown} />
                )}
              </div>
            </li>
            <li className={styles.menuItem}>
              <div className={styles.dropdownWrapper}>
                <button
                  className={styles.menuBar__link}
                  onClick={() => setActiveDropdown(activeDropdown === "news" ? null : "news")}
                >
                  TIN TỨC
                </button>
                {!showSearch && activeDropdown === "news" && (
                  <ProductServiceDropdown type="news" onClose={closeDropdown} />
                )}
              </div>
            </li>
            <li className={styles.menuItem}>
              <Link to="/lien-he" className={styles.menuBar__link}>
                LIÊN HỆ
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.menuBar__icons}>
          <a href="https://www.facebook.com/profile.php?id=61573816036604" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="facebook" />
          </a>
          <a href="https://www.linkedin.com/in/mayinpixels" target="_blank" rel="noopener noreferrer">
            <img src={linkendin} alt="linkedin" />
          </a>
          <a href="https://www.tiktok.com/@jptechlift" target="_blank" rel="noopener noreferrer">
            <img src={tiktok} alt="tiktok" />
          </a>
          <button onClick={onSearchOpen} className={styles.menuBar__iconButton}>
            <img className="transition duration-200 hover:brightness-200 hover:scale-105" src={search} alt="search" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
