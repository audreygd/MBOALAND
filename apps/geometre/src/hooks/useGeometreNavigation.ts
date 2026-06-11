import { useNavigate, useLocation } from "react-router-dom";
import { GEOMETRE_BASE_PATH, geometrePath, getGeometreBase } from "../lib/routes";

/**
 * Hook de navigation pour l'app Géomètre.
 * Gère le fait que l'app peut être montée sous "/surveyor/*"
 * (dans le routeur global) ou en racine "/" (en standalone).
 *
 * goTo("missions")        -> /surveyor/missions  (ou /missions en standalone)
 * goTo("missions/3")      -> /surveyor/missions/3
 * goTo("")                -> /surveyor (dashboard)
 */
export function useGeometreNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Détecte si on est sous /surveyor ou en standalone
  const base = getGeometreBase(location.pathname);

  const goTo = (segment: string = "") => {
    navigate(geometrePath(base, segment));
  };

  return { goTo, base, GEOMETRE_BASE_PATH };
}