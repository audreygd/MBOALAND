export type MissionStatus =
  | "assignée"
  | "en_cours"
  | "en_attente_validation"
  | "terminée";

export interface MissionTechnicalData {
  nb_bornes: number;
  surface_calculee: string;
  ecart_titre: string;
  fichier_gps: string;
  rapport: string;
  notes_techniques: string;
  superficieMesuree?: string;
  perimetre?: string;
  coordonneesGPS?: string;
  nombreBornes?: number;
  observations?: string;
}

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

export interface Mission {
  id: number;
  title: string;
  zone: string;
  status: MissionStatus;
  admin: MissionAdmin;
  technical: MissionTechnicalData;
  coordonnees?: string;
  date?: string;
  superficie?: string;
  notaire?: string;
  vendeur?: string;
  description?: string;
  nb_bornes?: number;
  surface_calculee?: string;
  ecart_titre?: string;
  fichier_gps?: string;
  certificat?: string;
  dateDepot?: string;
  dateValidation?: string;
}

const makeTechnical = (overrides: Partial<MissionTechnicalData> = {}): MissionTechnicalData => ({
  nb_bornes: 0,
  surface_calculee: "",
  ecart_titre: "",
  fichier_gps: "",
  rapport: "",
  notes_techniques: "",
  ...overrides,
});

export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: 1, title: "Relevé terrain Akwa", zone: "Douala — Akwa", status: "en_cours",
    coordonnees: "4.0511° N, 9.7085° E", date: "06/06/2026", superficie: "1 200 m²",
    notaire: "Me. Élise Nkolo", vendeur: "Armand Tabi",
    description: "Relevé GPS complet de la parcelle avec délimitation des bornes.",
    admin: { superficie: "1 200 m²", date: "06/06/2026", notaire: "Me. Élise Nkolo",
      proprietaire: "Armand Tabi", coordonnees: "4.0511° N, 9.7085° E",
      description: "Relevé GPS complet de la parcelle avec délimitation des bornes.",
      referenceTerrain: "TF-DLA-001-2026" },
    technical: makeTechnical(),
  },
  {
    id: 2, title: "Bornage Bonapriso", zone: "Douala — Bonapriso", status: "assignée",
    coordonnees: "4.0200° N, 9.6950° E", date: "10/06/2026", superficie: "800 m²",
    notaire: "Me. Paul Essomba", vendeur: "Cécile Manga",
    description: "Pose de bornes physiques et production du plan cadastral.",
    admin: { superficie: "800 m²", date: "10/06/2026", notaire: "Me. Paul Essomba",
      proprietaire: "Cécile Manga", coordonnees: "4.0200° N, 9.6950° E",
      description: "Pose de bornes physiques et production du plan cadastral.",
      referenceTerrain: "TF-DLA-002-2026" },
    technical: makeTechnical(),
  },
  {
    id: 3, title: "Plan topographique Bali", zone: "Douala — Bali", status: "terminée",
    coordonnees: "4.0650° N, 9.7200° E", date: "02/06/2026", superficie: "2 500 m²",
    notaire: "Me. Yvonne Bell", vendeur: "Roger Ekwalla",
    description: "Plan topographique complet livré. Bornage certifié conforme.",
    nb_bornes: 6, surface_calculee: "2 487 m²", ecart_titre: "-0.5%",
    fichier_gps: "releve_bali_20260602.gpx", certificat: "CERT-003-2026.pdf",
    admin: { superficie: "2 500 m²", date: "02/06/2026", notaire: "Me. Yvonne Bell",
      proprietaire: "Roger Ekwalla", coordonnees: "4.0650° N, 9.7200° E",
      description: "Plan topographique complet livré. Bornage certifié conforme.",
      referenceTerrain: "TF-DLA-003-2026" },
    technical: makeTechnical({ nb_bornes: 6, surface_calculee: "2 487 m²",
      ecart_titre: "-0.5%", fichier_gps: "releve_bali_20260602.gpx",
      rapport: "rapport_bali_2026.pdf", notes_techniques: "Terrain conforme au titre foncier." }),
  },
  {
    id: 4, title: "Délimitation Ngaoundéré", zone: "Ngaoundéré — Centre", status: "terminée",
    coordonnees: "7.3167° N, 13.5833° E", date: "25/05/2026", superficie: "3 100 m²",
    notaire: "Me. Adama Bello", vendeur: "Ibrahim Hamadou",
    description: "Délimitation d'un grand terrain agricole. Rapport transmis.",
    nb_bornes: 8, surface_calculee: "3 112 m²", ecart_titre: "+0.4%",
    fichier_gps: "releve_ngaoundere_20260525.gpx", certificat: "CERT-004-2026.pdf",
    admin: { superficie: "3 100 m²", date: "25/05/2026", notaire: "Me. Adama Bello",
      proprietaire: "Ibrahim Hamadou", coordonnees: "7.3167° N, 13.5833° E",
      description: "Délimitation d'un grand terrain agricole. Rapport transmis.",
      referenceTerrain: "TF-NGD-001-2026" },
    technical: makeTechnical({ nb_bornes: 8, surface_calculee: "3 112 m²",
      ecart_titre: "+0.4%", fichier_gps: "releve_ngaoundere_20260525.gpx",
      rapport: "rapport_ngaoundere_2026.pdf", notes_techniques: "Léger écart dû à l'érosion en bordure nord." }),
  },
  {
    id: 5, title: "Bornage Bafoussam", zone: "Bafoussam — Ouest", status: "assignée",
    coordonnees: "5.4767° N, 10.4192° E", date: "12/06/2026", superficie: "1 800 m²",
    notaire: "Me. Henri Feudjio", vendeur: "Martine Kenfack",
    description: "Bornage en zone périurbaine. Litige de voisinage à documenter.",
    admin: { superficie: "1 800 m²", date: "12/06/2026", notaire: "Me. Henri Feudjio",
      proprietaire: "Martine Kenfack", coordonnees: "5.4767° N, 10.4192° E",
      description: "Bornage en zone périurbaine. Litige de voisinage à documenter.",
      referenceTerrain: "TF-BFS-001-2026" },
    technical: makeTechnical(),
  },
];

export const MISSIONS = DEFAULT_MISSIONS;