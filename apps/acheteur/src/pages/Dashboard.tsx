import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Mail, Bell, Search, Filter, 
  Download, Check, Compass, CreditCard, UploadCloud, X, Clock
} from 'lucide-react';
import { type Terrain } from './Home';
import './pages.css';

interface DashboardProps {
  terrain: Terrain;
  notaryName: string;
  onRestart: () => void;
}

// Structure typée d'une ligne de transaction
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
  step: number; // Étape actuelle (1 à 5)
  gps: string;
  refCode: string;
}

export default function Dashboard({ terrain, notaryName, onRestart }: DashboardProps) {
  // Calculs financiers pour le terrain actif
  const serviceFee = Math.round(terrain.priceVal * 0.01);
  const totalAmountVal = terrain.priceVal + 35000 + 45000 + serviceFee;

  const fmt = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';

  // Base de données d'historique de transactions de l'acheteur
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
      status: 'pending', // En attente notaire au départ
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

  // États de sélection et filtres interactifs
  const [selectedTxId, setSelectedTxId] = useState<string>('TR-2024-0015');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modale de paiement séquestre
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Recherche de la transaction sélectionnée pour l'affichage de droite
  const activeTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

  // Algorithme de filtrage (Recherche par texte + Catégorie de statut)
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calcul des compteurs statistiques en fonction des données actuelles
  const countInProgress = transactions.filter(t => t.status === 'pending').length;
  const countWaiting = transactions.filter(t => t.status === 'progress').length;
  const countCompleted = transactions.filter(t => t.status === 'success').length;
  const countCancelled = transactions.filter(t => t.status === 'cancelled').length;

  // Action 1 : Simuler la validation de l'acte par le Notaire
  const handleSimulateNotaryApproval = () => {
    setTransactions(prev => prev.map(t => {
      if (t.id === 'TR-2024-0015') {
        return {
          ...t,
          status: 'progress',
          statusLabel: 'En attente de paiement',
          step: 4
        };
      }
      return t;
    }));
    setShowNotification(true);
  };

  // Action 2 : Téléverser la preuve
  const handleFileUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0].name);
    }
  };

  // Action 3 : Envoyer et finaliser l'achat
  const handleConfirmPayment = () => {
    if (!proofFile) {
      alert("Veuillez joindre la preuve de virement séquestre.");
      return;
    }
    setTransactions(prev => prev.map(t => {
      if (t.id === 'TR-2024-0015') {
        return {
          ...t,
          status: 'success',
          statusLabel: 'Paiement validé',
          step: 5
        };
      }
      return t;
    }));
    setPaymentModalOpen(false);
  };

  return (
    <div className="db-layout">
      
      {/* 1. BARRE LATÉRALE GAUCHE (STYLE OFFICIEL PROPRIÉTAIRE) */}
      <aside className="db-sidebar">
        <div className="db-logo-box">
          <span className="db-logo-text">MBOA<span style={{ color: '#0f172a' }}>LAND</span></span>
          <p style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 700, margin: '2px 0 0' }}>
            Achetez en toute sécurité
          </p>
        </div>

        <nav>
          <ul className="db-menu-list">
            <li className="db-menu-item">Tableau de bord</li>
            <li className="db-menu-item">Mes terrains</li>
            <li className="db-menu-item">Offres reçues <span className="badge-count-sidebar">8</span></li>
            <li className="db-menu-item active">Transactions</li>
            <li className="db-menu-item">Documents</li>
            <li className="db-menu-item">Visites</li>
            <li className="db-menu-item">Messagerie <span className="badge-count-sidebar">3</span></li>
            <li className="db-menu-item">Notifications <span className="badge-count-sidebar">5</span></li>
            <li className="db-menu-item">Profil</li>
          </ul>
        </nav>

        <div className="db-help-card-sidebar">
          <h5 style={{ fontWeight: 700, margin: '0 0 0.25rem' }}>Besoin d'aide ?</h5>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
            Notre équipe d'experts est à votre service 7j/7 de 8h à 20h.
          </p>
          <button className="btn btn-airbnb btn-airbnb-buy" style={{ fontSize: '0.75rem', padding: '0.45rem' }}>
            Contacter le support
          </button>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE DE CONTENU */}
      <main className="db-main-content">
        
        {/* Header supérieur */}
        <header className="db-top-header">
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Transactions de l'acquéreur</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: '2px 0 0' }}>
              Suivez l'avancement de toutes vos transactions en cours et terminées.
            </p>
          </div>

          <div className="db-header-user-badge">
            {/* Bouton de simulation si l'acte n'est pas encore validé par le notaire */}
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
            <Mail className="w-5 h-5 text-slate-500" style={{ cursor: 'pointer' }} />
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
          <div className="db-grid-content">
            
            {/* Colonne gauche : Recherche, Filtres, et Table des transactions */}
            <div>
              <div className="db-table-box">
                <div className="db-filters-bar">
                  <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                    <input 
                      type="text" 
                      placeholder="Rechercher une transaction..." 
                      className="db-search-input" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Select de statut interactif */}
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

                  <button className="db-filter-button" style={{ marginLeft: 'auto' }}><Download className="w-4 h-4" /> Exporter</button>
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
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((t) => (
                        <tr 
                          key={t.id} 
                          onClick={() => setSelectedTxId(t.id)}
                          className={`db-table-row-clickable ${selectedTxId === t.id ? 'active' : ''}`}
                        >
                          <td>
                            <strong style={{ display: 'block', color: '#0f172a' }}>{t.id}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>{t.date}</span>
                          </td>
                          <td>
                            <strong style={{ display: 'block', color: '#0f172a' }}>{t.title}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>{t.city}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{t.notary}</span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--color-primary)' }}>{t.amount}</strong>
                          </td>
                          <td>
                            {t.status === 'pending' && <span className="db-badge pending">Notaire en cours</span>}
                            {t.status === 'progress' && <span className="db-badge pending">En attente de paiement</span>}
                            {t.status === 'success' && <span className="db-badge success">Paiement validé</span>}
                            {t.status === 'cancelled' && <span className="db-badge cancelled">Annulée</span>}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                          Aucune transaction trouvée pour ces filtres de recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <button onClick={onRestart} className="btn btn-airbnb" style={{ width: 'auto', marginTop: '2.5rem', fontSize: '0.8rem' }}>
                Retour au portail d'achat
              </button>
            </div>

            {/* Colonne droite : NOUVELLE GRILLE STATS COMPACTE 2X2 + VOLET DÉTAILS [2] */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Grille de statistiques 2x2 demandée [2] */}
              <div className="db-stats-grid-2x2">
                <div className="db-stat-card-compact">
                  <div className="db-stat-icon-wrapper blue" style={{ width: '30px', height: '36px' }}><Clock className="w-4 h-4" /></div>
                  <div>
                    <div className="db-stat-value">{countInProgress}</div>
                    <div className="db-stat-label">En cours</div>
                  </div>
                </div>
                <div className="db-stat-card-compact">
                  <div className="db-stat-icon-wrapper amber" style={{ width: '30px', height: '36px' }}><CreditCard className="w-4 h-4" /></div>
                  <div>
                    <div className="db-stat-value">{countWaiting}</div>
                    <div className="db-stat-label">À payer</div>
                  </div>
                </div>
                <div className="db-stat-card-compact">
                  <div className="db-stat-icon-wrapper green" style={{ width: '30px', height: '36px' }}><Check className="w-4 h-4" /></div>
                  <div>
                    <div className="db-stat-value">{countCompleted}</div>
                    <div className="db-stat-label">Terminées</div>
                  </div>
                </div>
                <div className="db-stat-card-compact">
                  <div className="db-stat-icon-wrapper rose" style={{ width: '30px', height: '36px' }}><X className="w-4 h-4" /></div>
                  <div>
                    <div className="db-stat-value">{countCancelled}</div>
                    <div className="db-stat-label">Annulées</div>
                  </div>
                </div>
              </div>

              {/* Volet Détails de la transaction sélectionnée */}
              <div className="db-transaction-drawer">
                <div className="drawer-header-row">
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Détails de la transaction</h3>
                  <span className={`db-badge ${activeTx.status === 'success' ? 'success' : 'pending'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {activeTx.statusLabel}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>ID :</span>
                    <strong>{activeTx.id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Terrain :</span>
                    <strong>{activeTx.title}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Superficie :</span>
                    <strong>{activeTx.area}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Notaire d'étude :</span>
                    <strong>{activeTx.notary}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Total TTC :</span>
                    <strong>{activeTx.amount}</strong>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.03em', margin: '0 0 1rem' }}>
                  Étapes de la transaction
                </h4>

                {/* Timeline dynamique de la transaction sélectionnée */}
                <div className="timeline-vertical">
                  <div className="timeline-vertical-step checked">
                    <div className="timeline-circle">1</div>
                    <div className="timeline-step-content">
                      <h5 className="timeline-step-title">Offre acceptée</h5>
                      <p className="timeline-step-desc">Titre foncier et CNI vendeur validés d'entrée</p>
                    </div>
                  </div>

                  <div className="timeline-vertical-step checked">
                    <div className="timeline-circle">2</div>
                    <div className="timeline-step-content">
                      <h5 className="timeline-step-title">Vérification géomètre</h5>
                      <p className="timeline-step-desc">Le PV de bornage contradictoire est certifié</p>
                    </div>
                  </div>

                  <div className={`timeline-vertical-step ${activeTx.step >= 3 ? 'checked' : 'active'}`}>
                    <div className="timeline-circle">3</div>
                    <div className="timeline-step-content">
                      <h5 className="timeline-step-title">Vérification notaire</h5>
                      <p className="timeline-step-desc">
                        {activeTx.step < 3 ? 'Examen de l\'acte par le notaire...' : 'Authenticité approuvée par le cabinet'}
                      </p>
                    </div>
                  </div>

                  <div className={`timeline-vertical-step ${activeTx.step === 4 ? 'active' : activeTx.step >= 5 ? 'checked' : ''}`}>
                    <div className="timeline-circle">4</div>
                    <div className="timeline-step-content">
                      <h5 className="timeline-step-title">Paiement séquestre</h5>
                      <p className="timeline-step-desc">
                        {activeTx.step < 4 ? 'En attente de validation d\'acte' : activeTx.step === 4 ? 'Virement de séquestre en attente' : 'Acompte consigné en étude'}
                      </p>
                    </div>
                  </div>

                  <div className={`timeline-vertical-step ${activeTx.step === 5 ? 'active' : ''}`}>
                    <div className="timeline-circle">5</div>
                    <div className="timeline-step-content">
                      <h5 className="timeline-step-title">Vente finalisée</h5>
                      <p className="timeline-step-desc">Convocation des deux parties pour signatures</p>
                    </div>
                  </div>
                </div>

                {/* Déblocage du bouton de paiement si le notaire a validé et que le paiement n'est pas fait */}
                {activeTx.status === 'progress' && (
                  <button 
                    onClick={() => setPaymentModalOpen(true)}
                    className="btn btn-airbnb btn-airbnb-buy animate-pulse"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', marginTop: '1rem', borderRadius: '10px' }}
                  >
                    <CreditCard className="w-4 h-4" /> Effectuer le paiement séquestre
                  </button>
                )}

                {activeTx.status === 'success' && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <ShieldCheck className="w-5 h-5" /> Preuve de versement reçue. Convocation en cours sous 48h.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>

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