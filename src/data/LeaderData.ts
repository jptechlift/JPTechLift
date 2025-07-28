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
    title: "Co-Founder",
    image: VuNgocMinhTuyet,
    description: "Quản trị bộ máy và phát triển thương hiệu.",
  },

  {
    name: "Dr. Anh Khoa",
    title: "Investor & Medical Safety Advisor",
    image: AnhKhoa,
    description: "Chuyên gia cố vấn tiêu chuẩn an toàn vận hành thang máy JP TechLift từ góc nhìn y khoa và sức khỏe cộng đồng.",
  },
];
