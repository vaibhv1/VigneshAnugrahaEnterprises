/**
 * Facts taken from the Vignesh Anugraha Enterprises company profile.
 * Do not add clients, certifications, counts or testimonials here.
 *
 * Confirm before publishing:
 * - Office hours are not in the profile.
 * - The cover graphic says "1–3 years"; the company information table says 3 years.
 *   This site follows the table.
 * - Photographs after the labelled Project 03 page are not assigned to a project.
 * - Kannada text is a translation and needs a native-speaker review.
 * - The published mobile number is used for calls and WhatsApp. Confirm it is the enquiry line.
 * - Address punctuation is normalised from "#291, 2nd Floor, 1st main road 1st Cross, Kamalanagara, Bengaluru 560079, India".
 */
export const company = {
  legalName: "VIGNESH ANUGRAHA ENTERPRISES",
  displayName: "Vignesh Anugraha Enterprises",
  proprietor: "Santhosh Kumar H",
  gstin: "29ACGPE1528H1ZS",
  experienceYears: "3",
  phoneDisplay: "+91 79964 63956",
  phoneTel: "+917996463956",
  whatsapp: "917996463956",
  email: "kavyakushi677@gmail.com",
  addressEn:
    "#291, 2nd Floor, 1st Main Road, 1st Cross, Kamalanagara, Bengaluru 560079, India",
  mapsQuery:
    "291 2nd Floor 1st Main Road 1st Cross Kamalanagara Bengaluru 560079",
} as const;

export const serviceOrder = [
  "civil",
  "materials",
  "renovation",
  "plumbingElectrical",
  "infrastructure",
  "interior",
  "fabrication",
  "sports",
  "maintenance",
] as const;

export type ServiceId = (typeof serviceOrder)[number];

export const sectorOrder = [
  "education",
  "commercial",
  "residential",
  "industrial",
  "builders",
] as const;

export type SectorId = (typeof sectorOrder)[number];

export const valueOrder = [
  "integrity",
  "quality",
  "safety",
  "accountability",
] as const;

export const stepOrder = [
  "understand",
  "scope",
  "plan",
  "execute",
  "close",
] as const;

export const strengthOrder = ["integrated", "boq", "coordination", "flexible", "practical"] as const;

export const documentOrder = [
  "measurements",
  "materials",
  "progress",
  "handover",
] as const;

export const engagementOrder = [
  "enquiry",
  "visit",
  "quotation",
  "agreement",
  "execution",
] as const;

export const qualityOrder = ["drawings", "materials", "checks", "records"] as const;
export const safetyOrder = ["hazards", "ppe", "housekeeping", "highRisk"] as const;
export const environmentOrder = ["storage", "waste", "protect"] as const;

export const maintenanceScopeOrder = [
  "plumbing",
  "fingerProtector",
  "pigeonNet",
  "deepCleaning",
  "safetyNet",
  "floorSpring",
  "stormDrain",
  "materialShifting",
] as const;

export type ProjectSlug =
  | "commercial-building-8th-mile"
  | "residential-dasarahalli"
  | "maintenance-vibgyor";

export const projectOrder: ProjectSlug[] = [
  "commercial-building-8th-mile",
  "residential-dasarahalli",
  "maintenance-vibgyor",
];

export type Photo = {
  id: string;
  src: string;
  orientation: "portrait" | "landscape" | "panorama";
};

export const projects: Record<
  ProjectSlug,
  {
    year: string;
    client: string;
    plotArea: string | null;
    images: Photo[];
  }
> = {
  "commercial-building-8th-mile": {
    year: "2025",
    client: "Prakash B S",
    plotArea: "4,500 sq ft",
    images: [
      { id: "frame", src: "/media/project-01.jpg", orientation: "portrait" },
    ],
  },
  "residential-dasarahalli": {
    year: "2026",
    client: "Shiva Kumar",
    plotArea: "1,200 sq ft",
    images: [
      { id: "masonry", src: "/media/project-02.jpg", orientation: "portrait" },
    ],
  },
  "maintenance-vibgyor": {
    year: "2026",
    client: "VIBGYOR",
    plotArea: null,
    images: [
      { id: "netFrame", src: "/media/project-03-a.jpg", orientation: "portrait" },
      { id: "netRoof", src: "/media/project-03-b.jpg", orientation: "landscape" },
    ],
  },
};

export const extraPhotos: Photo[] = [
  { id: "court", src: "/media/site-court.jpg", orientation: "landscape" },
  { id: "facade", src: "/media/site-facade.jpg", orientation: "landscape" },
  { id: "courtJoint", src: "/media/site-court-joint.jpg", orientation: "landscape" },
  { id: "stair", src: "/media/site-stair.jpg", orientation: "portrait" },
  { id: "enclosure", src: "/media/site-enclosure.jpg", orientation: "portrait" },
  { id: "drain", src: "/media/site-drain.jpg", orientation: "portrait" },
  { id: "basketball", src: "/media/site-basketball.jpg", orientation: "landscape" },
  { id: "netA", src: "/media/site-net-a.jpg", orientation: "panorama" },
  { id: "netB", src: "/media/site-net-b.jpg", orientation: "panorama" },
];
