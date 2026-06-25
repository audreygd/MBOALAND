// @ts-nocheck
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, ShieldAlert, FileText, Check, Search, 
  ShieldCheck, Terminal, MapPin, MessageSquare, Send, LogOut, Plus, X, 
  Ban, Compass, ChevronDown, ChevronUp, Bell, Mail
} from 'lucide-react';
import { 
  ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, 
  Paper, Avatar, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, IconButton, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Divider, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, MenuItem, InputAdornment, Collapse, Grid, Select
} from '@mui/material';

const theme = createTheme({
  palette: { 
    primary: { main: '#0a5c44', dark: '#05332c' }, 
    error: { main: '#dc2626', light: '#fef2f2' }, 
    warning: { main: '#f59e0b', light: '#fffbeb' },
    success: { main: '#10b981', light: '#f0fdf4' },
    background: { default: '#f8fafc', paper: '#ffffff' }, 
    text: { primary: '#1e293b', secondary: '#64748b' } 
  },
  typography: { 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
    h4: { fontSize: '1.5rem', fontWeight: 800 },
    h5: { fontSize: '1.25rem', fontWeight: 800 },
    h6: { fontSize: '1.05rem', fontWeight: 800 },
    subtitle1: { fontSize: '0.95rem', fontWeight: 800 },
    subtitle2: { fontSize: '0.85rem', fontWeight: 700 },
    body1: { fontSize: '0.85rem', lineHeight: 1.5 },
    body2: { fontSize: '0.75rem' }, 
    button: { textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' } 
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', borderBottom: '2px solid #e2e8f0', padding: '12px 16px', backgroundColor: '#f8fafc' },
        body: { fontSize: '0.85rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }
      }
    }
  }
});

interface AdminDashboardProps { onLogout?: () => void; }
interface Cadastre { id: string; title: string; city: string; landTitle: string; owner: string; price: string; status: 'certified' | 'pending' | 'frozen'; statusLabel: string; }
interface Acteur { id: string; name: string; role: 'Acheteur' | 'Vendeur' | 'Notaire' | 'Géomètre'; email: string; phone: string; joinDate: string; certificationId?: string; active: boolean; docCount: number; avatarBg: string; initials: string; }
interface LogEntry { time: string; type: 'info' | 'ok' | 'alert'; msg: string; }
interface Contact { id: string; name: string; role: string; avatarBg: string; initials: string; autoReply: string; }
interface Message { sender: 'admin' | 'other'; text: string; time: string; }

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'lands' | 'notaires' | 'geometres' | 'vendeurs' | 'acheteurs' | 'chat' | 'audit'>('overview');
  const [isCoordinationMenuOpen, setIsCoordinationMenuOpen] = useState(true);

  const [landSearchQuery, setLandSearchQuery] = useState('');
  const [landStatusFilter, setLandStatusFilter] = useState('all');
  const [landCityFilter, setLandCityFilter] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>('NOT-0021');
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', phone: '', certificationId: '' });

  const [lands, setLands] = useState<Cadastre[]>([
    { id: 'TER-2024-0015', title: 'Superbe parcelle plane résidentielle', city: 'Yaoundé', landTitle: 'TF-1532/CM/CEN', owner: 'Jean Dupont', price: '15 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0012', title: 'Vaste domaine agricole', city: 'Mbankomo', landTitle: 'TF-0987/CM/CEN', owner: 'Sylvestre Atangana', price: '8 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0005', title: 'Terrain panoramique', city: 'Bafoussam', landTitle: 'TF-2241/CM/OUE', owner: 'Emmanuel Kamga', price: '6 000 000 FCFA', status: 'certified', statusLabel: 'Certifié' },
    { id: 'TER-2024-0002', title: 'Parcelle commerciale de premier choix', city: 'Douala', landTitle: 'TF-0341/CM/LIT', owner: 'Lucie Mefire', price: '18 000 000 FCFA', status: 'pending', statusLabel: 'En attente' }
  ]);

  const [acteurs, setActeurs] = useState<Acteur[]>([
    { id: 'NOT-0021', name: 'Me Mireille Dubois', role: 'Notaire', email: 'm.dubois@notaire.cm', phone: '+237 699 00 11 22', joinDate: '12 Jan 2023', certificationId: 'CN-2023-890', active: true, docCount: 15, avatarBg: '#3b82f6', initials: 'MD' },
    { id: 'NOT-0022', name: 'Me Jean-Paul Nkodo', role: 'Notaire', email: 'jp.nkodo@etude.cm', phone: '+237 677 22 33 44', joinDate: '05 Mar 2023', certificationId: 'CN-2023-451', active: true, docCount: 8, avatarBg: '#3b82f6', initials: 'JN' },
    { id: 'GEO-0481', name: 'Paul Mbarga', role: 'Géomètre', email: 'p.mbarga@geo.cm', phone: '+237 695 55 66 77', joinDate: '22 Fév 2024', certificationId: 'ONIGE-902', active: false, docCount: 7, avatarBg: '#f59e0b', initials: 'PM' },
    { id: 'USR-0891', name: 'Jean Dupont', role: 'Vendeur', email: 'j.dupont@mail.com', phone: '+237 690 12 34 56', joinDate: '10 Avr 2024', active: true, docCount: 4, avatarBg: '#8b5cf6', initials: 'JD' },
    { id: 'USR-1152', name: 'Martin Kamga', role: 'Acheteur', email: 'm.kamga@mail.com', phone: '+237 670 98 76 54', joinDate: '01 Mai 2024', active: true, docCount: 2, avatarBg: '#10b981', initials: 'MK' }
  ]);

  const contacts: Contact[] = [
    { id: 'c1', name: 'Me Mireille Dubois', role: 'Notaire', avatarBg: '#3b82f6', initials: 'MD', autoReply: "Bonjour, j'ai bien reçu vos instructions concernant le litige." },
    { id: 'c2', name: 'Paul Mbarga', role: 'Géomètre', avatarBg: '#f59e0b', initials: 'PM', autoReply: "Je vérifie les coordonnées cadastrales ce matin." },
    { id: 'c3', name: 'Jean Dupont', role: 'Vendeur', avatarBg: '#8b5cf6', initials: 'JD', autoReply: "Bonjour, merci de m'avoir contacté." },
    { id: 'c4', name: 'Martin Kamga', role: 'Acheteur', avatarBg: '#10b981', initials: 'MK', autoReply: "J'attends l'approbation du notaire." }
  ];

  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({ c1: [{ sender: 'other', text: "Le rapport d'activité est disponible.", time: '10:15' }] });
  const [writtenMessage, setWrittenMessage] = useState('');
  const currentContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '16:45:12', type: 'info', msg: 'Démarrage de l\'analyse cadastrale de la transaction TR-2024-0015.' },
    { time: '16:45:20', type: 'ok', msg: 'Titre Foncier TF-1532/CM/CEN validé avec succès.' }
  ]);

  // Actions
  const handleToggleFreezeLand = (id: string) => {
    setLands(prev => prev.map(l => {
      if (l.id === id) {
        const isFrozen = l.status === 'frozen';
        setLogs([{ time: new Date().toLocaleTimeString('fr-FR'), type: isFrozen ? 'ok' : 'alert', msg: isFrozen ? `Parcelle ${id} dégelée.` : `ALERTE : Parcelle ${id} gelée.` }, ...logs]);
        return { ...l, status: isFrozen ? 'certified' : 'frozen', statusLabel: isFrozen ? 'Certifié' : 'En litige' };
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
    const roleMap: Record<string, 'Notaire' | 'Géomètre' | 'Vendeur' | 'Acheteur'> = { 'notaires': 'Notaire', 'geometres': 'Géomètre', 'vendeurs': 'Vendeur', 'acheteurs': 'Acheteur' };
    const roleToAdd = roleMap[activeTab] || 'Acheteur';
    const prefix = roleToAdd === 'Notaire' ? 'NOT' : roleToAdd === 'Géomètre' ? 'GEO' : 'USR';
    const newUser: Acteur = {
      id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`, name: newUserForm.name, role: roleToAdd,
      email: newUserForm.email, phone: newUserForm.phone, joinDate: new Date().toLocaleDateString('fr-FR'),
      certificationId: newUserForm.certificationId, active: true, docCount: 0,
      avatarBg: roleToAdd === 'Notaire' ? '#3b82f6' : roleToAdd === 'Géomètre' ? '#f59e0b' : roleToAdd === 'Vendeur' ? '#8b5cf6' : '#10b981',
      initials: newUserForm.name.substring(0, 2).toUpperCase()
    };
    setActeurs([newUser, ...acteurs]);
    setAddUserModalOpen(false);
    setNewUserForm({ name: '', email: '', phone: '', certificationId: '' });
    setLogs([{ time: new Date().toLocaleTimeString('fr-FR'), type: 'ok', msg: `Nouveau compte créé : ${newUser.name}` }, ...logs]);
  };

  const handleSendMessage = () => {
    if (!writtenMessage.trim()) return;
    setChatHistory({ ...chatHistory, [activeContactId]: [...(chatHistory[activeContactId] || []), { sender: 'admin', text: writtenMessage, time: 'À l\'instant' }] });
    setWrittenMessage('');
    setTimeout(() => {
      setChatHistory(prev => ({ ...prev, [activeContactId]: [...(prev[activeContactId] || []), { sender: 'other', text: currentContact.autoReply, time: 'À l\'instant' }] }));
    }, 1500);
  };

  const handleLogoutClick = () => {
    if (window.confirm("Fermer la session Administrateur ?")) {
      if (onLogout) onLogout();
    }
  };

  const filteredLands = lands.filter(l => {
    const q = landSearchQuery.toLowerCase();
    const matchSearch = l.title.toLowerCase().includes(q) || l.owner.toLowerCase().includes(q) || l.landTitle.toLowerCase().includes(q);
    const matchStatus = landStatusFilter === 'all' || l.status === landStatusFilter;
    const matchCity = landCityFilter === 'all' || l.city.includes(landCityFilter);
    return matchSearch && matchStatus && matchCity;
  });

  const activeUserList = acteurs.filter(a => {
    if (activeTab === 'notaires' && a.role !== 'Notaire') return false;
    if (activeTab === 'geometres' && a.role !== 'Géomètre') return false;
    if (activeTab === 'vendeurs' && a.role !== 'Vendeur') return false;
    if (activeTab === 'acheteurs' && a.role !== 'Acheteur') return false;
    const q = userSearchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });
  const selectedUser = acteurs.find(a => a.id === selectedUserId) || activeUserList[0];

  const MenuButton = ({ id, icon: Icon, label, isSubItem = false }: any) => (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton 
        selected={activeTab === id} 
        onClick={() => { setActiveTab(id); if(isSubItem) setSelectedUserId(null); }}
        sx={{ borderRadius: 2, pl: isSubItem ? 4 : 2, '&.Mui-selected': { bgcolor: isSubItem ? '#e2f2ec' : 'primary.main', color: isSubItem ? 'primary.dark' : 'white', '& .MuiListItemIcon-root': { color: isSubItem ? 'primary.dark' : 'white' }, '&:hover': { bgcolor: isSubItem ? '#d1fae5' : 'primary.dark' } } }}
      >
        {!isSubItem && <ListItemIcon sx={{ minWidth: 36, color: activeTab === id ? 'white' : 'text.secondary' }}><Icon size={18} /></ListItemIcon>}
        <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 600, fontSize: isSubItem ? '0.85rem' : '0.9rem' }} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        
        {/* ===================== 1. BARRE LATÉRALE ===================== */}
        <Box sx={{ width: 260, flexShrink: 0, bgcolor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography variant="h5" fontWeight="900" color="primary.main">MBOA<Box component="span" sx={{ color: '#0f172a' }}>LAND</Box></Typography>
            <Typography variant="caption" fontWeight="800" color="error.main" sx={{ letterSpacing: '0.05em' }}>SUPER ADMIN</Typography>
          </Box>
          <Box sx={{ px: 2, py: 2, flexGrow: 1, overflowY: 'auto' }}>
            <List>
              <MenuButton id="overview" icon={LayoutDashboard} label="Vue d'ensemble" />
              <MenuButton id="lands" icon={MapPin} label="Gestion des parcelles" />
              
              <ListItem disablePadding sx={{ mb: 0.5, mt: 1 }}>
                <ListItemButton onClick={() => setIsCoordinationMenuOpen(!isCoordinationMenuOpen)} sx={{ borderRadius: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}><Users size={18} /></ListItemIcon>
                  <ListItemText primary="Coordination Réseau" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                  {isCoordinationMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </ListItemButton>
              </ListItem>
              
              <Collapse in={isCoordinationMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ borderLeft: '2px solid #e2e8f0', ml: 3, mb: 1 }}>
                  <MenuButton id="notaires" label="Officiers Notaires" isSubItem />
                  <MenuButton id="geometres" label="Experts Géomètres" isSubItem />
                  <MenuButton id="vendeurs" label="Vendeurs Propriétaires" isSubItem />
                  <MenuButton id="acheteurs" label="Acheteurs Citoyens" isSubItem />
                </List>
              </Collapse>

              <MenuButton id="chat" icon={MessageSquare} label="Messagerie privée" />
              <MenuButton id="audit" icon={Terminal} label="Journal d'audit" />
            </List>
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
            <Button fullWidth variant="outlined" color="error" startIcon={<LogOut size={16} />} onClick={handleLogoutClick} sx={{ bgcolor: 'error.light', border: 'none' }}>Déconnexion</Button>
          </Box>
        </Box>

        {/* ===================== 2. CONTENU PRINCIPAL ===================== */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', p: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight="800">Console d'Administration</Typography>
              <Typography variant="body2" color="text.secondary">Régulation domaniale et supervision du réseau.</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton size="small"><Bell size={20} /></IconButton>
              <IconButton size="small" onClick={() => setActiveTab('chat')}><Mail size={20} /></IconButton>
              <Divider orientation="vertical" flexItem sx={{ height: 24 }} />
              <Typography variant="subtitle2" fontWeight="700">Admin Principal</Typography>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'error.main', fontWeight: 'bold', fontSize: '0.85rem' }}>AD</Avatar>
              <IconButton size="small" onClick={handleLogoutClick}><LogOut size={20} color="#f43f5e" /></IconButton>
            </Box>
          </Box>

          <Box sx={{ p: 4, overflowY: 'auto', flexGrow: 1, bgcolor: '#f8fafc' }}>
            
            {/* ---------------- ONGLET 1 : VUE D'ENSEMBLE ---------------- */}
            {activeTab === 'overview' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  {[
                    { label: 'Parcelles gérées', value: lands.length, icon: MapPin, color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'Utilisateurs actifs', value: acteurs.length, icon: Users, color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Titres certifiés', value: lands.filter(l => l.status === 'certified').length, icon: ShieldCheck, color: '#10b981', bg: '#f0fdf4' },
                    { label: 'Terrains en litige', value: lands.filter(l => l.status === 'frozen').length, icon: ShieldAlert, color: '#f43f5e', bg: '#fef2f2' },
                  ].map((stat, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: stat.bg, color: stat.color }}>{<stat.icon size={20} />}</Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight="900">{stat.value}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase' }}>{stat.label}</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box><Typography variant="h6" fontWeight="800">Activité terrain</Typography><Typography variant="body2" color="text.secondary">Missions traitées sur 7 jours</Typography></Box>
                    <Typography variant="subtitle2" color="success.main" fontWeight="800">+14% ce mois</Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: '200px', position: 'relative' }}>
                    <svg viewBox="0 0 700 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a5c44" stopOpacity="0.25" /><stop offset="100%" stopColor="#0a5c44" stopOpacity="0.00" /></linearGradient></defs>
                      <line x1="40" y1="180" x2="660" y2="180" stroke="#f1f5f9" /><line x1="40" y1="135" x2="660" y2="135" stroke="#f1f5f9" /><line x1="40" y1="67" x2="660" y2="67" stroke="#f1f5f9" /><line x1="40" y1="22" x2="660" y2="22" stroke="#f1f5f9" />
                      <text x="15" y="184" fill="#94a3b8" fontSize="11">0</text><text x="15" y="139" fill="#94a3b8" fontSize="11">2</text><text x="15" y="71" fill="#94a3b8" fontSize="11">5</text><text x="15" y="26" fill="#94a3b8" fontSize="11">7</text>
                      <path d="M 60,146 L 160,94 L 260,116 L 360,74 L 460,52 L 560,94 L 660,22 L 660,180 L 60,180 Z" fill="url(#g1)" />
                      <path d="M 60,146 L 160,94 L 260,116 L 360,74 L 460,52 L 560,94 L 660,22" fill="none" stroke="#0a5c44" strokeWidth={3} strokeLinecap="round" />
                      {[ [60,146], [160,94], [260,116], [360,74], [460,52], [560,94], [660,22] ].map((pt, i) => <circle key={i} cx={pt[0]} cy={pt[1]} r="6" fill="#0a5c44" stroke="#ffffff" strokeWidth={2} />)}
                      <text x="52" y="198" fill="#94a3b8" fontSize="11">J1</text><text x="152" y="198" fill="#94a3b8" fontSize="11">J2</text><text x="252" y="198" fill="#94a3b8" fontSize="11">J3</text><text x="352" y="198" fill="#94a3b8" fontSize="11">J4</text><text x="452" y="198" fill="#94a3b8" fontSize="11">J5</text><text x="552" y="198" fill="#94a3b8" fontSize="11">J6</text><text x="652" y="198" fill="#94a3b8" fontSize="11">J7</text>
                    </svg>
                  </Box>
                </Paper>

                {/* CORRECTION DES GRAPHES : PLEINE LARGEUR (xs={12}) */}
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="800" sx={{ textTransform: 'uppercase', mb: 3 }}>Statut global des parcelles</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" fontWeight="700">Titres Certifiés conformes</Typography><Typography variant="body2" fontWeight="700">75%</Typography></Box><Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 5 }}><Box sx={{ width: '75%', height: '100%', bgcolor: 'primary.main', borderRadius: 5 }} /></Box></Box>
                        <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" fontWeight="700">Annonces en évaluation</Typography><Typography variant="body2" fontWeight="700">15%</Typography></Box><Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 5 }}><Box sx={{ width: '15%', height: '100%', bgcolor: '#f59e0b', borderRadius: 5 }} /></Box></Box>
                        <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" fontWeight="700">Terrains sous litige</Typography><Typography variant="body2" fontWeight="700">10%</Typography></Box><Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 5 }}><Box sx={{ width: '10%', height: '100%', bgcolor: '#dc2626', borderRadius: 5 }} /></Box></Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="800" sx={{ textTransform: 'uppercase', mb: 3 }}>Répartition domaniale par usage</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" fontWeight="700">Zones Résidentielles</Typography><Typography variant="body2" fontWeight="700">55%</Typography></Box><Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 5 }}><Box sx={{ width: '55%', height: '100%', bgcolor: 'primary.main', borderRadius: 5 }} /></Box></Box>
                        <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" fontWeight="700">Zones Agricoles</Typography><Typography variant="body2" fontWeight="700">25%</Typography></Box><Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 5 }}><Box sx={{ width: '25%', height: '100%', bgcolor: 'primary.main', borderRadius: 5 }} /></Box></Box>
                        <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" fontWeight="700">Zones Commerciales</Typography><Typography variant="body2" fontWeight="700">20%</Typography></Box><Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 5 }}><Box sx={{ width: '20%', height: '100%', bgcolor: 'primary.main', borderRadius: 5 }} /></Box></Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ---------------- ONGLET 2 : GESTION TERRAINS ---------------- */}
            {activeTab === 'lands' && (
              <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', gap: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                  <TextField size="small" placeholder="Rechercher Titre Foncier, Propriétaire..." value={landSearchQuery} onChange={(e) => setLandSearchQuery(e.target.value)} sx={{ bgcolor: 'white', flex: 2, minWidth: '300px' }} InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} color="#94a3b8" /></InputAdornment> }} />
                  <Select size="small" value={landCityFilter} onChange={(e) => setLandCityFilter(e.target.value)} sx={{ bgcolor: 'white', flex: 1, minWidth: '150px' }}>
                    <MenuItem value="all">Toutes les Villes</MenuItem>
                    <MenuItem value="Yaoundé">Yaoundé</MenuItem>
                    <MenuItem value="Douala">Douala</MenuItem>
                    <MenuItem value="Bafoussam">Bafoussam</MenuItem>
                  </Select>
                  <Select size="small" value={landStatusFilter} onChange={(e) => setLandStatusFilter(e.target.value)} sx={{ bgcolor: 'white', flex: 1, minWidth: '150px' }}>
                    <MenuItem value="all">Tous les statuts</MenuItem>
                    <MenuItem value="certified">Certifiés (Conformes)</MenuItem>
                    <MenuItem value="pending">En attente d'évaluation</MenuItem>
                    <MenuItem value="frozen">En litige (Bloqués)</MenuItem>
                  </Select>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Titre Foncier</TableCell><TableCell>Nom / Loc.</TableCell><TableCell>Propriétaire</TableCell><TableCell>Statut</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                    <TableBody>
                      {filteredLands.map((l) => (
                        <TableRow key={l.id} hover>
                          <TableCell><Typography variant="subtitle2">{l.id}</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontFamily="monospace" fontWeight="bold">{l.landTitle}</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight="700">{l.title}</Typography><Typography variant="caption" color="text.secondary">{l.city}</Typography></TableCell>
                          <TableCell>{l.owner}</TableCell>
                          <TableCell>
                            <Chip label={l.statusLabel} size="small" sx={{ fontWeight: 'bold', bgcolor: l.status === 'certified' ? '#f0fdf4' : l.status === 'frozen' ? '#fef2f2' : '#fffbeb', color: l.status === 'certified' ? '#15803d' : l.status === 'frozen' ? '#b91c1c' : '#b45309', px: 1 }} />
                          </TableCell>
                          <TableCell align="right">
                            <Button variant={l.status === 'frozen' ? "contained" : "outlined"} color={l.status === 'frozen' ? "success" : "error"} size="small" disableElevation onClick={() => handleToggleFreezeLand(l.id)}>
                              {l.status === 'frozen' ? 'Lever le litige' : 'Mettre en litige'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* ---------------- ONGLET 3 : COORDINATION ---------------- */}
            {['notaires', 'geometres', 'vendeurs', 'acheteurs'].includes(activeTab) && (
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
                <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                  <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
                      <Typography variant="h6" fontWeight="800">
                        {activeTab === 'notaires' && 'Officiers Notaires'}
                        {activeTab === 'geometres' && 'Experts Géomètres'}
                        {activeTab === 'vendeurs' && 'Vendeurs Propriétaires'}
                        {activeTab === 'acheteurs' && 'Acheteurs Citoyens'}
                      </Typography>
                      <Button variant="contained" color="primary" disableElevation startIcon={<Plus size={16} />} onClick={() => setAddUserModalOpen(true)}>Ajouter</Button>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <TextField fullWidth size="small" placeholder="Rechercher (Nom, Email, ID)..." value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} sx={{ bgcolor: 'white' }} InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }} />
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead><TableRow><TableCell>Utilisateur</TableCell><TableCell>Statut</TableCell><TableCell>Docs</TableCell></TableRow></TableHead>
                        <TableBody>
                          {activeUserList.map((u) => (
                            <TableRow key={u.id} hover onClick={() => setSelectedUserId(u.id)} selected={selectedUser?.id === u.id} sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: '#f0fdf4' } }}>
                              <TableCell>
                                <Typography variant="subtitle2" fontWeight="700">{u.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{u.id}</Typography>
                              </TableCell>
                              <TableCell><Chip label={u.active ? "Actif" : "Suspendu"} size="small" sx={{ fontWeight: 'bold', bgcolor: u.active ? '#f0fdf4' : '#fef2f2', color: u.active ? '#15803d' : '#b91c1c' }} /></TableCell>
                              <TableCell><Typography variant="body2" fontWeight="800">{u.docCount}</Typography></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>

                <Box sx={{ width: { xs: '100%', lg: '350px' }, flexShrink: 0 }}>
                  {selectedUser && (
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', position: 'sticky', top: 16 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="800">Détails du profil</Typography>
                        <Chip label={selectedUser.active ? "Actif" : "Suspendu"} size="small" sx={{ fontWeight: 'bold', bgcolor: selectedUser.active ? '#f0fdf4' : '#fef2f2', color: selectedUser.active ? '#15803d' : '#b91c1c' }} />
                      </Box>
                      <Divider sx={{ mb: 3 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: selectedUser.avatarBg, fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedUser.initials}</Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="800">{selectedUser.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{selectedUser.role} · Inscrit le {selectedUser.joinDate}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Identifiant :</span> <strong>{selectedUser.id}</strong></Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Email :</span> <strong>{selectedUser.email}</strong></Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Téléphone :</span> <strong>{selectedUser.phone}</strong></Typography>
                        {selectedUser.certificationId && (
                          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>N° Agrément :</span> <strong style={{ color: '#0a5c44' }}>{selectedUser.certificationId}</strong></Typography>
                        )}
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', pt: 1, mt: 1 }}><span style={{ color: '#64748b' }}>Documents validés :</span> <strong>{selectedUser.docCount}</strong></Typography>
                      </Box>
                      <Button fullWidth variant={selectedUser.active ? "outlined" : "contained"} color={selectedUser.active ? "error" : "success"} disableElevation onClick={() => handleToggleUserAccount(selectedUser.id)} startIcon={selectedUser.active ? <Ban size={18} /> : <Check size={18} />}>
                        {selectedUser.active ? "Suspendre l'accès" : "Réactiver l'accès"}
                      </Button>
                    </Paper>
                  )}
                </Box>
              </Box>
            )}

            {/* ---------------- ONGLET 4 : CHAT MULTI-CONTACTS (RESTAURÉ) ---------------- */}
            {activeTab === 'chat' && (
              <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', height: 'calc(100vh - 160px)', overflow: 'hidden' }}>
                <Box sx={{ width: 280, borderRight: '1px solid #e2e8f0', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}><Typography variant="subtitle1" fontWeight="800">Discussions Actives</Typography></Box>
                  <List disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
                    <Typography variant="caption" sx={{ px: 2, py: 1.5, display: 'block', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>OFFICIERS MINISTÉRIELS</Typography>
                    {contacts.filter(c => c.role === 'Notaire' || c.role === 'Géomètre').map(c => (
                      <ListItemButton key={c.id} selected={activeContactId === c.id} onClick={() => setActiveContactId(c.id)} sx={{ borderBottom: '1px solid #f1f5f9', p: 2, '&.Mui-selected': { bgcolor: '#e2f2ec', borderLeft: '4px solid #0a5c44' } }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: c.avatarBg, mr: 2, fontWeight: 'bold' }}>{c.initials}</Avatar>
                        <ListItemText primary={c.name} secondary={c.role} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} secondaryTypographyProps={{ fontSize: '0.75rem' }} />
                      </ListItemButton>
                    ))}
                    <Typography variant="caption" sx={{ px: 2, py: 1.5, display: 'block', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em', mt: 1 }}>CITOYENS (ACHETEURS & VENDEURS)</Typography>
                    {contacts.filter(c => c.role === 'Acheteur' || c.role === 'Vendeur').map(c => (
                      <ListItemButton key={c.id} selected={activeContactId === c.id} onClick={() => setActiveContactId(c.id)} sx={{ borderBottom: '1px solid #f1f5f9', p: 2, '&.Mui-selected': { bgcolor: '#e2f2ec', borderLeft: '4px solid #0a5c44' } }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: c.avatarBg, mr: 2, fontWeight: 'bold' }}>{c.initials}</Avatar>
                        <ListItemText primary={c.name} secondary={c.role} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} secondaryTypographyProps={{ fontSize: '0.75rem' }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: currentContact.avatarBg, fontWeight: 'bold' }}>{currentContact.initials}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="800">{currentContact.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>● En ligne</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {(chatHistory[activeContactId] || []).map((msg, idx) => (
                      <Box key={idx} sx={{ alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                        <Paper elevation={0} sx={{ p: 1.5, px: 2, borderRadius: 3, bgcolor: msg.sender === 'admin' ? 'primary.main' : 'white', color: msg.sender === 'admin' ? 'white' : 'text.primary', border: msg.sender === 'other' ? '1px solid #e2e8f0' : 'none', borderBottomRightRadius: msg.sender === 'admin' ? 4 : 12, borderBottomLeftRadius: msg.sender === 'other' ? 4 : 12 }}>
                          <Typography variant="body2">{msg.text}</Typography>
                        </Paper>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: msg.sender === 'admin' ? 'right' : 'left' }}>{msg.time}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
                    <TextField fullWidth size="small" placeholder={`Écrire un message d'arbitrage à ${currentContact.name}...`} value={writtenMessage} onChange={(e) => setWrittenMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    <Button variant="contained" disableElevation onClick={handleSendMessage} sx={{ minWidth: '100px', borderRadius: 2 }}><Send size={16} /></Button>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* ---------------- ONGLET 5 : AUDIT ---------------- */}
            {activeTab === 'audit' && (
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h5" fontWeight="800" mb={1}>Journal d'audit cryptographique</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Chaque action critique du cadastre est horodatée.</Typography>
                <Box sx={{ bgcolor: '#0f172a', p: 3, borderRadius: 3, fontFamily: 'monospace', color: '#34d399', fontSize: '0.85rem', lineHeight: 1.7 }}>
                  {logs.map((log, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <span style={{ color: '#64748b' }}>[{log.time}]</span>
                      <span style={{ color: log.type === 'alert' ? '#f43f5e' : log.type === 'ok' ? '#34d399' : '#f1f5f9' }}>{log.msg}</span>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}

          </Box>
        </Box>
      </Box>

      {/* MODALE D'AJOUT UTILISATEUR */}
      <Dialog open={addUserModalOpen} onClose={() => setAddUserModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Créer un compte</DialogTitle>
        <DialogContent dividers>
          <form id="addUserForm" onSubmit={handleAddUser}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}><TextField size="small" fullWidth required label="Nom complet" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} /></Grid>
              <Grid item xs={12} sm={6}><TextField size="small" fullWidth required label="Email" type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} /></Grid>
              <Grid item xs={12} sm={6}><TextField size="small" fullWidth required label="Téléphone" value={newUserForm.phone} onChange={e => setNewUserForm({...newUserForm, phone: e.target.value})} /></Grid>
              {(activeTab === 'notaires' || activeTab === 'geometres') && (
                <Grid item xs={12}><TextField size="small" fullWidth required label="N° Agrément d'État" value={newUserForm.certificationId} onChange={e => setNewUserForm({...newUserForm, certificationId: e.target.value})} /></Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setAddUserModalOpen(false)} color="inherit">Annuler</Button>
          <Button type="submit" form="addUserForm" variant="contained" color="primary" disableElevation>Créer le compte</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}