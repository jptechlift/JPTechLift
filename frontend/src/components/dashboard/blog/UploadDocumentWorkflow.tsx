import { useState, useRef } from "react";
import { ArrowLeft, Upload as UploadIcon, Sparkles } from "lucide-react";
import BlogEditorPreview from "./BlogEditorPreview";
import { blog, BlogRequest, GeneratedPreviewResponse } from "../../../services/blog"; // Import BlogRequest và GeneratedPreviewResponse
import { generateSlug } from "../../../services/SlugHelper"; // Đảm bảo đường dẫn đúng

interface UploadDocumentWorkflowProps {
  onPublishSuccess: () => void;
  onBack: () => void;
}

export default function UploadDocumentWorkflow({
  onPublishSuccess,
  onBack,
}: UploadDocumentWorkflowProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Optional: for progress bar
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [finalTitle, setFinalTitle] = useState("");
  const [finalSlug, setFinalSlug] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [finalMetaDescription, setFinalMetaDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Kiểm tra loại file
      if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setSelectedFile(file);
        // Có thể tự động kích hoạt generate ngay đây hoặc chờ user bấm nút
      } else {
        setSelectedFile(null);
        setUploadError("Chỉ chấp nhận file PDF (.pdf) hoặc Word (.docx).");
      }
    }
  };

  const handleGenerateFromDocument = async () => {
    if (!selectedFile) {
      setUploadError("Vui lòng chọn một file để upload.");
      return;
    }

    setIsProcessing(true);
    setUploadError(null);
    setFinalTitle("");
    setFinalSlug("");
    setFinalContent("");
    setFinalMetaDescription("");
    setPreviewUrl("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("Sending document for AI processing:", selectedFile.name);
      // Gọi API mới để xử lý file tài liệu
      const res: GeneratedPreviewResponse = await blog.generateFromDocument(formData, (progressEvent) => {
        // Optional: Cập nhật tiến độ upload
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      console.log("Received AI generated content from document:", res);

      setFinalTitle(res.title);
      setFinalSlug(res.slug);
      setFinalContent(res.generatedContent);
      setFinalMetaDescription(res.metaDescription);
      setPreviewUrl(res.previewUrl);

    } catch (error: unknown) {
      console.error(
        "%c[!!!] Frontend: Document AI generation API call failed!",
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
        setUploadError(`Lỗi xử lý tài liệu: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
        setUploadError("Lỗi không xác định khi xử lý tài liệu. Vui lòng kiểm tra console.");
      }
      setFinalTitle("Lỗi");
      setFinalContent("Không thể tạo nội dung từ tài liệu. Vui lòng thử lại.");
      setFinalMetaDescription("Lỗi khi tạo mô tả meta từ tài liệu.");
      setFinalSlug(generateSlug("Error generating from document"));
    } finally {
      setIsProcessing(false);
      setUploadProgress(0); // Reset progress
    }
  };

  const onPublish = async () => {
    setIsPublishing(true);
    setUploadError(null); // Reset lỗi khi xuất bản
    try {
      if (!finalTitle || !finalContent || !finalSlug) {
        setUploadError("Tiêu đề, đường dẫn URL và nội dung là bắt buộc.");
        setIsPublishing(false);
        return;
      }

      const payload: BlogRequest = {
        blogType: "topic", // Hoặc "product" nếu AI có thể suy luận, mặc định là topic cho văn bản chung
        title: finalTitle,
        slug: finalSlug,
        content: finalContent,
        metaDescription: finalMetaDescription,
        // Khi xuất bản từ upload, không có productDetails/topicDetails gốc để gửi
        // Backend PublishAsync sẽ chỉ sử dụng title, slug, content, metaDescription
        // và bạn có thể thêm logic ở backend để tự động phân loại nếu muốn
      };

      console.log("Sending final blog data to publish:", payload);
      await blog.publish(payload);
      console.log("Blog published successfully from document upload.");
      alert("Bài viết từ tài liệu đã được xuất bản thành công!");
      onPublishSuccess();
    } catch (error: unknown) {
      console.error(
        "%c[!!!] Frontend: Publishing API call failed (Document Upload)!",
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
        setUploadError(`Xuất bản thất bại: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
        setUploadError("Xuất bản blog thất bại. Vui lòng kiểm tra console để biết chi tiết lỗi.");
      }
    } finally {
      setIsPublishing(false);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Tạo Blog từ Tài liệu
        </h2>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>

      {finalContent ? (
        <BlogEditorPreview
          isGenerating={isProcessing}
          isPublishing={isPublishing}
          title={finalTitle}
          setTitle={setFinalTitle}
          slug={finalSlug}
          setSlug={setFinalSlug}
          content={finalContent}
          setContent={setFinalContent}
          metaDescription={finalMetaDescription}
          setMetaDescription={setFinalMetaDescription}
          previewUrl={previewUrl}
          onPublish={onPublish}
          // Không truyền onGenerate ở đây, vì việc tái tạo sẽ là tải lên lại file
          isAIGenerated={true} // Đánh dấu là được tạo bởi AI (từ tài liệu)
        />
      ) : (
        <div className="text-center py-16">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden" // Ẩn input mặc định
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-base font-medium text-gray-700 shadow-sm transition-all duration-300 ease-in-out hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadIcon className="w-6 h-6 mr-2" />
            {selectedFile ? `Chọn lại file: ${selectedFile.name}` : "Kéo & Thả hoặc Click để chọn file (PDF/DOCX)"}
          </button>

          {selectedFile && !uploadError && (
            <div className="mt-4 text-left p-4 border border-gray-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-800">
                File đã chọn: <span className="font-semibold">{selectedFile.name}</span>
              </p>
              <p className="text-xs text-gray-500">
                Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={handleGenerateFromDocument}
                disabled={isProcessing || !selectedFile}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-blue-900 px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:from-blue-900 hover:to-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    AI đang xử lý... ({uploadProgress}%)
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="mr-2" />
                    Tạo nội dung với AI
                  </span>
                )}
              </button>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-md mx-auto">
              <p className="text-sm font-medium">{uploadError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}