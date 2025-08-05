import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import product1 from "../../assets/images/Product/thang-may-gia-dinh.png";
import product2 from "../../assets/images/Product/thang-may-hanh-khach.png";
import product3 from "../../assets/images/Product/thang-may-tai-hang.png";
import product4 from "../../assets/images/Product/thang-may-benh-vien.png";
import product5 from "../../assets/images/Product/thang-tai-thuc-pham.png";
import product6 from "../../assets/images/Product/thang-may-quan-sat.png";
import product7 from "../../assets/images/Product/thang-truot-thang-cuon.png";
import patternLeft from "../../assets/images/Product/pattern-left.png";
import patternRight from "../../assets/images/Product/pattern-right.png";
import productShadow from "../../assets/images/Product/product-shadow.png";
import logo from "../../assets/images/logo-noname.png";

interface Product {
  title: string;
  slug: string;
  image: string;
  features: {
    title: string;
    desc: string;
  }[];
}

const products: Product[] = [
  {
    title: "Thang Máy Gia Đình",
    slug: "thang-may-gia-dinh",
    image: product1,
    features: [
      {
        title: "🔹SANG TRỌNG – ĐẲNG CẤP",
        desc: "Kiến tạo không gian sống hiện đại với thang máy sang trọng, thiết kế tinh tế.",
      },
      {
        title: "🔹AN TOÀN TUYỆT ĐỐI",
        desc: "Thiết kế để vận hành an toàn, bảo vệ những người bạn yêu thương nhất.",
      },
      {
        title: "🔹VẬN HÀNH ÊM ÁI",
        desc: "Công nghệ tiên tiến giúp vận hành mượt mà, hạn chế tối đa tiếng ồn.",
      },
      {
        title: "🔹TỐI ƯU KHÔNG GIAN",
        desc: "Phù hợp biệt thự, nhà phố – đảm bảo vừa vặn và thẩm mỹ.",
      },
    ],
  },
  {
    title: "Thang Máy Hành Khách",
    slug: "thang-may-hanh-khach",
    image: product2,
    features: [
      {
        title: "🔹THẨM MỸ ĐỈNH CAO",
        desc: "Cabin hiện đại, bảng điều khiển tinh xảo – mang đến vẻ ngoài đẳng cấp cho mọi công trình.",
      },
      {
        title: "🔹CHUYỂN ĐỘNG ÊM MƯỢT",
        desc: "Công nghệ biến tần và động cơ không hộp số – vận hành mượt mà, tiết kiệm điện năng.",
      },
      {
        title: "🔹AN TOÀN TOÀN DIỆN",
        desc: "Hệ thống cảm biến, chống quá tải, cứu hộ tự động – bảo vệ tối đa người dùng.",
      },
      {
        title: "🔹TÙY BIẾN LINH HOẠT",
        desc: "Thiết kế đa dạng – dễ dàng tích hợp cho chung cư, văn phòng, khách sạn.",
      },
    ],
  },
  {
    title: "Thang Máy Bệnh Viện",
    slug: "thang-may-benh-vien",
    image: product4,
    features: [
      {
        title: "🔹AN TOÀN CHUYÊN BIỆT",
        desc: "Cabin tối ưu cho cáng bệnh, xe lăn – nâng cao trải nghiệm và sự an tâm cho bệnh nhân.",
      },
      {
        title: "🔹VẬN HÀNH ÊM ÁI",
        desc: "Giảm thiểu rung lắc và tiếng ồn – bảo đảm sự yên tĩnh tuyệt đối trong không gian điều trị.",
      },
      {
        title: "🔹TIỆN ÍCH NHÂN ĐẠO",
        desc: "Trang bị tay vịn, sàn chống trượt – hỗ trợ tốt cho người lớn tuổi và người khuyết tật.",
      },
      {
        title: "🔹VẬT LIỆU CAO CẤP",
        desc: "Chống khuẩn, dễ lau chùi – đáp ứng tiêu chuẩn vệ sinh nghiêm ngặt ngành y tế.",
      },
    ],
  },
  {
    title: "Thang Máy Quan Sát",
    slug: "thang-may-quan-sat",
    image: product6,
    features: [
      {
        title: "🔹TRẢI NGHIỆM TOÀN CẢNH",
        desc: "Cabin kính trong suốt – mở ra tầm nhìn ngoạn mục, nâng tầm không gian kiến trúc.",
      },
      {
        title: "🔹TẠO ĐIỂM NHẤN SANG TRỌNG",
        desc: "Lý tưởng cho trung tâm thương mại, khách sạn, resort – khẳng định đẳng cấp công trình.",
      },
      {
        title: "🔹VẬN HÀNH CHÍNH XÁC",
        desc: "Dừng tầng mượt mà, hành trình êm ái – nâng cao trải nghiệm người dùng.",
      },
      {
        title: "🔹CÔNG NGHỆ AN TOÀN",
        desc: "Cảm biến hiện đại, khung thép cường lực – vận hành an toàn trong mọi điều kiện.",
      },
    ],
  },
  {
    title: "Thang Máy Thực Phẩm",
    slug: "thang-tai-thuc-pham",
    image: product5,
    features: [
      {
        title: "🔹VỆ SINH TUYỆT ĐỐI",
        desc: "Cabin inox khép kín – ngăn lây nhiễm chéo, đảm bảo an toàn thực phẩm tối đa.",
      },
      {
        title: "🔹ÊM ÁI – ỔN ĐỊNH",
        desc: "Cơ chế nâng hạ nhẹ nhàng – bảo toàn hình dạng và chất lượng món ăn cao cấp.",
      },
      {
        title: "🔹THIẾT KẾ NHỎ GỌN",
        desc: "Tối ưu không gian – dễ dàng lắp đặt trong nhà hàng, khách sạn, bếp ăn công nghiệp.",
      },
      {
        title: "🔹HIỆU SUẤT VƯỢT TRỘI",
        desc: "Vận chuyển nhanh, chính xác – tăng tốc độ phục vụ và hiệu quả vận hành.",
      },
    ],
  },
  {
    title: "Thang Máy Tải Hàng",
    slug: "thang-may-tai-hang",
    image: product3,
    features: [
      {
        title: "🔹TẢI TRỌNG CỰC ĐẠI",
        desc: "Hỗ trợ vận chuyển khối lượng lớn – đáp ứng yêu cầu kho xưởng và công trình lớn.",
      },
      {
        title: "🔹KẾT CẤU SIÊU BỀN",
        desc: "Cabin thép chịu lực, cửa rộng mở – dễ dàng cho hàng hóa cồng kềnh.",
      },
      {
        title: "🔹AN TOÀN CÔNG NGHIỆP",
        desc: "Trang bị khóa tầng, cảnh báo quá tải – bảo vệ an toàn tối đa cho người và hàng.",
      },
      {
        title: "🔹VẬN HÀNH MẠNH MẼ",
        desc: "Động cơ công suất lớn – tiết kiệm điện, hiệu suất ổn định trong mọi môi trường.",
      },
    ],
  },
  {
    title: "Thang Trượt – Thang Cuốn",
    slug: "thang-truot-thang-cuon",
    image: product7,
    features: [
      {
        title: "🔹LUỒNG DI CHUYỂN LIÊN TỤC",
        desc: "Phù hợp nơi đông đúc – vận hành liên tục, trơn tru suốt giờ cao điểm.",
      },
      {
        title: "🔹TIÊU CHUẨN AN TOÀN CAO",
        desc: "Tích hợp cảm biến vật cản, nút dừng khẩn – sẵn sàng xử lý mọi tình huống.",
      },
      {
        title: "🔹DỄ DÀNG CHO MỌI NGƯỜI",
        desc: "Thiết kế thân thiện – hỗ trợ tối đa người già, trẻ em và khách khuyết tật.",
      },
      {
        title: "🔹TINH TẾ TRONG MỌI KIẾN TRÚC",
        desc: "Dễ dàng tùy chỉnh độ nghiêng, độ dài – phù hợp mọi không gian nội thất.",
      },
    ],
  },
];

export default function ProductCarouselFullScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  return (
     <section className="pt-10 w-full bg-texture-bg bg-texture-pattern bg-[length:8px_8px] relative overflow-hidden md:pl-28 md:h-[calc(100vh-100px)]">
      {/* Desktop layout */}
      <div className="relative hidden h-full md:flex">
        {/* Navigation sidebar */}
        <div
          className="w-full mr-10 md:w-[300px] max-[1499px]:w-[240px] max-[1350px]:w-[220px] z-10 flex flex-col justify-start h-auto md:h-full transition-all duration-300"
        >
          <img src={logo} alt="logo" className="h-16 mb-6 mx-auto" />
          <h2 className="text-[24px] md:text-[28px] font-inter font-bold text-[#041E42] uppercase mb-4 text-center">
            SẢN PHẨM
          </h2>
          <div className="flex flex-col gap-2 border border-[#041E42] p-1">
            {products.map((prod, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`text-left px-4 py-2 border text-sm font-semibold transition-all duration-200 uppercase ${
                  idx === activeIndex
                    ? "bg-[#CBA052] text-white"
                    : "border-[#041E42] text-[#041E42] hover:bg-[#f2f2f2]"
                }`}
              >
                {prod.title}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel content */}
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          navigation={false}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          initialSlide={activeIndex}
          className="flex-1 h-full"
        >
          {products.map((p, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative md:ml-10 grid grid-cols-1 pl-8 md:grid-cols-[300px_420px_400px] max-[1499px]:grid-cols-[240px_420px_400px] max-[1350px]:grid-cols-[220px_420px_400px] gap-10 items-start justify-center h-full min-h-[600px] md:min-h-[700px] overflow-hidden"
              >
                {/* LEFT BLOCK */}
                <div className="relative left-0 md:left-8 z-10 w-full md:w-[400px] max-[1499px]:w-[400px] h-[540px] mx-auto md:mx-0">
                  <img
                    src={patternLeft}
                    alt=""
                    className="absolute top-10 left-0 md:left-18 w-full h-full object-contain pointer-events-none"
                  />
                  <div className="absolute top-[90px] left-[10px] md:left-[20px] w-[90%] max-w-[300px]">
                    <ul className="flex flex-col gap-5">
                      {p.features.slice(0, 2).map((f, idx) => (
                        <li key={idx} className="mb-6">
                          <h1 className="text-[#041E42] font-inter font-bold text-xl mb-2">
                            {f.title}
                          </h1>
                          <p className="text-[#0D1B2A] font-nunito text-base">{f.desc}</p>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/lien-he"
                      className="mt-6 inline-block border border-[#041E42] text-[#041E42] hover:bg-[#041E42] hover:text-white transition font-inter px-6 py-2"
                    >
                      LIÊN HỆ TƯ VẤN
                    </Link>
                  </div>
                </div>

                {/* IMAGE CENTER */}
                <div className="flex justify-center md:justify-start items-start h-full w-full max-[1499px]:min-w-[420px]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-contain z-30 h-[640px] w-[420px] drop-shadow-[0_40px_40px_rgba(0,0,0,0.3)]"
                  />
                </div>

                {/* RIGHT BLOCK */}
                <div className="relative right-0 md:right-32 z-10 w-full md:w-[400px] max-[1499px]:w-[400px] h-[540px] mx-auto md:mx-0">
                  <div className="relative w-full h-full">
                    <img
                      src={patternRight}
                      alt=""
                      className="absolute top-10 w-full h-full object-contain pointer-events-none"
                    />
                    <div className="absolute top-[90px] w-[90%] max-w-[300px] right-[10px] md:right-[20px] z-10">
                      <ul className="flex flex-col gap-5">
                        {p.features.slice(2).map((f, idx) => (
                          <li key={idx} className="mb-6">
                            <h1 className="text-[#041E42] font-inter font-bold text-xl mb-2">
                              {f.title}
                            </h1>
                            <p className="text-[#0D1B2A] font-nunito text-base">{f.desc}</p>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/san-pham/${p.slug}`}
                        className="mt-6 inline-block border border-[#041E42] text-white bg-[#041E42] hover:bg-white hover:text-[#041E42] font-inter px-6 py-2 transition"
                      >
                        TÌM HIỂU THÊM
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden px-4">
        <div className="text-center">
          <img src={logo} alt="logo" className="h-12 mb-4 mx-auto" />
          <h2 className="text-2xl font-inter font-bold text-[#041E42] uppercase mb-4">
            SẢN PHẨM
          </h2>
        </div>
        <Swiper modules={[Navigation]} slidesPerView={1} className="w-full">
          {products.map((p, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center py-6">
                <img src={p.image} alt={p.title} className="w-full max-w-xs h-auto mb-6" />
                <ul className="text-left w-full max-w-md">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="mb-4">
                      <h1 className="text-[#041E42] font-inter font-bold mb-1">
                        {f.title}
                      </h1>
                      <p className="text-[#0D1B2A] font-nunito text-base">{f.desc}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <Link
                    to="/lien-he"
                    className="border border-[#041E42] text-[#041E42] hover:bg-[#041E42] hover:text-white transition font-inter px-4 py-2"
                  >
                    LIÊN HỆ TƯ VẤN
                  </Link>
                  <Link
                    to={`/san-pham/${p.slug}`}
                    className="border border-[#041E42] bg-[#041E42] text-white hover:bg-white hover:text-[#041E42] transition font-inter px-4 py-2"
                  >
                    TÌM HIỂU THÊM
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
