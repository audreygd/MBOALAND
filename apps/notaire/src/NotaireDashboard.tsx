// @ts-nocheck
import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, Avatar, IconButton, Badge, Chip, Divider,
  Card, CardContent, Grid, TextField, Select, MenuItem, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, LinearProgress, Stack, Tooltip, Menu,
  MenuItem as MenuItemMUI
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import FolderIcon from '@mui/icons-material/Folder';
import ChatIcon from '@mui/icons-material/Chat';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityIcon from '@mui/icons-material/Security';
import ReportIcon from '@mui/icons-material/Report';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ShieldIcon from '@mui/icons-material/Shield';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PrintIcon from '@mui/icons-material/Print';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const notaryTheme = createTheme({
  palette: {
    primary: { main: '#0d5e45', light: '#e8f5f0', contrastText: '#ffffff' },
    error: { main: '#dc2626', light: '#fef2f2' },
    warning: { main: '#f59e0b', light: '#fffbeb' },
    success: { main: '#10b981', light: '#f0fdf4' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h6: { fontWeight: 800 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, borderRadius: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#f8fafc' },
        body: { fontSize: '0.82rem' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700, fontSize: '0.7rem', height: 24 } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': { backgroundColor: '#0d5e45', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' }, '&:hover': { backgroundColor: '#0a4d38' } },
          '&:hover': { backgroundColor: alpha('#0d5e45', 0.08) },
        },
      },
    },
  },
});

const DRAWER_WIDTH = 240;

export default function NotaireDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stepFilter, setStepFilter] = useState('all');
  const [selectedDossierId, setSelectedDossierId] = useState('DOS-2024-0015');
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectTouched, setRejectTouched] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [dossiers, setDossiers] = useState([
    { 
      id: 'DOS-2024-0015', 
      refCode: 'TER-2024-0015', 
      buyerName: 'Jean Dupont', 
      buyerPhone: '+237 695 12 34 56', 
      terrainName: "Superbe parcelle plane résidentielle d'Odza", 
      city: 'Odza, Yaoundé · Centre', 
      area: '1 000 m²', 
      landTitle: 'TF-1532/CM/CEN', 
      amount: '15 230 000 FCFA', 
      gps: '3.8842° N, 11.5243° E', 
      step: 3, 
      statusLabel: "Analyse d'authenticité", 
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
    { 
      id: 'DOS-2024-0008', 
      refCode: 'TER-2024-0002', 
      buyerName: 'Lucie Mefire', 
      buyerPhone: '+237 672 33 22 11', 
      terrainName: "Parcelle d'angle de Bonamoussadi", 
      city: 'Bonamoussadi, Douala · Littoral', 
      area: '450 m²', 
      landTitle: 'TF-0341/CM/LIT', 
      amount: '18 150 000 FCFA', 
      gps: '4.0511° N, 9.7679° E', 
      step: 3, 
      statusLabel: 'Rejeté (Litige / Non-conforme)', 
      dateInput: '28 Avr. 2024', 
      hasProof: false, 
      rejectionReason: "Double vente détectée sur le cadastre d'État. Un compromis de vente antérieur est toujours en cours d'enregistrement pour cette même parcelle.", 
      rejectedDate: '30 Avr. 2024' 
    },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'buyer', text: "Bonjour Maître, j'ai désigné votre cabinet pour mon dossier d'achat à Odza. Pouvez-vous vérifier l'authenticité de mon titre foncier ?", time: '14:10' },
  ]);
  const [writtenMessage, setWrittenMessage] = useState('');

  const activeDossier = dossiers.find(d => d.id === selectedDossierId) || dossiers[0];

  const filteredDossiers = dossiers.filter(d => {
    if (d.statusLabel.includes('Rejeté')) return false;
    const q = searchQuery.toLowerCase();
    const matchSearch = d.id.toLowerCase().includes(q) || d.buyerName.toLowerCase().includes(q) || d.terrainName.toLowerCase().includes(q) || d.landTitle.toLowerCase().includes(q);
    const matchStep = stepFilter === 'all' || d.step.toString() === stepFilter;
    return matchSearch && matchStep;
  });

  const rejectedDossiers = dossiers.filter(d => d.statusLabel.includes('Rejeté'));

  const handleSendMessage = () => {
    if (!writtenMessage.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'notary', text: writtenMessage, time: "À l'instant" }]);
    setWrittenMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'buyer', text: "Entendu, merci pour votre réactivité Maître ! J'attends votre feu vert.", time: "À l'instant" }]);
    }, 1500);
  };

  const handleApproveDeed = (id) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, step: 4, statusLabel: 'En attente paiement séquestre' } : d));
  };

  const handleOpenRejectModal = (id) => {
    setTargetRejectId(id);
    setRejectionReason('');
    setRejectTouched(false);
    setRejectModalOpen(true);
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      setRejectTouched(true);
      return;
    }
    setDossiers(prev => prev.map(d => {
      if (d.id === targetRejectId) {
        return {
          ...d,
          statusLabel: 'Rejeté (Litige / Non-conforme)',
          rejectionReason,
          rejectedDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return d;
    }));
    setRejectModalOpen(false);
  };

  const handleApprovePayment = (id) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, step: 5, statusLabel: 'Prêt pour signature' } : d));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    alert('Déconnexion en cours...');
  };

  const handleProfile = () => {
    handleMenuClose();
    alert('Ouverture du profil notaire...');
  };

  const handleSettings = () => {
    handleMenuClose();
    alert('Ouverture des paramètres...');
  };

  const StepChip = ({ step }) => {
    if (step === 3) return <Chip label="Authentification" size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }} />;
    if (step === 4) return <Chip label="À payer" size="small" sx={{ bgcolor: '#fffbeb', color: '#b45309', fontWeight: 700 }} />;
    return <Chip label="Prêt à signer" size="small" color="success" />;
  };

  const menuItems = [
    { id: 'overview', label: 'Dossiers & Missions', icon: <FolderIcon fontSize="small" /> },
    { id: 'disputes', label: 'Historique Rejets', icon: <ReportIcon fontSize="small" />, badge: rejectedDossiers.length },
    { id: 'chat', label: 'Messagerie', icon: <ChatIcon fontSize="small" />, badge: 1 },
    { id: 'documents', label: 'Pièces Reçues', icon: <ArticleIcon fontSize="small" /> },
    { id: 'certificates', label: 'Actes de Vente', icon: <SecurityIcon fontSize="small" /> },
  ];

  return (
    <ThemeProvider theme={notaryTheme}>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: DRAWER_WIDTH, 
              boxSizing: 'border-box', 
              bgcolor: '#ffffff', 
              borderRight: '1px solid #e2e8f0', 
              display: 'flex', 
              flexDirection: 'column' 
            },
          }}
        >
          <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: '#0d5e45', lineHeight: 1 }}>
              MBOA<Box component="span" sx={{ color: '#0f172a' }}>LAND</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: '#0d5e45', fontWeight: 700, letterSpacing: '0.02em' }}>
              Cabinet Notarial Assermenté
            </Typography>
          </Box>

          <List sx={{ pt: 1, flex: 1 }}>
            {menuItems.map(item => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={activeTab === item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'disputes') setSelectedDossierId('DOS-2024-0008');
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: activeTab === item.id ? '#fff' : '#64748b' }}>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color={item.id === 'disputes' ? 'error' : 'warning'} sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: activeTab === item.id ? 700 : 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Section Chambre des Notaires */}
          <Box sx={{ m: 1.5, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>Chambre des Notaires</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4, display: 'block' }}>
              Espace sécurisé conforme à la législation foncière du Cameroun.
            </Typography>
          </Box>

          {/* Bouton de déconnexion en bas de la sidebar */}
          <Box sx={{ m: 1.5, mt: 0 }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                borderColor: '#fca5a5',
                color: '#dc2626',
                '&:hover': {
                  borderColor: '#ef4444',
                  backgroundColor: '#fef2f2',
                },
                py: 1.5,
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Se déconnecter
            </Button>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  Étude de Me Mireille Dubois
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Numérisation notariale : validation d'actes, certification cadastrale, et séquestres.
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Tooltip title="Notifications">
                  <IconButton size="small">
                    <NotificationsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Messagerie">
                  <IconButton size="small" onClick={() => setActiveTab('chat')}>
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                
                <Tooltip title="Profil">
                  <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700 }}>
                      MD
                    </Avatar>
                  </IconButton>
                </Tooltip>
                
                <Typography variant="body2" fontWeight={700} sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Me Mireille Dubois
                </Typography>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        borderTop: '1px solid #e2e8f0',
                        borderLeft: '1px solid #e2e8f0',
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Me Mireille Dubois
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Notaire Assermenté
                    </Typography>
                  </Box>
                  
                  <MenuItemMUI onClick={handleProfile} sx={{ gap: 1.5 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">Mon profil</Typography>
                  </MenuItemMUI>
                  
                  <MenuItemMUI onClick={handleSettings} sx={{ gap: 1.5 }}>
                    <SettingsIcon fontSize="small" color="action" />
                    <Typography variant="body2">Paramètres</Typography>
                  </MenuItemMUI>
                  
                  <Divider />
                  
                  <MenuItemMUI 
                    onClick={handleLogout} 
                    sx={{ 
                      gap: 1.5, 
                      color: 'error.main',
                      '&:hover': { bgcolor: 'error.light' }
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>Se déconnecter</Typography>
                  </MenuItemMUI>
                </Menu>
              </Stack>
            </Toolbar>
          </AppBar>

          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {activeTab === 'overview' && (
              <Box>
                <Card sx={{ mb: 3, p: 2.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" fontWeight={800}>Tableau de bord</Typography>
                  <Typography variant="caption" color="text.secondary">Bienvenue dans votre espace notarial</Typography>
                </Card>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {[
                    { icon: <AccessTimeIcon />, color: '#3b82f6', bg: '#eff6ff', value: dossiers.filter(d => d.step === 3 && !d.statusLabel.includes('Rejeté')).length, label: 'À authentifier' },
                    { icon: <CreditCardIcon />, color: '#f59e0b', bg: '#fffbeb', value: dossiers.filter(d => d.step === 4).length, label: 'Séquestres en cours' },
                    { icon: <TaskAltIcon />, color: '#10b981', bg: '#f0fdf4', value: dossiers.filter(d => d.step === 5).length, label: 'Prêts à signer' },
                    { icon: <ShieldIcon />, color: '#0d5e45', bg: '#e8f5f0', value: dossiers.filter(d => !d.statusLabel.includes('Rejeté')).length, label: 'Affaires actives' },
                  ].map((s, i) => (
                    <Grid item xs={6} sm={3} key={i}>
                      <Card sx={{ p: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box sx={{ p: 1, bgcolor: s.bg, borderRadius: 2, color: s.color, display: 'flex' }}>{s.icon}</Box>
                          <Box>
                            <Typography variant="h5" fontWeight={800}>{s.value}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: '0 0 calc(66.666% - 8px)', minWidth: 0 }}>
                    <Card sx={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                      <Box sx={{ p: 2, display: 'flex', gap: 1.5 }}>
                        <TextField size="small" placeholder="Filtrer par acquéreur, n° titre, affaire..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} sx={{ flex: 1 }} />
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                          <Select value={stepFilter} onChange={e => setStepFilter(e.target.value)}>
                            <MenuItem value="all">Toutes les étapes</MenuItem>
                            <MenuItem value="3">Vérification de titre</MenuItem>
                            <MenuItem value="4">Attente de versement</MenuItem>
                            <MenuItem value="5">Prêt à finaliser</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Affaire ID</TableCell>
                              <TableCell>Acquéreur</TableCell>
                              <TableCell>Parcelle d'achat</TableCell>
                              <TableCell>Montant</TableCell>
                              <TableCell>Statut</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredDossiers.length > 0 ? filteredDossiers.map(d => (
                              <TableRow key={d.id} hover selected={selectedDossierId === d.id} onClick={() => setSelectedDossierId(d.id)} sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: '#f0fdf4' }, '&.Mui-selected:hover': { bgcolor: '#e8f5f0' } }}>
                                <TableCell>
                                  <Typography variant="caption" fontWeight={700} display="block">{d.id}</Typography>
                                  <Typography variant="caption" color="text.secondary">Reçu le {d.dateInput}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" fontWeight={700} display="block">{d.buyerName}</Typography>
                                  <Typography variant="caption" color="text.secondary">{d.buyerPhone}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" fontWeight={700} display="block">{d.terrainName}</Typography>
                                  <Typography variant="caption" color="text.secondary">{d.city}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" fontWeight={700}>{d.amount}</Typography>
                                </TableCell>
                                <TableCell><StepChip step={d.step} /></TableCell>
                              </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Aucun dossier en cours.</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Box>

                  <Box sx={{ flex: '0 0 calc(33.333% - 8px)', minWidth: 0 }}>
                    <Card sx={{ p: 2.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={800}>Action administrative</Typography>
                        <Chip label={activeDossier.id} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.68rem' }} />
                      </Box>
                      <Stack spacing={0.75} sx={{ pb: 2, mb: 2, borderBottom: '1px solid #f1f5f9' }}>
                        {[
                          ['Acquéreur', activeDossier.buyerName],
                          ['Titre foncier', activeDossier.landTitle],
                          ["Valeur d'acquisition", activeDossier.amount],
                          ['Coordonnées', activeDossier.gps],
                          ['Étape actuelle', `Étape ${activeDossier.step} / 5`],
                        ].map(([k, v], i) => (
                          <Typography key={i} variant="caption" color="text.secondary">
                            {k} : <Box component="span" sx={{ fontWeight: 700, color: k === 'Étape actuelle' ? 'primary.main' : 'text.primary' }}>{v}</Box>
                          </Typography>
                        ))}
                      </Stack>

                      {activeDossier.step === 3 && !activeDossier.statusLabel.includes('Rejeté') && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                            Vérifiez le titre cadastral fourni. Vous pouvez valider ou rejeter en cas de litige.
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Button variant="contained" color="primary" size="small" fullWidth startIcon={<AssignmentIcon />} onClick={() => handleApproveDeed(activeDossier.id)}>Approuver</Button>
                            <Button variant="outlined" color="error" size="small" fullWidth startIcon={<WarningIcon />} onClick={() => handleOpenRejectModal(activeDossier.id)}>Refuser</Button>
                          </Stack>
                        </Box>
                      )}
                      {activeDossier.step === 4 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                            {activeDossier.hasProof ? "Une preuve de versement d'acompte a été soumise." : "L'acheteur n'a pas encore versé les fonds."}
                          </Typography>
                          {activeDossier.hasProof ? (
                            <Button variant="contained" color="primary" fullWidth size="small" startIcon={<CheckIcon />} onClick={() => handleApprovePayment(activeDossier.id)}>Valider le versement séquestre</Button>
                          ) : (
                            <Button variant="outlined" disabled fullWidth size="small">En attente du virement</Button>
                          )}
                        </Box>
                      )}
                      {activeDossier.step === 5 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                            Authenticité et paiement validés. Générez l'acte de vente officiel avec QR Code.
                          </Typography>
                          <Button variant="contained" color="primary" fullWidth size="small" startIcon={<QrCodeScannerIcon />} onClick={() => { setCertificateGenerated(false); setCertificateModalOpen(true); }}>
                            Produire l'Acte de Vente
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 'disputes' && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: '0 0 calc(66.666% - 8px)', minWidth: 0 }}>
                  <Card sx={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Dossiers annulés ou suspectés de fraude</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Affaire ID</TableCell>
                              <TableCell>Acquéreur</TableCell>
                              <TableCell>Titre Foncier</TableCell>
                              <TableCell>Date d'annulation</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rejectedDossiers.map(d => (
                              <TableRow key={d.id} hover selected={selectedDossierId === d.id} onClick={() => setSelectedDossierId(d.id)} sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: '#fff5f5' } }}>
                                <TableCell><Typography variant="caption" fontWeight={700}>{d.id}</Typography></TableCell>
                                <TableCell><Typography variant="caption" fontWeight={700}>{d.buyerName}</Typography></TableCell>
                                <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{d.landTitle}</Typography></TableCell>
                                <TableCell><Chip label={d.rejectedDate || 'Récemment'} size="small" color="error" sx={{ fontSize: '0.68rem' }} /></TableCell>
                              </TableRow>
                            ))}
                            {rejectedDossiers.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>Aucun litige recensé.</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Box>
                <Box sx={{ flex: '0 0 calc(33.333% - 8px)', minWidth: 0 }}>
                  {activeDossier.statusLabel.includes('Rejeté') ? (
                    <Card sx={{ p: 2.5, border: '1px solid #fca5a5', boxShadow: '0 1px 4px rgba(220,38,38,0.08)', height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={800}>Dossier litigieux</Typography>
                        <Chip label="BLOQUÉ" size="small" color="error" />
                      </Box>
                      <Stack spacing={0.75} sx={{ pb: 2, mb: 2, borderBottom: '1px solid #fee2e2' }}>
                        {[
                          ['Acquéreur', activeDossier.buyerName],
                          ['Titre foncier', activeDossier.landTitle],
                          ['Localisation', activeDossier.city],
                          ["Valeur d'acquisition", activeDossier.amount]
                        ].map(([k, v], i) => (
                          <Typography key={i} variant="caption" color="text.secondary">
                            {k} : <Box component="span" fontWeight={700} color="text.primary">{v}</Box>
                          </Typography>
                        ))}
                      </Stack>
                      <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'error.main', display: 'block', mb: 1 }}>Motif légal du rejet</Typography>
                      <Alert severity="error" icon={<WarningIcon fontSize="small" />} sx={{ fontSize: '0.8rem', lineHeight: 1.5, '& .MuiAlert-message': { fontWeight: 500 } }}>
                        {activeDossier.rejectionReason || 'Aucune explication légale saisie.'}
                      </Alert>
                    </Card>
                  ) : (
                    <Card sx={{ p: 2.5, border: '1px solid #e2e8f0', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                      <ReportIcon sx={{ color: '#cbd5e1', fontSize: 40 }} />
                      <Typography variant="caption" color="text.secondary" textAlign="center">
                        Sélectionnez un dossier rejeté pour voir le motif légal.
                      </Typography>
                    </Card>
                  )}
                </Box>
              </Box>
            )}

            {activeTab === 'chat' && (
              <Card sx={{ display: 'flex', height: 'calc(100vh - 140px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box sx={{ width: 240, borderRight: '1px solid #e2e8f0', flexShrink: 0 }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={700}>Discussions Actives</Typography>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: '#f0fdf4', cursor: 'pointer' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.75rem', fontWeight: 700 }}>JD</Avatar>
                      <Box>
                        <Typography variant="caption" fontWeight={700} display="block">{activeDossier.buyerName}</Typography>
                        <Typography variant="caption" color="text.secondary">Dossier {activeDossier.id}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                    <Typography variant="subtitle2" fontWeight={700}>{activeDossier.buyerName} (Acquéreur)</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
                      <Typography variant="caption" color="success.main">En ligne</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {chatMessages.map((msg, i) => (
                      <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'notary' ? 'flex-end' : 'flex-start' }}>
                        <Box sx={{ maxWidth: '70%', p: 1.5, borderRadius: 2, bgcolor: msg.sender === 'notary' ? 'primary.main' : '#f1f5f9', color: msg.sender === 'notary' ? '#fff' : 'text.primary', fontSize: '0.83rem', lineHeight: 1.5 }}>
                          {msg.text}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>{msg.time}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1.5 }}>
                    <TextField size="small" fullWidth placeholder="Écrire un message à l'acquéreur..." value={writtenMessage} onChange={e => setWrittenMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }} />
                    <Button variant="contained" color="primary" onClick={handleSendMessage} endIcon={<SendIcon />} sx={{ px: 3, whiteSpace: 'nowrap' }}>Envoyer</Button>
                  </Box>
                </Box>
              </Card>
            )}

            {activeTab === 'documents' && (
              <Grid container spacing={2}>
                {[
                  { name: `Copie_Titre_Foncier_${activeDossier.landTitle}.pdf`, sub: 'Analyse cadastrale · 2.4 Mo', available: true, primary: false },
                  { name: 'Plan_Cadastral_Contradictoire.pdf', sub: 'PV Géomètre ONIGE · 1.8 Mo', available: true, primary: false },
                  { name: 'Justificatif_Virement_Sequestre.pdf', sub: activeDossier.hasProof ? 'Reçu bancaire soumis · 840 Ko' : "En attente de soumission par l'acheteur", available: activeDossier.hasProof, primary: activeDossier.hasProof },
                ].map((doc, i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <Card sx={{ p: 2.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ width: 48, height: 48, bgcolor: doc.primary ? '#f0fdf4' : '#fff5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArticleIcon sx={{ color: doc.primary ? 'success.main' : 'error.main' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>{doc.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{doc.sub}</Typography>
                      </Box>
                      {doc.available ? (
                        <Button variant={doc.primary ? 'contained' : 'outlined'} color="primary" size="small" startIcon={doc.primary ? <CheckIcon /> : <DownloadIcon />}>
                          {doc.primary ? 'Visualiser le virement' : 'Télécharger pour examen'}
                        </Button>
                      ) : (
                        <Button variant="outlined" disabled size="small">Non disponible</Button>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {activeTab === 'certificates' && (
              <Grid container spacing={2}>
                {dossiers.filter(d => d.step === 5 && !d.statusLabel.includes('Rejeté')).map(d => (
                  <Grid item xs={12} md={4} key={d.id}>
                    <Card sx={{ p: 2.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #0d5e45', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ width: 48, height: 48, bgcolor: '#f0fdf4', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SecurityIcon color="success" />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>Acte de Mutation : {d.buyerName}</Typography>
                        <Typography variant="caption" color="text.secondary">Titre foncier {d.landTitle} · Signé</Typography>
                      </Box>
                      <Button variant="contained" color="primary" size="small" startIcon={<QrCodeScannerIcon />} onClick={() => { setSelectedDossierId(d.id); setCertificateGenerated(true); setCertificateModalOpen(true); }}>
                        Visualiser l'Acte et QR Code
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>

        <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, border: '1px solid #fca5a5' } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'error.main' }}>
              <WarningIcon fontSize="small" />
              <Typography variant="subtitle1" fontWeight={800} color="error.main">Justifier le rejet du dossier</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setRejectModalOpen(false)}><CloseIcon fontSize="small" /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, lineHeight: 1.5 }}>
              Veuillez spécifier le motif légal de l'annulation de l'affaire <strong>{targetRejectId}</strong>. L'acquéreur en sera notifié.
            </Typography>
            <TextField multiline rows={4} fullWidth placeholder="Ex : Falsification constatée sur la signature du propriétaire du titre foncier d'origine..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} size="small" error={rejectTouched && !rejectionReason.trim()} helperText={rejectTouched && !rejectionReason.trim() ? "Le motif légal est obligatoire pour formaliser le rejet." : ""} sx={{ mt: 0.5 }} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
            <Button variant="outlined" onClick={() => setRejectModalOpen(false)}>Annuler</Button>
            <Button variant="contained" color="error" onClick={handleConfirmRejection}>Confirmer le rejet motivé</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={certificateModalOpen} onClose={() => setCertificateModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Typography variant="subtitle1" fontWeight={800}>Production de l'Acte de mutation</Typography>
            <IconButton size="small" onClick={() => setCertificateModalOpen(false)}><CloseIcon fontSize="small" /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Paper id="printable-deed" sx={{ p: 3, border: '2px solid #0d5e45', borderRadius: 2, bgcolor: '#fffef7', fontFamily: 'Georgia, serif', position: 'relative' }}>
              <Box sx={{ textAlign: 'center', borderBottom: '1px solid #cbd5e1', pb: 1.5, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ fontFamily: 'Georgia, serif' }}>République du Cameroun</Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic', textTransform: 'uppercase', display: 'block' }}>Paix – Travail – Patrie</Typography>
                <Typography variant="body2" fontWeight={700}>Cabinet d'Études Notariales de Me Dubois</Typography>
              </Box>
              <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 800, textDecoration: 'underline', mb: 2.5, fontSize: '1rem', textTransform: 'uppercase' }}>
                Certificat de Mutation Foncière
              </Typography>
              <Typography variant="body2" sx={{ textIndent: '1.5rem', textAlign: 'justify', mb: 2, lineHeight: 1.6, fontFamily: 'Georgia, serif' }}>
                Par la présente, nous, <strong>Me Mireille Dubois</strong>, notaire assermenté inscrit au Barreau du Cameroun, certifions l'authentification et l'enregistrement de l'acte de vente pour l'affaire <strong>{activeDossier.id}</strong>.
              </Typography>
              <Paper sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.7)', border: '1px solid #cbd5e1', borderRadius: 1.5, mb: 2.5 }}>
                {[
                  ['👤 Acquéreur', activeDossier.buyerName],
                  ['📍 Parcelle', `${activeDossier.terrainName} (${activeDossier.city})`],
                  ['📁 Titre foncier n°', activeDossier.landTitle],
                  ['🗺️ GPS certifiées', activeDossier.gps],
                  ['💰 Montant séquestre', activeDossier.amount],
                ].map(([k, v], i) => (
                  <Typography key={i} variant="caption" display="block" sx={{ mb: 0.4, fontFamily: 'Georgia, serif' }}>
                    <strong>{k} :</strong> {v}
                  </Typography>
                ))}
              </Paper>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
            <Button variant="outlined" onClick={() => setCertificateModalOpen(false)}>Fermer</Button>
            {!certificateGenerated && activeDossier.step === 5 ? (
              <Button variant="contained" color="primary" startIcon={<AssignmentIcon />} onClick={() => { setCertificateGenerated(true); alert('Acte certifié et enregistré dans la blockchain MBOALAND !'); }}>
                Signer et certifier l'Acte
              </Button>
            ) : (
              <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={() => window.print()}>
                Imprimer le document officiel
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}