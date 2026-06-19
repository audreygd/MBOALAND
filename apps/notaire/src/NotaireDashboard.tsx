import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Mail, Bell, Search, Filter, 
  Download, Check, Clock, X, MessageSquare, FileText, 
  Send, QrCode, Printer, CheckCircle, FileCheck, CreditCard,
  AlertTriangle, ShieldAlert
} from 'lucide-react';
import './NotaireDashboard.css';

// Interface typée d'une affaire/mission notariale [1]
interface Dossier {
  id: string;
  refCode: string;
  buyerName: string;
  buyerPhone: string;
  terrainName: string;
  city: string;
  area: string;
  landTitle: string;
  amount: string;
  gps: string;
  step: 3 | 4 | 5; // 3: Vérification acte, 4: Paiement, 5: Prêt pour signature
  statusLabel: string;
  dateInput: string;
  hasProof: boolean;
  rejectionReason?: string; // AJOUTÉ : Justification légale du rejet [1]
  rejectedDate?: string;     // AJOUTÉ : Date effective de l'annulation [1]
}

// Interface pour le chat de la messagerie
interface ChatMessage {
  sender: 'notary' | 'buyer';
  text: string;
  time: string;
}

export default function NotaireDashboard() {
  // Navigation incluant le nouvel onglet d'historique de rejets [1]
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'documents' | 'certificates' | 'disputes'>('overview');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stepFilter, setStepFilter] = useState<string>('all');
  const [selectedDossierId, setSelectedDossierId] = useState<string>('DOS-2024-0015');

  // Modale d'édition et production du certificat de vente
  const [certificateModalOpen, setCertificateModalOpen] = useState<boolean>(false);
  const [certificateGenerated, setCertificateGenerated] = useState<boolean>(false);

  // Modale pour motiver juridiquement le rejet d'un dossier [1]
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [targetRejectId, setTargetRejectId] = useState<string | null>(null);

  // Base des dossiers du cabinet notariale (Avec un cas historique simulé de rejet) [1]
  const [dossiers, setDossiers] = useState<Dossier[]>([
    {
      id: 'DOS-2024-0015',
      refCode: 'TER-2024-0015',
      buyerName: 'Jean Dupont',
      buyerPhone: '+237 695 12 34 56',
      terrainName: 'Superbe parcelle plane résidentielle d\'Odza',
      city: 'Odza, Yaoundé · Centre',
      area: '1 000 m²',
      landTitle: 'TF-1532/CM/CEN',
      amount: '15 230 000 FCFA',
      gps: '3.8842° N, 11.5243° E',
      step: 3, 
      statusLabel: 'Analyse d\'authenticité',
      dateInput: '12 Mai 2024',
      hasProof: false
    },
    {
      id: 'DOS-2024-0014',
      refCode: 'TER-2024-0012',
      buyerName: 'Martin Kamga',
      buyerPhone: '+237 677 44 22 11',
      terrainName: 'Terrain à Kribi en bord de mer',
      city: 'Kribi · Sud',
      area: '2 000 m²',
      landTitle: 'TF-0987/CM/CEN',
      amount: '22 120 000 FCFA',
      gps: '2.9372° N, 9.9079° E',
      step: 4, 
      statusLabel: 'Paiement à valider',
      dateInput: '08 Mai 2024',
      hasProof: true 
    },
    {
      id: 'DOS-2024-0012',
      refCode: 'TER-2024-0010',
      buyerName: 'Patricia Abega',
      buyerPhone: '+237 681 23 45 67',
      terrainName: 'Terrain urbain à Bonapriso',
      city: 'Bonapriso, Douala · Littoral',
      area: '450 m²',
      landTitle: 'TF-0341/CM/LIT',
      amount: '18 150 000 FCFA',
      gps: '4.0321° N, 9.6912° E',
      step: 5, 
      statusLabel: 'Prêt pour signature',
      dateInput: '02 Mai 2024',
      hasProof: true
    },
    /* AJOUTÉ : CAS HISTORIQUE DE REJET AVEC MOTIF DU NOTAIRE [1] */
    {
      id: 'DOS-2024-0008',
      refCode: 'TER-2024-0002',
      buyerName: 'Lucie Mefire',
      buyerPhone: '+237 672 33 22 11',
      terrainName: 'Parcelle d\'angle de Bonamoussadi',
      city: 'Bonamoussadi, Douala · Littoral',
      area: '450 m²',
      landTitle: 'TF-0341/CM/LIT',
      amount: '18 150 000 FCFA',
      gps: '4.0511° N, 9.7679° E',
      step: 3,
      statusLabel: 'Rejeté (Litige / Non-conforme)',
      dateInput: '28 Avr. 2024',
      hasProof: false,
      rejectionReason: 'Double vente détectée sur le cadastre d\'État. Un compromis de vente antérieur est toujours en cours d\'enregistrement pour cette même parcelle [1].',
      rejectedDate: '30 Avr. 2024'
    }
  ]);

  // Messagerie : Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'buyer', text: "Bonjour Maître, j'ai désigné votre cabinet pour mon dossier d'achat à Odza. Pouvez-vous vérifier l'authenticité de mon titre foncier ?", time: '14:10' }
  ]);
  const [writtenMessage, setWrittenMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (!writtenMessage.trim()) return;
    const notaryMsg: ChatMessage = { sender: 'notary', text: writtenMessage, time: 'À l\'instant' };
    setChatMessages(prev => [...prev, notaryMsg]);
    setWrittenMessage('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'buyer', text: "Entendu, merci pour votre réactivité Maître ! J'attends votre feu vert pour faire le virement de l'acompte séquestre.", time: 'À l\'instant' }
      ]);
    }, 1500);
  };

  const activeDossier = dossiers.find(d => d.id === selectedDossierId) || dossiers[0];

  // Filtrage des affaires actives (Exclut les dossiers rejetés pour garder l'onglet Overview propre) [1]
  const filteredDossiers = dossiers.filter(d => {
    if (d.statusLabel.includes('Rejeté')) return false; // N'affiche pas les rejets ici [1]

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      d.id.toLowerCase().includes(query) ||
      d.buyerName.toLowerCase().includes(query) ||
      d.terrainName.toLowerCase().includes(query) ||
      d.landTitle.toLowerCase().includes(query);

    const matchesStep = stepFilter === 'all' || d.step.toString() === stepFilter;
    return matchesSearch && matchesStep;
  });

  // Filtrage exclusif des dossiers rejetés [1]
  const rejectedDossiersHistory = dossiers.filter(d => d.statusLabel.includes('Rejeté'));

  // Validation cadastrale conforme
  const handleApproveDeed = (dossierId: string) => {
    setDossiers(prev => prev.map(d => {
      if (d.id === dossierId) {
        return {
          ...d,
          step: 4,
          statusLabel: 'En attente paiement séquestre'
        };
      }
      return d;
    }));
  };

  // AJOUTÉ : OUVERTURE DE LA MODALE DE SAISIE DE MOTIF DE REJET [1]
  const handleOpenRejectModal = (dossierId: string) => {
    setTargetRejectId(dossierId);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  // ENREGISTREMENT ET VALIDATION DU REJET MOTIVÉ [1]
  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      alert("Veuillez saisir un motif juridique pour formaliser le rejet.");
      return;
    }

    setDossiers(prev => prev.map(d => {
      if (d.id === targetRejectId) {
        return {
          ...d,
          statusLabel: 'Rejeté (Litige / Non-conforme)',
          rejectionReason: rejectionReason, /* Stockage du motif [1] */
          rejectedDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return d;
    }));

    setRejectModalOpen(false);
    setTargetRejectId(null);
    setRejectionReason('');
  };

  const handleApprovePayment = (dossierId: string) => {
    setDossiers(prev => prev.map(d => {
      if (d.id === dossierId) {
        return {
          ...d,
          step: 5,
          statusLabel: 'Prêt pour signature'
        };
      }
      return d;
    }));
  };

  const handlePrintDeed = () => {
    window.print();
  };

  return (
    <div className="notary-layout">
      
      {/* 1. BARRE LATÉRALE DE GAUCHE (STYLE OFFICIEL CABINET NOTARIAL) */}
      <aside className="notary-sidebar">
        <div className="notary-logo-box">
          <span className="notary-logo-text">MBOA<span style={{ color: '#0f172a' }}>LAND</span></span>
          <p style={{ fontSize: '0.65rem', color: 'var(--notary-primary)', fontWeight: 700, margin: '2px 0 0' }}>
            Cabinet Notarial Assermenté
          </p>
        </div>

        <nav>
          <ul className="notary-menu-list">
            <li 
              className={`notary-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Building2 className="w-4 h-4" /> Dossiers &amp; Missions
            </li>
            
            {/* NOUVEL ONGLET : HISTORIQUE DES REJETS / LITIGES FONCIERS [1] */}
            <li 
              className={`notary-menu-item ${activeTab === 'disputes' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('disputes');
                setSelectedDossierId('DOS-2024-0008'); // Pré-sélection du cas historique
              }}
            >
              <ShieldAlert className="w-4 h-4" /> Historique Rejets [1]
            </li>

            <li 
              className={`notary-menu-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4" /> Messagerie <span className="badge-count-notary">1</span>
            </li>
            <li 
              className={`notary-menu-item ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <FileText className="w-4 h-4" /> Pièces Reçues
            </li>
            <li 
              className={`notary-menu-item ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <ShieldCheck className="w-4 h-4" /> Actes de Vente
            </li>
          </ul>
        </nav>

        <div className="db-help-card-sidebar" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e2f2ec 100%)', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', marginTop: 'auto' }}>
          <h5 style={{ fontWeight: 700, margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Chambre des Notaires</h5>
          <p style={{ fontSize: '0.7rem', color: 'var(--notary-text-light)', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
            Espace sécurisé et conforme à la législation foncière en vigueur au Cameroun.
          </p>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE DE TRAVAIL */}
      <main className="notary-main-content">
        
        {/* Entête supérieur */}
        <header className="notary-top-header">
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Étude de Me Mireille Dubois</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', margin: '2px 0 0' }}>
              Numérisation notariale : validation d'actes, certification cadastrale, et séquestres.
            </p>
          </div>

          <div className="notary-header-profile">
            <div style={{ position: 'relative', cursor: 'pointer', padding: '0.25rem' }}>
              <Bell className="w-5 h-5 text-slate-500" />
            </div>
            <Mail className="w-5 h-5 text-slate-500" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('chat')} />
            <div style={{ height: '24px', width: '1px', backgroundColor: '#e2e8f0', margin: '0 0.25rem' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Me Mireille Dubois</span>
            <div className="notary-avatar placeholder" style={{ backgroundColor: 'var(--notary-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', width: '36px', height: '36px', borderRadius: '50%' }}>
              MD
            </div>
          </div>
        </header>

        <div className="notary-inner-container">

          {/* ================= Onglet 1 : GESTION DES DOSSIERS / MISSIONS ================= */}
          {activeTab === 'overview' && (
            <div>
              {/* Graphes et jauges */}
              <div className="notary-chart-card">
                <div className="notary-chart-header">
                  <div>
                    <h3 className="notary-chart-title">Rendement de l'Étude</h3>
                    <span className="notary-chart-subtitle">Actes officiels certifiés sur 7 jours</span>
                  </div>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>+12% d'actes signés</span>
                </div>

                <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                  <svg viewBox="0 0 700 180" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="notaryChartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d5e45" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0d5e45" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>
                    <line x1="40" y1="160" x2="660" y2="160" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="115" x2="660" y2="115" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="60" x2="660" y2="60" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="20" x2="660" y2="20" stroke="#f1f5f9" strokeWidth={1} />
                    <text x="15" y="164" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">0</text>
                    <text x="15" y="119" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">2</text>
                    <text x="15" y="64" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">5</text>
                    <text x="15" y="24" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">7</text>
                    <path d="M 60,115 L 160,64 L 260,116 L 360,60 L 460,30 L 560,94 L 660,20 L 660,160 L 60,160 Z" fill="url(#notaryChartGradient)" />
                    <path d="M 60,115 L 160,64 L 260,116 L 360,60 L 460,30 L 560,94 L 660,20" fill="none" stroke="#0d5e45" strokeWidth={3} strokeLinecap="round" />
                    <circle cx="60" cy="115" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="160" cy="64" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="260" cy="116" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="360" cy="60" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="460" cy="30" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="560" cy="94" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="660" cy="20" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <text x="52" y="178" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J1</text>
                    <text x="152" y="178" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J2</text>
                    <text x="252" y="178" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J3</text>
                    <text x="352" y="178" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J4</text>
                    <text x="452" y="178" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J5</text>
                    <text x="552" y="178" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J6</text>
                    <text x="652" y="178" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J7</text>
                  </svg>
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', borderTop: '1px solid var(--notary-border)', paddingTop: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div className="progress-row-label">
                      <span>Dossiers approuvés (Conformes)</span>
                      <span style={{ color: 'var(--notary-primary)' }}>85%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ marginBottom: 0 }}>
                      <div className="progress-bar-fill" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div className="progress-row-label">
                      <span>Dossiers rejetés (Litiges identifiés)</span>
                      <span style={{ color: 'var(--notary-danger)' }}>15%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ marginBottom: 0 }}>
                      <div className="progress-bar-fill red" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ligne des statistiques */}
              <div className="notary-stats-grid">
                <div className="notary-stat-card">
                  <div className="notary-stat-icon-wrapper blue"><Clock className="w-5 h-5" /></div>
                  <div><div className="notary-stat-value">{dossiers.filter(d => d.step === 3 && !d.statusLabel.includes('Rejeté')).length}</div><div className="notary-stat-label">À authentifier</div></div>
                </div>
                <div className="notary-stat-card">
                  <div className="notary-stat-icon-wrapper amber"><CreditCard className="w-5 h-5" /></div>
                  <div><div className="notary-stat-value">{dossiers.filter(d => d.step === 4).length}</div><div className="notary-stat-label">Séquestres en cours</div></div>
                </div>
                <div className="notary-stat-card">
                  <div className="notary-stat-icon-wrapper green"><Check className="w-5 h-5" /></div>
                  <div><div className="notary-stat-value">{dossiers.filter(d => d.step === 5).length}</div><div className="notary-stat-label">Prêts à signer</div></div>
                </div>
                <div className="notary-stat-card">
                  <div className="notary-stat-icon-wrapper rose"><ShieldCheck className="w-5 h-5" /></div>
                  <div><div className="notary-stat-value">{dossiers.filter(d => !d.statusLabel.includes('Rejeté')).length}</div><div className="notary-stat-label">Affaires actives</div></div>
                </div>
              </div>

              {/* Contenu principal : Table des affaires + Action à droite */}
              <div className="notary-grid-content">
                
                <div className="notary-card-box">
                  <div className="notary-filters-bar">
                    <input 
                      type="text" 
                      placeholder="Filtrer par acquéreur, n° titre, affaire..." 
                      className="notary-search-input" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select className="notary-select" value={stepFilter} onChange={(e) => setStepFilter(e.target.value)}>
                      <option value="all">Toutes les étapes</option>
                      <option value="3">Vérification de titre</option>
                      <option value="4">Attente de versement</option>
                      <option value="5">Prêt à finaliser</option>
                    </select>
                  </div>

                  <table className="notary-table">
                    <thead>
                      <tr>
                        <th>Affaire ID</th>
                        <th>Acquéreur</th>
                        <th>Parcelle d'achat</th>
                        <th>Montant</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDossiers.length > 0 ? (
                        filteredDossiers.map((d) => (
                          <tr 
                            key={d.id} 
                            className={`notary-row-clickable ${selectedDossierId === d.id ? 'active' : ''}`}
                            onClick={() => setSelectedDossierId(d.id)}
                          >
                            <td>
                              <strong style={{ display: 'block' }}>{d.id}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--notary-text-light)' }}>Reçu le {d.dateInput}</span>
                            </td>
                            <td>
                              <strong style={{ display: 'block' }}>{d.buyerName}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--notary-text-light)' }}>{d.buyerPhone}</span>
                            </td>
                            <td>
                              <strong style={{ display: 'block' }}>{d.terrainName}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--notary-text-light)' }}>{d.city}</span>
                            </td>
                            <td><strong>{d.amount}</strong></td>
                            <td>
                              {d.step === 3 ? (
                                <span className="notary-badge pending">Authentification</span>
                              ) : d.step === 4 ? (
                                <span className="notary-badge pending" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>À payer</span>
                              ) : (
                                <span className="notary-badge success">Prêt à signer</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Aucun dossier en cours.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Tiroir d'action */}
                <div className="notary-drawer">
                  <div className="notary-drawer-header">
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Action administrative</h3>
                    <span className="notary-badge progress" style={{ fontSize: '0.68rem' }}>{activeDossier.id}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                    <div>Acquéreur : <strong>{activeDossier.buyerName}</strong></div>
                    <div>Titre foncier : <strong>{activeDossier.landTitle}</strong></div>
                    <div>Valeur d'acquisition : <strong>{activeDossier.amount}</strong></div>
                    <div>Coordonnées : <strong>{activeDossier.gps}</strong></div>
                    <div>Étape actuelle : <strong style={{ color: 'var(--notary-primary)' }}>Étape {activeDossier.step} / 5</strong></div>
                  </div>

                  {activeDossier.step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', lineHeight: 1.4, margin: 0 }}>
                        Vérifiez le titre cadastral fourni. Vous pouvez valider l'affaire ou rejeter le dossier en cas de litige foncier [1].
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleApproveDeed(activeDossier.id)} className="btn-notary btn-notary-primary" style={{ flex: 1 }}>
                          <FileCheck className="w-4 h-4" /> Approuver
                        </button>
                        <button onClick={() => handleOpenRejectModal(activeDossier.id)} className="btn-notary btn-notary-danger" style={{ flex: 1 }}>
                          <AlertTriangle className="w-4 h-4" /> Refuser (Litige)
                        </button>
                      </div>
                    </div>
                  )}

                  {activeDossier.step === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', lineHeight: 1.4, margin: 0 }}>
                        {activeDossier.hasProof ? 'Une preuve de versement d\'acompte a été soumise par l\'acheteur.' : 'L\'acheteur n\'a pas encore versé les fonds sur le compte de l\'étude.'}
                      </p>
                      {activeDossier.hasProof ? (
                        <button onClick={() => handleApprovePayment(activeDossier.id)} className="btn-notary btn-notary-primary animate-pulse">
                          <CheckCircle className="w-4 h-4" /> Valider le versement séquestre
                        </button>
                      ) : (
                        <button className="btn-notary btn-notary-outline" style={{ cursor: 'not-allowed', color: '#94a3b8' }} disabled>En attente du virement</button>
                      )}
                    </div>
                  )}

                  {activeDossier.step === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', lineHeight: 1.4, margin: 0 }}>
                        L'authenticité et le paiement séquestre ont été validés. Vous pouvez générer l'acte de vente officiel avec signature et QR Code de certification.
                      </p>
                      <button onClick={() => { setCertificateGenerated(false); setCertificateModalOpen(true); }} className="btn-notary btn-notary-primary">
                        <QrCode className="w-4 h-4" /> Produire l'Acte de Vente (QR Code)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= NOUVEAU ONGLET : HISTORIQUE DES DOSSIERS REJETÉS / LITIGES [1] ================= */}
          {activeTab === 'disputes' && (
            <div className="notary-grid-content">
              {/* Table des rejets */}
              <div className="notary-card-box" style={{ margin: 0 }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800 }}>Dossiers annulés ou suspectés de fraude</h3>
                <table className="notary-table">
                  <thead>
                    <tr><th>Affaire ID</th><th>Acquéreur</th><th>Titre Foncier</th><th>Date d'annulation</th></tr>
                  </thead>
                  <tbody>
                    {rejectedDossiersHistory.map((d) => (
                      <tr 
                        key={d.id} 
                        className={`notary-row-clickable ${selectedDossierId === d.id ? 'active' : ''}`}
                        onClick={() => setSelectedDossierId(d.id)}
                      >
                        <td><strong>{d.id}</strong></td>
                        <td><strong>{d.buyerName}</strong></td>
                        <td><code style={{ fontWeight: 'bold' }}>{d.landTitle}</code></td>
                        <td><span className="notary-badge danger" style={{ fontSize: '0.7rem' }}>{d.rejectedDate || 'Récemment'}</span></td>
                      </tr>
                    ))}
                    {rejectedDossiersHistory.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Aucun litige recensé dans l'historique de l'étude.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Volet droit : Motif légal du rejet */}
                {activeDossier && activeDossier.statusLabel.includes('Rejeté') && (
                <div className="notary-drawer">
                  <div className="notary-drawer-header">
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Dossier litigieux</h3>
                    <span className="notary-badge danger" style={{ fontSize: '0.68rem' }}>BLOQUÉ</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                    <div>Acquéreur : <strong>{activeDossier.buyerName}</strong></div>
                    <div>Titre foncier : <strong>{activeDossier.landTitle}</strong></div>
                    <div>Localisation : <strong>{activeDossier.city}</strong></div>
                    <div>Valeur d'acquisition : <strong>{activeDossier.amount}</strong></div>
                  </div>

                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--notary-danger)', margin: '0 0 0.5rem' }}>Motif légal du rejet [1]</h4>
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: 'var(--notary-danger)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.5, fontWeight: 500 }}>
                    <AlertTriangle className="w-5 h-5" style={{ marginBottom: '0.4rem' }} />
                    {activeDossier.rejectionReason || 'Aucune explication légale saisie.'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= Onglet 2 : MESSAGERIE ================= */}
          {activeTab === 'chat' && (
            <div className="notary-chat-layout">
              <div className="notary-chat-sidebar">
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--notary-border)' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Discussions Actives</h4>
                </div>
                <div className="notary-chat-contact-row active">
                  <div className="notary-chat-avatar">JD</div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>{activeDossier.buyerName}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--notary-text-light)' }}>Dossier {activeDossier.id}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--notary-border)', backgroundColor: '#ffffff' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{activeDossier.buyerName} (Acquéreur)</h4>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} /> En ligne
                  </span>
                </div>

                <div className="notary-chat-messages">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`notary-chat-bubble-wrapper ${msg.sender === 'notary' ? 'user' : 'other'}`}>
                      <div className="notary-chat-bubble-text">{msg.text}</div>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem' }}>{msg.time}</span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--notary-border)', display: 'flex', gap: '0.75rem', backgroundColor: '#ffffff' }}>
                  <input type="text" placeholder="Écrire un message d'étude à l'acquéreur..." className="notary-search-input" value={writtenMessage} onChange={(e) => setWrittenMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} />
                  <button className="btn-notary btn-notary-primary" style={{ width: 'auto', padding: '0.65rem 1.5rem' }} onClick={handleSendMessage}>
                    Envoyer <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= Onglet 3 : PIÈCES REÇUES ================= */}
          {activeTab === 'documents' && (
            <div className="notary-doc-grid">
              <div className="notary-doc-card">
                <div className="notary-doc-icon-box"><FileText className="w-6 h-6" /></div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>Copie_Titre_Foncier_{activeDossier.landTitle}.pdf</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', marginTop: '0.15rem' }}>Analyse cadastrale · 2.4 Mo</p>
                </div>
                <button className="btn-notary btn-notary-outline"><Download className="w-4 h-4" /> Télécharger pour examen</button>
              </div>

              <div className="notary-doc-card">
                <div className="notary-doc-icon-box"><FileText className="w-6 h-6" /></div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>Plan_Cadastral_Contradictoire.pdf</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', marginTop: '0.15rem' }}>PV Géomètre ONIGE · 1.8 Mo</p>
                </div>
                <button className="btn-notary btn-notary-outline"><Download className="w-4 h-4" /> Télécharger pour examen</button>
              </div>

              <div className="notary-doc-card">
                <div className={`notary-doc-icon-box ${activeDossier.hasProof ? 'success' : ''}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>Justificatif_Virement_Sequestre.pdf</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', marginTop: '0.15rem' }}>
                    {activeDossier.hasProof ? 'Reçu bancaire soumis · 840 Ko' : 'En attente de soumission par l\'acheteur'}
                  </p>
                </div>
                {activeDossier.hasProof ? (
                  <button className="btn-notary btn-notary-primary"><Check className="w-4 h-4" /> Visualiser le virement</button>
                ) : (
                  <button className="btn-notary btn-notary-outline" style={{ cursor: 'not-allowed', color: '#94a3b8' }} disabled>Non disponible</button>
                )}
              </div>
            </div>
          )}

          {/* ================= Onglet 4 : CERTIFICATS PRODUITS ET ARCHIVÉS ================= */}
          {activeTab === 'certificates' && (
            <div className="notary-doc-grid">
              {dossiers.filter(d => d.step === 5 && !d.statusLabel.includes('Rejeté')).map((d) => (
                <div key={d.id} className="notary-doc-card" style={{ borderColor: 'var(--notary-primary)' }}>
                  <div className="notary-doc-icon-box success"><ShieldCheck className="w-6 h-6" /></div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>Acte de Mutation : {d.buyerName}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--notary-text-light)', marginTop: '0.15rem' }}>Titre foncier {d.landTitle} · Signé</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedDossierId(d.id);
                      setCertificateGenerated(true);
                      setCertificateModalOpen(true);
                    }}
                    className="btn-notary btn-notary-primary"
                  >
                    <QrCode className="w-4 h-4" /> Visualiser l'Acte et QR Code
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* ═════════════════ MODALE DE SAISIE DU MOTIF DU REJET (NOUVEAU) [1] ═════════════════ */}
      {rejectModalOpen && (
        <div className="notary-modal-overlay">
          <div className="notary-modal-content-box animate-scale-up" style={{ backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '460px', padding: '1.5rem', border: '1px solid #fca5a5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--notary-danger)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <AlertTriangle className="w-5 h-5" /> Justifier le rejet du dossier [1]
              </h3>
              <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={() => { setRejectModalOpen(false); setTargetRejectId(null); }} />
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--notary-text-light)', lineHeight: 1.4, marginBottom: '1rem' }}>
              Veuillez spécifier le motif légal et formel de l'annulation de l'affaire <strong>{targetRejectId}</strong>. L'acquéreur en sera immédiatement notifié pour l'arbitrage d'État [1].
            </p>

            <textarea 
              placeholder="Ex : Falsification constatée sur la signature du propriétaire du titre foncier d'origine..." 
              className="form-group-input" 
              rows={3} 
              style={{ width: '100%', resize: 'vertical', fontSize: '0.85rem', padding: '0.65rem' }}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button className="btn-notary btn-notary-outline" style={{ flex: 1 }} onClick={() => { setRejectModalOpen(false); setTargetRejectId(null); }}>Annuler</button>
              <button className="btn-notary btn-notary-danger" style={{ flex: 1, backgroundColor: 'var(--notary-danger)', color: 'white' }} onClick={handleConfirmRejection}>Confirmer le rejet motivé [1]</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DU CERTIFICAT DE VENTE */}
      {certificateModalOpen && (
        <div className="notary-modal-overlay">
          <div className="notary-modal-box">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--notary-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Production de l'Acte de mutation</h3>
              <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={() => setCertificateModalOpen(false)} />
            </div>

            <div className="official-deed-paper" id="printable-deed">
              <div className="official-deed-header">
                <h2>République du Cameroun</h2>
                <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontStyle: 'italic', margin: '0.2rem 0' }}>Paix - Travail - Patrie</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Cabinet d'Études Notariales de Me Dubois</p>
              </div>

              <h1 className="official-deed-title">Certificat de Mutation Foncière</h1>

              <p style={{ fontSize: '0.85rem', textIndent: '1.5rem', textAlign: 'justify', marginBottom: '1rem' }}>
                Par la présente, nous, <strong>Me Mireille Dubois</strong>, notaire assermenté inscrit au Barreau du Cameroun, certifions l'authentification et l'enregistrement de l'acte de vente immobilière pour l'affaire sous la référence d'acquisition <strong>{activeDossier.id}</strong>.
              </p>

              <div style={{ fontSize: '0.8rem', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <div style={{ marginBottom: '0.4rem' }}>👤 <strong>Acquéreur :</strong> {activeDossier.buyerName}</div>
                <div style={{ marginBottom: '0.4rem' }}>📍 <strong>Parcelle de terrain :</strong> {activeDossier.terrainName} ({activeDossier.city})</div>
                <div style={{ marginBottom: '0.4rem' }}>📁 <strong>Titre foncier cadastral n° :</strong> {activeDossier.landTitle}</div>
                <div style={{ marginBottom: '0.4rem' }}>🗺️ <strong>Coordonnées GPS certifiées :</strong> {activeDossier.gps}</div>
                <div>💰 <strong>Montant séquestre déposé :</strong> {activeDossier.amount}</div>
              </div>

              <p style={{ fontSize: '0.82rem', textAlign: 'justify', marginBottom: '1.5rem' }}>
                Le versement séquestre de l'acompte ayant été dument validé et consigné en l'étude notariale de Yaoundé, la mutation définitive du titre foncier au registre domanial est déclarée recevable.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', fontSize: '0.78rem' }}>
                  <p style={{ margin: 0 }}><strong>Sceau et Signature</strong></p>
                  <p style={{ fontStyle: 'italic', margin: '2rem 0 0', textDecoration: 'underline' }}>Me Mireille Dubois</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div className="deed-qr-code-box">
                    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="6" height="6" rx="1" />
                      <rect x="4" y="4" width="2" height="2" />
                      <rect x="16" y="2" width="6" height="6" rx="1" />
                      <rect x="18" y="4" width="2" height="2" />
                      <rect x="2" y="16" width="6" height="6" rx="1" />
                      <rect x="4" y="18" width="2" height="2" />
                      <path d="M10 2h2v2h-2zM12 6h2v2h-2zM10 10h4v2h-4zM2 10h2v2H2zM6 12h2v2H6zM10 16h2v2h-2zM14 18h2v2h-2zM18 10h4v2h-4zM20 14h2v2h-2zM16 16h2v2h-2zM10 20h2v2h-2z" fill="#000" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.62rem', color: '#1a202c', fontFamily: 'monospace', fontWeight: 'bold' }}>SCANNEZ POUR VÉRIFIER</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--notary-border)', paddingTop: '1.25rem' }}>
              <button className="btn-notary btn-notary-outline" style={{ width: 'auto' }} onClick={() => setCertificateModalOpen(false)}>Fermer</button>
              
              {!certificateGenerated && activeDossier.step === 5 ? (
                <button 
                  onClick={() => {
                    setCertificateGenerated(true);
                    alert("Acte de mutation validé, signé et enregistré dans la blockchain MBOALAND !");
                  }} 
                  className="btn-notary btn-notary-primary" 
                  style={{ width: 'auto', marginLeft: 'auto' }}
                >
                  <FileCheck className="w-4 h-4" /> Signer et certifier l'Acte de mutation
                </button>
              ) : (
                <button 
                  onClick={handlePrintDeed}
                  className="btn-notary btn-notary-primary animate-pulse" 
                  style={{ width: 'auto', marginLeft: 'auto' }}
                >
                  <Printer className="w-4 h-4" /> Imprimer le document officiel
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}