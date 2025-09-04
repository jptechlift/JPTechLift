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
      json: () =>
        Promise.resolve({
          headerName: "RequestVerificationToken",
          requestToken: "dummy",
        }),
    } as unknown as Response);

    await auth.fetchCsrfToken();
    expect(document.cookie).toBe("");
  });

  it("sends antiforgery header on login using stored token", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            headerName: "RequestVerificationToken",
            requestToken: "abc",
          }),
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
        headers: expect.objectContaining({
          RequestVerificationToken: "abc",
        }),
        credentials: "include",
      })
    );
  });
});