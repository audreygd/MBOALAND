import React from "react";

const iconStyle = { display: "block" };
const createIcon =
  (...children: React.ReactNode[]) =>
  ({ size = 20 }: { size?: number }) =>
    React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: iconStyle,
      },
      ...children,
    );

export const DashboardIcon = createIcon(
  React.createElement("path", {
    d: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  }),
);

export const MapIcon = createIcon(
  React.createElement("path", {
    d: "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z",
  }),
);

export const OfferIcon = createIcon(
  React.createElement("path", {
    d: "M6 4h10l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  }),
);

export const TransactionIcon = createIcon(
  React.createElement("path", {
    d: "M6 12H3l3-3m0 0l3 3m-3-3v12m12-9h3l-3 3m0 0l-3-3m3 3V3",
  }),
);

export const DocumentIcon = createIcon(
  React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z",
  }),
  React.createElement("path", { d: "M14 2v6h6" }),
  React.createElement("path", { d: "M8 12h8M8 16h8" }),
);

export const VisitIcon = createIcon(
  React.createElement("path", {
    d: "M8 2v4M16 2v4M3 8h18M7 22h10a2 2 0 0 0 2-2V10H5v10a2 2 0 0 0 2 2z",
  }),
);

export const MessageIcon = createIcon(
  React.createElement("path", {
    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  }),
);

export const NotificationIcon = createIcon(
  React.createElement("path", {
    d: "M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8",
  }),
  React.createElement("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }),
);

export const UserIcon = createIcon(
  React.createElement("path", {
    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
  }),
  React.createElement("circle", { cx: 12, cy: 7, r: 4 }),
);

export const SettingsIcon = createIcon(
  React.createElement("path", {
    d: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  }),
  React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3 12.5H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9.5 3H10.5a1.65 1.65 0 0 0 1.51 1 .1.1 0 0 0 0 .09 1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1 1.51h.09A2 2 0 0 1 21 12.5h0a1.65 1.65 0 0 0-.33 1.82z",
  }),
);

export const LogoutIcon = createIcon(
  React.createElement("path", {
    d: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  }),
);
