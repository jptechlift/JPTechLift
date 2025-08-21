import Logo from "../../Logo/Logo";
import phone from "../../../assets/images/header/Phone_Icon.jpg";
import email from "../../../assets/images/header/Email_Icon.jpg";
import flag from "../../../assets/images/header/Flag_Icon.jpg";
import polygon from "../../../assets/images/header/Polygon 1.jpg";
import styles from "../../../styles/components/Navbar/DesktopNavbar/desktopNav.module.scss";
import { Link } from "react-router-dom";

const TopBar = () => {

  return (
    <div className={styles.topBar}>
      {/* Logo */}
      <div className={styles.topBar__logo}>
        <Logo />
      </div>
      {/* Info + ngôn ngữ */}
      <div className={styles.topBar__info}>
        <div className={styles.topBar__item + " " + styles.topBar__contactIcon}>
          <img src={phone} alt="Phone" />
          <span>(+84) 777 275 384</span>
        </div>
        <div className={styles.topBar__item + " " + styles.topBar__contactIcon}>
          <img src={email} alt="Email" />
          <span>
            {" "}
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=contact.jptechlift@gmail.com&su=Yêu cầu tư vấn thang máy&body=${encodeURIComponent(
                `Xin chào JP TechLift,

Tôi cần được tư vấn về sản phẩm thang máy. Dưới đây là thông tin của tôi:

• Họ tên: 
• Số điện thoại: 
• Loại thang máy quan tâm: 
• Nhu cầu lắp đặt: 
• Khu vực (tỉnh/thành): 

Rất mong sớm nhận được phản hồi từ quý công ty.

Trân trọng,`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              contact.jptechlift@gmail.com
            </a>
          </span>
        </div>
        <div className={styles.topBar__lang}>
          
          <img src={polygon} alt="scroll down" className={styles.topBar__icon_sc} />
          <span>VN</span>
          <img src={flag} alt="VN" className={styles.topBar__icon_flag} />
          
          {/* ⬇️ Enhanced Dropdown cho Login/Register */}
          <div className={styles.topBar__langMenu} role="menu">
            {/* Header Section */}
            <div className={styles.topBar__langMenu__header}>
              <h3>Chào mừng bạn!</h3>
              <p>Đăng nhập để trải nghiệm đầy đủ</p>
            </div>

            {/* Actions Container */}
            <div className={styles.topBar__langMenu__actions}>
              {/* Login Button - Primary */}
              <Link 
                to="/login" 
                className={`${styles.topBar__langItem} ${styles["topBar__langItem--primary"]}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v12z"/>
                </svg>
                Đăng nhập
              </Link>

              {/* Divider */}
              <div className={styles.topBar__langMenu__divider}></div>

              {/* Register Button - Secondary */}
              <Link 
                to="/register" 
                className={`${styles.topBar__langItem} ${styles["topBar__langItem--secondary"]}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Đăng ký tài khoản
              </Link>
            </div>

            {/* Footer */}
            <div className={styles.topBar__langMenu__footer}>
              <p>
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <Link to="/terms">Điều khoản</Link> và{" "}
                <Link to="/privacy">Chính sách</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};
export default TopBar;