import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormValues } from "./CreateBlogForm";

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  disabled: boolean;
};

const toneOfVoiceOptions = [
  "Hướng dẫn & Giáo dục",
  "Phân tích & Chuyên gia",
  "Tin tức & Cập nhật",
];

export default function TopicBlogForm({ register, errors, disabled }: Props) {
  return (
    <div className="space-y-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Chi tiết chủ đề bài viết
        </h3>
        <p className="text-sm text-slate-500 mt-1">Điền thông tin cần thiết để tạo bài viết chất lượng</p>
      </div>

      {/* ArticleTitle */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="text-red-500">*</span>
          Tiêu đề bài viết
        </label>
        <div className="relative">
          <input
            {...register("topicDetails.articleTitle")}
            className={`
              w-full p-3 border-2 rounded-lg transition-colors duration-200
              placeholder:text-slate-400 text-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 
              ${errors.topicDetails?.articleTitle 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
              }
              ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-white'}
            `}
            placeholder="VD: Xu hướng thang máy gia đình 2024 - Đột phá công nghệ mới"
            disabled={disabled}
          />
          {!disabled && !errors.topicDetails?.articleTitle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            </div>
          )}
        </div>
        {errors.topicDetails?.articleTitle && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {errors.topicDetails.articleTitle.message as string}
          </div>
        )}
      </div>

      {/* TargetAudience */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="text-red-500">*</span>
          Đối tượng độc giả mục tiêu
        </label>
        <input
          {...register("topicDetails.targetAudience")}
          className={`
            w-full p-3 border-2 rounded-lg transition-colors duration-200
            placeholder:text-slate-400 text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 
            ${errors.topicDetails?.targetAudience 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
            }
            ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-white'}
          `}
          placeholder="VD: Gia đình trẻ có thu nhập khá, sống tại nhà phố 3-4 tầng"
          disabled={disabled}
        />
        {errors.topicDetails?.targetAudience && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {errors.topicDetails.targetAudience.message as string}
          </div>
        )}
      </div>

      {/* MainPoints */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="text-red-500">*</span>
          Các ý chính
          <span className="text-xs text-slate-500 font-normal">(mỗi ý một dòng)</span>
        </label>
        <textarea
          {...register("topicDetails.mainPoints")}
          className={`
            w-full p-3 border-2 rounded-lg transition-colors duration-200
            placeholder:text-slate-400 text-slate-700 resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 
            ${errors.topicDetails?.mainPoints 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
            }
            ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-white'}
          `}
          rows={4}
          placeholder="- Tính năng an toàn và tiết kiệm năng lượng&#10;- So sánh giá thành với các loại thang máy khác&#10;- Quy trình lắp đặt và bảo trì&#10;- Xu hướng thiết kế hiện đại"
          disabled={disabled}
        />
        <div className="flex justify-between items-center">
          {errors.topicDetails?.mainPoints ? (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.topicDetails.mainPoints.message as string}
            </div>
          ) : (
            <div></div>
          )}
          <span className="text-xs text-slate-400">Gợi ý: 3-5 ý chính</span>
        </div>
      </div>

      {/* SeoKeywords */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd"/>
          </svg>
          Từ khóa SEO
          <span className="text-xs text-slate-500 font-normal">(cách nhau bởi dấu phẩy)</span>
        </label>
        <input
          {...register("topicDetails.seoKeywords")}
          className={`
            w-full p-3 border-2 rounded-lg transition-colors duration-200
            placeholder:text-slate-400 text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 
            ${errors.topicDetails?.seoKeywords 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
            }
            ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-white'}
          `}
          placeholder="thang máy gia đình, công nghệ thang máy, giá thang máy mini, lắp đặt thang máy"
          disabled={disabled}
        />
        {errors.topicDetails?.seoKeywords && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {errors.topicDetails.seoKeywords.message as string}
          </div>
        )}
        <p className="text-xs text-slate-500">Từ khóa giúp tối ưu hóa bài viết cho công cụ tìm kiếm</p>
      </div>

      {/* ToneOfVoice */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd"/>
          </svg>
          Văn phong bài viết
        </label>
        <select
          {...register("topicDetails.toneOfVoice")}
          className={`
            w-full p-3 border-2 rounded-lg transition-colors duration-200
            text-slate-700 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 
            border-slate-200 focus:border-blue-500 hover:border-slate-300
            ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-white'}
          `}
          disabled={disabled}
        >
          {toneOfVoiceOptions.map((opt) => (
            <option key={opt} value={opt} className="py-2">
              {opt}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="text-xs text-slate-500 space-y-1">
            <div><strong>Hướng dẫn & Giáo dục:</strong> Dễ hiểu, thân thiện, có tính hướng dẫn</div>
            <div><strong>Phân tích & Chuyên gia:</strong> Chuyên sâu, logic, có dẫn chứng</div>
            <div><strong>Tin tức & Cập nhật:</strong> Nhanh gọn, cập nhật, có tính thời sự</div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Hoàn thiện thông tin để tạo bài viết chất lượng cao
        </div>
      </div>
    </div>
  );
}