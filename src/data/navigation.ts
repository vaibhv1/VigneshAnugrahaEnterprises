export const primaryNav = [
  { to: "/", key: "home", end: true },
  { to: "/about", key: "about", end: false },
  { to: "/services", key: "services", end: false },
  { to: "/projects", key: "projects", end: false },
  { to: "/contact", key: "contact", end: false },
] as const;

export type NavKey = (typeof primaryNav)[number]["key"] | "approach";

export const footerNav = [
  ...primaryNav.filter((item) => item.key !== "home"),
  { to: "/approach", key: "approach" as const, end: false },
];
