import React, { useState } from 'react';
import { 
  Search, MapPin, Globe, Shield, PhoneCall, Plus, X, UploadCloud
} from 'lucide-react';
import './pages.css';

export interface Terrain {
  id: string;
  title: string;
  refCode: string;
  city: string;
  region: 'Yaoundé' | 'Douala' | 'Mbankomo' | 'Bafoussam';
  area: string;
  price: string;
  priceVal: number;
  landTitle: string;
  owner: string;
  gps: string;
  desc: string;
  certified: boolean;
  image: string;
  type: 'residentiel' | 'agricole' | 'commercial' | 'industriel';
}

const INITIAL_TERRAINS: Terrain[] = [
  {
    id: 'odza',
    title: 'Superbe parcelle plane résidentielle',
    refCode: 'TER-2024-0015',
    city: 'Yaoundé (Odza)',
    region: 'Yaoundé',
    area: '1 000 m²',
    price: '15 000 000 FCFA',
    priceVal: 15000000,
    landTitle: 'TF-1532/CM/CEN',
    owner: 'Jean Dupont',
    gps: '3.8842° N, 11.5243° E',
    desc: 'Idéalement située dans la zone résidentielle d\'Odza, cette parcelle plane bénéficie d\'une excellente accessibilité. Parfait pour un projet de villa familiale.',
    certified: true,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    type: 'residentiel'
  },
  {
    id: 'mbankomo',
    title: 'Vaste domaine idéal projet agricole',
    refCode: 'TER-2024-0012',
    city: 'Mbankomo',
    region: 'Mbankomo',
    area: '5 000 m²',
    price: '8 000 000 FCFA',
    priceVal: 8000000,
    landTitle: 'TF-0987/CM/CEN',
    owner: 'Sylvestre Atangana',
    gps: '3.6612° N, 11.3954° E',
    desc: 'Terre agricole très fertile, avec accès direct par piste praticable. Idéal pour verger ou culture vivrière.',
    certified: true,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    type: 'agricole'
  },
  {
    id: 'bonamoussadi',
    title: 'Parcelle commerciale de premier choix',
    refCode: 'TER-2024-0002',
    city: 'Douala (Bonamoussadi)',
    region: 'Douala',
    area: '450 m²',
    price: '18 000 000 FCFA',
    priceVal: 18000000,
    landTitle: 'TF-0341/CM/LIT',
    owner: 'Chantal Ngo',
    gps: '4.0511° N, 9.7679° E',
    desc: 'Emplacement stratégique de premier choix en bordure de route goudronnée. Parfait pour immeuble de rapport ou commerces.',
    certified: false,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    type: 'commercial'
  },
  {
    id: 'bafoussam',
    title: 'Terrain panoramique des hauts plateaux',
    refCode: 'TER-2024-0005',
    city: 'Bafoussam',
    region: 'Bafoussam',
    area: '3 000 m²',
    price: '6 000 000 FCFA',
    priceVal: 6000000,
    landTitle: 'TF-2241/CM/OUE',
    owner: 'Emmanuel Kamga',
    gps: '5.4767° N, 10.4187° E',
    desc: 'Situé sur les hauteurs de Bafoussam, ce terrain offre un climat frais et une vue imprenable sur la région.',
    certified: true,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    type: 'industriel'
  }
];

interface HomeProps {
  onViewDetails: (terrain: Terrain) => void;
  onBuy: (terrain: Terrain) => void;
}

export default function Home({ onViewDetails, onBuy }: HomeProps) {
  // Liste des terrains gérée par un état pour pouvoir en rajouter en temps réel
  const [terrains, setTerrains] = useState<Terrain[]>(INITIAL_TERRAINS);

  // États pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // États pour le formulaire de publication de terrain (vendeur)
  const [publishModalOpen, setPublishModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCity, setNewCity] = useState<string>('');
  const [newArea, setNewArea] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newLandTitle, setNewLandTitle] = useState<string>('');
  const [newOwner, setNewOwner] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newType, setNewType] = useState<'residentiel' | 'agricole' | 'commercial' | 'industriel'>('residentiel');

  // FILTRAGE : Un seul input qui vérifie SIMULTANÉMENT : le Nom (title), la Ville (city) et le Titre Foncier (landTitle)
  const filteredTerrains = terrains.filter((t) => {
    const query = searchQuery.toLowerCase();
    const matchesUnifiedSearch = 
      t.title.toLowerCase().includes(query) ||
      t.city.toLowerCase().includes(query) ||
      t.landTitle.toLowerCase().includes(query);

    const matchesCity = 
      selectedCity === null || 
      t.region === selectedCity;

    const matchesCategory = 
      selectedCategory === 'all' || 
      t.type === selectedCategory;

    return matchesUnifiedSearch && matchesCity && matchesCategory;
  });

  const cityFilteredTerrains = terrains.filter(
    (t) => t.region === selectedCity
  );

  // Fonction d'ajout d'une parcelle (vendeur)
  const handlePublishTerrain = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle || !newCity || !newPrice || !newLandTitle || !newOwner) {
      alert("Veuillez renseigner tous les champs obligatoires (*) pour publier.");
      return;
    }

    // Association de la ville de saisie à une région clé pour le tri
    const detectRegion = (city: string): 'Yaoundé' | 'Douala' | 'Mbankomo' | 'Bafoussam' => {
      const val = city.toLowerCase();
      if (val.includes('douala')) return 'Douala';
      if (val.includes('mbankomo')) return 'Mbankomo';
      if (val.includes('bafoussam')) return 'Bafoussam';
      return 'Yaoundé';
    };

    // Attribution d'une image réaliste selon la catégorie
    const getCategoryImage = (cat: string) => {
      if (cat === 'agricole') return 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
      if (cat === 'commercial') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
      if (cat === 'industriel') return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
      return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80';
    };

    const numericPrice = parseInt(newPrice.replace(/\s/g, '')) || 1000000;

    const newTerrain: Terrain = {
      id: 'custom-' + Date.now(),
      title: newTitle,
      refCode: 'TER-2026-' + Math.floor(1000 + Math.random() * 9000),
      city: newCity,
      region: detectRegion(newCity),
      area: newArea || '500 m²',
      price: numericPrice.toLocaleString('fr-FR') + ' FCFA',
      priceVal: numericPrice,
      landTitle: newLandTitle,
      owner: newOwner,
      gps: '3.' + Math.floor(1000 + Math.random() * 9000) + '° N, 11.' + Math.floor(1000 + Math.random() * 9000) + '° E',
      desc: newDesc || 'Aucune description additionnelle fournie par le propriétaire.',
      certified: false, // Nouveau terrain : pas encore certifié
      image: getCategoryImage(newType),
      type: newType
    };

    // Insertion au début de la liste
    setTerrains([newTerrain, ...terrains]);
    setPublishModalOpen(false);

    // Réinitialisation des champs du formulaire
    setNewTitle('');
    setNewCity('');
    setNewArea('');
    setNewPrice('');
    setNewLandTitle('');
    setNewOwner('');
    setNewDesc('');
    setNewType('residentiel');
  };

  const CITIES_LIST = [
    { id: 'Yaoundé', name: 'Yaoundé', flag: '🇨🇲', count: 'Yaoundé & environs', image: 'https://images.unsplash.com/photo-1598977123418-45f04b616a0e?auto=format&fit=crop&w=400&q=80' },
    { id: 'Douala', name: 'Douala', flag: '🇨🇲', count: 'Littoral', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&q=80' },
    { id: 'Mbankomo', name: 'Mbankomo', flag: '🇨🇲', count: 'Mbankomo rase campagne', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80' },
    { id: 'Bafoussam', name: 'Bafoussam', flag: '🇨🇲', count: 'Ouest plateaux', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  ];

  const INFINITE_CITIES = [...CITIES_LIST, ...CITIES_LIST, ...CITIES_LIST];

  const CATEGORIES = [
    { id: 'all', name: 'Tous les terrains', count: `${terrains.length} terrains`, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80' },
    { id: 'residentiel', name: 'Résidentiel', count: `${terrains.filter(t => t.type === 'residentiel').length} disponible(s)`, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80' },
    { id: 'agricole', name: 'Agricole', count: `${terrains.filter(t => t.type === 'agricole').length} disponible(s)`, image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80' },
    { id: 'commercial', name: 'Commercial', count: `${terrains.filter(t => t.type === 'commercial').length} disponible(s)`, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80' },
    { id: 'industriel', name: 'Industriel', count: `${terrains.filter(t => t.type === 'industriel').length} disponible(s)`, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div>
      <div className="page-container">
        
        {/* ═════════════════ MOTEUR DE RECHERCHE & PUBLICATION ═════════════════ */}
        <div className="hero-search-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ margin: 0 }}>Trouvez votre futur terrain</h1>
              <p style={{ margin: '4px 0 0', color: '#cbd5e1' }}>Recherchez parmi nos parcelles titrées et vérifiées à travers le Cameroun.</p>
            </div>
            
            {/* Bouton d'action Vendeur pour publier son terrain */}
            <button 
              onClick={() => setPublishModalOpen(true)}
              className="btn" 
              style={{ background: '#ffffff', color: 'var(--color-primary-dark)', fontWeight: 800, padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', border: 'none', borderRadius: '8px' }}
            >
              <Plus className="w-4 h-4" /> Publier mon terrain
            </button>
          </div>
          
          {/* MOTEUR DE RECHERCHE : UN UNIQUE INPUT (Nom, Ville, Titre Foncier) */}
          <div className="booking-search-panel" style={{ maxWidth: '640px', margin: '1.5rem 0 0' }}>
            <div className="search-field-group" style={{ borderRight: 'none' }}>
              <Search className="search-field-icon" />
              <input
                type="text"
                placeholder="Saisissez un nom de terrain, une ville, ou un n° de Titre Foncier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ═════════════════ SECTION 1 : RECHERCHER PAR TYPE DE TERRAIN ═════════════════ */}
        <h2 className="section-title">Rechercher par type de terrain</h2>
        <p className="section-subtitle">Filtrez les offres foncières selon l'usage recherché [2].</p>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="category-img-container">
                <img src={cat.image} alt={cat.name} />
              </div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count}</div>
            </div>
          ))}
        </div>

        {/* ═════════════════ GRILLE DES TERRAINS GÉNÉRAUX ═════════════════ */}
        <h2 className="section-title">Nos parcelles recommandées</h2>
        <p className="section-subtitle">
          Découvrez notre sélection de terrains certifiés.
          {selectedCategory !== 'all' && <span> (Filtré par type : <strong>{selectedCategory}</strong>)</span>}
        </p>

        <div className="terrains-grid">
          {filteredTerrains.length > 0 ? (
            filteredTerrains.map((terrain) => (
              <div key={terrain.id} className="terrain-card" onClick={() => onViewDetails(terrain)}>
                <div className="terrain-image-container">
                  <img src={terrain.image} alt={terrain.title} className="terrain-img" />
                  {terrain.certified ? (
                    <div className="badge-certified">✓ Titre Certifié</div>
                  ) : (
                    <div className="badge-certified" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>En attente de certification</div>
                  )}
                </div>
                <div className="terrain-details">
                  <div className="terrain-title-row">
                    <span className="terrain-card-title">{terrain.title}</span>
                  </div>
                  <div className="terrain-meta-line">{terrain.city}</div>
                  <div className="terrain-meta-line">Titre Foncier : {terrain.landTitle}</div>
                  <div className="terrain-meta-line">Vendeur : {terrain.owner} · {terrain.area}</div>
                  <div className="terrain-card-price">{terrain.price}</div>
                </div>
                <div className="terrain-action-buttons" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-airbnb btn-airbnb-details" onClick={() => onViewDetails(terrain)}>
                    Détails
                  </button>
                  <button className="btn-airbnb btn-airbnb-buy" onClick={() => onBuy(terrain)}>
                    Acheter
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#717171', padding: '2.5rem 0', fontSize: '0.9rem' }}>
              Aucune parcelle ne correspond à ces critères de recherche.
            </div>
          )}
        </div>

        {/* ═════════════════ SECTION 2 : DESTINATIONS EN VOGUE (BOUCLE INFINIE) ═════════════════ */}
        <div className="infinite-section">
          <h2 className="section-title">Destinations en vogue au Cameroun</h2>
          <p className="section-subtitle">
            Explorez les opportunités foncières par ville en cliquant sur les cartes défilantes ci-dessous [2].
          </p>

          <div className="infinite-slider">
            <div className="slider-track">
              {INFINITE_CITIES.map((city, idx) => (
                <div 
                  key={idx} 
                  className={`destination-slide-card ${selectedCity === city.id ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city.id)}
                >
                  <img src={city.image} alt={city.name} />
                  <div className="destination-overlay">
                    <div className="destination-name-row">
                      <span className="destination-name">{city.name}</span>
                      <span className="destination-flag">{city.flag}</span>
                    </div>
                    <span className="destination-count">{city.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Affichage des parcelles de la ville sélectionnée */}
          <div className="city-results-area">
            {selectedCity ? (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>
                  Opportunités d'achat à : <span style={{ textDecoration: 'underline' }}>{selectedCity}</span>
                </h3>
                
                <div className="terrains-grid" style={{ marginBottom: 0 }}>
                  {cityFilteredTerrains.map((terrain) => (
                    <div key={terrain.id} className="terrain-card" onClick={() => onViewDetails(terrain)}>
                      <div className="terrain-image-container">
                        <img src={terrain.image} alt={terrain.title} className="terrain-img" />
                        {terrain.certified ? (
                          <div className="badge-certified">✓ Titre Certifié</div>
                        ) : (
                          <div className="badge-certified" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>En attente de certification</div>
                        )}
                      </div>
                      <div className="terrain-details">
                        <div className="terrain-title-row">
                          <span className="terrain-card-title">{terrain.title}</span>
                      </div>
                      <div className="terrain-meta-line">{terrain.city}</div>
                      <div className="terrain-meta-line">Titre Foncier : {terrain.landTitle}</div>
                      <div className="terrain-card-price">{terrain.price}</div>
                    </div>
                    <div className="terrain-action-buttons" onClick={(e) => e.stopPropagation()}>
                      <button className="btn-airbnb btn-airbnb-details" onClick={() => onViewDetails(terrain)}>
                        Détails
                      </button>
                      <button className="btn-airbnb btn-airbnb-buy" onClick={() => onBuy(terrain)}>
                        Acheter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="city-placeholder-text">
              Cliquez sur une destination ci-dessus pour afficher instantanément ses terrains disponibles [2].
            </div>
          )}
        </div>
      </div>

    </div>

    {/* ═════════════════ FOOTER DESIGN ═════════════════ */}
    <footer className="booking-footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4>Acheter un terrain</h4>
          <ul>
            <li><a href="#link">Comment ça marche ?</a></li>
            <li><a href="#link">Sécuriser son cadastre</a></li>
            <li><a href="#link">Frais de notaire</a></li>
            <li><a href="#link">Trouver un géomètre</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>À propos</h4>
          <ul>
            <li><a href="#link">Qui sommes-nous ?</a></li>
            <li><a href="#link">Presse & Partenaires</a></li>
            <li><a href="#link">Charte de confiance</a></li>
            <li><a href="#link">CGU & Conditions</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Assistance</h4>
          <ul>
            <li><a href="#link">Centre d'aide</a></li>
            <li><a href="#link">Contacter un expert</a></li>
            <li><a href="#link">Signaler une annonce</a></li>
            <li><a href="#link">FAQ Cadastre</a></li>
          </ul>
        </div>
        <div className="footer-column" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4>MBOALAND S.A.</h4>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
            <Globe className="w-5 h-5 text-emerald-400" />
            <span>Cameroun · Français</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Achat 100% garanti</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <span>Service Client H24</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Mboaland S.A. Tous droits réservés. Numérisation foncière sécurisée.</span>
        <span style={{ display: 'flex', gap: '1rem' }}>
          <a href="#link" style={{ color: '#64748b', textDecoration: 'none' }}>Confidentialité</a>
          <span>·</span>
          <a href="#link" style={{ color: '#64748b', textDecoration: 'none' }}>Mentions Légales</a>
        </span>
      </div>
    </footer>

    {/* ═════════════════ MODALE VENDEUR : PUBLICATION DE TERRAIN ═════════════════ */}
    {publishModalOpen && (
      <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="modal-content-box" style={{ maxWidth: '580px', overflowY: 'auto', maxHeight: '90vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-primary-dark)' }}>
              Publier un terrain sur MBOALAND
            </h3>
            <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={() => setPublishModalOpen(false)} />
          </div>

          <form onSubmit={handlePublishTerrain} className="custom-form-grid" style={{ margin: 0 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-group-label">Nom de la parcelle / Titre d'annonce *</label>
              <input 
                type="text" 
                placeholder="Ex: Terrain plat prêt à bâtir à Odza" 
                className="form-group-input" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="form-group-label">Ville *</label>
              <input 
                type="text" 
                placeholder="Ex: Yaoundé" 
                className="form-group-input" 
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-group-label">Catégorie d'usage *</label>
              <select 
                className="form-group-input" 
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
              >
                <option value="residentiel">Résidentiel</option>
                <option value="agricole">Agricole (Champs/Vergers)</option>
                <option value="commercial">Commercial (Bureaux/Immeubles)</option>
                <option value="industriel">Industriel (Entrepôts/Usines)</option>
              </select>
            </div>

            <div>
              <label className="form-group-label">N° de Titre Foncier *</label>
              <input 
                type="text" 
                placeholder="Ex: TF-4481/CM/CEN" 
                className="form-group-input" 
                value={newLandTitle}
                onChange={(e) => setNewLandTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-group-label">Prix demandé (FCFA) *</label>
              <input 
                type="text" 
                placeholder="Ex: 8000000" 
                className="form-group-input" 
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-group-label">Superficie (m²)</label>
              <input 
                type="text" 
                placeholder="Ex: 1 200 m²" 
                className="form-group-input" 
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
              />
            </div>

            <div>
              <label className="form-group-label">Nom complet du propriétaire *</label>
              <input 
                type="text" 
                placeholder="Ex: Jean Dupont" 
                className="form-group-input" 
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                required
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-group-label">Description du terrain</label>
              <textarea 
                placeholder="Décrivez l'accès, l'environnement, la viabilisation..." 
                className="form-group-input" 
                rows={3} 
                style={{ resize: 'vertical' }}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            {/* Téléversement de la copie de Titre Foncier */}
            <div style={{ gridColumn: 'span 2' }}>
              <span className="form-group-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Copie conforme du Titre Foncier (PDF, Optionnel)
              </span>
              <div style={{ border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Parcourir ou déposer le fichier</span>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <button type="button" className="btn btn-airbnb btn-airbnb-details" onClick={() => setPublishModalOpen(false)}>
                Annuler
              </button>
              <button type="submit" className="btn btn-airbnb btn-airbnb-buy">
                Publier l'annonce de vente
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

  </div>
  );
}