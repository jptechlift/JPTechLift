import MinhKhoi from "../../src/assets/images/leaders/MinhKhoi.png";
import Tan from "../../src/assets/images/leaders/Tan.png";
import LeMinhDa from "../../src/assets/images/leaders/LeMinhDa.png";
export interface Engineer {
  name: string;
  title: string;
  image: string;
  description?: string;
  highlights?: string[];
}

export const engineerers: Engineer[] = [
  {
    name: "Lê Minh Đà",
    title: "Elevator Operations Engineer",
    image: LeMinhDa,
    description:
      "Phụ trách dẫn dắt tổ điện trong việc lắp đặt, kiểm tra, xử lý sự cố, bảo trì hệ thống điện thang máy. Đảm bảo tuân thủ quy định an toàn, tiêu chuẩn kỹ thuật, tiến độ dự án. Phối hợp với tổ cơ khí, quản lý dự án để đảm bảo vận hành trơn tru, bàn giao đúng hạn",
  },
  {
    name: "Minh Khôi",
    title: "Maintenance Electrical Engineer",
    image: MinhKhoi,
    description:
      "Kiểm tra định kỳ, khắc phục sự cố điện, hỗ trợ lắp đặt và cải tiến hệ thống điều khiển thang máy",
  },
  {
    name: "Tân",
    title: "Elevator Mechanical Installer",
    image: Tan,
    description:
      "Thực hiện lắp đặt các cấu kiện cơ khí theo bản vẽ kỹ thuật, tiêu chuẩn an toàn và tiến độ thi công.",
  },
];
