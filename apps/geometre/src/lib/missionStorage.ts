import { DEFAULT_MISSIONS, type Mission } from "../types";

const STORAGE_KEY = "mboaland_geometre_missions";

export function loadMissions(): Mission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveMissions(DEFAULT_MISSIONS);
      return DEFAULT_MISSIONS;
    }
    const parsed = JSON.parse(raw) as Mission[];
    // Vérifie que les données sont valides (ont bien admin + technical)
    if (!Array.isArray(parsed) || !parsed[0]?.admin || !parsed[0]?.technical) {
      saveMissions(DEFAULT_MISSIONS);
      return DEFAULT_MISSIONS;
    }
    return parsed;
  } catch {
    saveMissions(DEFAULT_MISSIONS);
    return DEFAULT_MISSIONS;
  }
}

export function saveMissions(missions: Mission[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
}

export function resetMissions(): Mission[] {
  saveMissions(DEFAULT_MISSIONS);
  return DEFAULT_MISSIONS;
}