import type { Slide } from "../components/Carousel/Carousel";
import banner1 from "../assets/images/Banner-img.jpg";  
import banner2 from "../assets/images/BannerFooter.jpg"; 

export const slides: Slide[] = [
  {
    src: banner1,
    title: "KHÔNG CHỈ LẮP ĐẶT – CHÚNG TÔI ĐỒNG HÀNH",
    description: "Mỗi mét thang là một cam kết",
    ctaText: "Tìm hiểu thêm",
    ctaLink: "/services",
  },
  {
    src: banner2,
    title: "Stylish - Smart - Simple",
    description: "Nền tảng để chúng tôi phát huy hết mình",
    ctaText: "Liên hệ tư vấn",
    ctaLink: "/contact",
  },
];
