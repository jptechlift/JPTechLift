// Danh sách ánh xạ rõ ràng giữa tên hiển thị và slug URL
export const productSlugMap = {
  "THANG MÁY GIA ĐÌNH": "thang-may-gia-dinh",
"THANG MÁY HÀNH KHÁCH": "thang-may-hanh-khach",
  "THANG CUỐN": "thang-truot-thang-cuon",
  "THANG MÁY TẢI HÀNG": "thang-may-tai-hang",
  "THANG TẢI THỰC PHẨM": "thang-tai-thuc-pham",
  "THANG MÁY BỆNH VIỆN": "thang-may-benh-vien",
  "THANG MÁY QUAN SÁT": "thang-may-quan-sat", // nếu chưa có thì ghi placeholder
} as const;

export type ProductTitle = keyof typeof productSlugMap;
