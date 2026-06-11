import type { Mission, MissionStatus, MissionTechnicalData } from "../types";

export const STATUS_LABELS: Record<MissionStatus, string> = {
  assignée:              "Assignée",
  en_cours:              "En cours",
  en_attente_validation: "En attente validation",
  terminée:              "Terminée",
};

export const STATUS_CHIP_COLOR: Record<
  MissionStatus,
  "default" | "warning" | "success" | "info"
> = {
  assignée:              "info",
  en_cours:              "warning",
  en_attente_validation: "default",
  terminée:              "success",
};

export function formatToday(): string {
  return new Date().toLocaleDateString("fr-FR");
}

export function canEditTechnical(status: MissionStatus): boolean {
  return status === "assignée" || status === "en_cours";
}

export function validateTechnicalData(data: MissionTechnicalData): string[] {
  const errors: string[] = [];
  // ✅ Utilise les bons noms de champs définis dans MissionTechnicalData
  if (!data.nb_bornes || data.nb_bornes <= 0)
    errors.push("Le nombre de bornes doit être supérieur à 0.");
  if (!data.surface_calculee?.trim())
    errors.push("La surface calculée est requise.");
  if (!data.ecart_titre?.trim())
    errors.push("L'écart avec le titre est requis.");
  if (!data.fichier_gps?.trim())
    errors.push("Le fichier GPS est requis.");
  if (!data.rapport?.trim())
    errors.push("Le rapport PDF est requis.");
  return errors;
}

export interface MissionStep {
  label: string;
  done: boolean;
}

export function getMissionSteps(mission: Mission): MissionStep[] {
  const { status, technical } = mission;
  // Accès aux bons champs de MissionTechnicalData
  const hasGps        = Boolean(technical?.fichier_gps);
  const hasTechnical  =
    (technical?.nb_bornes ?? 0) > 0 &&
    Boolean(technical?.surface_calculee) &&
    Boolean(technical?.ecart_titre);
  const reportSubmitted = status === "en_attente_validation" || status === "terminée";
  const validated       = status === "terminée";

  return [
    { label: "Mission reçue",         done: true               },
    { label: "Consultation des infos",done: status !== "assignée" || hasGps },
    { label: "Relevé GPS",            done: hasGps             },
    { label: "Données techniques",    done: hasTechnical       },
    { label: "Rapport déposé",        done: reportSubmitted    },
    { label: "Validé par notaire",    done: validated          },
  ];
}