import React from 'react';
import { 
  ArrowLeft, Compass, FileText, CheckCircle2, Download, ShieldCheck
} from 'lucide-react';
import { type Terrain } from './Home';
import './pages.css';

interface DetailsProps {
  terrain: Terrain;
  onBack: () => void;
  onBuy: (terrain: Terrain) => void;
}

export default function Details({ terrain, onBack, onBuy }: DetailsProps) {
  
  // Fonction utilitaire pour nettoyer les coordonnées et générer l'URL Google Maps Satellite [1]
  const getGoogleMapsEmbedUrl = (gpsString: string) => {
    // Nettoie les lettres N, E, S, W et les degrés pour obtenir un format pur (ex: "3.8842,11.5243") [1]
    const cleanGps = gpsString
      .replace(/°\s*N/gi, '')
      .replace(/°\s*E/gi, '')
      .replace(/°\s*S/gi, '-')
      .replace(/°\s*O/gi, '-')
      .replace(/°\s*W/gi, '-')
      .trim();

    // q = coordonnées, t = k (Satellite), z = 16 (Zoom) [1]
    return `https://maps.google.com/maps?q=${encodeURIComponent(cleanGps)}&t=k&z=17&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="page-container">
      
      {/* Entête avec bouton retour */}
      <div className="details-back-header">
        <button onClick={onBack} className="btn btn-airbnb btn-airbnb-details" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <ArrowLeft className="w-4 h-4" /> Retour aux parcelles
        </button>
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
          {terrain.landTitle}
        </span>
      </div>

      {/* Grille principale */}
      <div className="details-grid">
        
        {/* Colonne Gauche : Contenu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Galerie d'images style Booking */}
          <div className="details-gallery">
            <img src={terrain.image} alt={terrain.title} className="details-main-img" />
            <div className="details-thumb-column">
              <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80" alt="Vue satellite" className="details-thumb-img" />
              <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80" alt="Cadre environnant" className="details-thumb-img" />
            </div>
          </div>

          {/* Section d'informations */}
          <div className="details-box">
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              {terrain.title}
            </h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {terrain.city} · Cameroun
            </p>
            
            <h3 className="details-box-title">Description du terrain</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
              {terrain.desc}
            </p>
          </div>

          {/* Section Cadastre & Géolocalisation (INTÉGRATION GOOGLE MAPS SATELLITE DIRECTE) [1] */}
          <div className="details-box">
            <h3 className="details-box-title">Localisation Google Maps (Vue Satellite) [1]</h3>
            
            <div className="map-simulation-box" style={{ marginBottom: '1rem', height: '300px' }}>
              {/* Carte Google Maps dynamique et interactive [1] */}
              <iframe
                title="Google Maps Cadastre"
                src={getGoogleMapsEmbedUrl(terrain.gps)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span>Coordonnées GPS réelles : <strong>{terrain.gps}</strong></span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Compass className="w-4 h-4" /> Position vérifiée par GPS différentiel
              </span>
            </div>
          </div>

          {/* Section Copie du Titre Foncier */}
          <div className="details-box">
            <h3 className="details-box-title">Documents administratifs</h3>
            <div className="title-document-box">
              <FileText className="w-8 h-8 text-rose-700" />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Copie conforme du Titre Foncier</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: '0.2rem 0 0' }}>
                  Document PDF officiel · {terrain.landTitle}
                </p>
              </div>
              <button className="btn btn-airbnb btn-airbnb-details" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', width: 'auto' }}>
                <Download className="w-4 h-4" /> Télécharger
              </button>
            </div>
          </div>

        </div>

        {/* Colonne Droite : Achat */}
        <div className="booking-sidebar-card">
          <div className="verified-badge-row">
            <ShieldCheck className="w-4 h-4" /> Parcelle 100% Certifiée
          </div>
          
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            Prix total d'acquisition
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary)', margin: '0.25rem 0 1rem' }}>
            {terrain.price}
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-light)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Superficie cadastrée : {terrain.area}
            </li>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Vendeur vérifié : {terrain.owner}
            </li>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Titre libre d'hypothèque
            </li>
          </ul>

          <button 
            onClick={() => onBuy(terrain)}
            className="btn btn-airbnb btn-airbnb-buy" 
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '10px' }}
          >
            Lancer l'acquisition (Acheter)
          </button>
        </div>

      </div>
    </div>
  );
}