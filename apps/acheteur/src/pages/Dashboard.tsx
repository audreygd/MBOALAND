// @ts-nocheck
import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Mail, Bell, Search, Filter, Download, 
  Check, Compass, CreditCard, UploadCloud, X, Clock, FileText, 
  MessageSquare, Send, Sparkles, LayoutDashboard, LogOut
} from 'lucide-react';
import { type Terrain } from './Home';
import { 
  ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, 
  Paper, Avatar, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, IconButton, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Divider, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Select, MenuItem, InputAdornment, Alert,
  Grid /* CORRECTION 1 : Ajout de l'import Grid manquant [1] */
} from '@mui/material';
import './pages.css';

const theme = createTheme({
  palette: { 
    primary: { main: '#0a5c44', dark: '#05332c' }, 
    error: { main: '#dc2626', light: '#fef2f2' }, 
    background: { default: '#f8fafc', paper: '#ffffff' }, 
    text: { primary: '#1e293b', secondary: '#64748b' } 
  },
  typography: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
  shape: { borderRadius: 12 },
});

interface DashboardProps { terrain: Terrain; notaryName: string; onRestart: () => void; onLogout?: () => void; }
interface Transaction { id: string; date: string; title: string; city: string; area: string; notary: string; amount: string; amountVal: number; status: 'pending' | 'progress' | 'success' | 'cancelled'; statusLabel: string; step: number; gps: string; refCode: string; }
interface Message { sender: 'user' | 'other'; text: string; time: string; }

const drawerWidth = 260;

export default function Dashboard({ terrain, notaryName, onRestart, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'offers' | 'documents' | 'chat'>('overview');
  const fmt = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';
  const serviceFee = Math.round(terrain.priceVal * 0.01);
  const totalAmountVal = terrain.priceVal + 35000 + 45000 + serviceFee;

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TR-2024-0015', date: '12 Mai 2024', title: terrain.title, city: terrain.city, area: terrain.area, notary: notaryName, amount: fmt(totalAmountVal), amountVal: totalAmountVal, status: 'pending', statusLabel: 'Notaire en cours', step: 3, gps: terrain.gps, refCode: terrain.refCode },
    { id: 'TR-2024-0014', date: '08 Mai 2024', title: 'Terrain à Kribi', city: 'Kribi · Sud', area: '2 000 m²', notary: 'Me Jean-Paul Nkodo', amount: '22 000 000 FCFA', amountVal: 22000000, status: 'progress', statusLabel: 'En attente paiement', step: 4, gps: '2.9372° N, 9.9079° E', refCode: 'TER-2024-0013' },
    { id: 'TR-2024-0012', date: '02 Mai 2024', title: 'Terrain à Yaoundé', city: 'Mvan, Yaoundé', area: '800 m²', notary: 'Me Mireille Dubois', amount: '5 200 000 FCFA', amountVal: 5200000, status: 'success', statusLabel: 'Paiement validé', step: 5, gps: '3.8211° N, 11.5012° E', refCode: 'TER-2024-0010' },
    { id: 'TR-2024-0010', date: '20 Avr. 2024', title: 'Terrain à Douala', city: 'Bonapriso', area: '450 m²', notary: 'Me Awa Bello', amount: '18 000 000 FCFA', amountVal: 18000000, status: 'cancelled', statusLabel: 'Annulée', step: 1, gps: '4.0321° N, 9.6912° E', refCode: 'TER-2024-0002' }
  ]);

  const mockOffers = [
    { id: 'OF-9912', terrain: terrain.title, owner: terrain.owner, price: terrain.price, status: 'Acceptée', date: '12 Mai 2024' },
    { id: 'OF-9877', terrain: 'Terrain à Kribi', owner: 'Bernard Tchamda', price: '21 500 000 FCFA', status: 'Négociation', date: '08 Mai 2024' },
    { id: 'OF-9511', terrain: 'Terrain à Douala', owner: 'Lucie Mefire', price: '16 500 000 FCFA', status: 'Réfusée', date: '18 Avr. 2024' },
  ];

  // Gestion du Chat double (Notaire / Support)
  const [activeContactId, setActiveContactId] = useState<'notaire' | 'support'>('notaire');
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({
    notaire: [{ sender: 'other', text: `Bonjour Monsieur Dupont, je suis ${notaryName}. J'analyse le certificat de propriété de votre terrain à ${terrain.city}.`, time: '14:30' }],
    support: [{ sender: 'other', text: "Bonjour ! Je suis votre conseiller technique MBOALAND. Comment puis-je vous aider ?", time: 'À l\'instant' }]
  });
  const [writtenMessage, setWrittenMessage] = useState('');

  const handleSendMessage = () => {
    if (!writtenMessage.trim()) return;
    const userMessage: Message = { sender: 'user', text: writtenMessage, time: 'À l\'instant' };
    setChatHistories(prev => ({ ...prev, [activeContactId]: [...(prev[activeContactId] || []), userMessage] }));
    setWrittenMessage('');
    setTimeout(() => {
      const replyText = activeContactId === 'notaire' ? `Merci pour votre message. J'accuse bonne réception.` : `Un technicien a pris en charge votre demande.`;
      setChatHistories(prev => ({ ...prev, [activeContactId]: [...(prev[activeContactId] || []), { sender: 'other', text: replyText, time: 'À l\'instant' }] }));
    }, 1500);
  };

  const [selectedTxId, setSelectedTxId] = useState('TR-2024-0015');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const activeTx = transactions.find(t => t.id === selectedTxId) || transactions[0];
  const paymentDone = activeTx.status === 'success';

  const filteredTransactions = transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchSearch = t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.notary.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countInProgress = transactions.filter(t => t.status === 'pending').length;
  const countWaiting = transactions.filter(t => t.status === 'progress').length;
  const countCompleted = transactions.filter(t => t.status === 'success').length;
  const countCancelled = transactions.filter(t => t.status === 'cancelled').length;

  const handleSimulateNotaryApproval = () => {
    setTransactions(prev => prev.map(t => t.id === 'TR-2024-0015' ? { ...t, status: 'progress', statusLabel: 'En attente paiement', step: 4 } : t));
    setShowNotification(true);
    setActiveTab('transactions');
    setSelectedTxId('TR-2024-0015');
  };

  const handleFileUpload = (e: any) => { if (e.target.files && e.target.files[0]) { setProofFile(e.target.files[0].name); } };

  const handleConfirmPayment = () => {
    if (!proofFile) { alert("Veuillez téléverser la preuve."); return; }
    setTransactions(prev => prev.map(t => t.id === 'TR-2024-0015' ? { ...t, status: 'success', statusLabel: 'Paiement validé', step: 5 } : t));
    setPaymentModalOpen(false);
  };

  const handleLogoutClick = () => {
    if (window.confirm("Fermer la session ?")) {
      if (onLogout) onLogout(); else onRestart(); 
    }
  };

  const MenuButton = ({ id, icon: Icon, label, badge, action }: any) => (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton 
        selected={activeTab === id} 
        onClick={() => action ? action() : setActiveTab(id)}
        sx={{ borderRadius: 2, py: 1, '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' }, '&:hover': { bgcolor: 'primary.dark' } } }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: activeTab === id ? 'white' : 'text.secondary' }}><Icon size={18} /></ListItemIcon>
        <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem' }} />
        {badge && <Chip label={badge} size="small" sx={{ height: 20, bgcolor: '#ef4444', color: 'white', fontWeight: 'bold' }} />}
      </ListItemButton>
    </ListItem>
  );

  const TimelineStep = ({ stepNumber, title, desc, status }: any) => (
    <Box sx={{ display: 'flex', gap: 2, position: 'relative', pb: 2.5 }}>
      {stepNumber < 5 && (
        <Box sx={{ position: 'absolute', top: 24, left: 11, width: 2, height: 'calc(100% - 16px)', bgcolor: status === 'checked' ? '#10b981' : '#e2e8f0', zIndex: 1 }} />
      )}
      <Box sx={{
        width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, flexShrink: 0,
        bgcolor: status === 'checked' ? '#10b981' : status === 'active' ? '#eff6ff' : '#f1f5f9',
        border: '2px solid', borderColor: status === 'checked' ? '#10b981' : status === 'active' ? '#3b82f6' : '#cbd5e1',
        color: status === 'checked' ? 'white' : status === 'active' ? '#1d4ed8' : '#64748b',
        fontSize: '0.7rem', fontWeight: 'bold'
      }}>
        {stepNumber}
      </Box>
      <Box sx={{ pt: 0.2 }}>
        <Typography variant="subtitle2" color="text.primary">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{desc}</Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        
        {/* ===================== BARRE LATÉRALE GAUCHE ===================== */}
        <Box sx={{ width: 260, flexShrink: 0, bgcolor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography variant="h5" fontWeight="900" color="primary.main">MBOA<Box component="span" sx={{ color: '#0f172a' }}>LAND</Box></Typography>
            <Typography variant="caption" fontWeight="700" color="error.main">Espace Acheteur</Typography>
          </Box>
          <Box sx={{ px: 2, py: 2, flexGrow: 1, overflowY: 'auto' }}>
            <List>
              <MenuButton id="overview" icon={LayoutDashboard} label="Tableau de bord" />
              <MenuButton id="offers" icon={Sparkles} label="Offres envoyées" badge={mockOffers.length} />
              <MenuButton id="transactions" icon={Building2} label="Transactions" />
              <MenuButton id="documents" icon={FileText} label="Documents" />
              <MenuButton id="chat" icon={MessageSquare} label="Messagerie" badge={1} action={() => { setActiveTab('chat'); setActiveContactId('notaire'); }} />
            </List>
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, background: 'linear-gradient(135deg, #eefaf6 0%, #e1f5ee 100%)', border: '1px solid #cce8dd', borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="800" color="primary.dark">Aide MBOALAND</Typography>
              <Typography variant="caption" display="block" mb={1} color="text.secondary">Un conseiller répond en direct.</Typography>
              <Button size="small" variant="contained" color="primary" fullWidth disableElevation onClick={() => { setActiveTab('chat'); setActiveContactId('support'); }}>Contacter le support</Button>
            </Paper>
            <Button fullWidth variant="outlined" color="error" startIcon={<LogOut size={16} />} onClick={handleLogoutClick} sx={{ bgcolor: '#fef2f2', borderColor: '#fecaca', '&:hover': { bgcolor: '#dc2626', color: 'white' } }}>Déconnexion</Button>
          </Box>
        </Box>

        {/* ===================== ZONE PRINCIPALE ===================== */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          
          {/* HEADER */}
          <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', p: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight="800">
                {activeTab === 'overview' && "Vue d'ensemble"}
                {activeTab === 'offers' && "Offres d'acquisition"}
                {activeTab === 'transactions' && "Transactions foncières"}
                {activeTab === 'documents' && "Coffre-fort de documents"}
                {activeTab === 'chat' && `Discussion : ${activeContactId === 'notaire' ? notaryName : 'Support Client'}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">Suivez l'avancement de vos procédures sécurisées.</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {transactions[0].status === 'pending' && (
                <Button variant="outlined" color="warning" size="small" onClick={handleSimulateNotaryApproval} sx={{ bgcolor: '#fffbeb', fontWeight: 'bold' }}>
                  ⚡ Simuler Notaire
                </Button>
              )}
              <IconButton size="small"><Bell size={20} /></IconButton>
              <IconButton size="small" onClick={() => {setActiveTab('chat'); setActiveContactId('notaire');}}><Mail size={20} /></IconButton>
              <Divider orientation="vertical" flexItem sx={{ height: 24 }} />
              <Typography variant="subtitle2" fontWeight="700">Jean Dupont</Typography>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontWeight: 'bold', fontSize: '0.85rem' }}>JD</Avatar>
            </Box>
          </Box>

          <Box sx={{ p: 4, overflowY: 'auto', flexGrow: 1 }}>
            
            {showNotification && !paymentDone && (
              <Alert severity="success" icon={<Bell />} sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }} onClose={() => setShowNotification(false)}>
                <strong>Notification MBOALAND :</strong> Le notaire a validé l'authenticité de l'acte. Veuillez verser l'acompte séquestre.
              </Alert>
            )}

            {/* ONGLET 1 : VUE D'ENSEMBLE */}
            {activeTab === 'overview' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #05332c 0%, #0d5e45 100%)', color: 'white', boxShadow: 3 }}>
                  <Typography variant="h4" fontWeight="800" gutterBottom>Bienvenue Jean 👋</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Toutes vos parcelles d'achat sont sécurisées par la Chambre Notariale.</Typography>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                  {[
                    { label: 'Notaire en cours', value: countInProgress, icon: Clock, color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'À payer', value: countWaiting, icon: CreditCard, color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Terminées', value: countCompleted, icon: Check, color: '#10b981', bg: '#f0fdf4' },
                    { label: 'Annulées', value: countCancelled, icon: X, color: '#f43f5e', bg: '#fef2f2' },
                  ].map((stat, i) => (
                    <Paper key={i} elevation={0} sx={{ flex: 1, minWidth: '200px', p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: stat.bg, color: stat.color }}>{<stat.icon size={20} />}</Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="900">{stat.value}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>

                <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="800">Transaction active : {terrain.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Examen cadastral par {notaryName}.</Typography>
                  </Box>
                  <Button variant="contained" color="primary" disableElevation onClick={() => setActiveTab('transactions')}>Consulter l'avancement</Button>
                </Paper>
              </Box>
            )}

            {/* ONGLET 2 : OFFRES */}
            {activeTab === 'offers' && (
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <Table>
                  <TableHead><TableRow sx={{ bgcolor: '#f8fafc' }}><TableCell>Offre ID</TableCell><TableCell>Terrain ciblé</TableCell><TableCell>Vendeur</TableCell><TableCell>Prix proposé</TableCell><TableCell>Statut</TableCell><TableCell>Date</TableCell></TableRow></TableHead>
                  <TableBody>
                    {mockOffers.map((off) => (
                      <TableRow key={off.id} hover>
                        <TableCell><Typography variant="subtitle2" fontWeight="800">{off.id}</Typography></TableCell>
                        <TableCell><Typography variant="body2" fontWeight="700">{off.terrain}</Typography></TableCell>
                        <TableCell>{off.owner}</TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="800" color="primary.main">{off.price}</Typography></TableCell>
                        <TableCell><Chip label={off.status} size="small" sx={{ fontWeight: 'bold', bgcolor: off.status === 'Acceptée' ? '#f0fdf4' : off.status === 'Négociation' ? '#fffbeb' : '#fef2f2', color: off.status === 'Acceptée' ? '#15803d' : off.status === 'Négociation' ? '#b45309' : '#b91c1c' }} /></TableCell>
                        <TableCell>{off.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* ONGLET 3 : TRANSACTIONS */}
            {activeTab === 'transactions' && (
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
                <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                  <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2, display: 'flex', gap: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <TextField size="small" placeholder="Rechercher une transaction..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ bgcolor: 'white', flex: 1 }} InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }} />
                      <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ bgcolor: 'white', minWidth: 150 }}>
                        <MenuItem value="all">Tous les statuts</MenuItem>
                        <MenuItem value="pending">Notaire en cours</MenuItem>
                        <MenuItem value="progress">À payer</MenuItem>
                        <MenuItem value="success">Terminées</MenuItem>
                      </Select>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell>ID / Date</TableCell>
                            <TableCell>Terrain / Ville</TableCell>
                            <TableCell>Notaire</TableCell>
                            <TableCell>Montant</TableCell>
                            <TableCell>Statut</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredTransactions.map((t) => (
                            <TableRow key={t.id} hover onClick={() => setSelectedTxId(t.id)} selected={selectedTxId === t.id} sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: '#f0fdf4' } }}>
                              <TableCell><Typography variant="subtitle2" fontWeight="800">{t.id}</Typography><Typography variant="body2" color="text.secondary">{t.date}</Typography></TableCell>
                              <TableCell><Typography variant="body2" fontWeight="700">{t.title}</Typography><Typography variant="caption" color="text.secondary">{t.city}</Typography></TableCell>
                              <TableCell>{t.notary}</TableCell>
                              <TableCell><Typography variant="subtitle2" fontWeight="800" color="primary.main">{t.amount}</Typography></TableCell>
                              <TableCell>
                                <Chip label={t.statusLabel} size="small" sx={{ fontWeight: 'bold', bgcolor: t.status === 'success' ? '#f0fdf4' : t.status === 'progress' || t.status === 'pending' ? '#fffbeb' : '#f1f5f9', color: t.status === 'success' ? '#15803d' : t.status === 'progress' || t.status === 'pending' ? '#b45309' : '#475569' }} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>

                <Box sx={{ width: { xs: '100%', lg: '380px' }, flexShrink: 0 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', position: 'sticky', top: 16 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="800">Détails de la transaction</Typography>
                      <Chip label={activeTx.statusLabel} size="small" sx={{ fontWeight: 'bold', bgcolor: paymentDone ? '#f0fdf4' : '#fffbeb', color: paymentDone ? '#15803d' : '#b45309' }} />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>ID Transaction :</span> <strong>{activeTx.id}</strong></Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Titre Foncier :</span> <strong style={{ color: '#0a5c44' }}>{activeTx.refCode}</strong></Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Terrain :</span> <strong>{activeTx.title}</strong></Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Superficie :</span> <strong>{activeTx.area}</strong></Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Notaire :</span> <strong>{activeTx.notary}</strong></Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px dashed #e2e8f0' }}><span style={{ color: '#64748b' }}>Total TTC :</span> <strong style={{ fontSize: '1.1rem' }}>{activeTx.amount}</strong></Typography>
                    </Box>

                    <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 2 }}>
                      Étapes de la transaction
                    </Typography>

                    <TimelineStep stepNumber={1} title="Offre acceptée" desc="Titre foncier et CNI validés" status="checked" />
                    <TimelineStep stepNumber={2} title="Vérification géomètre" desc="PV de bornage validé" status="checked" />
                    <TimelineStep stepNumber={3} title="Vérification notaire" desc={activeTx.step < 3 ? 'Examen de l\'acte...' : 'Authenticité approuvée'} status={activeTx.step >= 3 ? 'checked' : 'active'} />
                    <TimelineStep stepNumber={4} title="Paiement séquestre" desc={activeTx.step < 4 ? 'En attente' : activeTx.step === 4 ? 'Virement en attente' : 'Acompte consigné'} status={activeTx.step === 4 ? 'active' : activeTx.step >= 5 ? 'checked' : 'pending'} />
                    <TimelineStep stepNumber={5} title="Vente finalisée" desc="Rendez-vous physique en étude" status={activeTx.step === 5 ? 'active' : 'pending'} />

                    {activeTx.status === 'progress' && (
                      <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5, mt: 2 }} onClick={() => setPaymentModalOpen(true)}>
                        Effectuer le paiement séquestre
                      </Button>
                    )}
                    {paymentDone && (
                      <Alert severity="success" icon={<ShieldCheck size={20} />} sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}>
                        Preuve de versement reçue par l'étude. Convocation sous 48h.
                      </Alert>
                    )}
                  </Paper>
                </Box>
              </Box>
            )}

            {/* ONGLET 4 : DOCUMENTS (RÉPARÉ ET SÉCURISÉ POUR ÉVITER LES ÉCRANS BLANCS) [1] */}
            {activeTab === 'documents' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                  <Typography variant="h5" fontWeight="800" mb={1}>Coffre-fort numérique</Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    Retrouvez ici tous les documents légaux et vérifiés liés à vos transactions immobilières.
                  </Typography>
                  
                  {/* CORRIGÉ : Grid de MUI est bien importé et ses balises sont 100% équilibrées [1] */}
                  <Grid container spacing={3}>
                    {[
                      { name: `Titre_Foncier_${selectedTxId}.pdf`, size: '2.4 Mo', date: 'Aujourd\'hui' },
                      { name: `Plan_Cadastral.pdf`, size: '1.8 Mo', date: 'Aujourd\'hui' },
                      { name: `Attestation_Virement.pdf`, size: '840 Ko', date: paymentDone ? 'Aujourd\'hui' : 'Non disponible' },
                      { name: `CNI_Vendeur.pdf`, size: '920 Ko', date: 'Aujourd\'hui' },
                    ].map((doc, idx) => (
                      <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' } }}>
                          <Avatar sx={{ bgcolor: '#fef2f2', color: '#ef4444', width: 44, height: 44, borderRadius: 2 }}><FileText size={20} /></Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" fontWeight="800" sx={{ wordBreak: 'break-all' }}>{doc.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{doc.size} · {doc.date}</Typography>
                          </Box>
                          <Button variant="outlined" color="inherit" size="small" startIcon={<Download size={14} />} sx={{ borderColor: '#e2e8f0', mt: 'auto' }}>Télécharger</Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            )}

            {/* ONGLET 5 : CHAT MULTI-CONTACTS */}
            {activeTab === 'chat' && (
              <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', height: 'calc(100vh - 160px)', overflow: 'hidden' }}>
                <Box sx={{ width: 280, borderRight: '1px solid #e2e8f0', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}><Typography variant="subtitle1" fontWeight="800">Vos Contacts</Typography></Box>
                  <List disablePadding>
                    <ListItemButton selected={activeContactId === 'notaire'} onClick={() => setActiveContactId('notaire')} sx={{ borderBottom: '1px solid #f1f5f9', p: 2, '&.Mui-selected': { bgcolor: '#e2f2ec', borderLeft: '4px solid #0a5c44' } }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 2, fontWeight: 'bold' }}>MD</Avatar>
                      <ListItemText primary={notaryName} secondary="Cabinet Notarial" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} secondaryTypographyProps={{ fontSize: '0.75rem' }} />
                    </ListItemButton>
                    <ListItemButton selected={activeContactId === 'support'} onClick={() => setActiveContactId('support')} sx={{ borderBottom: '1px solid #f1f5f9', p: 2, '&.Mui-selected': { bgcolor: '#e2f2ec', borderLeft: '4px solid #0a5c44' } }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.dark', mr: 2, fontWeight: 'bold' }}>SC</Avatar>
                      <ListItemText primary="Support Client" secondary="Assistance MBOALAND" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} secondaryTypographyProps={{ fontSize: '0.75rem' }} />
                    </ListItemButton>
                  </List>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: activeContactId === 'notaire' ? 'primary.main' : 'primary.dark', fontWeight: 'bold' }}>{activeContactId === 'notaire' ? 'MD' : 'SC'}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="800">{activeContactId === 'notaire' ? notaryName : 'Support Client MBOALAND'}</Typography>
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>● En ligne</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {(chatHistories[activeContactId] || []).map((msg, idx) => (
                      <Box key={idx} sx={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                        <Paper elevation={0} sx={{ p: 1.5, px: 2, borderRadius: 3, bgcolor: msg.sender === 'user' ? 'primary.main' : 'white', color: msg.sender === 'user' ? 'white' : 'text.primary', border: msg.sender === 'other' ? '1px solid #e2e8f0' : 'none', borderBottomRightRadius: msg.sender === 'user' ? 4 : 12, borderBottomLeftRadius: msg.sender === 'other' ? 4 : 12 }}>
                          <Typography variant="body2">{msg.text}</Typography>
                        </Paper>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
                    <TextField fullWidth size="small" placeholder="Écrivez un message..." value={writtenMessage} onChange={(e) => setWrittenMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    <Button variant="contained" disableElevation onClick={handleSendMessage} sx={{ minWidth: '100px', borderRadius: 2 }}><Send size={16} /></Button>
                  </Box>
                </Box>
              </Paper>
            )}

          </Box> {/* Closes .db-inner-container */}
        </Box> {/* Closes .db-main-content */}
      </Box> {/* Closes .db-layout */}

      {/* MODALE DE PAIEMENT SÉQUESTRE */}
      <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Règlement de l'acompte séquestre</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" mb={2}>Pour valider le compromis de vente de la parcelle <strong>{activeTx.refCode}</strong>, veuillez effectuer le virement de l'acompte :</Typography>
          <Paper elevation={0} sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', p: 2, fontFamily: 'monospace', mb: 3 }}>
            <div><strong>Bénéficiaire :</strong> Étude Notariale MBOALAND</div>
            <div><strong>Compte :</strong> UBA Cameroun</div>
            <div><strong>RIB :</strong> CM21 0001 0000 1234 5678 9010 11</div>
            <div><strong>Montant séquestre :</strong> {activeTx.amount}</div>
          </Paper>
          
          <Typography variant="subtitle2" fontWeight="700" mb={1}>Justificatif de versement</Typography>
          {!proofFile ? (
            <Box sx={{ border: '2px dashed #cbd5e1', bgcolor: '#f8fafc', p: 3, borderRadius: 2, textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
              <input type="file" onChange={handleFileUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
              <UploadCloud size={24} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
              <Typography variant="body2" fontWeight="600">Sélectionner le reçu (PDF/IMG)</Typography>
            </Box>
          ) : (
            <Alert severity="success" onClose={() => setProofFile(null)}>{proofFile}</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setPaymentModalOpen(false)} color="inherit">Annuler</Button>
          <Button variant="contained" onClick={handleConfirmPayment} disableElevation>Envoyer la preuve de virement</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}