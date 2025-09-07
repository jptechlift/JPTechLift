// src/data/leaders.ts
import ThomasEaton from "../assets/images/leaders/ThomasEaton.png";
import VuNgocMinhTuyet from "../../src/assets/images/leaders/VuNgocMinhTuyet.png";
import AnhKhoa from "../../src/assets/images/leaders/AnhKhoa.png";

export interface Leader {
  name: string;
  title: string;
  image: string;
  description?: string;
  highlights?: string[];
}

export const leaders: Leader[] = [
  {
    name: "Thomas Eaton",
    title: "President JP TechLift UK",
    image: ThomasEaton,
    description: "Cố vấn công nghệ tại Anh Quốc.",
  },
  {
    name: "Minh Tuyết",
    title: "Founder",
    image: VuNgocMinhTuyet,
    description: "Quản trị bộ máy và phát triển thương hiệu.",
  },

  {
    name: "Dr. Anh Khoa",
    title: "Investor & Medical Safety Advisor",
    image: AnhKhoa,
    description: "Cố vấn an toàn y khoa, kiến tạo tầm nhìn tương lai JP TechLift, định hướng phát triển các thế hệ thang máy bền vững, tiết kiệm năng lượng và bảo vệ môi trường.",
  },
];
