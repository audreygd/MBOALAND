import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, ShieldAlert, FileText, Check, Search, 
  ShieldCheck, Terminal, MapPin, MessageSquare, Send, LogOut, Plus, X, Edit, Ban, Compass,
  Bell, Mail,ChevronUp, ChevronDown
} from 'lucide-react';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export interface Cadastre {
  id: string; title: string; city: string; landTitle: string; owner: string; price: string;
  status: 'certified' | 'pending' | 'frozen'; statusLabel: string;
}

interface Acteur {
  id: string; name: string; role: 'Acheteur' | 'Vendeur' | 'Notaire' | 'Géomètre';
  email: string; phone: string; joinDate: string; certificationId?: string;
  active: boolean; docCount: number; avatarClass: string; initials: string;
}

interface LogEntry { time: string; type: 'info' | 'ok' | 'alert'; msg: string; }

interface Contact {
  id: string; name: string; role: string; avatarClass: string; initials: string; autoReply: string;
}

interface Message { sender: 'admin' | 'other'; text: string; time: string; }

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  // --- ÉTATS DE NAVIGATION ---
  const [activeTab, setActiveTab] = useState<'overview' | 'lands' | 'notaires' | 'geometres' | 'clients' | 'chat' | 'audit'>('overview');
  const [isCoordinationMenuOpen, setIsCoordinationMenuOpen] = useState<boolean>(true); // Gère le déroulement du menu Coordination

  // --- ÉTATS DE DONNÉES ---
  const [landSearchQuery, setLandSearchQuery] = useState<string>('');
  const [landStatusFilter, setLandStatusFilter] = useState<string>('all');
  const [landCityFilter, setLandCityFilter] = useState<string>('all');

  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [addUserModalOpen, setAddUserModalOpen] = useState<boolean>(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', phone: '', certificationId: '' });

  const [lands, setLands] = useState<Cadastre[]>([
    { id: 'TER-2024-0015', title: 'Superbe parcelle plane résidentielle', city: 'Yaoundé', landTitle: 'TF-1532/CM/CEN', owner: 'Jean Dupont', price: '15 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0012', title: 'Vaste domaine agricole', city: 'Mbankomo', landTitle: 'TF-0987/CM/CEN', owner: 'Sylvestre Atangana', price: '8 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0005', title: 'Terrain panoramique', city: 'Bafoussam', landTitle: 'TF-2241/CM/OUE', owner: 'Emmanuel Kamga', price: '6 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0002', title: 'Parcelle commerciale de premier choix', city: 'Douala', landTitle: 'TF-0341/CM/LIT', owner: 'Lucie Mefire', price: '18 000 000 FCFA', status: 'pending', statusLabel: 'En attente' }
  ]);

  const [acteurs, setActeurs] = useState<Acteur[]>([
    { id: 'NOT-0021', name: 'Me Mireille Dubois', role: 'Notaire', email: 'm.dubois@notaire.cm', phone: '+237 699 00 11 22', joinDate: '12 Jan 2023', certificationId: 'CN-2023-890', active: true, docCount: 15, avatarClass: 'notary', initials: 'MD' },
    { id: 'NOT-0022', name: 'Me Jean-Paul Nkodo', role: 'Notaire', email: 'jp.nkodo@etude.cm', phone: '+237 677 22 33 44', joinDate: '05 Mar 2023', certificationId: 'CN-2023-451', active: true, docCount: 8, avatarClass: 'notary', initials: 'JN' },
    { id: 'GEO-0481', name: 'Paul Mbarga', role: 'Géomètre', email: 'p.mbarga@geo.cm', phone: '+237 695 55 66 77', joinDate: '22 Fév 2024', certificationId: 'ONIGE-902', active: false, docCount: 7, avatarClass: 'geometre', initials: 'PM' },
    { id: 'USR-0891', name: 'Jean Dupont', role: 'Vendeur', email: 'j.dupont@mail.com', phone: '+237 690 12 34 56', joinDate: '10 Avr 2024', active: true, docCount: 4, avatarClass: 'seller', initials: 'JD' },
    { id: 'USR-1152', name: 'Martin Kamga', role: 'Acheteur', email: 'm.kamga@mail.com', phone: '+237 670 98 76 54', joinDate: '01 Mai 2024', active: true, docCount: 2, avatarClass: 'buyer', initials: 'MK' }
  ]);

  const contacts: Contact[] = [
    { id: 'c1', name: 'Me Mireille Dubois', role: 'Notaire', avatarClass: 'notary', initials: 'MD', autoReply: "Bonjour M. l'Administrateur, j'ai suspendu l'instruction du dossier en attendant les conclusions du litige que vous venez de signaler." },
    { id: 'c2', name: 'Paul Mbarga', role: 'Géomètre', avatarClass: 'geometre', initials: 'PM', autoReply: "Bonjour Chef, bien reçu. Je me rends sur place à Douala pour effectuer un contre-bornage contradictoire." },
    { id: 'c3', name: 'Jean Dupont', role: 'Vendeur', avatarClass: 'seller', initials: 'JD', autoReply: "Bonjour, je conteste ce litige ! Mon titre foncier est parfaitement en règle." },
    { id: 'c4', name: 'Martin Kamga', role: 'Acheteur', avatarClass: 'buyer', initials: 'MK', autoReply: "Bonjour, je vous remercie de veiller sur ma sécurité. J'attends la résolution du litige avant le paiement." }
  ];

  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    c1: [{ sender: 'other', text: "Bonjour, le rapport cadastral mensuel a été déposé dans votre coffre sécurisé.", time: '10:15' }]
  });
  const [writtenMessage, setWrittenMessage] = useState<string>('');
  const currentContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '16:45:12', type: 'info', msg: 'Démarrage de l\'analyse cadastrale de la transaction TR-2024-0015.' },
    { time: '16:45:20', type: 'ok', msg: 'Titre Foncier TF-1532/CM/CEN validé avec succès en base d\'État.' }
  ]);

  // --- ACTIONS ---
  const handleToggleFreezeLand = (id: string) => {
    setLands(prev => prev.map(l => {
      if (l.id === id) {
        const isCurrentlyFrozen = l.status === 'frozen';
        setLogs([{ time: new Date().toLocaleTimeString('fr-FR'), type: isCurrentlyFrozen ? 'ok' : 'alert', msg: isCurrentlyFrozen ? `Parcelle ${id} dégelée.` : `ALERTE : Parcelle ${id} gelée.` }, ...logs]);
        return { ...l, status: isCurrentlyFrozen ? 'certified' : 'frozen', statusLabel: isCurrentlyFrozen ? 'Certifié' : 'En litige' };
      }
      return l;
    }));
  };

  const handleToggleUserAccount = (id: string) => {
    setActeurs(prev => prev.map(a => {
      if (a.id === id) {
        const targetActive = !a.active;
        setLogs([{ time: new Date().toLocaleTimeString('fr-FR'), type: targetActive ? 'ok' : 'alert', msg: `Le compte de ${a.name} a été ${targetActive ? 'réactivé' : 'suspendu'}.` }, ...logs]);
        return { ...a, active: targetActive };
      }
      return a;
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const roleMap: Record<string, 'Notaire' | 'Géomètre' | 'Acheteur'> = { 'notaires': 'Notaire', 'geometres': 'Géomètre', 'clients': 'Acheteur' };
    const roleToAdd = roleMap[activeTab] || 'Acheteur';
    const prefix = roleToAdd === 'Notaire' ? 'NOT' : roleToAdd === 'Géomètre' ? 'GEO' : 'USR';
    
    const newUser: Acteur = {
      id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`, name: newUserForm.name, role: roleToAdd,
      email: newUserForm.email, phone: newUserForm.phone, joinDate: new Date().toLocaleDateString('fr-FR'),
      certificationId: newUserForm.certificationId, active: true, docCount: 0,
      avatarClass: roleToAdd === 'Notaire' ? 'notary' : roleToAdd === 'Géomètre' ? 'geometre' : 'buyer',
      initials: newUserForm.name.substring(0, 2).toUpperCase()
    };

    setActeurs([newUser, ...acteurs]);
    setAddUserModalOpen(false);
    setNewUserForm({ name: '', email: '', phone: '', certificationId: '' });
    setLogs([{ time: new Date().toLocaleTimeString('fr-FR'), type: 'ok', msg: `Nouvel utilisateur ajouté : ${newUser.name} (${newUser.role})` }, ...logs]);
  };

  const handleSendMessage = () => {
    if (!writtenMessage.trim()) return;
    const newMsg: Message = { sender: 'admin', text: writtenMessage, time: 'À l\'instant' };
    setChatHistory({ ...chatHistory, [activeContactId]: [...(chatHistory[activeContactId] || []), newMsg] });
    setWrittenMessage('');

    setTimeout(() => {
      setChatHistory(prev => ({
        ...prev, [activeContactId]: [...(prev[activeContactId] || []), { sender: 'other', text: currentContact.autoReply, time: 'À l\'instant' }]
      }));
    }, 1500);
  };

  const handleLogoutClick = () => {
    if (window.confirm("Fermer la session Administrateur ?")) {
      if (onLogout) onLogout();
    }
  };

  // --- FILTRES ---
  const filteredLands = lands.filter(l => {
    const q = landSearchQuery.toLowerCase();
    const matchesSearch = l.title.toLowerCase().includes(q) || l.owner.toLowerCase().includes(q) || l.landTitle.toLowerCase().includes(q);
    const matchesStatus = landStatusFilter === 'all' || l.status === landStatusFilter;
    const matchesCity = landCityFilter === 'all' || l.city.includes(landCityFilter);
    return matchesSearch && matchesStatus && matchesCity;
  });

  const activeUserList = acteurs.filter(a => {
    if (activeTab === 'notaires' && a.role !== 'Notaire') return false;
    if (activeTab === 'geometres' && a.role !== 'Géomètre') return false;
    if (activeTab === 'clients' && (a.role !== 'Acheteur' && a.role !== 'Vendeur')) return false;
    const q = userSearchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });
  const selectedUser = acteurs.find(a => a.id === selectedUserId) || activeUserList[0];

  return (
    <div className="admin-layout">
      
      {/* 1. BARRE LATÉRALE DE GAUCHE */}
      <aside className="admin-sidebar">
        <div className="admin-logo-box">
          <span className="admin-logo-text">MBOA<span style={{ color: '#0f172a' }}>LAND</span></span>
          <p style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: 800, margin: '2px 0 0' }}>SUPER ADMIN</p>
        </div>

        <nav>
          <ul className="admin-menu-list">
            <li className={`admin-menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard className="w-4 h-4" /> Vue d'ensemble
            </li>
            
            <li className={`admin-menu-item ${activeTab === 'lands' ? 'active' : ''}`} onClick={() => setActiveTab('lands')}>
              <MapPin className="w-4 h-4" /> Gestion des parcelles
            </li>

            {/* Menu Déroulant Coordination */}
            <li 
              className={`admin-menu-item ${(activeTab === 'notaires' || activeTab === 'geometres' || activeTab === 'clients') ? 'active' : ''}`} 
              onClick={() => setIsCoordinationMenuOpen(!isCoordinationMenuOpen)}
            >
              <Users className="w-4 h-4" /> Coordination Réseau
              {isCoordinationMenuOpen ? <ChevronUp className="w-4 h-4" style={{marginLeft: 'auto'}} /> : <ChevronDown className="w-4 h-4" style={{marginLeft: 'auto'}} />}
            </li>
            
            {/* Les Sous-Menus */}
            {isCoordinationMenuOpen && (
              <div className="admin-submenu-container">
                <li className={`admin-submenu-item ${activeTab === 'notaires' ? 'active' : ''}`} onClick={() => {setActiveTab('notaires'); setSelectedUserId(null);}}>
                  Officiers Notaires
                </li>
                <li className={`admin-submenu-item ${activeTab === 'geometres' ? 'active' : ''}`} onClick={() => {setActiveTab('geometres'); setSelectedUserId(null);}}>
                  Experts Géomètres
                </li>
                <li className={`admin-submenu-item ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => {setActiveTab('clients'); setSelectedUserId(null);}}>
                  Acheteurs & Vendeurs
                </li>
              </div>
            )}

            <li className={`admin-menu-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <MessageSquare className="w-4 h-4" /> Messagerie privée
            </li>
            <li className={`admin-menu-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
              <Terminal className="w-4 h-4" /> Journal d'audit
            </li>
          </ul>
        </nav>

        {/* Bouton de déconnexion */}
        <button onClick={handleLogoutClick} className="btn-admin-action danger" style={{ marginTop: 'auto', width: '100%' }}>
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </aside>

      {/* 2. CONTENU PRINCIPAL */}
      <main className="admin-main-content">
        <header className="admin-top-header">
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Console d'Administration</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)', margin: '2px 0 0' }}>Régulation domaniale et supervision du réseau.</p>
          </div>
          <div className="admin-header-profile">
            {/* Icône de notifications */}
            <div style={{ position: 'relative', cursor: 'pointer', padding: '0.25rem' }}>
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </div>

            {/* Icône de messagerie */}
            <Mail className="w-5 h-5 text-slate-500" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('chat')} />
            
            {/* Ligne verticale de séparation */}
            <div style={{ height: '24px', width: '1px', backgroundColor: '#e2e8f0' }} />
            
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Admin Principal</span>
            
           {/* Avatar AD (Forme ronde forcée en ligne) */}
            <div 
              className="admin-user-avatar" 
              style={{ 
                backgroundColor: 'var(--admin-primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
                fontSize: '0.8rem', 
                width: '36px',          /* Forcé en ligne [1] */
                height: '36px',         /* Forcé en ligne [1] */
                borderRadius: '50%',    /* Forcé en ligne [1] */
                border: '2px solid #e2f2ec', /* Forcé en ligne [1] */
                flexShrink: 0 
              }}
            >
              AD
            </div>

            {/* Bouton de déconnexion */}
            <span title="Se déconnecter" onClick={handleLogoutClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <LogOut className="w-5 h-5 text-rose-500" />
            </span>
          </div>
        </header>

        <div className="admin-inner-container">

          {/* ================= ONGLET 1 : VUE D'ENSEMBLE (Graphes Mboaland) ================= */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card"><div className="admin-stat-icon-wrapper blue"><MapPin className="w-5 h-5" /></div><div><div className="admin-stat-value">{lands.length}</div><div className="admin-stat-label">Parcelles gérées</div></div></div>
                <div className="admin-stat-card"><div className="admin-stat-icon-wrapper amber"><Users className="w-5 h-5" /></div><div><div className="admin-stat-value">{acteurs.length}</div><div className="admin-stat-label">Utilisateurs actifs</div></div></div>
                <div className="admin-stat-card"><div className="admin-stat-icon-wrapper green"><ShieldCheck className="w-5 h-5" /></div><div><div className="admin-stat-value">{lands.filter(l => l.status === 'certified').length}</div><div className="admin-stat-label">Titres certifiés</div></div></div>
                <div className="admin-stat-card"><div className="admin-stat-icon-wrapper red"><ShieldAlert className="w-5 h-5" /></div><div><div className="admin-stat-value">{lands.filter(l => l.status === 'frozen').length}</div><div className="admin-stat-label">Terrains en litige</div></div></div>
              </div>

              {/* GRAPHIQUE LINÉAIRE D'ACTIVITÉ EN SVG PUR */}
              <div className="activity-chart-card">
                <div className="activity-header-row">
                  <div>
                    <h3 className="activity-title">Activité terrain</h3>
                    <span className="activity-subtitle">Missions traitées sur 7 jours</span>
                  </div>
                  <span className="activity-trend-badge">+14% ce mois</span>
                </div>

                <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                  <svg viewBox="0 0 700 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d5e45" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0d5e45" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    <line x1="40" y1="180" x2="660" y2="180" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="135" x2="660" y2="135" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="67" x2="660" y2="67" stroke="#f1f5f9" strokeWidth={1} />
                    <line x1="40" y1="22" x2="660" y2="22" stroke="#f1f5f9" strokeWidth={1} />

                    <text x="15" y="184" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">0</text>
                    <text x="15" y="139" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">2</text>
                    <text x="15" y="71" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">5</text>
                    <text x="15" y="26" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">7</text>

                    <path d="M 60,146 L 160,94 L 260,116 L 360,74 L 460,52 L 560,94 L 660,22 L 660,180 L 60,180 Z" fill="url(#chartAreaGradient)" />
                    <path d="M 60,146 L 160,94 L 260,116 L 360,74 L 460,52 L 560,94 L 660,22" fill="none" stroke="#0d5e45" strokeWidth={3} strokeLinecap="round" />

                    <circle cx="60" cy="146" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="160" cy="94" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="260" cy="116" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="360" cy="74" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="460" cy="52" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="560" cy="94" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />
                    <circle cx="660" cy="22" r="6" fill="#0d5e45" stroke="#ffffff" strokeWidth={2} />

                    <text x="52" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J1</text>
                    <text x="152" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J2</text>
                    <text x="252" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J3</text>
                    <text x="352" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J4</text>
                    <text x="452" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J5</text>
                    <text x="552" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J6</text>
                    <text x="652" y="198" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">J7</text>
                  </svg>
                </div>
              </div>

              {/* Les graphiques en barres Mboaland */}
              <div className="admin-charts-row">
                <div className="admin-chart-card">
                  <h4 className="chart-title">Statut global des parcelles</h4>
                  <div className="chart-bar-container">
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row"><span>Titres Certifiés conformes</span><span>75%</span></div>
                      <div className="chart-progress-bg"><div className="chart-progress-fill primary" style={{ width: '75%' }} /></div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row"><span>Annonces en évaluation</span><span>15%</span></div>
                      <div className="chart-progress-bg"><div className="chart-progress-fill amber" style={{ width: '15%' }} /></div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row"><span>Terrains sous litige</span><span>10%</span></div>
                      <div className="chart-progress-bg"><div className="chart-progress-fill red" style={{ width: '10%' }} /></div>
                    </div>
                  </div>
                </div>

                <div className="admin-chart-card">
                  <h4 className="chart-title">Répartition domaniale par usage</h4>
                  <div className="chart-bar-container">
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row"><span>Zones Résidentielles</span><span>55%</span></div>
                      <div className="chart-progress-bg"><div className="chart-progress-fill primary" style={{ width: '55%' }} /></div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row"><span>Zones Agricoles</span><span>25%</span></div>
                      <div className="chart-progress-bg"><div className="chart-progress-fill primary" style={{ width: '25%' }} /></div>
                    </div>
                    <div className="chart-bar-row">
                      <div className="chart-bar-label-row"><span>Zones Commerciales</span><span>20%</span></div>
                      <div className="chart-progress-bg"><div className="chart-progress-fill primary" style={{ width: '20%' }} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= ONGLET 2 : GESTION DES TERRAINS (Litiges) ================= */}
          {activeTab === 'lands' && (
            <div className="admin-card-box">
              <div className="admin-filters-bar">
                <div className="search-field-group" style={{ backgroundColor: 'white', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '0.2rem 0.75rem', flex: 2 }}>
                  <Search className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Rechercher par Titre Foncier, Nom, Propriétaire..." value={landSearchQuery} onChange={(e) => setLandSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', padding: '0.4rem' }} />
                </div>
                
                <select className="admin-select" value={landCityFilter} onChange={(e) => setLandCityFilter(e.target.value)} style={{ flex: 1 }}>
                  <option value="all">Toutes les Villes</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Douala">Douala</option>
                  <option value="Bafoussam">Bafoussam</option>
                </select>

                <select className="admin-select" value={landStatusFilter} onChange={(e) => setLandStatusFilter(e.target.value)} style={{ flex: 1 }}>
                  <option value="all">Tous les statuts</option>
                  <option value="certified">Certifiés (Conformes)</option>
                  <option value="pending">En attente d'évaluation</option>
                  <option value="frozen">En litige (Bloqués)</option>
                </select>
              </div>

              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>Titre Foncier</th><th>Nom / Localisation</th><th>Propriétaire</th><th>Statut</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredLands.map((l) => (
                    <tr key={l.id}>
                      <td><strong>{l.id}</strong></td>
                      <td><code style={{ fontWeight: 'bold' }}>{l.landTitle}</code></td>
                      <td><strong>{l.title}</strong><br/><span style={{fontSize: '0.75rem', color: '#64748b'}}>{l.city}</span></td>
                      <td>{l.owner}</td>
                      <td>
                        {l.status === 'certified' && <span className="admin-badge success">Certifié</span>}
                        {l.status === 'pending' && <span className="admin-badge pending">En attente</span>}
                        {l.status === 'frozen' && <span className="admin-badge danger">En litige</span>}
                      </td>
                      <td>
                        <button onClick={() => handleToggleFreezeLand(l.id)} className={`btn-admin-action ${l.status === 'frozen' ? 'success' : 'danger'}`}>
                          {l.status === 'frozen' ? 'Lever le litige' : 'Mettre en litige'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= ONGLETS ACTEURS (Notaires, Géomètres, Clients) ================= */}
          {(activeTab === 'notaires' || activeTab === 'geometres' || activeTab === 'clients') && (
            <div className="admin-grid-content">
              
              <div className="admin-card-box" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                    {activeTab === 'notaires' ? 'Officiers Notaires' : activeTab === 'geometres' ? 'Experts Géomètres' : 'Clients Plateforme'}
                  </h3>
                  <button className="btn-admin-action primary" onClick={() => setAddUserModalOpen(true)}>
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>

                <div className="admin-filters-bar">
                  <input type="text" placeholder="Rechercher (Nom, Email, ID)..." className="admin-search-input" value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} />
                </div>

                <table className="admin-table">
                  <thead>
                    <tr><th>Utilisateur</th><th>Statut</th><th>Docs</th></tr>
                  </thead>
                  <tbody>
                    {activeUserList.map((u) => (
                      <tr key={u.id} className={`admin-row-clickable ${selectedUserId === u.id || (!selectedUserId && selectedUser?.id === u.id) ? 'active' : ''}`} onClick={() => setSelectedUserId(u.id)}>
                        <td>
                          <strong style={{ display: 'block' }}>{u.name}</strong>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{u.id}</span>
                        </td>
                        <td>{u.active ? <span className="admin-badge success">Actif</span> : <span className="admin-badge danger">Suspendu</span>}</td>
                        <td><strong>{u.docCount}</strong></td>
                      </tr>
                    ))}
                    {activeUserList.length === 0 && <tr><td colSpan={3} style={{textAlign:'center', padding:'2rem'}}>Aucun résultat.</td></tr>}
                  </tbody>
                </table>
              </div>

              {selectedUser && (
                <div className="admin-drawer">
                  <div className="drawer-header-row">
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Détails du profil</h3>
                    <span className={`admin-badge ${selectedUser.active ? 'success' : 'danger'}`}>{selectedUser.active ? 'Actif' : 'Suspendu'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className={`admin-chat-avatar ${selectedUser.avatarClass}`} style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>{selectedUser.initials}</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{selectedUser.name}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)', fontWeight: 600, marginTop: '0.15rem' }}>{selectedUser.role} · Inscrit le {selectedUser.joinDate}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div className="drawer-detail-row"><span className="drawer-detail-label">Identifiant :</span><span className="drawer-detail-value">{selectedUser.id}</span></div>
                    <div className="drawer-detail-row"><span className="drawer-detail-label">Email :</span><span className="drawer-detail-value">{selectedUser.email}</span></div>
                    <div className="drawer-detail-row"><span className="drawer-detail-label">Téléphone :</span><span className="drawer-detail-value">{selectedUser.phone}</span></div>
                    {selectedUser.certificationId && (
                      <div className="drawer-detail-row"><span className="drawer-detail-label">N° Agrément :</span><span className="drawer-detail-value" style={{ color: 'var(--admin-primary)' }}>{selectedUser.certificationId}</span></div>
                    )}
                    <div className="drawer-detail-row"><span className="drawer-detail-label">Documents validés :</span><span className="drawer-detail-value">{selectedUser.docCount}</span></div>
                  </div>

                  <button 
                    onClick={() => handleToggleUserAccount(selectedUser.id)}
                    className={`btn-admin-action ${selectedUser.active ? 'danger' : 'success'}`} 
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    {selectedUser.active ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    {selectedUser.active ? 'Suspendre cet accès' : 'Réactiver ce compte'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= ONGLET MESSAGERIE PRIVÉE ================= */}
          {activeTab === 'chat' && (
            <div className="admin-chat-layout">
              <div className="admin-chat-sidebar">
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Discussions Actives</h4>
                </div>

                <span className="chat-role-label">Officiers Ministériels</span>
                {contacts.filter(c => c.role === 'Notaire' || c.role === 'Géomètre').map(c => (
                  <div key={c.id} className={`admin-chat-contact-row ${activeContactId === c.id ? 'active' : ''}`} onClick={() => setActiveContactId(c.id)}>
                    <div className={`admin-chat-avatar ${c.avatarClass}`}>{c.initials}</div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>{c.role}</span>
                    </div>
                  </div>
                ))}

                <span className="chat-role-label">Citoyens (Acheteurs &amp; Vendeurs)</span>
                {contacts.filter(c => c.role === 'Acheteur' || c.role === 'Vendeur').map(c => (
                  <div key={c.id} className={`admin-chat-contact-row ${activeContactId === c.id ? 'active' : ''}`} onClick={() => setActiveContactId(c.id)}>
                    <div className={`admin-chat-avatar ${c.avatarClass}`}>{c.initials}</div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>

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

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '0.75rem', backgroundColor: '#ffffff' }}>
                  <input type="text" placeholder={`Écrire un message d'arbitrage à ${currentContact.name}...`} className="admin-search-input" value={writtenMessage} onChange={(e) => setWrittenMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} />
                  <button className="btn-admin-action primary" style={{ width: 'auto', padding: '0.65rem 1.5rem' }} onClick={handleSendMessage}>
                    Envoyer <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= ONGLET AUDIT ================= */}
          {activeTab === 'audit' && (
            <div className="admin-card-box">
              <h3 className="section-title" style={{ marginTop: 0 }}>Journal d'audit cryptographique</h3>
              <div className="audit-log-terminal" style={{ maxHeight: 'none' }}>
                {logs.map((log, idx) => (
                  <div key={idx} className="log-entry">
                    <span className="log-timestamp">[{log.time}]</span>
                    <span className={`log-message ${log.type}`}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODALE D'AJOUT D'UTILISATEUR */}
      {addUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Créer un compte {activeTab === 'notaires' ? 'Notaire' : activeTab === 'geometres' ? 'Géomètre' : 'Client'}</h3>
              <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={() => setAddUserModalOpen(false)} />
            </div>

            <form onSubmit={handleAddUser}>
              <label className="form-group-label">Nom complet</label>
              <input type="text" required className="form-group-input" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} placeholder="Ex: Jean Dupont" />

              <label className="form-group-label">Email professionnel</label>
              <input type="email" required className="form-group-input" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} placeholder="contact@email.com" />

              <label className="form-group-label">Téléphone</label>
              <input type="tel" required className="form-group-input" value={newUserForm.phone} onChange={e => setNewUserForm({...newUserForm, phone: e.target.value})} placeholder="+237 600 00 00 00" />

              {(activeTab === 'notaires' || activeTab === 'geometres') && (
                <>
                  <label className="form-group-label">N° Agrément d'État (Obligatoire)</label>
                  <input type="text" required className="form-group-input" value={newUserForm.certificationId} onChange={e => setNewUserForm({...newUserForm, certificationId: e.target.value})} placeholder="Ex: CN-2024-XXX" />
                </>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-admin-action" onClick={() => setAddUserModalOpen(false)} style={{ flex: 1 }}>Annuler</button>
                <button type="submit" className="btn-admin-action primary" style={{ flex: 1 }}>Créer le compte</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}