import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import axios from "axios";
import { blog, BlogRequest, BlogPost } from "./blog";

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
  const mockedGet = axios.get as unknown as Mock;

  beforeEach(() => {
    mockedPost.mockReset();
    mockedPost.mockResolvedValue({ data: {} });
    mockedGet.mockReset();
    mockedGet.mockResolvedValue({ data: [] });
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

  it("returns list of blogs", async () => {
    const posts: BlogPost[] = [
      {
        id: "1",
        title: "T",
        content: "C",
        slug: "s",
        author: "a",
        createdDate: "2024-01-01",
        viewCount: 0,
      },
    ];
    mockedGet.mockResolvedValueOnce({ data: posts });
    const res = await blog.list();
    expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("/api/blogs"));
    expect(res).toEqual(posts);
  });

  it("returns a blog post", async () => {
    const post: BlogPost = {
      id: "1",
      title: "T",
      content: "C",
      slug: "s",
      author: "a",
      createdDate: "2024-01-01",
      viewCount: 0,
    };
    mockedGet.mockResolvedValueOnce({ data: post });
    const res = await blog.get("s");
    expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("/api/blog/s"));
    expect(res).toEqual(post);
  });
});