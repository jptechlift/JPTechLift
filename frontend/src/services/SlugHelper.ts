// src/utils/slugHelper.ts
export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .normalize("NFD") // Chuyển đổi ký tự có dấu thành không dấu
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu phụ
        .replace(/đ/g, "d") // Xử lý riêng chữ 'đ'
        .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ các ký tự không phải chữ cái, số, khoảng trắng, gạch ngang
        .trim() // Cắt khoảng trắng ở đầu và cuối
        .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng gạch ngang
        .replace(/-+/g, "-"); // Thay thế nhiều gạch ngang liên tiếp bằng một gạch ngang
};