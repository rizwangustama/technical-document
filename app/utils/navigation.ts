export const navItems = [
  { title: "Dashboard", icon: "tabler-layout-dashboard", to: "/", badge: null },
  { title: "Document Request", icon: "tabler-file-plus", to: "/document-request", badge: null },
  { title: "Document Approval", icon: "tabler-file-check", to: "/document-approval", badge: null },
];

export const pageTitles: Record<string, string> = {
  "/": "Dashboard Overview",
  "/document-request": "Document Request",
  "/document-approval": "Document Approval",
  "/settings": "Settings & Theme", // Pertahankan opsi Settings karena biasanya dibutuhkan untuk tema UI
};
