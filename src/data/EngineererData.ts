import MinhKhoi from "../../src/assets/images/leaders/MinhKhoi.png";

export interface Engineer {
  name: string;
  title: string;
  image: string;
  description?: string;
  highlights?: string[];
}

export const engineerers: Engineer[] = [
  {
    name: "Minh Khôi",
    title: "Maintenance Electrical Engineer",
    image: MinhKhoi,
    description:
      "Kiểm tra định kỳ, khắc phục sự cố điện, hỗ trợ lắp đặt và cải tiến hệ thống điều khiển thang máy",
  },
];
