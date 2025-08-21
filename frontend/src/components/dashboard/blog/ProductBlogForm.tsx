import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormValues } from "./CreateBlogForm";

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  disabled: boolean;
};

const productTypeOptions = [
  "home-lift",
  "freight-lift",
  "panorama-lift",
  "hospital-lift",
  "passenger-lift",
  "dumpwaiter",
  "escalator",
];
const toneOfVoiceOptions = [
  "Chuyên nghiệp & Kỹ thuật",
  "Thân thiện & Thuyết phục",
  "Sang trọng & Cao cấp",
];

export default function ProductBlogForm({ register, errors, disabled }: Props) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      {/* ProductName */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
        <input
          {...register("productDetails.productName")}
          className="w-full p-2 border rounded-md"
          placeholder="VD: Thang máy gia đình JP-HomeLift S-Series"
          disabled={disabled}
        />
        {errors.productDetails?.productName && (
          <p className="text-red-500 text-xs mt-1">{errors.productDetails.productName.message as string}</p>
        )}
      </div>

      {/* ProductType */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Loại sản phẩm</label>
        <select
          {...register("productDetails.productType")}
          className="w-full p-2 border rounded-md"
          disabled={disabled}
        >
          <option value="">-- Chọn loại thang máy --</option>
          {productTypeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.productDetails?.productType && (
          <p className="text-red-500 text-xs mt-1">{errors.productDetails.productType.message as string}</p>
        )}
      </div>

      {/* TargetAudience */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Đối tượng khách hàng mục tiêu</label>
        <input
          {...register("productDetails.targetAudience")}
          className="w-full p-2 border rounded-md"
          placeholder="VD: Chủ biệt thự, kiến trúc sư, chủ đầu tư..."
          disabled={disabled}
        />
        {errors.productDetails?.targetAudience && (
          <p className="text-red-500 text-xs mt-1">{errors.productDetails.targetAudience.message as string}</p>
        )}
      </div>

      {/* KeySellingPoints */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Lợi ích bán hàng chính (mỗi ý một dòng)</label>
        <textarea
          {...register("productDetails.keySellingPoints")}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="- Thiết kế sang trọng, tùy biến cao&#10;- Vận hành siêu êm&#10;- Tiết kiệm 40% điện năng"
          disabled={disabled}
        />
        {errors.productDetails?.keySellingPoints && (
          <p className="text-red-500 text-xs mt-1">{errors.productDetails.keySellingPoints.message as string}</p>
        )}
      </div>

      {/* SeoKeywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Từ khóa SEO (cách nhau bởi dấu phẩy)</label>
        <input
          {...register("productDetails.seoKeywords")}
          className="w-full p-2 border rounded-md"
          placeholder="thang máy gia đình, thang máy biệt thự,..."
          disabled={disabled}
        />
        {errors.productDetails?.seoKeywords && (
          <p className="text-red-500 text-xs mt-1">{errors.productDetails.seoKeywords.message as string}</p>
        )}
      </div>

      {/* ToneOfVoice */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Văn phong bài viết</label>
        <select
          {...register("productDetails.toneOfVoice")}
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