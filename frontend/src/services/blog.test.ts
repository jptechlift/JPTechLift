import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import axios from "axios";
import { blog, BlogRequest } from "./blog";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock("./auth", () => ({
  auth: {
    getToken: () => null,
  },
}));

describe("blog service", () => {
  const request: BlogRequest = {
    blogType: "product",
    productDetails: {
      productName: "Test",
      productType: "type",
      description: "desc",
      targetAudience: "audience",
      keySellingPoints: "points",
      seoKeywords: "keywords",
      toneOfVoice: "Chuyên nghiệp & Kỹ thuật",
    },
  };

  const mockedPost = axios.post as unknown as Mock;

  beforeEach(() => {
    mockedPost.mockReset();
    mockedPost.mockResolvedValue({ data: {} });
  });

  it("sends description in generatePreview", async () => {
    await blog.generatePreview(request);
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        productDetails: expect.objectContaining({ description: "desc" }),
      }),
      expect.any(Object)
    );
  });

  it("sends description in create", async () => {
    await blog.create(request);
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        productDetails: expect.objectContaining({ description: "desc" }),
      }),
      expect.any(Object)
    );
  });
});
