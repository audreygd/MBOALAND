import React, { useState } from 'react';
import { 
  LayoutGrid, MapPin, Building2, Ruler, CreditCard, Upload, 
  ShieldCheck, Mountain, Trees, Building, Clock, ArrowLeft, 
  Plus, Minus, Info, CircleCheck, Eye, Send, RotateCcw,
  Smartphone, CreditCard as CardIcon, Landmark, FileText, Star,
 Search, SlidersHorizontal, Compass, Download, Check, ExternalLink
} from 'lucide-react';

interface Terrain {
  id: string;
  title: string;
  ref: string;
  refCode: string;
  loc: string;
  region: 'Centre' | 'Littoral' | 'Ouest';
  sup: string;
  prix: string;
  prixVal: number;
  tf: string;
  gps: string;
  date: string;
  type: 'mountain' | 'trees' | 'building';
  recap: string;
  certified: boolean;
  image: string;
  desc: string;
}

const TERRAINS_DATA: Record<string, Terrain> = {
  odza: {
    id: 'odza',
    title: 'Superbe parcelle résidentielle à Odza',
    ref: 'Réf. TER-2024-0015 · Certifié par MBOALAND',
    refCode: 'TER-2024-0015',
    loc: 'Odza, Yaoundé',
    region: 'Centre',
    sup: '1 000 m²',
    prix: '15 000 000 FCFA',
    prixVal: 15000000,
    tf: 'TF-1532/CM/CEN',
    gps: '3.8842° N, 11.5243° E',
    date: '12 Mai 2024',
    type: 'mountain',
    recap: 'Terrain à Odza · TER-2024-0015',
    certified: true,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    desc: 'Idéalement située dans la zone résidentielle d\'Odza, cette parcelle plane bénéficie d\'une excellente accessibilité. Parfait pour un projet de villa familiale. Viabilisation eau et électricité à proximité immédiate.'
  },
  mbankomo: {
    id: 'mbankomo',
    title: 'Vaste terrain agricole à Mbankomo',
    ref: 'Réf. TER-2024-0012 · Certifié par MBOALAND',
    refCode: 'TER-2024-0012',
    loc: 'Mbankomo, Yaoundé rase campagne',
    region: 'Centre',
    sup: '5 000 m²',
    prix: '8 000 000 FCFA',
    prixVal: 8000000,
    tf: 'TF-0987/CM/CEN',
    gps: '3.6612° N, 11.3954° E',
    date: '10 Mai 2024',
    type: 'trees',
    recap: 'Terrain à Mbankomo · TER-2024-0012',
    certified: true,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    desc: 'Un domaine spacieux entouré d\'un cadre naturel et paisible à Mbankomo. Idéal pour des cultures de rente, un verger ou un projet éco-touristique. Terre fertile, accès direct via piste carrossable.'
  },
  bafoussam: {
    id: 'bafoussam',
    title: 'Terrain panoramique sur les hauteurs de Bafoussam',
    ref: 'Réf. TER-2024-0005 · Certifié par MBOALAND',
    refCode: 'TER-2024-0005',
    loc: 'Bafoussam',
    region: 'Ouest',
    sup: '3 000 m²',
    prix: '6 000 000 FCFA',
    prixVal: 6000000,
    tf: 'TF-2241/CM/OUE',
    gps: '5.4767° N, 10.4187° E',
    date: '05 Mai 2024',
    type: 'mountain',
    recap: 'Terrain à Bafoussam · TER-2024-0005',
    certified: true,
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
    desc: 'Parcelle offrant une vue imprenable sur la vallée. Atmosphère fraîche caractéristique des hauts plateaux de l\'Ouest. Convivial pour une résidence secondaire ou un projet agro-pastoral.'
  },
  douala: {
    id: 'douala',
    title: 'Parcelle commerciale de premier choix à Douala',
    ref: 'Réf. TER-2024-0002 · En attente de certification',
    refCode: 'TER-2024-0002',
    loc: 'Bonamoussadi, Douala',
    region: 'Littoral',
    sup: '450 m²',
    prix: '18 000 000 FCFA',
    prixVal: 18000000,
    tf: 'TF-0341/CM/LIT',
    gps: '4.0511° N, 9.7679° E',
    date: '28 Avr. 2024',
    type: 'building',
    recap: 'Terrain à Douala · TER-2024-0002',
    certified: false,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    desc: 'Idéal pour bureaux, appartements à haut rendement ou commerce de proximité. Situé dans une rue passante très convoitée. Accès goudronné rapide.'
  }
};

export default function AchatProcessus() {
  // Navigation principale : 'home' (Portail d'accueil) | 'details' (Fiche technique) | 'purchase' (Processus d'achat)
  const [view, setView] = useState<'home' | 'details' | 'purchase'>('home');
  const [step, setStep] = useState<number>(1); // Stepper d'achat (1 à 5)
  
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain>(TERRAINS_DATA.odza);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Toutes');
  
  const [notaire, setNotaire] = useState<{ id: string | null; name: string; fee: number }>({ id: null, name: '', fee: 0 });
  const [customNotaireOpen, setCustomNotaireOpen] = useState<boolean>(false);
  
  const [geometre, setGeometre] = useState<{ id: string | null; name: string; fee: number }>({ id: null, name: '', fee: 0 });
  const [customGeoOpen, setCustomGeoOpen] = useState<boolean>(false);
  
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  
  const [errors, setErrors] = useState({ notaire: false, geometre: false, payment: false, file: false });

  const fmt = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';

  // Filtrage des terrains sur la page d'accueil
  const filteredTerrains = Object.values(TERRAINS_DATA).filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.loc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'Toutes' || t.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleOpenDetails = (t: Terrain) => {
    setSelectedTerrain(t);
    setView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPurchase = () => {
    setView('purchase');
    setStep(1); // Étape 1 : Choix du notaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromNotaire = () => {
    if (!notaire.name) {
      setErrors((prev) => ({ ...prev, notaire: true }));
      return;
    }
    setStep(2); // Étape 2 : Géomètre
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromGeo = () => {
    if (!geometre.name) {
      setErrors((prev) => ({ ...prev, geometre: true }));
      return;
    }
    setStep(3); // Étape 3 : Paiement
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromPay = () => {
    if (!paymentMode) {
      setErrors((prev) => ({ ...prev, payment: true }));
      return;
    }
    setStep(4); // Étape 4 : Preuve de paiement
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitDossier = () => {
    if (!uploadedFile) {
      setErrors((prev) => ({ ...prev, file: true }));
      return;
    }
    setStep(5); // Étape 5 : Succès
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 const handleFileUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: file.size > 1024 * 1024 
          ? (file.size / (1024 * 1024)).toFixed(1) + ' Mo' 
          : (file.size / 1024).toFixed(0) + ' Ko'
      });
      setErrors((prev) => ({ ...prev, file: false }));
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
  };

  const restart = () => {
    setView('home');
    setStep(1);
    setNotaire({ id: null, name: '', fee: 0 });
    setGeometre({ id: null, name: '', fee: 0 });
    setPaymentMode('');
    setUploadedFile(null);
    setCustomNotaireOpen(false);
    setCustomGeoOpen(false);
  };

  const serviceFee = Math.round(selectedTerrain.prixVal * 0.01);
  const totalAmount = selectedTerrain.prixVal + notaire.fee + geometre.fee + serviceFee;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans pb-16">
      
      {/* HEADER DE MARQUE */}
      <header className="navbar bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={restart}>
          <span className="font-black text-xl tracking-tight text-emerald-600 font-serif">
            MBOA<span className="text-emerald-950">LAND</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="badge badge-success gap-1.5 text-[11px] font-semibold py-3 px-3.5 text-emerald-800 bg-emerald-50 border-emerald-100 hidden sm:flex">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Sécurité Garantie
          </div>
          {view === 'purchase' && (
            <div className="badge badge-outline border-slate-200 text-[11px] py-3 px-3 font-semibold text-slate-500 bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              {step < 5 ? `Acquisition : Étape ${step} / 4` : 'Terminé ✓'}
            </div>
          )}
        </div>
      </header>

      {/* ════════════════════════ VUE 1 : PORTAIL D'ACCUEIL DES TERRAINS ════════════════════════ */}
      {view === 'home' && (
        <div className="max-w-6xl mx-auto px-4 mt-8">
          
          {/* Section d'accueil principale (Hero Section) */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold tracking-wider text-[10px] uppercase py-1 px-3 rounded-full border border-emerald-500/30">
                Achat Foncier Numérisé & Certifié
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold font-serif mt-3 mb-4 leading-tight tracking-tight">
                Devenez propriétaire terrien <span className="text-emerald-400">en toute légalité</span>
              </h1>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Mboaland centralise, vérifie et sécurise chaque transaction. Parcourez des terrains certifiés par notre réseau d'experts.
              </p>
            </div>
          </div>

          {/* Filtres & Recherche */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher par lieu, ville..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm input-bordered pl-9 w-full h-11 text-slate-800 rounded-xl"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['Toutes', 'Centre', 'Littoral', 'Ouest'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`btn btn-sm text-xs rounded-xl h-10 px-4 ${
                    selectedRegion === region 
                      ? 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm' 
                      : 'btn-ghost text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {region === 'Toutes' ? 'Toutes les régions' : region}
                </button>
              ))}
            </div>
          </div>

          {/* Grille de terrains */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerrains.length > 0 ? (
              filteredTerrains.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => handleOpenDetails(t)}
                  className="card bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <figure className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={t.image} 
                      alt={t.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    <span className={`absolute top-3 right-3 text-[10px] font-bold py-1 px-2.5 rounded-full shadow-sm text-white ${
                      t.certified ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}>
                      {t.certified ? '✓ Titre Certifié' : 'En certification'}
                    </span>
                    <span className="absolute bottom-3 left-3 text-white font-extrabold text-lg tracking-tight bg-slate-900/40 backdrop-blur-sm py-1 px-3 rounded-lg">
                      {t.prix}
                    </span>
                  </figure>
                  
                  <div className="card-body p-5">
                    <h3 className="font-bold text-sm text-slate-950 line-clamp-2 h-10 group-hover:text-emerald-700 transition-colors">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{t.loc} · {t.region}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-4 pt-3 border-t border-slate-50">
                      <span>Superficie : <strong>{t.sup}</strong></span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        Consulter <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                Aucun terrain ne correspond à votre recherche pour le moment.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════ VUE 2 : PAGE DE DÉTAILS COMPLÈTE DU TERRAIN ════════════════════════ */}
      {view === 'details' && (
        <div className="max-w-5xl mx-auto px-4 mt-6">
          
          {/* Bouton retour */}
          <button onClick={() => setView('home')} className="btn btn-ghost btn-sm text-slate-600 hover:bg-slate-100 gap-1 rounded-xl mb-4 text-xs">
            <ArrowLeft className="w-4 h-4" /> Retour aux annonces
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne Principale : Galerie, description, Geolocation */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Galerie principale */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-white">
                <div className="h-72 md:h-96 relative">
                  <img src={selectedTerrain.image} alt={selectedTerrain.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="badge badge-success bg-emerald-600 border-none text-xs font-bold text-white mb-2 py-2.5">
                      {selectedTerrain.certified ? '✓ Foncier Certifié' : 'En cours d\'analyse'}
                    </span>
                    <h1 className="text-xl md:text-2xl font-black font-serif leading-tight">{selectedTerrain.title}</h1>
                  </div>
                </div>
              </div>

              {/* Fiche technique */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-950 text-base border-b border-slate-100 pb-2">Description de la parcelle</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{selectedTerrain.desc}</p>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { label: 'Identifiant Parcelle', value: selectedTerrain.refCode },
                    { label: 'Superficie certifiée', value: selectedTerrain.sup },
                    { label: 'Titre Foncier d\'origine', value: selectedTerrain.tf },
                    { label: 'Mise en ligne', value: selectedTerrain.date },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{item.label}</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualisation de la Géolocalisation (Simulée) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-600" /> Géolocalisation
                  </h3>
                  <span className="text-xs text-emerald-600 font-semibold font-mono bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    {selectedTerrain.gps}
                  </span>
                </div>

                {/* Mockup de carte interactive */}
                <div className="relative h-60 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  {/* Trame de carte simplifiée en CSS */}
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70 bg-slate-50" />
                  
                  {/* Tracé simulé d'une parcelle cadastrale */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-dashed border-emerald-500 bg-emerald-500/10 w-40 h-40 rounded-lg flex items-center justify-center relative animate-pulse">
                      <div className="w-3.5 h-3.5 bg-emerald-600 rounded-full border-2 border-white shadow-md flex items-center justify-center relative">
                        <span className="absolute w-6 h-6 rounded-full bg-emerald-500/30 animate-ping" />
                      </div>
                      <span className="absolute bottom-2 right-2 text-[9px] font-bold text-emerald-800 font-mono">CADASTRE OK</span>
                    </div>
                  </div>

                  {/* Contrôles de carte fictifs */}
                  <div className="absolute bottom-3 left-3 bg-white border border-slate-200 py-1 px-2 rounded-lg shadow-sm text-[9px] font-bold text-slate-600">
                    Échelle : 1 / 500
                  </div>
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <button className="btn btn-xs bg-white text-slate-800 border-slate-200 hover:bg-slate-100 py-1 h-auto min-h-0 text-[10px] rounded-md font-semibold">
                      Satellite
                    </button>
                    <button className="btn btn-xs bg-emerald-600 text-white border-none hover:bg-emerald-700 py-1 h-auto min-h-0 text-[10px] rounded-md font-semibold">
                      Plan
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span>Coordonnées certifiées par procès-verbal de bornage contradictoire.</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedTerrain.gps}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-ghost btn-xs text-emerald-700 font-bold hover:bg-emerald-50"
                  >
                    Ouvrir dans Maps
                  </a>
                </div>
              </div>

            </div>

            {/* Colonne Latérale : Synthèse, Documents vérifiés et Action d'Achat */}
            <div className="space-y-6">
              
              {/* Carte d'action d'achat */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md space-y-4 ring-1 ring-emerald-500/15">
                <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider block">Valeur de la parcelle</span>
                <div className="text-2xl font-black text-slate-950 font-serif leading-none">{selectedTerrain.prix}</div>
                <div className="text-[11px] text-slate-500 mt-1">Garantie de remboursement de séquestre incluse de base.</div>
                
                <button 
                  onClick={handleStartPurchase}
                  className="btn btn-block btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none font-extrabold py-3.5 h-auto text-sm shadow-md rounded-xl"
                >
                  Acquérir ce terrain
                </button>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Mutation administrative assistée sous 15 jours</span>
                </div>
              </div>

              {/* État des vérifications */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-950 text-sm border-b border-slate-100 pb-2">Documents vérifiés</h4>
                <div className="space-y-3">
                  {[
                    { doc: 'Titre Foncier original', desc: 'Validé en base domaniale' },
                    { doc: 'Identité du Propriétaire', desc: 'Conformité CNI & procuration' },
                    { doc: 'Certificat d\'urbanisme', desc: 'Non frappé d\'utilité publique' },
                    { doc: 'Bornage cadastral', desc: 'Géolocalisation vérifiée sur site' }
                  ].map((check, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 leading-none">{check.doc}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">{check.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Propriétaire */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 text-xs">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Propriétaire vendeur</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
                    JD
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Jean Dupont</h5>
                    <p className="text-[10px] text-slate-400">Compte certifié Mboaland</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════ VUE 3 : PROCESSUS DE TRANSACTION (STEPPER) ════════════════════════ */}
      {view === 'purchase' && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          
          {/* STEP 1 : CHOIX DU NOTAIRE */}
          {step === 1 && (
            <div className="card bg-white border border-slate-100 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-4">
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Désignez votre notaire</h2>
                    <p className="text-xs text-slate-500">Un officier assermenté rédigera l'acte de vente et authentifiera la mutation foncière</p>
                  </div>
                </div>

                <div className="alert alert-success bg-emerald-50 border-emerald-100 text-emerald-800 text-xs rounded-xl mb-4 gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Le notaire désigné conservera les fonds en compte d'étude (séquestre) jusqu'à validation de la transaction.</span>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Notaires partenaires agréés</span>

                <div className="space-y-2">
                  {[
                    { id: 'n1', name: 'Me Mireille Dubois', detail: 'Cabinet Littoral · Douala', rating: '4.9 (127 dossiers)', fee: 40000, initial: 'MD' },
                    { id: 'n2', name: 'Me Jean-Paul Nkodo', detail: 'Cabinet Centre · Yaoundé', rating: '4.7 (89 dossiers)', fee: 35000, initial: 'JN' },
                    { id: 'n3', name: 'Me Awa Bello', detail: 'Cabinet Ouest · Bafoussam', rating: '4.8 (62 dossiers)', fee: 32000, initial: 'AB' },
                  ].map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setNotaire({ id: n.id, name: n.name, fee: n.fee });
                        setErrors((prev) => ({ ...prev, notaire: false }));
                      }}
                      className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                        notaire.id === n.id ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                      }`}
                    >
                      <div className="avatar placeholder">
                        <div className="bg-slate-100 text-slate-600 rounded-full w-10 h-10 font-bold text-sm">
                          {n.initial}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-900">{n.name}</h4>
                        <p className="text-[11px] text-slate-500">{n.detail}</p>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> {n.rating}
                        </div>
                        <span className="badge badge-success text-emerald-800 bg-emerald-100/80 text-[10px] font-bold py-2 border-none mt-2">
                          Tarif d'acte fixé : {fmt(n.fee)}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="notaire"
                        checked={notaire.id === n.id}
                        onChange={() => {}}
                        className="radio radio-primary border-slate-300 checked:bg-emerald-600" 
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button 
                    onClick={() => setCustomNotaireOpen(!customNotaireOpen)} 
                    className="btn btn-outline btn-xs gap-1 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-500 w-full py-3 h-auto"
                  >
                    {customNotaireOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    {customNotaireOpen ? 'Fermer le formulaire' : 'Désigner mon propre notaire personnel'}
                  </button>

                  {customNotaireOpen && (
                    <div className="bg-slate-50 rounded-xl p-4 mt-3 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="col-span-1 sm:col-span-2 text-xs text-slate-500">
                        Votre notaire doit disposer d'une étude en activité au Cameroun pour finaliser l'acquisition.
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Nom du Notaire</span></label>
                        <input 
                          type="text" 
                          placeholder="Me Nom Prénom" 
                          onChange={(e) => setNotaire({ id: 'custom', name: e.target.value, fee: 30000 })}
                          className="input input-bordered input-sm w-full text-slate-800" 
                        />
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">N° d'inscription</span></label>
                        <input type="text" placeholder="NOT-2024-XXX" className="input input-bordered input-sm w-full text-slate-800" />
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Téléphone</span></label>
                        <input type="tel" placeholder="+237 6XX XXX XXX" className="input input-bordered input-sm w-full text-slate-800" />
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Email professionnel</span></label>
                        <input type="email" placeholder="contact@etude-notaire.cm" className="input input-bordered input-sm w-full text-slate-800" />
                      </div>
                    </div>
                  )}
                </div>

                {errors.notaire && (
                  <div className="text-red-600 text-xs font-medium mt-3 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    Veuillez sélectionner ou désigner un notaire pour passer à l'étape suivante.
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                  <button onClick={() => setView('details')} className="btn btn-outline btn-sm border-slate-200 text-slate-600 hover:bg-slate-50 font-medium gap-1">
                    <ArrowLeft className="w-4 h-4" /> Annuler
                  </button>
                  <button onClick={handleNextFromNotaire} className="btn btn-sm btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold">
                    Étape suivante
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 : CHOIX DU GÉOMÈTRE */}
          {step === 2 && (
            <div className="card bg-white border border-slate-100 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-4">
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Désignez votre géomètre</h2>
                    <p className="text-xs text-slate-500">Le géomètre dressera le procès-verbal de bornage de la parcelle pour mutation du titre</p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2 mb-4">
                  <CircleCheck className="w-4 h-4 text-emerald-600" />
                  <span>Notaire désigné : <strong>{notaire.name}</strong></span>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Géomètres partenaires agrées</span>

                <div className="space-y-2">
                  {[
                    { id: 'g1', name: 'Paul Mbarga', detail: 'Cabinet Expert ONIGE · Douala & Littoral', rating: '4.9 (203 bornages)', fee: 50000, initial: 'PM' },
                    { id: 'g2', name: 'Sylvie Fouda', detail: 'Cabinet Expert ONIGE · Yaoundé & Centre', rating: '4.6 (148 bornages)', fee: 45000, initial: 'SF' },
                    { id: 'g3', name: 'Emmanuel Kana', detail: 'Cabinet Expert ONIGE · Ouest', rating: '4.8 (91 bornages)', fee: 42000, initial: 'EK' },
                  ].map((g) => (
                    <div 
                      key={g.id}
                      onClick={() => {
                        setGeometre({ id: g.id, name: g.name, fee: g.fee });
                        setErrors((prev) => ({ ...prev, geometre: false }));
                      }}
                      className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                        geometre.id === g.id ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                      }`}
                    >
                      <div className="avatar placeholder">
                        <div className="bg-slate-100 text-slate-600 rounded-full w-10 h-10 font-bold text-sm">
                          {g.initial}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-900">{g.name}</h4>
                        <p className="text-[11px] text-slate-500">{g.detail}</p>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> {g.rating}
                        </div>
                        <span className="badge badge-success text-emerald-800 bg-emerald-100/80 text-[10px] font-bold py-2 border-none mt-2">
                          Honoraires bornage : {fmt(g.fee)}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="geometre"
                        checked={geometre.id === g.id}
                        onChange={() => {}}
                        className="radio radio-primary border-slate-300 checked:bg-emerald-600" 
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button 
                    onClick={() => setCustomGeoOpen(!customGeoOpen)} 
                    className="btn btn-outline btn-xs gap-1 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-500 w-full py-3 h-auto"
                  >
                    {customGeoOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    {customGeoOpen ? 'Fermer le formulaire' : 'Ajouter mon géomètre expert (Inscrit ONIGE)'}
                  </button>

                  {customGeoOpen && (
                    <div className="bg-slate-50 rounded-xl p-4 mt-3 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="col-span-1 sm:col-span-2 text-xs text-slate-500">
                        Votre géomètre doit impérativement être assermenté et inscrit à l'Ordre National des Géomètres Experts (ONIGE).
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Nom du Géomètre</span></label>
                        <input 
                          type="text" 
                          placeholder="Nom Prénom" 
                          onChange={(e) => setGeometre({ id: 'custom', name: e.target.value, fee: 40000 })}
                          className="input input-bordered input-sm w-full text-slate-800" 
                        />
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">N° d'agrément ONIGE</span></label>
                        <input type="text" placeholder="GEO-2024-XXX" className="input input-bordered input-sm w-full text-slate-800" />
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Téléphone</span></label>
                        <input type="tel" placeholder="+237 6XX XXX XXX" className="input input-bordered input-sm w-full text-slate-800" />
                      </div>
                      <div>
                        <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Email professionnel</span></label>
                        <input type="email" placeholder="geometre@cabinet-expert.cm" className="input input-bordered input-sm w-full text-slate-800" />
                      </div>
                    </div>
                  )}
                </div>

                {errors.geometre && (
                  <div className="text-red-600 text-xs font-medium mt-3 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    Veuillez désigner un géomètre expert agréé pour continuer.
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                  <button onClick={() => setStep(1)} className="btn btn-outline btn-sm border-slate-200 text-slate-600 hover:bg-slate-50 font-medium gap-1">
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </button>
                  <button onClick={handleNextFromGeo} className="btn btn-sm btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold">
                    Étape suivante
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 : RÉCAPITULATIF & CHOIX DU PAIEMENT */}
          {step === 3 && (
            <div className="card bg-white border border-slate-100 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-4">
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Récapitulatif & Règlement</h2>
                    <p className="text-xs text-slate-500">Examinez le décompte global de la transaction foncière avant d'initier le paiement de séquestre</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Synthèse des prestataires</span>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Parcelle foncière :</span>
                    <span className="font-bold text-slate-800">{selectedTerrain.recap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notaire en charge :</span>
                    <span className="font-bold text-slate-800">{notaire.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Géomètre désigné :</span>
                    <span className="font-bold text-slate-800">{geometre.name}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Décompte détaillé</span>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prix d'acquisition du terrain :</span>
                    <span className="font-semibold text-slate-800">{selectedTerrain.prix}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Honoraires notariaux :</span>
                    <span className="font-semibold text-slate-800">{fmt(notaire.fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Honoraires géomètre :</span>
                    <span className="font-semibold text-slate-800">{fmt(geometre.fee)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Frais de service MBOALAND (1%) :</span>
                    <span className="font-semibold text-slate-800">{fmt(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-bold text-sm text-emerald-700">
                    <span>Montant total à régler :</span>
                    <span className="text-base text-emerald-600 font-extrabold">{fmt(totalAmount)}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Sélectionnez votre moyen de paiement</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { id: 'momo', label: 'MTN MoMo', icon: Smartphone },
                    { id: 'om', label: 'Orange Money', icon: Smartphone },
                    { id: 'card', label: 'Carte Bancaire', icon: CardIcon },
                    { id: 'bank', label: 'Virement', icon: Landmark }
                  ].map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setPaymentMode(mode.id);
                          setErrors((prev) => ({ ...prev, payment: false }));
                        }}
                        className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 transition-all ${
                          paymentMode === mode.id 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500/20' 
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-emerald-600" />
                        <span className="text-[10px]">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMode && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-xs">
                    {(paymentMode === 'momo' || paymentMode === 'om') && (
                      <div className="space-y-3">
                        <div>
                          <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Numéro de téléphone Mobile Money</span></label>
                          <input type="tel" placeholder="+237 6XX XXX XXX" className="input input-bordered input-sm w-full text-slate-800" />
                        </div>
                        <div className="text-slate-500">
                          Un push de validation de transaction de <strong>{fmt(totalAmount)}</strong> sera envoyé sur ce téléphone. Saisissez votre code PIN secret pour confirmer.
                        </div>
                      </div>
                    )}

                    {paymentMode === 'card' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Numéro de carte</span></label>
                          <input type="text" placeholder="4000 1234 5678 9010" className="input input-bordered input-sm w-full text-slate-800" />
                        </div>
                        <div>
                          <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Date d'expiration</span></label>
                          <input type="text" placeholder="MM/AA" className="input input-bordered input-sm w-full text-slate-800" />
                        </div>
                        <div>
                          <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Code CVC / CVV</span></label>
                          <input type="text" placeholder="123" className="input input-bordered input-sm w-full text-slate-800" />
                        </div>
                      </div>
                    )}

                    {paymentMode === 'bank' && (
                      <div className="space-y-2">
                        <p className="text-slate-600">Veuillez initier un virement bancaire vers le compte séquestre MBOALAND :</p>
                        <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-[10px] space-y-1 text-slate-700">
                          <div><strong>Bénéficiaire :</strong> MBOALAND S.A.</div>
                          <div><strong>Banque :</strong> UBA Cameroun</div>
                          <div><strong>IBAN :</strong> CM21 0001 0000 1234 5678 9010 11</div>
                          <div><strong>Référence obligatoire :</strong> {selectedTerrain.refCode}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="alert alert-warning bg-amber-50 border-amber-200 text-amber-900 text-xs rounded-xl gap-2 flex items-start">
                  <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Séquestre de confiance MBOALAND :</strong> Vos fonds restent consignés de manière sécurisée et ne seront débloqués en faveur du vendeur qu'à la signature finale de l'acte de vente notarié.</span>
                </div>

                {errors.payment && (
                  <div className="text-red-600 text-xs font-medium mt-3 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    Veuillez spécifier un moyen de paiement afin de procéder.
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                  <button onClick={() => setStep(2)} className="btn btn-outline btn-sm border-slate-200 text-slate-600 hover:bg-slate-50 font-medium gap-1">
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </button>
                  <button onClick={handleNextFromPay} className="btn btn-sm btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold gap-1">
                    Confirmer & Payer <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 : ENREGISTREMENT DE LA PREUVE */}
          {step === 4 && (
            <div className="card bg-white border border-slate-100 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-4">
                  <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Preuve de paiement</h2>
                    <p className="text-xs text-slate-500">Transmettez le justificatif bancaire ou l'avis de transfert pour débloquer l'intervention des experts</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">NOTAIRE EN CHARGE</span>
                    <span className="font-semibold text-slate-800">{notaire.name}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">GÉOMÈTRE EXPERT</span>
                    <span className="font-semibold text-slate-800">{geometre.name}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pièce justificative requise</span>
                
                {!uploadedFile ? (
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-emerald-50/20 hover:border-emerald-400 transition-all rounded-xl p-8 text-center cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                    />
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Déposez votre reçu de paiement ici, ou parcourez</p>
                    <p className="text-[10px] text-slate-400 mt-1">Formats acceptés : PDF, PNG, JPG (Max. 10 Mo)</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs">
                    <CircleCheck className="w-5 h-5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="font-bold text-emerald-800">{uploadedFile.name}</p>
                      <p className="text-slate-500">{uploadedFile.size} · Importé avec succès</p>
                    </div>
                    <button onClick={resetUpload} className="btn btn-ghost btn-xs text-rose-600 underline hover:bg-transparent">
                      Supprimer
                    </button>
                  </div>
                )}

                <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Métadonnées optionnelles</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Date effective du règlement</span></label>
                      <input type="text" placeholder="JJ/MM/AAAA" className="input input-bordered input-sm w-full text-slate-800" />
                    </div>
                    <div>
                      <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">ID de transaction bancaire/opérateur</span></label>
                      <input type="text" placeholder="TXN-2024-XXXX" className="input input-bordered input-sm w-full text-slate-800" />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="label py-1"><span className="label-text text-xs font-bold text-slate-600">Remarques particulières</span></label>
                      <textarea placeholder="Ajoutez un message à destination des équipes d'analyse ou des prestataires." className="textarea textarea-bordered textarea-sm w-full text-slate-800" rows={2} />
                    </div>
                  </div>
                </div>

                {errors.file && (
                  <div className="text-red-600 text-xs font-medium mt-3 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    Merci de joindre la preuve de versement afin d'envoyer la demande.
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                  <button onClick={() => setStep(3)} className="btn btn-outline btn-sm border-slate-200 text-slate-600 hover:bg-slate-50 font-medium gap-1">
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </button>
                  <button onClick={handleSubmitDossier} className="btn btn-sm btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold gap-1">
                    Soumettre le dossier <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 : CONFIRMATION ET TIMELINE */}
          {step === 5 && (
            <div className="card bg-white border border-slate-100 shadow-xl">
              <div className="card-body p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
                  <CircleCheck className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Dossier soumis avec succès !</h2>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Votre ordre d'achat a été transmis aux intervenants. Le notaire ainsi que le géomètre diligentés débuteront l'examen sous 24h.
                </p>

                <div className="bg-slate-100 rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 inline-block my-4">
                  Dossier d'acquisition : ACQ-2024-{Math.floor(1000 + Math.random() * 9000)} · {selectedTerrain.refCode}
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs mb-6">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">NOTAIRE ASSIGNÉ</span>
                    <span className="font-semibold text-slate-800">{notaire.name}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">GÉOMÈTRE ASSIGNÉ</span>
                    <span className="font-semibold text-slate-800">{geometre.name}</span>
                  </div>
                </div>

                <div className="max-w-md mx-auto text-left border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Feuille de route de la vente</h4>
                  
                  {[
                    { title: 'Dossier transmis', desc: 'Aujourd\'hui · Preuve de virement consignée', current: true },
                    { title: 'Vérification de l\'acte', desc: `En attente · Notification envoyée à ${notaire.name}`, pending: true },
                    { title: 'Bornage sur site', desc: `À planifier · Plan contradictoire par ${geometre.name}`, pending: true },
                    { title: 'Signature des parties', desc: 'Étape finale · Signature physique ou électronique sécurisée', pending: true }
                  ].map((step, sIdx) => (
                    <div key={sIdx} className="flex gap-3 relative pb-1">
                      {sIdx < 3 && <div className="absolute top-4 left-2.5 w-[1px] h-full bg-slate-200" />}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                        step.current ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-400'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{step.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => alert("Suivi de dossier disponible bientôt")} 
                    className="btn btn-sm btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold gap-1 w-full sm:w-auto"
                  >
                    <Eye className="w-4 h-4" /> Suivre mon dossier
                  </button>
                  <button 
                    onClick={restart} 
                    className="btn btn-outline btn-sm border-slate-200 text-slate-600 hover:bg-slate-50 font-medium gap-1 w-full sm:w-auto"
                  >
                    <RotateCcw className="w-4 h-4" /> Voir d'autres terrains
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}