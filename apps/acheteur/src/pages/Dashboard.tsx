import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Mail, Bell, Search, Filter, 
  Download, Check, Compass, CreditCard, UploadCloud, X, Clock,
  FileText, MessageSquare, Send, Sparkles, LayoutDashboard
} from 'lucide-react';
import { type Terrain } from './Home';
import './pages.css';

interface DashboardProps {
  terrain: Terrain;
  notaryName: string;
  onRestart: () => void;
}

interface Transaction {
  id: string;
  date: string;
  title: string;
  city: string;
  area: string;
  notary: string;
  amount: string;
  amountVal: number;
  status: 'pending' | 'progress' | 'success' | 'cancelled';
  statusLabel: string;
  step: number;
  gps: string;
  refCode: string;
}

interface Message {
  sender: 'user' | 'other';
  text: string;
  time: string;
}

export default function Dashboard({ terrain, notaryName, onRestart }: DashboardProps) {
  // Onglet actif : 'overview' (Tableau de bord) | 'transactions' | 'offers' | 'documents' | 'chat'
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'offers' | 'documents' | 'chat'>('overview');

  const fmt = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';
  const serviceFee = Math.round(terrain.priceVal * 0.01);
  const totalAmountVal = terrain.priceVal + 35000 + 45000 + serviceFee;

  // Base des transactions de l'acheteur
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TR-2024-0015',
      date: '12 Mai 2024',
      title: terrain.title,
      city: terrain.city,
      area: terrain.area,
      notary: notaryName,
      amount: fmt(totalAmountVal),
      amountVal: totalAmountVal,
      status: 'pending',
      statusLabel: 'Notaire en cours',
      step: 3,
      gps: terrain.gps,
      refCode: terrain.refCode
    },
    {
      id: 'TR-2024-0014',
      date: '08 Mai 2024',
      title: 'Terrain à Kribi',
      city: 'Kribi · Sud',
      area: '2 000 m²',
      notary: 'Me Jean-Paul Nkodo',
      amount: '22 000 000 FCFA',
      amountVal: 22000000,
      status: 'progress',
      statusLabel: 'En attente de paiement',
      step: 4,
      gps: '2.9372° N, 9.9079° E',
      refCode: 'TER-2024-0013'
    },
    {
      id: 'TR-2024-0012',
      date: '02 Mai 2024',
      title: 'Terrain à Yaoundé',
      city: 'Mvan, Yaoundé · Centre',
      area: '800 m²',
      notary: 'Me Mireille Dubois',
      amount: '5 200 000 FCFA',
      amountVal: 5200000,
      status: 'success',
      statusLabel: 'Paiement validé',
      step: 5,
      gps: '3.8211° N, 11.5012° E',
      refCode: 'TER-2024-0010'
    },
    {
      id: 'TR-2024-0010',
      date: '20 Avr. 2024',
      title: 'Terrain à Douala',
      city: 'Bonapriso, Douala · Littoral',
      area: '450 m²',
      notary: 'Me Awa Bello',
      amount: '18 000 000 FCFA',
      amountVal: 18000000,
      status: 'cancelled',
      statusLabel: 'Annulée',
      step: 1,
      gps: '4.0321° N, 9.6912° E',
      refCode: 'TER-2024-0002'
    }
  ]);

  // Liste des offres soumises
  const mockOffers = [
    { id: 'OF-9912', terrain: terrain.title, owner: terrain.owner, price: terrain.price, status: 'Acceptée', date: '12 Mai 2024', color: 'success' },
    { id: 'OF-9877', terrain: 'Terrain à Kribi', owner: 'Bernard Tchamda', price: '21 500 000 FCFA', status: 'Négociation', date: '08 Mai 2024', color: 'progress' },
    { id: 'OF-9511', terrain: 'Terrain à Douala', owner: 'Lucie Mefire', price: '16 500 000 FCFA', status: 'Réfusée', date: '18 Avr. 2024', color: 'cancelled' },
  ];

  // Gestion de la Messagerie de discussion (Chat)
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { sender: 'other', text: `Bonjour Monsieur Dupont, je suis ${notaryName}. J'ai bien reçu votre dossier cadastral pour le terrain à ${terrain.city}. J'analyse le certificat de propriété et je vous tiens informé.`, time: '14:30' }
  ]);
  const [writtenMessage, setWrittenMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (!writtenMessage.trim()) return;

    const userMessage: Message = { sender: 'user', text: writtenMessage, time: 'À l\'instant' };
    setChatMessages(prev => [...prev, userMessage]);
    setWrittenMessage('');

    // Réponse automatique fictive du Notaire sous 1,5s
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'other', text: `Merci pour votre message. J'accuse bonne réception de votre demande. Nos équipes d'étude notariale reviennent vers vous dans les plus brefs délais.`, time: 'À l\'instant' }
      ]);
    }, 1500);
  };

  // États pour la table de transactions
  const [selectedTxId, setSelectedTxId] = useState<string>('TR-2024-0015');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modale de versement d'acompte
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const activeTx = transactions.find(t => t.id === selectedTxId) || transactions[0];
  const paymentDone = activeTx.status === 'success';

  const filteredTransactions = transactions.filter(t => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      t.id.toLowerCase().includes(query) ||
      t.title.toLowerCase().includes(query) ||
      t.city.toLowerCase().includes(query) ||
      t.notary.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calcul des statistiques
  const countInProgress = transactions.filter(t => t.status === 'pending').length;
  const countWaiting = transactions.filter(t => t.status === 'progress').length;
  const countCompleted = transactions.filter(t => t.status === 'success').length;
  const countCancelled = transactions.filter(t => t.status === 'cancelled').length;

  const handleSimulateNotaryApproval = () => {
    setTransactions(prev => prev.map(t => {
      if (t.id === 'TR-2024-0015') {
        return { ...t, status: 'progress', statusLabel: 'En attente de paiement', step: 4 };
      }
      return t;
    }));
    setShowNotification(true);
  };

  const handleFileUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0].name);
    }
  };

  const handleConfirmPayment = () => {
    if (!proofFile) {
      alert("Veuillez téléverser la preuve du versement.");
      return;
    }
    setTransactions(prev => prev.map(t => {
      if (t.id === 'TR-2024-0015') {
        return { ...t, status: 'success', statusLabel: 'Paiement validé', step: 5 };
      }
      return t;
    }));
    setPaymentModalOpen(false);
  };

  return (
    <div className="db-layout">
      
      {/* 1. BARRE LATÉRALE GAUCHE */}
      <aside className="db-sidebar">
        <div className="db-logo-box">
          <span className="db-logo-text">MBOA<span style={{ color: '#0f172a' }}>LAND</span></span>
          <p style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 700, margin: '2px 0 0' }}>
            Espace Acheteur
          </p>
        </div>

        <nav>
          <ul className="db-menu-list">
            <li 
              className={`db-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard className="w-4 h-4" /> Tableau de bord
            </li>
            <li 
              className={`db-menu-item ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              <Sparkles className="w-4 h-4" /> Offres envoyées <span className="badge-count-sidebar">{mockOffers.length}</span>
            </li>
            <li 
              className={`db-menu-item ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <Building2 className="w-4 h-4" /> Transactions
            </li>
            <li 
              className={`db-menu-item ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <FileText className="w-4 h-4" /> Documents
            </li>
            <li 
              className={`db-menu-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4" /> Messagerie <span className="badge-count-sidebar">1</span>
            </li>
          </ul>
        </nav>

        <div className="db-help-card-sidebar">
          <h5 style={{ fontWeight: 700, margin: '0 0 0.25rem' }}>Aide MBOALAND</h5>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
            Un conseiller vous répond en direct pour tout blocage foncier.
          </p>
          <button className="btn btn-airbnb btn-airbnb-buy" style={{ fontSize: '0.75rem', padding: '0.45rem' }}>
            Contacter le support
          </button>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE DE CONTENU */}
      <main className="db-main-content">
        
        {/* Entête commune */}
        <header className="db-top-header">
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {activeTab === 'overview' && "Vue d'ensemble de vos parcelles"}
              {activeTab === 'offers' && "Vos offres d'acquisition soumises"}
              {activeTab === 'transactions' && "Suivi de vos transactions foncières"}
              {activeTab === 'documents' && "Coffre-fort de documents sécurisé"}
              {activeTab === 'chat' && "Messagerie d'études notariales"}
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: '2px 0 0' }}>
              Suivez l'avancement de toutes vos procédures d'acquisition sous séquestre d'État.
            </p>
          </div>

          <div className="db-header-user-badge">
            {/* Bouton de simulation */}
            {transactions.find(t => t.id === 'TR-2024-0015')?.status === 'pending' && (
              <button 
                onClick={handleSimulateNotaryApproval}
                className="btn btn-airbnb animate-pulse" 
                style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem', width: 'auto' }}
              >
                ⚡ Simuler validation notaire
              </button>
            )}
            
            <div style={{ position: 'relative', cursor: 'pointer', padding: '0.25rem' }}>
              <Bell className="w-5 h-5 text-slate-500" />
              {showNotification && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
            </div>
            <Mail className="w-5 h-5 text-slate-500" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('chat')} />
            <div style={{ height: '24px', width: '1px', backgroundColor: '#e2e8f0', margin: '0 0.25rem' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Jean Dupont</span>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Avatar" 
              className="db-user-avatar" 
            />
          </div>
        </header>

        <div className="db-inner-container">

          {/* Bandeau d'alerte mail + notification en cas de validation du Notaire */}
          {showNotification && transactions.find(t => t.id === 'TR-2024-0015')?.status === 'progress' && (
            <div className="alert alert-success" style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', color: '#065f46', fontSize: '0.85rem' }}>
              <Bell className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>🔔 Notification & E-mail de MBOALAND :</strong> Le notaire <strong>{notaryName}</strong> a validé l'authenticité de votre acte d'achat ! Vous pouvez à présent verser les fonds sur le compte séquestre pour réserver définitivement le terrain.
              </div>
              <button onClick={() => setShowNotification(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#065f46' }}>X</button>
            </div>
          )}

          {/* Grille principale à deux colonnes */}
          
          {/* ================= Onglet 1 : VUE D'ENSEMBLE ================= */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="hero-search-section" style={{ padding: '2rem', margin: 0 }}>
                <h2>Bienvenue dans votre Espace Foncier, Jean 👋</h2>
                <p style={{ color: '#cbd5e1', margin: 0 }}>
                  Toutes vos parcelles d'achat sont listées, sécurisées et transmises à la Chambre Notariale de manière authentique.
                </p>
              </div>

              {/* Centralisation des 4 indicateurs en ligne */}
              <div className="db-stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', margin: 0 }}>
                <div className="db-stat-card">
                  <div className="db-stat-icon-wrapper blue"><Clock className="w-5 h-5" /></div>
                  <div><div className="db-stat-value">{countInProgress}</div><div className="db-stat-label">Notaire en cours</div></div>
                </div>
                <div className="db-stat-card">
                  <div className="db-stat-icon-wrapper amber"><CreditCard className="w-5 h-5" /></div>
                  <div><div className="db-stat-value">{countWaiting}</div><div className="db-stat-label">En attente paiement</div></div>
                </div>
                <div className="db-stat-card">
                  <div className="db-stat-icon-wrapper green"><Check className="w-5 h-5" /></div>
                  <div><div className="db-stat-value">{countCompleted}</div><div className="db-stat-label">Ventes finalisées</div></div>
                </div>
                <div className="db-stat-card">
                  <div className="db-stat-icon-wrapper rose"><X className="w-5 h-5" /></div>
                  <div><div className="db-stat-value">{countCancelled}</div><div className="db-stat-label">Ventes annulées</div></div>
                </div>
              </div>

              <div className="details-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Votre transaction active : {terrain.title}</h4>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--color-text-light)' }}>
                    Examen cadastral par {notaryName}.
                  </p>
                </div>
                <button className="btn btn-airbnb btn-airbnb-buy" style={{ width: 'auto' }} onClick={() => setActiveTab('transactions')}>
                  Consulter l'avancement
                </button>
              </div>
            </div>
          )}

          {/* ================= Onglet 2 : VOS OFFRES COMPLÈTES ================= */}
          {activeTab === 'offers' && (
            <div className="db-table-box">
              <table className="db-data-table">
                <thead>
                  <tr>
                    <th>Offre ID</th>
                    <th>Terrain ciblé</th>
                    <th>Vendeur Propriétaire</th>
                    <th>Prix proposé</th>
                    <th>Statut Offre</th>
                    <th>Date d'émission</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOffers.map((off) => (
                    <tr key={off.id}>
                      <td><strong style={{ color: '#0f172a' }}>{off.id}</strong></td>
                      <td><strong>{off.terrain}</strong></td>
                      <td>{off.owner}</td>
                      <td><strong style={{ color: 'var(--color-primary)' }}>{off.price}</strong></td>
                      <td>
                        {off.status === 'Acceptée' && <span className="db-badge success">✓ Acceptée</span>}
                        {off.status === 'Négociation' && <span className="db-badge pending">En cours</span>}
                        {off.status === 'Réfusée' && <span className="db-badge cancelled">Réfusée</span>}
                      </td>
                      <td>{off.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= Onglet 3 : TRANSACTION BOOKING AVEC GRILLE STATS 2X2 ================= */}
          {activeTab === 'transactions' && (
            <div className="db-grid-content">
              <div>
                <div className="db-table-box">
                  <div className="db-filters-bar">
                    <input 
                      type="text" 
                      placeholder="Rechercher par n° de titre, nom, notaire..." 
                      className="db-search-input" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select 
                      className="db-status-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="pending">Notaire en cours</option>
                      <option value="progress">En attente de paiement</option>
                      <option value="success">Paiement validé</option>
                      <option value="cancelled">Annulées</option>
                    </select>
                  </div>

                  <table className="db-data-table">
                    <thead>
                      <tr>
                        <th>Transaction</th>
                        <th>Terrain</th>
                        <th>Notaire</th>
                        <th>Montant</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((t) => (
                        <tr 
                          key={t.id} 
                          onClick={() => setSelectedTxId(t.id)}
                          className={`db-table-row-clickable ${selectedTxId === t.id ? 'active' : ''}`}
                        >
                          <td>
                            <strong style={{ display: 'block' }}>{t.id}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>{t.date}</span>
                          </td>
                          <td>
                            <strong style={{ display: 'block' }}>{t.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>{t.city}</span>
                          </td>
                          <td>{t.notary}</td>
                          <td><strong style={{ color: 'var(--color-primary)' }}>{t.amount}</strong></td>
                          <td>
                            {t.status === 'pending' && <span className="db-badge pending">Notaire en cours</span>}
                            {t.status === 'progress' && <span className="db-badge pending">À payer</span>}
                            {t.status === 'success' && <span className="db-badge success">Paiement validé</span>}
                            {t.status === 'cancelled' && <span className="db-badge cancelled">Annulée</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Barre de droite avec statistiques 2x2 et tiroir d'acquisition */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="db-stats-grid-2x2">
                  <div className="db-stat-card-compact">
                    <div className="db-stat-icon-wrapper blue"><Clock className="w-4 h-4" /></div>
                    <div><div className="db-stat-value">{countInProgress}</div><div className="db-stat-label">En cours</div></div>
                  </div>
                  <div className="db-stat-card-compact">
                    <div className="db-stat-icon-wrapper amber"><CreditCard className="w-4 h-4" /></div>
                    <div><div className="db-stat-value">{countWaiting}</div><div className="db-stat-label">À payer</div></div>
                  </div>
                  <div className="db-stat-card-compact">
                    <div className="db-stat-icon-wrapper green"><Check className="w-4 h-4" /></div>
                    <div><div className="db-stat-value">{countCompleted}</div><div className="db-stat-label">Terminées</div></div>
                  </div>
                  <div className="db-stat-card-compact">
                    <div className="db-stat-icon-wrapper rose"><X className="w-4 h-4" /></div>
                    <div><div className="db-stat-value">{countCancelled}</div><div className="db-stat-label">Annulées</div></div>
                  </div>
                </div>

                <div className="db-transaction-drawer">
                  <div className="drawer-header-row">
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Détails d'acquisition</h3>
                    <span className="db-badge progress" style={{ fontSize: '0.68rem' }}>{activeTx.statusLabel}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ID :</span> <strong>{activeTx.id}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Terrain :</span> <strong>{activeTx.title}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Superficie :</span> <strong>{activeTx.area}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Notaire :</span> <strong>{activeTx.notary}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total :</span> <strong>{activeTx.amount}</strong></div>
                  </div>

                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-light)', margin: '0 0 1rem' }}>Étapes de transaction</h4>
                  <div className="timeline-vertical">
                    <div className="timeline-vertical-step checked">
                      <div className="timeline-circle">1</div>
                      <div className="timeline-step-content"><h5 className="timeline-step-title">Offre acceptée</h5><p className="timeline-step-desc">Titre foncier et CNI vendeurs certifiés d'entrée</p></div>
                    </div>
                    <div className="timeline-vertical-step checked">
                      <div className="timeline-circle">2</div>
                      <div className="timeline-step-content"><h5 className="timeline-step-title">Vérification géomètre</h5><p className="timeline-step-desc">PV de bornage validé</p></div>
                    </div>
                    <div className={`timeline-vertical-step ${activeTx.step >= 3 ? 'checked' : 'active'}`}>
                      <div className="timeline-circle">3</div>
                      <div className="timeline-step-content"><h5 className="timeline-step-title">Vérification notaire</h5><p className="timeline-step-desc">{activeTx.step < 3 ? 'Examen de l\'acte en cours...' : 'Authenticité approuvée par le cabinet'}</p></div>
                    </div>
                    <div className={`timeline-vertical-step ${activeTx.step === 4 ? 'active' : activeTx.step >= 5 ? 'checked' : ''}`}>
                      <div className="timeline-circle">4</div>
                      <div className="timeline-step-content"><h5 className="timeline-step-title">Paiement séquestre</h5><p className="timeline-step-desc">{activeTx.step < 4 ? 'En attente de validation d\'acte' : activeTx.step === 4 ? 'Virement de séquestre en attente' : 'Acompte consigné en étude'}</p></div>
                    </div>
                    <div className={`timeline-vertical-step ${activeTx.step === 5 ? 'active' : ''}`}>
                      <div className="timeline-circle">5</div>
                      <div className="timeline-step-content"><h5 className="timeline-step-title">Vente finalisée</h5><p className="timeline-step-desc">Rendez-vous physique en étude notariale</p></div>
                    </div>
                  </div>

                  {activeTx.status === 'progress' && (
                    <button onClick={() => setPaymentModalOpen(true)} className="btn btn-airbnb btn-airbnb-buy" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', borderRadius: '10px' }}>
                      <CreditCard className="w-4 h-4" /> Effectuer le paiement séquestre
                    </button>
                  )}

                  {activeTx.status === 'success' && (
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                      <ShieldCheck className="w-5 h-5" /> Reçu de virement validé. Convocation en cours sous 48h.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= Onglet 4 : COFFRE-FORT DE DOCUMENTS ================= */}
          {activeTab === 'documents' && (
            <div className="doc-tab-grid">
              {[
                { name: `Titre_Foncier_${selectedTxId}.pdf`, size: '2.4 Mo', date: 'Aujourd\'hui' },
                { name: `Plan_Cadastral_Contradictoire.pdf`, size: '1.8 Mo', date: 'Aujourd\'hui' },
                { name: `Attestation_Virement_Sequestre.pdf`, size: '840 Ko', date: paymentDone ? 'Aujourd\'hui' : 'Non disponible' },
                { name: `CNI_Vendeur_Certifie.pdf`, size: '920 Ko', date: 'Aujourd\'hui' },
              ].map((doc, idx) => (
                <div key={idx} className="doc-vault-card">
                  <div className="doc-vault-icon-box">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="doc-vault-name">{doc.name}</h4>
                    <p className="doc-vault-meta">{doc.size} · Mis en ligne {doc.date}</p>
                  </div>
                  <button className="btn btn-airbnb btn-airbnb-details" style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <Download className="w-4 h-4" /> Télécharger
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ================= Onglet 5 : MESSAGERIE (CHAT INTERACTIF) ================= */}
          {activeTab === 'chat' && (
            <div className="chat-tab-container">
              {/* Panneau de contacts */}
              <div className="chat-sidebar-panel">
                <div className="chat-sidebar-header">
                  <h3>Cabinet Notarial</h3>
                </div>
                <div className="chat-contacts-list">
                  <div className="chat-contact-row active">
                    <div className="chat-contact-avatar">AB</div>
                    <div className="chat-contact-info">
                      <div className="chat-contact-name">{notaryName}</div>
                      <div className="chat-contact-preview">Traitement de l'acte...</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fenêtre de discussion */}
              <div className="chat-window-panel">
                <div className="chat-window-header">
                  <div className="chat-contact-avatar" style={{ width: '32px', height: '36px' }}>AB</div>
                  <div>
                    <h4 className="chat-active-name">{notaryName}</h4>
                    <span className="chat-active-status">En ligne</span>
                  </div>
                </div>

                <div className="chat-messages-container">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user' : 'other'}`}>
                      <div className="chat-bubble-text">{msg.text}</div>
                      <span className="chat-bubble-time">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Formulaire de saisie du chat */}
                <div className="chat-input-bar">
                  <input 
                    type="text" 
                    placeholder="Écrivez un message d'instruction..." 
                    className="chat-text-input" 
                    value={writtenMessage}
                    onChange={(e) => setWrittenMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  />
                  <button className="btn btn-airbnb btn-airbnb-buy" style={{ width: 'auto', display: 'flex', gap: '0.4rem' }} onClick={handleSendMessage}>
                    Envoyer <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div> {/* Closes .db-inner-container */}
      </main> {/* Closes .db-main-content */}

      {/* 3. MODALE DE PAIEMENT SÉQUESTRE */}
      {paymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Règlement de l'acompte séquestre</h3>
              <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={() => setPaymentModalOpen(false)} />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Pour valider le compromis de vente de la parcelle <strong>{activeTx.refCode}</strong>, veuillez effectuer le virement de l'acompte :
            </p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.78rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              <div><strong>Bénéficiaire :</strong> Étude Notariale MBOALAND</div>
              <div><strong>Compte :</strong> UBA Cameroun</div>
              <div><strong>RIB :</strong> CM21 0001 0000 1234 5678 9010 11</div>
              <div><strong>Montant séquestre :</strong> {activeTx.amount}</div>
              <div><strong>Référence :</strong> {activeTx.id}</div>
            </div>

            {/* Téléversement de la preuve */}
            <span className="form-group-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Justificatif de versement</span>
            {!proofFile ? (
              <div style={{ border: '2px dashed #cbd5e1', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg"
                  onChange={handleFileUpload}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                />
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>Sélectionner le reçu (PDF, PNG, JPG)</span>
              </div>
            ) : (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#166534' }}>📎 {proofFile}</span>
                <button onClick={() => setProofFile(null)} style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 'bold', cursor: 'pointer' }}>X</button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <button className="btn btn-airbnb btn-airbnb-details" onClick={() => setPaymentModalOpen(false)}>Annuler</button>
              <button className="btn btn-airbnb btn-airbnb-buy" onClick={handleConfirmPayment}>Envoyer la preuve de virement</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}