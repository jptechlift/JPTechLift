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
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      {/* ArticleTitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tiêu đề bài viết</label>
        <input
          {...register("topicDetails.articleTitle")}
          className="w-full p-2 border rounded-md"
          placeholder="VD: Xu hướng thang máy gia đình 2024"
          disabled={disabled}
        />
        {errors.topicDetails?.articleTitle && (
          <p className="text-red-500 text-xs mt-1">{errors.topicDetails.articleTitle.message as string}</p>
        )}
      </div>

      {/* TargetAudience */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Đối tượng độc giả mục tiêu</label>
        <input
          {...register("topicDetails.targetAudience")}
          className="w-full p-2 border rounded-md"
          placeholder="VD: Gia đình trẻ, nhà phố nhỏ..."
          disabled={disabled}
        />
        {errors.topicDetails?.targetAudience && (
          <p className="text-red-500 text-xs mt-1">{errors.topicDetails.targetAudience.message as string}</p>
        )}
      </div>

      {/* MainPoints */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Các ý chính (mỗi ý một dòng)</label>
        <textarea
          {...register("topicDetails.mainPoints")}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="- Ý chính 1\n- Ý chính 2\n- Ý chính 3"
          disabled={disabled}
        />
        {errors.topicDetails?.mainPoints && (
          <p className="text-red-500 text-xs mt-1">{errors.topicDetails.mainPoints.message as string}</p>
        )}
      </div>

      {/* SeoKeywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Từ khóa SEO (cách nhau bởi dấu phẩy)</label>
        <input
          {...register("topicDetails.seoKeywords")}
          className="w-full p-2 border rounded-md"
          placeholder="thang máy gia đình, công nghệ thang máy..."
          disabled={disabled}
        />
        {errors.topicDetails?.seoKeywords && (
          <p className="text-red-500 text-xs mt-1">{errors.topicDetails.seoKeywords.message as string}</p>
        )}
      </div>

      {/* ToneOfVoice */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Văn phong bài viết</label>
        <select
          {...register("topicDetails.toneOfVoice")}
          className="w-full p-2 border rounded-md"
          disabled={disabled}
        >
          {toneOfVoiceOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
