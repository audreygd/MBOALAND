import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadMissions, resetMissions, saveMissions } from "../lib/missionStorage";
import {
  formatToday,
  validateTechnicalData,
  canEditTechnical,
} from "../lib/missionUtils";
import type { Mission, MissionTechnicalData } from "../types";

interface MissionsContextValue {
  missions: Mission[];
  getMission: (id: number) => Mission | undefined;
  updateMission: (id: number, patch: Partial<Mission>) => void;
  updateTechnical: (id: number, technical: Partial<MissionTechnicalData>) => void;
  startMission: (id: number) => void;
  submitReport: (id: number, technical?: Partial<MissionTechnicalData>) => string[];
  resetDemo: () => void;
}

const MissionsContext = createContext<MissionsContextValue | null>(null);

export function MissionsProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>(() => loadMissions());

  const persist = useCallback((next: Mission[]) => {
    setMissions(next);
    saveMissions(next);
  }, []);

  const getMission = useCallback(
    (id: number) => missions.find((m) => m.id === id),
    [missions],
  );

  const updateMission = useCallback(
    (id: number, patch: Partial<Mission>) => {
      persist(
        missions.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      );
    },
    [missions, persist],
  );

  const updateTechnical = useCallback(
    (id: number, technical: Partial<MissionTechnicalData>) => {
      persist(
        missions.map((m) =>
          m.id === id
            ? { ...m, technical: { ...m.technical, ...technical } }
            : m,
        ),
      );
    },
    [missions, persist],
  );

  const startMission = useCallback(
    (id: number) => {
      const mission = missions.find((m) => m.id === id);
      if (!mission || mission.status !== "assignée") return;
      updateMission(id, { status: "en_cours" });
    },
    [missions, updateMission],
  );

  const submitReport = useCallback(
    (id: number, technicalPatch?: Partial<MissionTechnicalData>): string[] => {
      const mission = missions.find((m) => m.id === id);
      if (!mission) return ["Mission introuvable."];
      if (!canEditTechnical(mission.status)) {
        return ["Cette mission ne peut plus être modifiée."];
      }

      const technical = { ...mission.technical, ...technicalPatch };
      const errors = validateTechnicalData(technical);
      if (errors.length > 0) return errors;

      persist(
        missions.map((m) =>
          m.id === id
            ? {
                ...m,
                technical,
                status: "en_attente_validation" as const,
                dateDepot: formatToday(),
              }
            : m,
        ),
      );
      return [];
    },
    [missions, persist],
  );

  const resetDemo = useCallback(() => {
    persist(resetMissions());
  }, [persist]);

  const value = useMemo(
    () => ({
      missions,
      getMission,
      updateMission,
      updateTechnical,
      startMission,
      submitReport,
      resetDemo,
    }),
    [missions, getMission, updateMission, updateTechnical, startMission, submitReport, resetDemo],
  );

  return (
    <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>
  );
}

export function useMissions(): MissionsContextValue {
  const ctx = useContext(MissionsContext);
  if (!ctx) {
    throw new Error("useMissions doit être utilisé dans MissionsProvider");
  }
  return ctx;
}
