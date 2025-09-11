import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormValues } from "./AiBlogCreationWorkflow";
import {
  Package,
  Tag,
  Users,
  Star,
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

const productTypeOptions = [
  { value: "home-lift", label: "Thang máy gia đình" },
  { value: "freight-lift", label: "Thang máy hàng hóa" },
  { value: "panorama-lift", label: "Thang máy kính quan cảnh" },
  { value: "hospital-lift", label: "Thang máy bệnh viện" },
  { value: "passenger-lift", label: "Thang máy chở người" },
  { value: "dumpwaiter", label: "Thang máy thức ăn" },
  { value: "escalator", label: "Thang cuốn" },
];

const toneOfVoiceOptions = [
  {
    value: "Chuyên nghiệp & Kỹ thuật",
    label: "Chuyên nghiệp & Kỹ thuật",
    description: "Sử dụng thuật ngữ kỹ thuật, tập trung vào thông số",
  },
  {
    value: "Thân thiện & Thuyết phục",
    label: "Thân thiện & Thuyết phục",
    description: "Gần gũi, dễ hiểu, tập trung vào lợi ích",
  },
  {
    value: "Sang trọng & Cao cấp",
    label: "Sang trọng & Cao cấp",
    description: "Nhấn mạnh đẳng cấp, chất lượng premium",
  },
];

export default function ProductBlogForm({ register, errors, disabled }: Props) {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-blue-900/10">
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Blog Post
          </h2>
          <p className="text-gray-600">
            Tạo bài viết chi tiết cho sản phẩm cụ thể
          </p>
        </div>

        <div className="space-y-8">
          {/* Product Basic Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="product_name"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Package className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Tên sản phẩm</span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="product_name"
                  {...register("productDetails.productName")}
                  className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 ${
                    errors.productDetails?.productName
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  placeholder="VD: JPTech L-Series Premium"
                  disabled={disabled}
                />
                {errors.productDetails?.productName && (
                  <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>
                      {errors.productDetails.productName.message as string}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="product_category"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Tag className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Danh mục sản phẩm</span>
                </label>
                <div className="relative">
                  <select
                    id="product_category"
                    {...register("productDetails.productType")}
                    className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 appearance-none pr-10 ${
                      errors.productDetails?.productType
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : disabled
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                        : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                    disabled={disabled}
                  >
                    <option value="" className="text-gray-500">
                      -- Chọn loại thang máy --
                    </option>
                    {productTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {errors.productDetails?.productType && (
                  <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>
                      {errors.productDetails.productType.message as string}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Target Audience */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Đối tượng khách hàng
            </h3>
            <div>
              <label
                htmlFor="target_audience"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span>Khách hàng mục tiêu</span>
              </label>
              <input
                id="target_audience"
                {...register("productDetails.targetAudience")}
                className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 ${
                  errors.productDetails?.targetAudience
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : disabled
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
                placeholder="VD: Chủ biệt thự cao cấp, kiến trúc sư, chủ đầu tư bất động sản..."
                disabled={disabled}
              />
              {errors.productDetails?.targetAudience && (
                <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>
                    {errors.productDetails.targetAudience.message as string}
                  </span>
                </p>
              )}
            </div>
          </section>

          {/* Content & SEO */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Nội dung & SEO
            </h3>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="key_points"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Star className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Điểm bán hàng chính</span>
                  <span className="text-gray-500 text-xs ml-2 bg-gray-100 px-2 py-1 rounded">
                    mỗi ý một dòng
                  </span>
                </label>
                <textarea
                  id="key_points"
                  {...register("productDetails.keySellingPoints")}
                  rows={5}
                  className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 resize-none ${
                    errors.productDetails?.keySellingPoints
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  placeholder="- Thiết kế sang trọng với khả năng tùy biến cao&#10;- Vận hành siêu êm ái, không tiếng ồn&#10;- Tiết kiệm 40% điện năng so với thang máy thường&#10;- Bảo hành 5 năm toàn diện, hỗ trợ 24/7"
                  disabled={disabled}
                />
                {errors.productDetails?.keySellingPoints && (
                  <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>
                      {errors.productDetails.keySellingPoints.message as string}
                    </span>
                  </p>
                )}
              </div>

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
                  {...register("productDetails.seoKeywords")}
                  className={`block w-full px-4 py-3 text-sm rounded-sm border border-gray-300 transition-all duration-200 ${
                    errors.productDetails?.seoKeywords
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  placeholder="thang máy gia đình, thang máy biệt thự, elevator, thang máy cao cấp..."
                  disabled={disabled}
                />
                {errors.productDetails?.seoKeywords && (
                  <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>
                      {errors.productDetails.seoKeywords.message as string}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Tone of Voice */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Phong cách viết
            </h3>
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
                      {...register("productDetails.toneOfVoice")}
                      type="radio"
                      value={option.value}
                      className="sr-only peer"
                      disabled={disabled}
                    />
                    <div
                      className={`flex items-center justify-center px-4 py-3 rounded-sm border border-gray-300 text-center transition-all duration-200 ${
                        disabled
                          ? "border-gray-200 bg-gray-50"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-900 peer-focus:ring-2 peer-focus:ring-blue-500/20"
                      }`}
                    >
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
          </section>

          {/* Processing Status */}
          {disabled && (
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
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
