import React, { useState } from 'react';
import { 
  Building2, Star, ShieldCheck, ArrowLeft, Send, Plus, Minus
} from 'lucide-react';
import { type Terrain } from './Home';
import './pages.css';

interface PurchaseProps {
  terrain: Terrain;
  onBack: () => void;
  onSubmitSuccess: (notaryName: string) => void;
}

export default function Purchase({ terrain, onBack, onSubmitSuccess }: PurchaseProps) {
  const [selectedNotaire, setSelectedNotaire] = useState<{ id: string | null; name: string; fee: number }>({ id: null, name: '', fee: 0 });
  const [customFormOpen, setCustomFormOpen] = useState<boolean>(false);
  const [customNotaryName, setCustomNotaryName] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const fmt = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';

  const notairesPartenaires = [
    { id: 'n1', name: 'Me Mireille Dubois', detail: 'Cabinet Littoral · Douala', rating: '4.9 (127 dossiers)', fee: 40000, initial: 'MD' },
    { id: 'n2', name: 'Me Jean-Paul Nkodo', detail: 'Cabinet Centre · Yaoundé', rating: '4.7 (89 dossiers)', fee: 35000, initial: 'JN' },
    { id: 'n3', name: 'Me Awa Bello', detail: 'Cabinet Ouest · Bafoussam', rating: '4.8 (62 dossiers)', fee: 32000, initial: 'AB' },
  ];

  const handleSelectNotaire = (n: typeof notairesPartenaires[0]) => {
    setSelectedNotaire({ id: n.id, name: n.name, fee: n.fee });
    setCustomFormOpen(false);
    setError(false);
  };

  const handleToggleCustomForm = () => {
    setCustomFormOpen(!customFormOpen);
    if (!customFormOpen) {
      setSelectedNotaire({ id: 'custom', name: customNotaryName || 'Notaire Personnel', fee: 30000 });
    } else {
      setSelectedNotaire({ id: null, name: '', fee: 0 });
    }
    setError(false);
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCustomNotaryName(name);
    setSelectedNotaire((prev) => ({ ...prev, name: name || 'Notaire Personnel' }));
  };

  const handleSubmit = () => {
    if (!selectedNotaire.name) {
      setError(true);
      return;
    }
    onSubmitSuccess(selectedNotaire.name);
  };

  return (
    <div className="page-container" style={{ maxWidth: '780px' }}>
      
      <button onClick={onBack} className="btn btn-airbnb btn-airbnb-details" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
        <ArrowLeft className="w-4 h-4" /> Revenir au terrain
      </button>

      <div className="details-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <Building2 className="w-6 h-6 text-emerald-700" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Choix du cabinet de notaire</h2>
        </div>
        
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Sélectionnez un notaire pour lancer officiellement l'examen de votre acte d'achat pour la parcelle <strong>{terrain.refCode}</strong>.
        </p>

        {/* Notaires agrées disponibles */}
        <span className="form-group-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Notaires partenaires MBOALAND</span>
        <div className="purchase-notary-grid">
          {notairesPartenaires.map((n) => (
            <div 
              key={n.id}
              onClick={() => handleSelectNotaire(n)}
              className={`notary-card-row ${selectedNotaire.id === n.id ? 'active' : ''}`}
            >
              <div className="notary-avatar">{n.initial}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{n.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', margin: '0.15rem 0' }}>{n.detail}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>
                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" /> {n.rating}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>
                  {fmt(n.fee)}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', display: 'block', marginTop: '0.2rem' }}>
                  Frais d'acte
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire d'ajout d'un notaire personnel */}
        <div style={{ marginTop: '1.5rem' }}>
          <button 
            onClick={handleToggleCustomForm} 
            className="btn btn-airbnb btn-airbnb-details" 
            style={{ width: '100%', borderStyle: 'dashed', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {customFormOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {customFormOpen ? 'Annuler l\'ajout de mon notaire' : 'Désigner mon propre notaire personnel'}
          </button>

          {customFormOpen && (
            <div className="custom-notary-form-panel animate-fade-in">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Formulaire de désignation</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', margin: 0 }}>
                Saisissez les coordonnées de votre notaire. Le dossier cadastral de la parcelle {terrain.refCode} lui sera envoyé par e-mail.
              </p>

              <div className="custom-form-grid">
                <div>
                  <label className="form-group-label">Nom Complet du Notaire</label>
                  <input 
                    type="text" 
                    placeholder="Me Prénom Nom" 
                    className="form-group-input" 
                    value={customNotaryName}
                    onChange={handleCustomNameChange}
                  />
                </div>
                <div>
                  <label className="form-group-label">N° Inscription Chambre des Notaires</label>
                  <input type="text" placeholder="NOT-2024-XXXX" className="form-group-input" />
                </div>
                <div>
                  <label className="form-group-label">Téléphone</label>
                  <input type="tel" placeholder="+237 6XX XXX XXX" className="form-group-input" />
                </div>
                <div>
                  <label className="form-group-label">E-mail professionnel</label>
                  <input type="email" placeholder="notaire@etude.cm" className="form-group-input" />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: '#b91c1c', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Veuillez sélectionner un notaire partenaire ou remplir les informations de votre notaire personnel.
          </div>
        )}

        {/* CORRECTION ICI : "justify" remplacé par "justifyContent" */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Processus d'acquisition certifié par l'ONIGE & la Chambre Notariale</span>
          </div>
          <button 
            onClick={handleSubmit}
            className="btn btn-airbnb btn-airbnb-buy" 
            style={{ width: 'auto', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Envoyer le dossier <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}