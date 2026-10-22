import { describe, it, expect } from "vitest";
import { validateDraftMedia, engagementTotals, CTA_MAX, CAPTION_MAX } from "./Promotions";

describe("promo media validation", () => {
  it("demands at least one photo, a product photo or a video", () => {
    expect(validateDraftMedia([])).toMatch(/add a photo/i);
    expect(validateDraftMedia([{ url: "https://cdn.test/a.jpg", type: "image" }])).toBe("");
  });

  it("allows up to ten items but a single video", () => {
    expect(validateDraftMedia([{ url: "https://cdn.test/a.mp4", type: "video" }])).toBe("");
    expect(validateDraftMedia([
      { url: "https://cdn.test/a.mp4", type: "video" },
      { url: "https://cdn.test/b.mp4", type: "video" },
    ])).toMatch(/one video/i);
    const ten = Array.from({ length: 10 }, (_, i) => ({ url: `https://cdn.test/${i}.jpg`, type: "image" }));
    expect(validateDraftMedia(ten)).toBe("");
    expect(validateDraftMedia([...ten, { url: "https://cdn.test/x.jpg", type: "image" }])).toMatch(/up to 10/i);
  });
});

describe("engagement totals (anonymous counts only)", () => {
  it("sums likes, shares and button taps across posts", () => {
    const totals = engagementTotals([
      { likeCount: "4", shareCount: 2, patronageCount: 1 },
      { likeCount: null, shareCount: "3", patronageCount: undefined },
    ]);
    expect(totals).toEqual({ likes: 4, shares: 5, patronage: 1 });
  });
});

describe("composer copy limits", () => {
  it("matches the API caps", () => {
    expect(CTA_MAX).toBe(40);
    expect(CAPTION_MAX).toBe(500);
  });
});
