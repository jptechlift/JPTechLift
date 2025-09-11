import { Rocket, RotateCcw, FileText, Globe, Edit3, Type, Eye } from "lucide-react"; // Import Type icon for meta description
import { generateSlug } from "../../../services/SlugHelper"; // Assume a utility for slug generation
import { useEffect } from "react";

interface BlogEditorPreviewProps {
  isGenerating: boolean;
  isPublishing: boolean;
  title: string;
  setTitle: (title: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  content: string;
  setContent: (content: string) => void;
  metaDescription: string; // New prop
  setMetaDescription: (meta: string) => void; // New prop setter
  previewUrl: string;
  onPublish: () => void;
  onGenerate?: () => void; // Optional for AI flow
  isAIGenerated: boolean; // To differentiate button text
}

export default function BlogEditorPreview({
  isGenerating,
  isPublishing,
  title,
  setTitle,
  slug,
  setSlug,
  content,
  setContent,
  metaDescription,
  setMetaDescription,
  previewUrl,
  onPublish,
  onGenerate,
  isAIGenerated,
}: BlogEditorPreviewProps) {
  // Auto-generate slug when title changes, if slug is empty AND not an AI-generated flow (where slug comes from AI)
  useEffect(() => {
    if (!isAIGenerated && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, slug, isAIGenerated, setSlug]);

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-[#041e42]/10 transition-all duration-500 hover:shadow-xl hover:shadow-[#041e42]/15">
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8 animate-fadeIn">
          <h2 className="text-2xl font-bold text-[#041e42] mb-2 transition-colors duration-300">
            Xem trước & Chỉnh sửa
          </h2>
          <p className="text-gray-600 transition-colors duration-300">
            Xem trước và chỉnh sửa nội dung trước khi xuất bản
          </p>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="relative mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#041e42] to-[#041e42]/80 rounded-full flex items-center justify-center opacity-90 animate-pulse">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-[#041e42]/20 rounded-full animate-ping" />
            </div>
            <h3 className="text-lg font-semibold text-[#041e42] mb-3 animate-slideUp">
              AI đang tạo nội dung...
            </h3>
            <p
              className="text-gray-600 max-w-md mx-auto leading-relaxed animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              Hệ thống đang phân tích thông tin và tạo nội dung chất lượng cao,
              tối ưu SEO cho bạn.
            </p>
            <div className="mt-8 flex justify-center">
              <div
                className="bg-[#fafaf9] rounded-full px-6 py-2 animate-bounceIn"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#041e42] rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-[#d64344] rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#cba052] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Form */}
        {!isGenerating && (title || content) ? ( // Show if not generating AND has content/title
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
                    htmlFor="final_title"
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
                      id="final_title"
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
                    htmlFor="final_slug"
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
                      id="final_slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 font-mono transform hover:scale-[1.01]"
                      placeholder="duong-dan-url-bai-viet"
                      disabled={isPublishing}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#041e42]/5 to-transparent rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  {previewUrl && (
                    <div className="mt-2 animate-slideDown">
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm text-[#041e42] hover:text-[#d64344] underline inline-block transition-all duration-300 hover:translate-x-1 ${
                          isPublishing ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        {previewUrl}
                      </a>
                    </div>
                  )}
                </div>

                {/* Meta Description Field */}
                <div className="lg:col-span-2 group">
                  <label
                    htmlFor="final_meta_description"
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
                      id="final_meta_description"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
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
                        metaDescription.length <= 160
                          ? "text-green-600"
                          : metaDescription.length > 160
                          ? "text-[#d64344]"
                          : "text-[#cba052]"
                      }`}
                    >
                      {metaDescription.length}
                    </span>{" "}
                    ký tự
                    <span className="ml-1 text-gray-400">
                      (khuyến nghị: 150-160 ký tự)
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
                  htmlFor="final_content"
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
                    id="final_content"
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
                disabled={isPublishing || isGenerating}
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

              {isAIGenerated && onGenerate && (
                <button
                  onClick={onGenerate}
                  disabled={isPublishing || isGenerating}
                  className="flex-1 inline-flex items-center justify-center rounded-sm bg-white border-2 border-[#bfbfbf] px-6 py-3 text-base font-medium text-[#041e42] shadow-lg transition-all duration-300 ease-in-out hover:bg-[#fafaf9] hover:border-[#041e42] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#041e42] disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="flex items-center group">
                    <RotateCcw className="mr-2 w-5 h-5 transition-transform duration-200 group-hover:rotate-180" />
                    Tạo lại nội dung
                  </span>
                </button>
              )}
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
          </div>
        ) : (
          // Empty State (only if not generating and no content/title)
          !isGenerating && (
            <div className="text-center py-16 animate-fadeIn">
              <div className="w-16 h-16 bg-gradient-to-br from-[#fafaf9] to-[#bfbfbf]/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-110 hover:rotate-6">
                <Eye className="w-8 h-8 text-[#bfbfbf] transition-colors duration-300 hover:text-[#041e42]" />
              </div>
              <h4 className="text-lg font-semibold text-[#041e42] mb-3 animate-slideUp">
                Chưa có nội dung để xem trước
              </h4>
              <p
                className="text-gray-600 leading-relaxed max-w-md mx-auto animate-slideUp"
                style={{ animationDelay: "0.2s" }}
              >
                {isAIGenerated
                  ? "Hãy điền thông tin trong form và tạo nội dung bằng AI trước khi xem trước."
                  : "Hãy nhập nội dung vào các trường để tạo bài viết thủ công."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}