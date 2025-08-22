import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormValues } from "./CreateBlogForm";

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
  { value: "Chuyên nghiệp & Kỹ thuật", label: "Chuyên nghiệp & Kỹ thuật", description: "Sử dụng thuật ngữ kỹ thuật, tập trung vào thông số" },
  { value: "Thân thiện & Thuyết phục", label: "Thân thiện & Thuyết phục", description: "Gần gũi, dễ hiểu, tập trung vào lợi ích" },
  { value: "Sang trọng & Cao cấp", label: "Sang trọng & Cao cấp", description: "Nhấn mạnh đẳng cấp, chất lượng premium" },
];

export default function ProductBlogForm({ register, errors, disabled }: Props) {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Thông tin sản phẩm</h3>
          <p className="text-sm text-gray-600">Điền thông tin chi tiết về sản phẩm để tạo bài viết blog</p>
        </div>
      </div>

      {/* ProductName */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Tên sản phẩm
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          {...register("productDetails.productName")}
          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 placeholder-gray-400 ${
            errors.productDetails?.productName 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}`}
          placeholder="VD: Thang máy gia đình JP-HomeLift S-Series"
          disabled={disabled}
        />
        {errors.productDetails?.productName && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.productDetails.productName.message as string}</span>
          </div>
        )}
      </div>

      {/* ProductType */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Loại sản phẩm
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          {...register("productDetails.productType")}
          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
            errors.productDetails?.productType 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}`}
          disabled={disabled}
        >
          <option value="" className="text-gray-500">-- Chọn loại thang máy --</option>
          {productTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
        {errors.productDetails?.productType && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.productDetails.productType.message as string}</span>
          </div>
        )}
      </div>

      {/* TargetAudience */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Đối tượng khách hàng mục tiêu
        </label>
        <input
          {...register("productDetails.targetAudience")}
          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 placeholder-gray-400 ${
            errors.productDetails?.targetAudience 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}`}
          placeholder="VD: Chủ biệt thự, kiến trúc sư, chủ đầu tư..."
          disabled={disabled}
        />
        {errors.productDetails?.targetAudience && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.productDetails.targetAudience.message as string}</span>
          </div>
        )}
      </div>

      {/* KeySellingPoints */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Lợi ích bán hàng chính
          <span className="text-gray-500 text-xs ml-2">(mỗi ý một dòng)</span>
        </label>
        <textarea
          {...register("productDetails.keySellingPoints")}
          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 placeholder-gray-400 resize-none ${
            errors.productDetails?.keySellingPoints 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}`}
          rows={4}
          placeholder="- Thiết kế sang trọng, tùy biến cao&#10;- Vận hành siêu êm&#10;- Tiết kiệm 40% điện năng&#10;- Bảo hành 5 năm toàn diện"
          disabled={disabled}
        />
        {errors.productDetails?.keySellingPoints && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.productDetails.keySellingPoints.message as string}</span>
          </div>
        )}
      </div>

      {/* SeoKeywords */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          Từ khóa SEO
          <span className="text-gray-500 text-xs ml-2">(cách nhau bởi dấu phẩy)</span>
        </label>
        <input
          {...register("productDetails.seoKeywords")}
          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 placeholder-gray-400 ${
            errors.productDetails?.seoKeywords 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}`}
          placeholder="thang máy gia đình, thang máy biệt thự, elevator, home lift..."
          disabled={disabled}
        />
        {errors.productDetails?.seoKeywords && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.productDetails.seoKeywords.message as string}</span>
          </div>
        )}
      </div>

      {/* ToneOfVoice */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Văn phong bài viết
        </label>
        <div className="grid gap-3">
          {toneOfVoiceOptions.map((option) => (
            <label key={option.value} className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-blue-300 hover:bg-blue-50'
            }`}>
              <input
                {...register("productDetails.toneOfVoice")}
                type="radio"
                value={option.value}
                className="mt-1 text-blue-600 focus:ring-blue-500 focus:ring-2"
                disabled={disabled}
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {disabled && (
        <div className="flex items-center justify-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm text-amber-700 font-medium">Form đang được xử lý, vui lòng chờ...</span>
        </div>
      )}
    </div>
  );
}