// types.ts

// Dùng cho các mục chính như Cabin thép, Cabin tiêu chuẩn...
export interface ConfiguratorItem {
  id: number | string;
  images: string[];
  title: string;
  description: string;
}

// Dùng cho các lựa chọn hoàn thiện (màu sắc, vật liệu)
export interface FinishingOption {
  id: string;
  code: string;
  name: string;
  colorHex?: string;
  imageUrl?: string;
}

// Nhóm các lựa chọn hoàn thiện lại với nhau
export interface FinishingCategory {
  id: string;
  title: string;
  items: FinishingOption[];
}

// Đại diện cho toàn bộ cấu hình người dùng đã chọn
export interface ElevatorConfiguration {
  cabin: ConfiguratorItem;
  ceiling: ConfiguratorItem;
  handrail: ConfiguratorItem;
  finish: {
    // Lưu trữ id của vật liệu được chọn cho mỗi danh mục
    [categoryId: string]: string; 
  };
}

// Dữ liệu cho biểu mẫu liên hệ
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}