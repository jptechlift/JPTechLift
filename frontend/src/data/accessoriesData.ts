export interface AccessoryItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  price?: string;
}

export const accessories: AccessoryItem[] = [
  {
    id: 'panel-01',
    title: 'Bảng điều khiển Type A',
    desc: 'Mặt bảng bằng thép không gỉ, tích hợp màn hình LED hiển thị tầng rõ nét',
    image: '/assets/accessories/control-panel-a.jpg',
    price: 'Liên hệ để báo giá'
  },
  {
    id: 'led-01',
    title: 'Đèn LED hiển thị tầng',
    desc: 'Thiết kế tiết kiệm điện, ánh sáng rõ ràng giúp nhận biết trạng thái cabin',
    image: '/assets/accessories/led-indicator.jpg',
    price: '850.000 VNĐ'
  },
  {
    id: 'machine-01',
    title: 'Máy kéo thang X2',
    desc: 'Máy kéo mô-men xoắn cao, phù hợp cho các dòng thang máy từ 5–12 tầng',
    image: '/assets/accessories/traction-machine.jpg',
    price: 'Liên hệ để báo giá'
  }
];
