import { useState } from "react";
import RecentPosts from "./RecentPosts";
import AiBlogCreationWorkflow from "./AiBlogCreationWorkflow";
import ManualBlogCreationForm from "./ManualBlogCreationForm";
import UploadDocumentWorkflow from "./UploadDocumentWorkflow"; // <-- Import component mới
import { Sparkles, FileText, Upload } from "lucide-react"; // <-- Import icon Upload

// Định nghĩa các mode cho việc tạo blog
type Mode = "initial" | "ai_creation" | "manual_creation" | "upload_document"; // <-- Thêm 'upload_document'

export default function CreateBlogPage() {
  const [mode, setMode] = useState<Mode>("initial");
  const [refreshRecentPostsKey, setRefreshRecentPostsKey] = useState(0);

  // Hàm được gọi khi một blog được xuất bản thành công (từ bất kỳ workflow nào)
  const handlePublishSuccess = () => {
    setRefreshRecentPostsKey((prevKey) => prevKey + 1); // Cập nhật key để RecentPosts fetch lại dữ liệu
    setMode("initial"); // Quay về màn hình chọn phương thức ban đầu
  };

  // Hàm được gọi khi người dùng muốn quay lại màn hình chọn phương thức
  const handleBackToInitial = () => {
    setMode("initial");
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Blog Creation Interface
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Create and manage your blog content efficiently.
        </p>
      </div>

      {/* Render nội dung dựa trên mode hiện tại */}
      {mode === "initial" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Chọn phương thức tạo blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Đã sửa gap thành gap-4 cho khoảng cách đều */}
              {/* Nút TẠO BLOG VỚI AI */}
              <button
                onClick={() => setMode("ai_creation")}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-blue-900 px-6 py-4 text-base font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:from-blue-900 hover:to-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
              >
                <Sparkles className="mr-2" />
                TẠO BLOG VỚI AI
              </button>
              {/* Nút TẠO THỦ CÔNG */}
              <button
                onClick={() => setMode("manual_creation")}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-500 to-gray-700 px-6 py-4 text-base font-medium text-gray-900 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:from-gray-700 hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FileText className="mr-2" />
                TẠO THỦ CÔNG
              </button>
              {/* Nút UPLOAD PDF/DOCX mới */}
              <button
                onClick={() => setMode("upload_document")} // <-- Kích hoạt mode upload_document
                className="mt-4 sm:col-span-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-800 px-6 py-4 text-base font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:from-indigo-800 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
              >
                <Upload className="w-6 h-6 mr-2" /> {/* <-- Sử dụng icon Upload */}
                UPLOAD PDF/DOCX
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              Recently Generated Posts
            </h3>
            <RecentPosts refreshKey={refreshRecentPostsKey} /> {/* Truyền refreshKey để làm mới */}
          </div>
        </div>
      )}

      {mode === "ai_creation" && (
        <AiBlogCreationWorkflow
          onPublishSuccess={handlePublishSuccess}
          onBack={handleBackToInitial}
        />
      )}

      {mode === "manual_creation" && (
        <ManualBlogCreationForm
          onPublishSuccess={handlePublishSuccess}
          onBack={handleBackToInitial}
        />
      )}

      {/* <-- Thêm điều kiện render cho UploadDocumentWorkflow --> */}
      {mode === "upload_document" && (
        <UploadDocumentWorkflow
          onPublishSuccess={handlePublishSuccess}
          onBack={handleBackToInitial}
        />
      )}
    </div>
  );
}