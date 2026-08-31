import type { DesignPiece, DesignProject } from "@/types/content";

export const designPieces: DesignPiece[] = [
  { file: "design_school copy.jpg", width: 2480, height: 3508 },
  { file: "design_school-2 copy.jpg", width: 2400, height: 2400 },
  { file: "design_school-3.jpg", width: 4800, height: 4800 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51.jpeg", width: 2961, height: 4160 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (1).jpeg", width: 3400, height: 2161 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (2).jpeg", width: 1600, height: 1600 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (3).jpeg", width: 1280, height: 1600 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (4).jpeg", width: 1190, height: 1488 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (5).jpeg", width: 3328, height: 4160 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (6).jpeg", width: 1600, height: 1600 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (7).jpeg", width: 3328, height: 4160 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (8).jpeg", width: 4160, height: 2081 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (9).jpeg", width: 1036, height: 1241 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (10).jpeg", width: 3200, height: 420 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.52.jpeg", width: 2562, height: 424 },
  { file: "WhatsApp Image 2026-03-12 at 15.13.28.jpeg", width: 3400, height: 2161 },
  { file: "WhatsApp Image 2026-03-12 at 15.15.02.jpeg", width: 1280, height: 1600 },
];

export const designProjects: DesignProject[] = designPieces.map((item, index) => ({
  title: `Design Exploration ${String(index + 1).padStart(2, "0")}`,
  image: encodeURI(`/design/${item.file}`),
  width: item.width,
  height: item.height,
}));
