import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormValues } from "./CreateBlogForm";
import {
  FileText,
  Users,
  List,
  Search,
  Type as TypeIcon,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  disabled: boolean;
};

const toneOfVoiceOptions = [
  {
    value: "Hướng dẫn & Giáo dục",
    label: "Hướng dẫn & Giáo dục",
    description: "Dễ hiểu, thân thiện, có tính hướng dẫn",
  },
  {
    value: "Phân tích & Chuyên gia", 
    label: "Phân tích & Chuyên gia",
    description: "Chuyên sâu, logic, có dẫn chứng",
  },
  {
    value: "Tin tức & Cập nhật",
    label: "Tin tức & Cập nhật", 
    description: "Nhanh gọn, cập nhật, có tính thời sự",
  },
];

export default function TopicBlogForm({ register, errors, disabled }: Props) {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-blue-900/10">
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Topic Blog Post</h2>
          <p className="text-gray-600">Tạo bài viết theo chủ đề cụ thể</p>
        </div>

        <div className="space-y-8">
          {/* Article Basic Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Thông tin bài viết
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label
                  htmlFor="article_title"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Tiêu đề bài viết</span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="article_title"
                  {...register("topicDetails.articleTitle")}
                  className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 ${
                    errors.topicDetails?.articleTitle
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : disabled
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-300 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  placeholder="VD: Xu hướng thang máy gia đình 2024 - Đột phá công nghệ mới"
                  disabled={disabled}
                />
                {errors.topicDetails?.articleTitle && (
                  <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errors.topicDetails.articleTitle.message as string}</span>
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="target_audience"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Đối tượng độc giả mục tiêu</span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="target_audience"
                  {...register("topicDetails.targetAudience")}
                  className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 ${
                    errors.topicDetails?.targetAudience
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  placeholder="VD: Gia đình trẻ có thu nhập khá, sống tại nhà phố 3-4 tầng"
                  disabled={disabled}
                />
                {errors.topicDetails?.targetAudience && (
                  <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errors.topicDetails.targetAudience.message as string}</span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Content Structure */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Cấu trúc nội dung
            </h3>
            <div>
              <label
                htmlFor="main_points"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <List className="w-4 h-4 mr-2 text-blue-500" />
                <span>Các ý chính</span>
                <span className="text-red-500 ml-1">*</span>
                <span className="text-gray-500 text-xs ml-2 bg-gray-100 px-2 py-1 rounded">
                  mỗi ý một dòng
                </span>
              </label>
              <textarea
                id="main_points"
                {...register("topicDetails.mainPoints")}
                rows={5}
                className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 resize-none ${
                  errors.topicDetails?.mainPoints
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : disabled
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
                placeholder="• Tính năng an toàn và tiết kiệm năng lượng&#10;• So sánh giá thành với các loại thang máy khác&#10;• Quy trình lắp đặt và bảo trì&#10;• Xu hướng thiết kế hiện đại"
                disabled={disabled}
              />
              {errors.topicDetails?.mainPoints && (
                <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>{errors.topicDetails.mainPoints.message as string}</span>
                </p>
              )}
              <div className="flex justify-end mt-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Gợi ý: 3-5 ý chính
                </span>
              </div>
            </div>
          </section>

          {/* SEO & Content Style */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              SEO & Phong cách
            </h3>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="seo_keywords"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Search className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Từ khóa SEO</span>
                  <span className="text-gray-500 text-xs ml-2 bg-gray-100 px-2 py-1 rounded">
                    phân cách bằng dấu phẩy
                  </span>
                </label>
                <input
                  id="seo_keywords"
                  {...register("topicDetails.seoKeywords")}
                  className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 ${
                    errors.topicDetails?.seoKeywords
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  placeholder="thang máy gia đình, công nghệ thang máy, giá thang máy mini, lắp đặt thang máy"
                  disabled={disabled}
                />
                {errors.topicDetails?.seoKeywords && (
                  <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errors.topicDetails.seoKeywords.message as string}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2 bg-gray-50 px-3 py-2 rounded-lg">
                  💡 Từ khóa giúp tối ưu hóa bài viết cho công cụ tìm kiếm
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <TypeIcon className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Chọn văn phong bài viết</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {toneOfVoiceOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`group relative flex-1 min-w-[200px] cursor-pointer transition-all duration-200 ${
                        disabled ? "cursor-not-allowed opacity-60" : ""
                      }`}
                    >
                      <input
                        {...register("topicDetails.toneOfVoice")}
                        type="radio"
                        value={option.value}
                        className="sr-only peer"
                        disabled={disabled}
                      />
                      <div className={`flex items-center justify-center px-4 py-3 rounded-sm border border-gray-300 text-center transition-all duration-200 ${
                        disabled
                          ? "border-gray-200 bg-gray-50"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-900 peer-focus:ring-2 peer-focus:ring-blue-500/20"
                      }`}>
                        <div>
                          <div className="font-semibold text-sm mb-1">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500 leading-tight">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Processing Status */}
          {disabled && (
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 animate-pulse" />
                <div>
                  <div className="text-sm text-amber-800 font-semibold">
                    Đang xử lý yêu cầu...
                  </div>
                  <div className="text-xs text-amber-700 mt-1">
                    Vui lòng chờ trong giây lát
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}