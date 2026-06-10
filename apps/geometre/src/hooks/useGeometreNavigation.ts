import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { geometrePath, getGeometreBase } from "../lib/routes";

export function useGeometreNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const base = getGeometreBase(location.pathname);

  const goTo = useCallback(
    (segment = "") => {
      navigate(geometrePath(base, segment));
    },
    [navigate, base],
  );

  return { goTo, base };
}
