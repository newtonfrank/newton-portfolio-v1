import type { DesignPiece, DesignProject } from "@/types/content";

/**
 * The design gallery, in composition order — this is the left-to-right reading
 * order of the card field, so it is a design decision, not an alphabetical dump.
 *
 * `width`/`height` are the intrinsic pixel dimensions. They are recorded here
 * rather than measured at runtime so the 3D scene can size every plane on the
 * first frame, before a single texture has decoded.
 */
export const designPieces: DesignPiece[] = [
  {
    file: "design_school copy.jpg",
    width: 2480,
    height: 3508,
    title: "NSD — Join the Experts",
    kind: "Poster",
  },
  {
    file: "design_school-2 copy.jpg",
    width: 2400,
    height: 2400,
    title: "NSD — Design Your Future",
    kind: "Poster",
  },
  {
    file: "design_school-3.jpg",
    width: 4800,
    height: 4800,
    title: "NSD — Elevate Your Creativity",
    kind: "Poster",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51.jpeg",
    width: 2961,
    height: 4160,
    title: "First Corner — Direction Over Speed",
    kind: "Poster",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (1).jpeg",
    width: 3400,
    height: 2161,
    title: "Unipix — Responsive Showcase",
    kind: "Product",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (2).jpeg",
    width: 1600,
    height: 1600,
    title: "Hair Basics — Key Ingredients",
    kind: "Brand",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (3).jpeg",
    width: 1280,
    height: 1600,
    title: "Gukesh Dommaraju — World Champion",
    kind: "Social",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (4).jpeg",
    width: 1190,
    height: 1488,
    title: "Always Greatfull — Tee",
    kind: "Apparel",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (5).jpeg",
    width: 3328,
    height: 4160,
    title: "Toyota Supra — Born on the Track",
    kind: "Poster",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (6).jpeg",
    width: 1600,
    height: 1600,
    title: "Limited Edition — Tee",
    kind: "Apparel",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (7).jpeg",
    width: 3328,
    height: 4160,
    title: "Nike Air Jordan 1 — Mid Fire Red",
    kind: "Poster",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (8).jpeg",
    width: 4160,
    height: 2081,
    title: "Porsche 911 — Wide",
    kind: "Poster",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (9).jpeg",
    width: 1036,
    height: 1241,
    title: "Hope — Tee",
    kind: "Apparel",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.51 (10).jpeg",
    width: 3200,
    height: 420,
    title: "DAZL Design — Banner",
    kind: "Banner",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.12.52.jpeg",
    width: 2562,
    height: 424,
    title: "Soccer Spotlight — Banner",
    kind: "Banner",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.13.28.jpeg",
    width: 3400,
    height: 2161,
    title: "Unipix — Product Page",
    kind: "Product",
  },
  {
    file: "WhatsApp Image 2026-03-12 at 15.15.02.jpeg",
    width: 1280,
    height: 1600,
    title: "PETA Exotica — Hyacinth Macaw",
    kind: "Poster",
  },
];

/**
 * Display form. `encodeURI` is load-bearing: the filenames carry spaces and
 * parentheses, so the raw path is not a valid URL.
 */
export const designProjects: DesignProject[] = designPieces.map((piece) => ({
  title: piece.title,
  kind: piece.kind,
  image: encodeURI(`/design/${piece.file}`),
  width: piece.width,
  height: piece.height,
  aspect: piece.width / piece.height,
}));
