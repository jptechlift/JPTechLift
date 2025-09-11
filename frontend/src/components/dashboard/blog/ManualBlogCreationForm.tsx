import { useState, useEffect } from "react";
import { blog, BlogRequest } from "../../../services/blog";
import { ArrowLeft, Rocket, FileText, Globe, Edit3, Type } from "lucide-react"; // Import thêm các icon cần thiết
import { generateSlug } from "../../../services/SlugHelper"; // Đảm bảo đường dẫn đúng

interface ManualBlogCreationFormProps {
  onPublishSuccess: () => void;
  onBack: () => void;
}

export default function ManualBlogCreationForm({
  onPublishSuccess,
  onBack,
}: ManualBlogCreationFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null); // State để lưu lỗi xuất bản

  // Constants for max lengths (PHẢI KHỚP với MaxLength trong C# model Backend.Models/Blog.cs)
  const MAX_SLUG_LENGTH = 200; // Khớp với [MaxLength(200)] trên Slug
  const MAX_META_DESCRIPTION_LENGTH = 500; // Khớp với [MaxLength(500)] trên MetaDescription (nếu bạn đã tăng)

  useEffect(() => {
    // Chỉ tự động tạo slug nếu title có giá trị và slug hiện tại rỗng
    // Cắt ngắn slug ngay khi tạo nếu nó quá dài
    if (title && !slug) {
      const generated = generateSlug(title);
      setSlug(generated.length > MAX_SLUG_LENGTH ? generated.substring(0, MAX_SLUG_LENGTH) : generated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]); // Chỉ phụ thuộc vào title để tạo slug ban đầu

  // Reset lỗi khi người dùng bắt đầu nhập lại
  useEffect(() => {
    setPublishError(null);
  }, [title, slug, content, metaDescription]);

  const onPublish = async () => {
    setIsPublishing(true);
    setPublishError(null); // Reset lỗi khi bắt đầu xuất bản
    try {
      if (!title || !content || !slug) {
        setPublishError("Tiêu đề, đường dẫn URL và nội dung là bắt buộc.");
        setIsPublishing(false);
        return;
      }

      // Cắt ngắn slug và metaDescription một lần nữa ngay trước khi gửi để đảm bảo
      const finalSlug = slug.length > MAX_SLUG_LENGTH ? slug.substring(0, MAX_SLUG_LENGTH) : slug;
      const finalMetaDescription = metaDescription.length > MAX_META_DESCRIPTION_LENGTH
                                 ? metaDescription.substring(0, MAX_META_DESCRIPTION_LENGTH)
                                 : metaDescription;

      const payload: BlogRequest = {
        blogType: "manual", // blogType manual
        title: title,
        slug: finalSlug, // Sử dụng finalSlug đã cắt ngắn
        content: content,
        metaDescription: finalMetaDescription, // Sử dụng finalMetaDescription đã cắt ngắn
      };

      console.log("Sending payload to publish (ManualBlog):", payload);
      await blog.publish(payload); // Gọi hàm publish của service
      console.log("Manual blog published successfully.");
      alert("Bài viết thủ công đã được xuất bản thành công!");
      onPublishSuccess();
    } catch (error: unknown) {
      console.error(
        "%c[!!!] Frontend: Manual publishing API call failed!",
        "color: red; font-weight: bold;",
        error
      );
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status: number; data: unknown } }).response
      ) {
        const err = error as { response: { status: number; data: unknown } };
        console.error("Error details:", {
          status: err.response.status,
          data: err.response.data,
        });

        // Cố gắng hiển thị thông báo lỗi cụ thể hơn từ backend
        if (err.response.status === 400 && typeof err.response.data === 'object' && 'errors' in err.response.data) {
          // Xử lý lỗi validation từ backend (ví dụ: duplicate slug)
          const apiErrors = err.response.data.errors as { [key: string]: string[] };
          if (apiErrors['Slug'] && apiErrors['Slug'].length > 0) {
            setPublishError(`Lỗi Slug: ${apiErrors['Slug'][0]}`);
          } else if (apiErrors['Title'] && apiErrors['Title'].length > 0) {
             setPublishError(`Lỗi Tiêu đề: ${apiErrors['Title'][0]}`);
          }
          else {
            setPublishError(`Xuất bản thất bại: ${JSON.stringify(err.response.data)}`);
          }
        } else if (err.response.status === 500) {
            setPublishError(`Lỗi máy chủ (500): ${err.response.data || "Lỗi không xác định."}`);
        }
        else {
          setPublishError(`Xuất bản thất bại: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        }
      } else {
        setPublishError("Xuất bản blog thất bại. Vui lòng kiểm tra console để biết chi tiết lỗi.");
      }
      // alert("Xuất bản blog thất bại. Vui lòng kiểm tra console để biết chi tiết lỗi."); // Loại bỏ alert chung này, dùng publishError
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Tạo Blog Thủ Công
        </h2>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>

      <div className="space-y-8 animate-fadeIn">
        {/* Meta Information Section */}
        <section className="transform transition-all duration-500 hover:translate-y-[-2px]">
          <h3 className="text-lg font-semibold text-[#041e42] mb-4 pb-2 border-b border-gray-200 transition-colors duration-300">
            Thông tin bài viết
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title Field */}
            <div className="group">
              <label
                htmlFor="manual_title"
                className="flex items-center text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-hover:text-[#041e42]"
              >
                <FileText className="w-4 h-4 mr-2 text-[#041e42] transition-transform duration-200 group-hover:scale-110" />
                <span>Tiêu đề bài viết</span>
                <span className="text-gray-500 text-xs ml-2 bg-[#fafaf9] px-2 py-1 rounded transition-all duration-200 group-hover:bg-[#041e42]/10 group-hover:text-[#041e42]">
                  SEO optimized
                </span>
              </label>
              <div className="relative">
                <input
                  id="manual_title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 transform hover:scale-[1.01]"
                  placeholder="Nhập tiêu đề bài viết..."
                  disabled={isPublishing}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#041e42]/5 to-transparent rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="mt-1 text-xs text-gray-500 transition-all duration-200 group-hover:text-[#041e42]/70">
                Độ dài:{" "}
                <span
                  className={`font-medium ${
                    title.length >= 50 && title.length <= 60
                      ? "text-green-600"
                      : title.length > 60
                      ? "text-[#d64344]"
                      : "text-[#cba052]"
                  }`}
                >
                  {title.length}
                </span>{" "}
                ký tự
                <span className="ml-1 text-gray-400">
                  (khuyến nghị: 50-60 ký tự)
                </span>
              </div>
            </div>

            {/* Slug Field */}
            <div className="group">
              <label
                htmlFor="manual_slug"
                className="flex items-center text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-hover:text-[#041e42]"
              >
                <Globe className="w-4 h-4 mr-2 text-[#041e42] transition-transform duration-200 group-hover:scale-110" />
                <span>Đường dẫn URL</span>
                <span className="text-gray-500 text-xs ml-2 bg-[#fafaf9] px-2 py-1 rounded transition-all duration-200 group-hover:bg-[#041e42]/10 group-hover:text-[#041e42]">
                  SEO friendly
                </span>
              </label>
              <div className="relative">
                <input
                  id="manual_slug"
                  value={slug}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSlug(value.length > MAX_SLUG_LENGTH ? value.substring(0, MAX_SLUG_LENGTH) : value);
                  }}
                  className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 font-mono transform hover:scale-[1.01]"
                  placeholder="duong-dan-url-bai-viet"
                  disabled={isPublishing}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#041e42]/5 to-transparent rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="mt-1 text-xs text-gray-500 transition-all duration-200 group-hover:text-[#041e42]/70">
                Độ dài:{" "}
                <span
                  className={`font-medium ${
                    slug.length <= MAX_SLUG_LENGTH ? "text-green-600" : "text-[#d64344]"
                  }`}
                >
                  {slug.length}
                </span>{" "}
                ký tự
                <span className="ml-1 text-gray-400">
                  (tối đa: {MAX_SLUG_LENGTH} ký tự)
                </span>
              </div>
              {slug && (
                <div className="mt-2 animate-slideDown">
                  <a
                    href={`/blogs/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm text-[#041e42] hover:text-[#d64344] underline inline-block transition-all duration-300 hover:translate-x-1 ${
                      isPublishing ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    {`/blogs/${slug}`}
                  </a>
                </div>
              )}
            </div>

            {/* Meta Description Field */}
            <div className="lg:col-span-2 group">
              <label
                htmlFor="manual_meta_description"
                className="flex items-center text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-hover:text-[#041e42]"
              >
                <Type className="w-4 h-4 mr-2 text-[#041e42] transition-transform duration-200 group-hover:scale-110" />
                <span>Mô tả Meta (SEO)</span>
                <span className="text-gray-500 text-xs ml-2 bg-[#fafaf9] px-2 py-1 rounded transition-all duration-200 group-hover:bg-[#041e42]/10 group-hover:text-[#041e42]">
                  SEO snippet
                </span>
              </label>
              <div className="relative">
                <textarea
                  id="manual_meta_description"
                  value={metaDescription}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMetaDescription(value.length > MAX_META_DESCRIPTION_LENGTH ? value.substring(0, MAX_META_DESCRIPTION_LENGTH) : value);
                  }}
                  rows={3}
                  className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 resize-none transform hover:scale-[1.005]"
                  placeholder="Mô tả ngắn gọn, hấp dẫn cho công cụ tìm kiếm..."
                  disabled={isPublishing}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#041e42]/5 to-transparent rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="mt-1 text-xs text-gray-500 transition-all duration-200 group-hover:text-[#041e42]/70">
                Độ dài:{" "}
                <span
                  className={`font-medium ${
                    metaDescription.length >= 150 &&
                    metaDescription.length <= MAX_META_DESCRIPTION_LENGTH
                      ? "text-green-600"
                      : metaDescription.length > MAX_META_DESCRIPTION_LENGTH
                      ? "text-[#d64344]"
                      : "text-[#cba052]"
                  }`}
                >
                  {metaDescription.length}
                </span>{" "}
                ký tự
                <span className="ml-1 text-gray-400">
                  (khuyến nghị: 150-160, tối đa: {MAX_META_DESCRIPTION_LENGTH} ký tự)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Editor Section */}
        <section className="transform transition-all duration-500 hover:translate-y-[-2px]">
          <h3 className="text-lg font-semibold text-[#041e42] mb-4 pb-2 border-b border-gray-200 transition-colors duration-300">
            Nội dung bài viết
          </h3>
          <div className="group">
            <label
              htmlFor="manual_content"
              className="flex items-center text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-hover:text-[#041e42]"
            >
              <Edit3 className="w-4 h-4 mr-2 text-[#041e42] transition-transform duration-200 group-hover:scale-110" />
              <span>Nội dung</span>
              <span className="text-gray-500 text-xs ml-2 bg-[#fafaf9] px-2 py-1 rounded transition-all duration-200 group-hover:bg-[#041e42]/10 group-hover:text-[#041e42]">
                Markdown
              </span>
            </label>
            <div className="relative">
              <textarea
                id="manual_content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 resize-none font-mono leading-relaxed transform hover:scale-[1.005]"
                placeholder="Nội dung bài viết sẽ hiển thị ở đây..."
                disabled={isPublishing}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#041e42]/5 via-transparent to-[#d64344]/5 rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 transition-all duration-200 group-hover:text-[#041e42]/70">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span>Từ:</span>
                  <span className="font-medium text-[#041e42]">
                    {
                      content
                        .split(" ")
                        .filter((word) => word.length > 0).length
                    }
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>Ký tự:</span>
                  <span className="font-medium text-[#041e42]">
                    {content.length}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>Dòng:</span>
                  <span className="font-medium text-[#041e42]">
                    {content.split("\n").length}
                  </span>
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-[#041e42]/50 transition-colors duration-200">
                Hỗ trợ định dạng Markdown
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={onPublish}
            disabled={isPublishing || !title || !slug || !content} // Vô hiệu hóa nếu thiếu thông tin bắt buộc
            className="flex-1 inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-[#041e42] to-[#041e42]/90 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-[#041e42]/30 hover:from-[#041e42]/90 hover:to-[#041e42] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#041e42] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPublishing ? (
              <span className="flex items-center animate-pulse">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang xuất bản...
              </span>
            ) : (
              <span className="flex items-center group">
                <Rocket className="mr-2 w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" />
                Xuất bản bài viết
              </span>
            )}
          </button>
        </div>

        {/* Publishing Status */}
        {isPublishing && (
          <div className="flex items-center p-4 bg-gradient-to-r from-[#fafaf9] to-white border-2 border-[#041e42]/20 rounded-sm animate-slideDown shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#041e42]/10 to-[#041e42]/20 rounded-full flex items-center justify-center mr-3 animate-pulse">
                <div className="w-4 h-4 border-2 border-[#041e42] border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <div className="text-sm text-[#041e42] font-semibold animate-pulse">
                  Đang xuất bản bài viết...
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Nội dung đang được xử lý và sẽ có sẵn trong giây lát
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display Error Message */}
        {publishError && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-sm shadow-md mt-4 animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <div className="text-sm text-red-800 font-semibold">Lỗi xuất bản:</div>
                <div className="text-xs text-red-700 mt-1">{publishError}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}