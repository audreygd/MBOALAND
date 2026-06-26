// =====================================================
// STATUS DES MISSIONS
// =====================================================

export type MissionStatus =
  | "assignée"
  | "en_cours"
  | "en_attente_validation"
  | "terminée";

// =====================================================
// DONNÉES ADMINISTRATIVES
// =====================================================

export interface MissionAdmin {
  superficie: string;
  date: string;
  notaire: string;
  proprietaire: string;
  coordonnees: string;
  description: string;
  referenceTerrain: string;

  nom?: string;
  email?: string;
  telephone?: string;
}

// =====================================================
// DONNÉES TECHNIQUES
// =====================================================

export interface MissionTechnicalData {
  // -----------------------
  // Descente terrain
  // -----------------------

  date_descente: string;

  heure_debut: string;

  heure_fin: string;

  nom_geometre: string;

  equipe: string;

  meteo: string;

  // -----------------------
  // Localisation
  // -----------------------

  commune: string;

  departement: string;

  village: string;

  lieu_dit: string;

  coordonneesGPS: string;

  altitude: string;

  // -----------------------
  // Terrain
  // -----------------------

  nature_terrain: string;

  topographie: string;

  accessibilite: string;

  occupation: string;

  // -----------------------
  // Bornage
  // -----------------------

  nb_bornes: number;

  bornes_existantes: number;

  bornes_posees: number;

  bornes_detruites: number;

  // -----------------------
  // Mesures
  // -----------------------

  surface_calculee: string;

  superficieMesuree: string;

  surface_cadastre: string;

  perimetre: string;

  ecart_titre: string;

  precision_gps: string;

  materiel_utilise: string;

  // -----------------------
  // Documents
  // -----------------------

  fichier_gps: string;

  rapport: string;

  plan_pdf: string;

  plan_dwg: string;

  croquis: string;

  proces_verbal: string;

  photos: string[];

  // -----------------------
  // Observations
  // -----------------------

  observations: string;

  recommandations: string;

  notes_techniques: string;

  signature: string;
}

// =====================================================
// DOCUMENTS
// =====================================================

export interface MissionDocument {
  id: number;

  missionId: number;

  nom: string;

  type: string;

  url: string;

  taille: string;

  date: string;

  version: number;

  expediteur: string;

  destinataire: string;

  statut: "brouillon" | "envoye" | "valide";
}

// =====================================================
// HISTORIQUE
// =====================================================

export interface MissionHistorique {
  id: number;

  missionId: number;

  date: string;

  utilisateur: string;

  action: string;

  commentaire: string;
}

// =====================================================
// MISSION
// =====================================================

export interface Mission {
  id: number;

  title: string;

  zone: string;

  status: MissionStatus;

  admin: MissionAdmin;

  technical: MissionTechnicalData;

  certificat?: string;

  dateDepot?: string;

  dateValidation?: string;
}

// =====================================================
// DONNÉES TECHNIQUES PAR DÉFAUT
// =====================================================

const makeTechnical = (
  overrides: Partial<MissionTechnicalData> = {}
): MissionTechnicalData => ({
  date_descente: "",

  heure_debut: "",

  heure_fin: "",

  nom_geometre: "",

  equipe: "",

  meteo: "",

  commune: "",

  departement: "",

  village: "",

  lieu_dit: "",

  coordonneesGPS: "",

  altitude: "",

  nature_terrain: "",

  topographie: "",

  accessibilite: "",

  occupation: "",

  nb_bornes: 0,

  bornes_existantes: 0,

  bornes_posees: 0,

  bornes_detruites: 0,

  surface_calculee: "",

  superficieMesuree: "",

  surface_cadastre: "",

  perimetre: "",

  ecart_titre: "",

  precision_gps: "",

  materiel_utilise: "",

  fichier_gps: "",

  rapport: "",

  plan_pdf: "",

  plan_dwg: "",

  croquis: "",

  proces_verbal: "",

  photos: [],

  observations: "",

  recommandations: "",

  notes_techniques: "",

  signature: "",

  ...overrides,
});

// =====================================================
// MISSIONS PAR DÉFAUT
// =====================================================

export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Relevé terrain Akwa",
    zone: "Douala — Akwa",
    status: "en_cours",

    admin: {
      superficie: "1 200 m²",
      date: "06/06/2026",
      notaire: "Me. Élise Nkolo",
      proprietaire: "Armand Tabi",
      coordonnees: "4.0511° N, 9.7085° E",
      description:
        "Relevé GPS complet de la parcelle avec délimitation des bornes.",
      referenceTerrain: "TF-DLA-001-2026",
    },

    technical: makeTechnical(),
  },

  {
    id: 2,
    title: "Bornage Bonapriso",
    zone: "Douala — Bonapriso",
    status: "assignée",

    admin: {
      superficie: "800 m²",
      date: "10/06/2026",
      notaire: "Me. Paul Essomba",
      proprietaire: "Cécile Manga",
      coordonnees: "4.0200° N, 9.6950° E",
      description:
        "Pose de bornes physiques et production du plan cadastral.",
      referenceTerrain: "TF-DLA-002-2026",
    },

    technical: makeTechnical(),
  },

  {
    id: 3,
    title: "Plan topographique Bali",
    zone: "Douala — Bali",
    status: "terminée",

    certificat: "CERT-003-2026.pdf",

    admin: {
      superficie: "2 500 m²",
      date: "02/06/2026",
      notaire: "Me. Yvonne Bell",
      proprietaire: "Roger Ekwalla",
      coordonnees: "4.0650° N, 9.7200° E",
      description:
        "Plan topographique complet livré. Bornage certifié conforme.",
      referenceTerrain: "TF-DLA-003-2026",
    },

    technical: makeTechnical({
      nb_bornes: 6,
      surface_calculee: "2 487 m²",
      ecart_titre: "-0.5%",
      fichier_gps: "releve_bali_20260602.gpx",
      rapport: "rapport_bali_2026.pdf",
      notes_techniques:
        "Terrain conforme au titre foncier.",
    }),
  },

  {
    id: 4,
    title: "Délimitation Ngaoundéré",
    zone: "Ngaoundéré — Centre",
    status: "terminée",

    certificat: "CERT-004-2026.pdf",

    admin: {
      superficie: "3 100 m²",
      date: "25/05/2026",
      notaire: "Me. Adama Bello",
      proprietaire: "Ibrahim Hamadou",
      coordonnees: "7.3167° N, 13.5833° E",
      description:
        "Délimitation d'un grand terrain agricole. Rapport transmis.",
      referenceTerrain: "TF-NGD-001-2026",
    },

    technical: makeTechnical({
      nb_bornes: 8,
      surface_calculee: "3 112 m²",
      ecart_titre: "+0.4%",
      fichier_gps: "releve_ngaoundere_20260525.gpx",
      rapport: "rapport_ngaoundere_2026.pdf",
      notes_techniques:
        "Léger écart dû à l'érosion en bordure nord.",
    }),
  },

  {
    id: 5,
    title: "Bornage Bafoussam",
    zone: "Bafoussam — Ouest",
    status: "assignée",

    admin: {
      superficie: "1 800 m²",
      date: "12/06/2026",
      notaire: "Me. Henri Feudjio",
      proprietaire: "Martine Kenfack",
      coordonnees: "5.4767° N, 10.4192° E",
      description:
        "Bornage en zone périurbaine. Litige de voisinage à documenter.",
      referenceTerrain: "TF-BFS-001-2026",
    },

    technical: makeTechnical(),
  },
];

export const MISSIONS = DEFAULT_MISSIONS;