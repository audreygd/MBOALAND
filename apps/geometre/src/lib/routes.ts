export const GEOMETRE_BASE_PATH = "/surveyor";

export function getGeometreBase(pathname: string): string {
  if (pathname === GEOMETRE_BASE_PATH || pathname.startsWith(`${GEOMETRE_BASE_PATH}/`)) {
    return GEOMETRE_BASE_PATH;
  }
  return "";
}

export function geometrePath(base: string, segment = ""): string {
  const clean = segment.replace(/^\/+/, "");
  if (!clean) return base || "/";
  return base ? `${base}/${clean}` : `/${clean}`;
}

export function getActiveGeometreSegment(pathname: string): string {
  const base = getGeometreBase(pathname);
  const relative = base
    ? pathname.slice(base.length).replace(/^\/+/, "")
    : pathname.replace(/^\/+/, "");

  if (!relative) return "";

  const [first] = relative.split("/");
  if (/^\d+$/.test(first)) return "missions";

  return first;
}
