import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "./auth";

describe("auth service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("document", { cookie: "" });
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    });
  });

  it("does not modify cookie when fetching CSRF token", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      headers: new Headers({ "X-CSRF-TOKEN-FROM-SERVER": "dummy" }),
      text: () => Promise.resolve(""),
    } as unknown as Response);

    await auth.fetchCsrfToken();
    expect(document.cookie).toBe("");
  });

    it("sends X-CSRF-TOKEN header on login using stored token", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "X-CSRF-TOKEN-FROM-SERVER": "abc" }),
        text: () => Promise.resolve(""),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve(JSON.stringify({ token: "t" })),
      } as unknown as Response);

    const res = await auth.login({ email: "e", password: "p" });
    expect(res.token).toBe("t");
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({
        headers: expect.objectContaining({ "X-CSRF-TOKEN": "abc" }),
      })
    );
  });
});
