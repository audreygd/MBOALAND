import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, ShieldAlert, FileText, Check, Search, 
  ShieldCheck, Terminal, MapPin, MessageSquare, Send
} from 'lucide-react';
import './AdminDashboard.css';

// Interface d'une parcelle cadastrale
export interface Cadastre {
  id: string;
  title: string;
  city: string;
  landTitle: string;
  owner: string;
  price: string;
  status: 'certified' | 'pending' | 'frozen';
  statusLabel: string;
}

// Interface d'un acteur du réseau MBOALAND
interface Acteur {
  id: string;
  name: string;
  role: 'Acheteur' | 'Vendeur' | 'Notaire' | 'Géomètre';
  active: boolean;
  docCount: number;
  avatarClass: string;
  initials: string;
}

// Interface d'un log système d'audit
interface LogEntry {
  time: string;
  type: 'info' | 'ok' | 'alert';
  msg: string;
}

// Interface pour la messagerie
interface Contact {
  id: string;
  name: string;
  role: string;
  avatarClass: string;
  initials: string;
  autoReply: string;
}

interface Message {
  sender: 'admin' | 'other';
  text: string;
  time: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'lands' | 'users' | 'chat'>('overview');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Base des terrains modifiable
  const [lands, setLands] = useState<Cadastre[]>([
    { id: 'TER-2024-0015', title: 'Superbe parcelle plane résidentielle', city: 'Odza, Yaoundé', landTitle: 'TF-1532/CM/CEN', owner: 'Jean Dupont', price: '15 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0012', title: 'Vaste domaine agricole', city: 'Mbankomo, Centre', landTitle: 'TF-0987/CM/CEN', owner: 'Sylvestre Atangana', price: '8 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0005', title: 'Terrain panoramique', city: 'Bafoussam, Ouest', landTitle: 'TF-2241/CM/OUE', owner: 'Emmanuel Kamga', price: '6 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0002', title: 'Parcelle commerciale de premier choix', city: 'Bonamoussadi, Douala', landTitle: 'TF-0341/CM/LIT', owner: 'Lucie Mefire', price: '18 000 000 FCFA', status: 'pending', statusLabel: 'En attente' }
  ]);

  // Base des acteurs/utilisateurs
  const [acteurs, setActeurs] = useState<Acteur[]>([
    { id: 'USR-0891', name: 'Jean Dupont', role: 'Vendeur', active: true, docCount: 4, avatarClass: 'seller', initials: 'JD' },
    { id: 'USR-1152', name: 'Martin Kamga', role: 'Acheteur', active: true, docCount: 2, avatarClass: 'buyer', initials: 'MK' },
    { id: 'NOT-0021', name: 'Me Mireille Dubois', role: 'Notaire', active: true, docCount: 15, avatarClass: 'notary', initials: 'MD' },
    { id: 'GEO-0481', name: 'Paul Mbarga', role: 'Géomètre', active: false, docCount: 7, avatarClass: 'geometre', initials: 'PM' }
  ]);

  const contacts: Contact[] = [
    { id: 'c1', name: 'Me Mireille Dubois', role: 'Notaire', avatarClass: 'notary', initials: 'MD', autoReply: "Bonjour M. l'Administrateur, j'ai suspendu l'instruction du dossier d'Odza en attendant les conclusions du litige que vous venez de signaler." },
    { id: 'c2', name: 'Paul Mbarga', role: 'Géomètre', avatarClass: 'geometre', initials: 'PM', autoReply: "Bonjour Chef, bien reçu. Je me rends sur place à Douala pour effectuer un contre-bornage contradictoire." },
    { id: 'c3', name: 'Jean Dupont', role: 'Vendeur', avatarClass: 'seller', initials: 'JD', autoReply: "Bonjour, je conteste ce litige ! Mon titre foncier à Odza est parfaitement en règle." },
    { id: 'c4', name: 'Martin Kamga', role: 'Acheteur', avatarClass: 'buyer', initials: 'MK', autoReply: "Bonjour, je vous remercie de veiller sur ma sécurité. J'attends la résolution du litige." }
  ];

  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    c1: [{ sender: 'other', text: "Bonjour Monsieur l'Administrateur, nos vérifications sur le dossier d'Odza se poursuivent.", time: '10:15' }]
  });
  const [writtenMessage, setWrittenMessage] = useState<string>('');

  const currentContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  // Console d'audit de sécurité
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '16:45:12', type: 'info', msg: 'Démarrage de l\'analyse cadastrale de la transaction TR-2024-0015.' },
    { time: '16:45:20', type: 'ok', msg: 'Titre Foncier TF-1532/CM/CEN validé avec succès en base d\'État.' },
    { time: '16:46:02', type: 'alert', msg: 'Tentative de modification suspecte sur le relevé GPS TER-2024-0005 par le géomètre.' }
  ]);

  // Action : Mettre en litige / Lever le litige
  const handleToggleFreezeLand = (id: string) => {
    setLands(prev => prev.map(l => {
      if (l.id === id) {
        const isCurrentlyFrozen = l.status === 'frozen';
        const targetStatus = isCurrentlyFrozen ? 'certified' : 'frozen';
        
        const newLog: LogEntry = {
          time: new Date().toLocaleTimeString('fr-FR'),
          type: isCurrentlyFrozen ? 'ok' : 'alert',
          msg: isCurrentlyFrozen 
            ? `ADMINISTRATEUR : Le litige de la parcelle cadastrale ${id} a été levé après vérification.`
            : `ADMINISTRATEUR (ALERTE) : La parcelle cadastrale ${id} a été placée sous litige foncier administratif.`
        };
        setLogs(current => [newLog, ...current]);

        return {
          ...l,
          status: targetStatus,
          statusLabel: isCurrentlyFrozen ? 'Certifié' : 'En litige (Bloqué)'
        };
      }
      return l;
    }));
  };

  const handleToggleUserAccount = (id: string) => {
    setActeurs(prev => prev.map(a => {
      if (a.id === id) {
        const targetActive = !a.active;

        const newLog: LogEntry = {
          time: new Date().toLocaleTimeString('fr-FR'),
          type: targetActive ? 'ok' : 'alert',
          msg: `ADMINISTRATEUR : Droits d'accès modifiés pour ${a.name} (${a.role}) -> ${targetActive ? 'Activé' : 'Suspendu'}.`
        };
        setLogs(current => [newLog, ...current]);

        return { ...a, active: targetActive };
      }
      return a;
    }));
  };

  const handleSendMessage = () => {
    if (!writtenMessage.trim()) return;

    const newMsg: Message = { sender: 'admin', text: writtenMessage, time: 'À l\'instant' };
    const updatedHistory = {
      ...chatHistory,
      [activeContactId]: [...(chatHistory[activeContactId] || []), newMsg]
    };
    setChatHistory(updatedHistory);
    setWrittenMessage('');

    setTimeout(() => {
      setChatHistory(prev => ({
        ...prev,
        [activeContactId]: [
          ...(prev[activeContactId] || []),
          { sender: 'other', text: currentContact.autoReply, time: 'À l\'instant' }
        ]
      }));
    }, 1500);
  };

  const filteredLands = lands.filter(l => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      l.title.toLowerCase().includes(query) ||
      l.owner.toLowerCase().includes(query) ||
      l.city.toLowerCase().includes(query) ||
      l.landTitle.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-layout">
      
      {/* 1. BARRE LATÉRALE DE GAUCHE */}
      <aside className="admin-sidebar">
        <div className="admin-logo-box">
          <span className="admin-logo-text">MBOA<span style={{ color: '#0f172a' }}>LAND</span></span>
          <p style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: 800, margin: '2px 0 0' }}>
            SUPER ADMINISTRATEUR
          </p>
        </div>

        <nav>
          <ul className="admin-menu-list">
            <li 
              className={`admin-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard className="w-4 h-4" /> Vue d'ensemble
            </li>
            <li 
              className={`admin-menu-item ${activeTab === 'lands' ? 'active' : ''}`}
              onClick={() => setActiveTab('lands')}
            >
              <MapPin className="w-4 h-4" /> Gestion des parcelles
            </li>
            <li 
              className={`admin-menu-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4" /> Coordination
            </li>
            <li 
              className={`admin-menu-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4" /> Messagerie unifiée
            </li>
          </ul>
        </nav>
      </aside>

      {/* 2. ZONE PRINCIPALE DE CONTENU */}
      <main className="admin-main-content">
        
        {/* Entête */}
        <header className="admin-top-header">
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Console d'Administration Globale</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)', margin: '2px 0 0' }}>
              Régulation domaniale : arbitrage des litiges, supervision des études de notaires et géomètres.
            </p>
          </div>

          <div className="admin-header-profile">
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Admin Principal</span>
            <div className="avatar placeholder" style={{ backgroundColor: 'var(--admin-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', width: '36px', height: '36px', borderRadius: '50%' }}>
              AD
            </div>
          </div>
        </header>

        <div className="admin-inner-container">

          {/* ================= Onglet 1 : VUE D'ENSEMBLE AVEC GRAPHIQUE CADAUSTRAL INTERACTIF (SVG) ================= */}
          {activeTab === 'overview' && (
            <div>
              {/* Ligne des statistiques */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon-wrapper blue"><MapPin className="w-5 h-5" /></div>
                  <div><div className="admin-stat-value">{lands.length}</div><div className="admin-stat-label">Parcelles gérées</div></div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon-wrapper amber"><Users className="w-5 h-5" /></div>
                  <div><div className="admin-stat-value">{acteurs.length}</div><div className="admin-stat-label">Utilisateurs actifs</div></div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon-wrapper green"><ShieldCheck className="w-5 h-5" /></div>
                  <div><div className="admin-stat-value">{lands.filter(l => l.status === 'certified').length}</div><div className="admin-stat-label">Titres certifiés</div></div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon-wrapper red"><ShieldAlert className="w-5 h-5" /></div>
                  <div><div className="admin-stat-value">{lands.filter(l => l.status === 'frozen').length}</div><div className="admin-stat-label">Terrains en litige</div></div>
                </div>
              </div>

              {/* NOUVEAU : LE GRAPHIQUE LINÉAIRE D'ACTIVITÉ EN SVG PUR SANS LIBRAIRIES [1] */}
              <div className="activity-chart-card">
                <div className="activity-header-row">
                  <div>
                    <h3 className="activity-title">Activité terrain</h3>
                    <span className="activity-subtitle">Missions traitées sur 7 jours</span>
                  </div>
                  <span className="activity-trend-badge">+14% ce mois</span>
                </div>

                {/* Courbe vectorielle identique à la capture d'écran [1] */}
                <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                  <svg viewBox="0 0 700 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Grilles horizontales aux Y-labels [1] */}
                    <line x1="40" y1="180" x2="660" y2="180" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="135" x2="660" y2="135" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="67" x2="660" y2="67" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="22" x2="660" y2="22" stroke="#f1f5f9" strokeWidth={1} />

                    {/* Les labels Y (0, 2, 5, 7) [1] */}
                    <text x="15" y="184" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">0</text>
                    <text x="15" y="139" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">2</text>
                    <text x="15" y="71" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">5</text>
                    <text x="15" y="26" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">7</text>

                    {/* Zone de dégradé transparent en dessous [1] */}
                    <path 
                      d="M 60,146 L 160,94 L 260,116 L 360,74 L 460,52 L 560,94 L 660,22 L 660,180 L 60,180 Z" 
                      fill="url(#chartAreaGradient)" 
                    />

                    {/* La courbe principale verte [1] */}
                    <path 
                      d="M 60,146 L 160,94 L 260,116 L 360,74 L 460,52 L 560,94 L 660,22" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      strokeLinecap="round"
                    />

                    {/* Les points de données entourés de blanc [1] */}
                    <circle cx="60" cy="146" r="6" fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="160" cy="94" r="6" fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="260" cy="116" r="6" fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="360" cy="74" r="6" fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="460" cy="52" r="6" fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="560" cy="94" r="6" fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="660" cy="22" r="6" fill="#10b981" stroke="#ffffff" strokeWidth={2} />

                    {/* Labels de l'axe X (J1, J2, J3, J4, J5, J6, J7) [1] */}
                    <text x="52" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J1</text>
                    <text x="152" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J2</text>
                    <text x="252" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J3</text>
                    <text x="352" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J4</text>
                    <text x="452" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J5</text>
                    <text x="552" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J6</text>
                    <text x="652" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J7</text>
                  </svg>
                </div>

                <div className="activity-footer-line">
                  <span>Relevés GPS complétés : <strong>2</strong></span>
                </div>
              </div>

              {/* Les graphiques en barres secondaires */}
              <div className="admin-charts-row">
                <div className="admin-chart-card">
                  <h4 className="chart-title">Statut global des parcelles</h4>
                  <div className="chart-bar-container">
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row">
                        <span>Titres Certifiés conformes (Blockchain)</span>
                        <span>75%</span>
                      </div>
                      <div className="chart-progress-bg">
                        <div className="chart-progress-fill primary" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row">
                        <span>Annonces en cours d'évaluation</span>
                        <span>15%</span>
                      </div>
                      <div className="chart-progress-bg">
                        <div className="chart-progress-fill amber" style={{ width: '15%' }} />
                      </div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row">
                        <span>Terrains sous litige foncier</span>
                        <span>10%</span>
                      </div>
                      <div className="chart-progress-bg">
                        <div className="chart-progress-fill red" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-chart-card">
                  <h4 className="chart-title">Répartition domaniale par usage</h4>
                  <div className="chart-bar-container">
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row">
                        <span>Zones Résidentielles</span>
                        <span>55%</span>
                      </div>
                      <div className="chart-progress-bg">
                        <div className="chart-progress-fill primary" style={{ width: '55%' }} />
                      </div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row">
                        <span>Zones Agricoles</span>
                        <span>25%</span>
                      </div>
                      <div className="chart-progress-bg">
                        <div className="chart-progress-fill primary" style={{ width: '25%' }} />
                      </div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row">
                        <span>Zones Commerciales et Industrielles</span>
                        <span>20%</span>
                      </div>
                      <div className="chart-progress-bg">
                        <div className="chart-progress-fill primary" style={{ width: '20%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console d'audit de sécurité */}
              <h3 className="section-title">Journal de sécurité en temps réel</h3>
              <p className="section-subtitle">Historique instantané des actions système domaniales.</p>
              <div className="audit-log-terminal">
                {logs.map((log, idx) => (
                  <div key={idx} className="log-entry">
                    <span className="log-timestamp">[{log.time}]</span>
                    <span className={`log-message ${log.type === 'alert' ? 'alert' : log.type === 'ok' ? 'ok' : ''}`}>
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= Onglet 2 : GESTION DES LITIGES ET DES TERRAINS ================= */}
          {activeTab === 'lands' && (
            <div className="admin-card-box">
              <div className="admin-filters-bar">
                <input 
                  type="text" 
                  placeholder="Rechercher une parcelle par nom, ville, titre..." 
                  className="admin-search-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <select 
                  className="admin-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="certified">Certifiés d'office</option>
                  <option value="pending">En attente d'évaluation</option>
                  <option value="frozen">En litige (Bloqués)</option>
                </select>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Terrain ID</th>
                    <th>Nom du Terrain</th>
                    <th>Localisation</th>
                    <th>Titre Foncier d'étude</th>
                    <th>Propriétaire</th>
                    <th>Statut</th>
                    <th>Actions de régulation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLands.map((l) => (
                    <tr key={l.id}>
                      <td><strong style={{ color: '#0f172a' }}>{l.id}</strong></td>
                      <td><strong>{l.title}</strong></td>
                      <td>{l.city}</td>
                      <td><code style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{l.landTitle}</code></td>
                      <td>{l.owner}</td>
                      <td>
                        {l.status === 'certified' && <span className="admin-badge success">Certifié</span>}
                        {l.status === 'pending' && <span className="admin-badge pending">En attente</span>}
                        {l.status === 'frozen' && <span className="admin-badge danger">En litige</span>}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleFreezeLand(l.id)}
                          className={`btn-admin-action ${l.status === 'frozen' ? 'success' : 'danger'}`}
                        >
                          {l.status === 'frozen' ? 'Lever le litige' : 'Mettre en litige'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= Onglet 3 : COORDINATION DES RÔLES ================= */}
          {activeTab === 'users' && (
            <div className="admin-card-box">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur ID</th>
                    <th>Nom complet</th>
                    <th>Rôle assigné</th>
                    <th>Documents vérifiés</th>
                    <th>Statut d'accès</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {acteurs.map((u) => (
                    <tr key={u.id}>
                      <td><strong style={{ color: '#0f172a' }}>{u.id}</strong></td>
                      <td><strong style={{ display: 'block' }}>{u.name}</strong></td>
                      <td><span style={{ fontWeight: 600 }}>{u.role}</span></td>
                      <td><strong style={{ color: 'var(--admin-primary)' }}>{u.docCount} documents</strong></td>
                      <td>
                        {u.active ? (
                          <span className="admin-badge success">Actif (Autorisé)</span>
                        ) : (
                          <span className="admin-badge danger">Suspendu</span>
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleUserAccount(u.id)}
                          className={`btn-admin-action ${u.active ? 'danger' : 'success'}`}
                        >
                          {u.active ? 'Suspendre l\'accès' : 'Activer l\'accès'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= Onglet 4 : MESSAGERIE UNIFIÉE AVEC TOUS LES ACTEURS ================= */}
          {activeTab === 'chat' && (
            <div className="admin-chat-layout">
              {/* Sidebar de messagerie regroupée par rôles */}
              <div className="admin-chat-sidebar">
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Discussions Actives</h4>
                </div>

                <span className="chat-role-label">Officiers Ministériels</span>
                {contacts.filter(c => c.role === 'Notaire' || c.role === 'Géomètre').map(c => (
                  <div 
                    key={c.id} 
                    className={`admin-chat-contact-row ${activeContactId === c.id ? 'active' : ''}`}
                    onClick={() => setActiveContactId(c.id)}
                  >
                    <div className={`admin-chat-avatar ${c.avatarClass}`}>{c.initials}</div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>{c.role}</span>
                    </div>
                  </div>
                ))}

                <span className="chat-role-label">Citoyens (Acheteurs &amp; Vendeurs)</span>
                {contacts.filter(c => c.role === 'Acheteur' || c.role === 'Vendeur').map(c => (
                  <div 
                    key={c.id} 
                    className={`admin-chat-contact-row ${activeContactId === c.id ? 'active' : ''}`}
                    onClick={() => setActiveContactId(c.id)}
                  >
                    <div className={`admin-chat-avatar ${c.avatarClass}`}>{c.initials}</div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fenêtre de discussion */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-border)', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className={`admin-chat-avatar ${currentContact.avatarClass}`} style={{ width: '32px', height: '36px' }}>{currentContact.initials}</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{currentContact.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>Profil {currentContact.role} · Connecté</span>
                  </div>
                </div>

                <div className="admin-chat-messages">
                  {(chatHistory[activeContactId] || []).map((msg, idx) => (
                    <div key={idx} className={`admin-chat-bubble-wrapper ${msg.sender === 'admin' ? 'user' : 'other'}`}>
                      <div className="admin-chat-bubble-text">{msg.text}</div>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem' }}>{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Barre d'envoi de messages */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '0.75rem', backgroundColor: '#ffffff' }}>
                  <input 
                    type="text" 
                    placeholder={`Écrire un message d'arbitrage à ${currentContact.name}...`} 
                    className="admin-search-input" 
                    value={writtenMessage}
                    onChange={(e) => setWrittenMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  />
                  <button className="btn-admin-action success" style={{ width: 'auto', padding: '0.65rem 1.5rem' }} onClick={handleSendMessage}>
                    Envoyer <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div> 
      </main> 

    </div>
  );
}