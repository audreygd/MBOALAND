// @ts-nocheck
import React, { useState } from 'react';
import { Search, MapPin, Globe, Shield, PhoneCall, Plus, X, UploadCloud } from 'lucide-react';
import AuthModal, { type UserRole } from './AuthModal';
import { 
  ThemeProvider, createTheme, CssBaseline, Box, Container, Typography, Button, 
  Grid, Card, CardMedia, CardContent, CardActions, Paper, InputBase, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, 
  FormControl, InputLabel, IconButton, Avatar, Chip, Divider
} from '@mui/material';
import './pages.css';

// Thème pour MUI
const theme = createTheme({
  palette: { 
    primary: { main: '#0a5c44', dark: '#05332c' }, 
    background: { default: '#f8fafc' }, 
    text: { primary: '#1e293b', secondary: '#64748b' } 
  },
  typography: { 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
    h3: { fontSize: '1.6rem', fontWeight: 800 }, 
    h4: { fontSize: '1.2rem', fontWeight: 800 }, 
    h5: { fontSize: '1.05rem', fontWeight: 800 }, 
    h6: { fontSize: '0.9rem', fontWeight: 800 }, 
    body1: { fontSize: '0.85rem' }, 
    body2: { fontSize: '0.75rem' }, 
    button: { textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' } 
  },
  shape: { borderRadius: 12 },
});

export interface Terrain { id: string; title: string; refCode: string; city: string; region: 'Yaoundé' | 'Douala' | 'Mbankomo' | 'Bafoussam'; area: string; price: string; priceVal: number; landTitle: string; owner: string; gps: string; desc: string; certified: boolean; image: string; type: 'residentiel' | 'agricole' | 'commercial' | 'industriel'; }

const INITIAL_TERRAINS: Terrain[] = [
  { id: 'odza', title: 'Superbe parcelle plane résidentielle', refCode: 'TER-2024-0015', city: 'Yaoundé (Odza)', region: 'Yaoundé', area: '1 000 m²', price: '15 000 000 FCFA', priceVal: 15000000, landTitle: 'TF-1532/CM/CEN', owner: 'Jean Dupont', gps: '3.8842° N, 11.5243° E', desc: 'Idéalement située dans la zone résidentielle.', certified: true, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', type: 'residentiel' },
  { id: 'mbankomo', title: 'Vaste domaine idéal projet agricole', refCode: 'TER-2024-0012', city: 'Mbankomo', region: 'Mbankomo', area: '5 000 m²', price: '8 000 000 FCFA', priceVal: 8000000, landTitle: 'TF-0987/CM/CEN', owner: 'Sylvestre Atangana', gps: '3.6612° N, 11.3954° E', desc: 'Terre agricole très fertile, accès direct piste.', certified: true, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', type: 'agricole' },
  { id: 'bonamoussadi', title: 'Parcelle commerciale de premier choix', refCode: 'TER-2024-0002', city: 'Douala (Bonamoussadi)', region: 'Douala', area: '450 m²', price: '18 000 000 FCFA', priceVal: 18000000, landTitle: 'TF-0341/CM/LIT', owner: 'Chantal Ngo', gps: '4.0511° N, 9.7679° E', desc: 'Emplacement stratégique en bordure de route.', certified: false, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', type: 'commercial' },
  { id: 'bafoussam', title: 'Terrain panoramique des hauts plateaux', refCode: 'TER-2024-0005', city: 'Bafoussam', region: 'Bafoussam', area: '3 000 m²', price: '6 000 000 FCFA', priceVal: 6000000, landTitle: 'TF-2241/CM/OUE', owner: 'Emmanuel Kamga', gps: '5.4767° N, 10.4187° E', desc: 'Climat frais et vue imprenable.', certified: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', type: 'industriel' }
];

export default function Home({ onViewDetails, onBuy, isAuthenticated, onLoginRequest, onRegisterRequest, onPublishRequest, isPublishModalOpen, onClosePublishModal }: any) {
  const [terrains, setTerrains] = useState<Terrain[]>(INITIAL_TERRAINS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [newTitle, setNewTitle] = useState(''); const [newCity, setNewCity] = useState(''); const [newArea, setNewArea] = useState(''); const [newPrice, setNewPrice] = useState(''); const [newLandTitle, setNewLandTitle] = useState(''); const [newOwner, setNewOwner] = useState(''); const [newDesc, setNewDesc] = useState(''); const [newType, setNewType] = useState<'residentiel' | 'agricole' | 'commercial' | 'industriel'>('residentiel');

  const filteredTerrains = terrains.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.landTitle.toLowerCase().includes(q);
    const matchCity = selectedCity === null || t.region === selectedCity;
    const matchCat = selectedCategory === 'all' || t.type === selectedCategory;
    return matchSearch && matchCity && matchCat;
  });

  const cityFilteredTerrains = terrains.filter((t) => t.region === selectedCity);

  const handlePublishTerrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCity || !newPrice || !newLandTitle || !newOwner) { alert("Champs obligatoires manquants."); return; }
    const numPrice = parseInt(newPrice.replace(/\s/g, '')) || 1000000;
    const newTerrain: Terrain = {
      id: 'custom-' + Date.now(), title: newTitle, refCode: 'TER-2026-' + Math.floor(1000 + Math.random() * 9000), city: newCity, region: 'Yaoundé', area: newArea || '500 m²', price: numPrice.toLocaleString('fr-FR') + ' FCFA', priceVal: numPrice, landTitle: newLandTitle, owner: newOwner, gps: '3.8° N, 11.5° E', desc: newDesc || 'Aucune description.', certified: false, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', type: newType
    };
    setTerrains([newTerrain, ...terrains]); onClosePublishModal();
  };

  const CITIES_LIST = [
    { id: 'Yaoundé', name: 'Yaoundé', flag: '🇨🇲', count: 'Yaoundé & environs', image: 'https://images.unsplash.com/photo-1598977123418-45f04b616a0e?auto=format&fit=crop&w=400&q=80' },
    { id: 'Douala', name: 'Douala', flag: '🇨🇲', count: 'Littoral', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&q=80' },
    { id: 'Mbankomo', name: 'Mbankomo', flag: '🇨🇲', count: 'Mbankomo', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80' },
    { id: 'Bafoussam', name: 'Bafoussam', flag: '🇨🇲', count: 'Ouest plateaux', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  ];
  const INFINITE_CITIES = [...CITIES_LIST, ...CITIES_LIST, ...CITIES_LIST];

  const CATEGORIES = [
    { id: 'all', name: 'Tous', count: `${terrains.length}`, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80' },
    { id: 'residentiel', name: 'Résidentiel', count: `${terrains.filter(t => t.type === 'residentiel').length}`, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80' },
    { id: 'agricole', name: 'Agricole', count: `${terrains.filter(t => t.type === 'agricole').length}`, image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80' },
    { id: 'commercial', name: 'Commercial', count: `${terrains.filter(t => t.type === 'commercial').length}`, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80' },
    { id: 'industriel', name: 'Industriel', count: `${terrains.filter(t => t.type === 'industriel').length}`, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 0 }}>
        
        {/* CSS pour le scroll doux (ancres du footer) et le slider */}
        <style>{`
          html { scroll-behavior: smooth; } 
          @keyframes scrollTrack { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-300px * 4 - 24px * 4)); } } 
          .slider-track { display: flex; gap: 24px; width: max-content; animation: scrollTrack 35s linear infinite; } 
          .slider-track:hover { animation-play-state: paused; } 
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        
        {/* 1. BARRE DE NAVIGATION (HEADER) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '0.75rem 2rem', bgcolor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', cursor: 'pointer' }}>
            MBOA<Box component="span" sx={{ color: '#0f172a' }}>LAND</Box>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Liens vers le Footer */}
            <Typography component="a" href="#about" sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 600, fontSize: '0.85rem', '&:hover': { color: 'primary.main' } }}>À propos</Typography>
            <Typography component="a" href="#support" sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 600, fontSize: '0.85rem', '&:hover': { color: 'primary.main' } }}>Aide & Support</Typography>
            
            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button variant="outlined" color="inherit" onClick={onLoginRequest} sx={{ borderColor: '#e2e8f0' }}>Se connecter</Button>
                <Button variant="contained" color="primary" onClick={onRegisterRequest} disableElevation sx={{ borderRadius: '8px', px: 3 }}>S'inscrire</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Mon Compte</Typography>
                <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, fontSize: '0.85rem', fontWeight: 'bold' }}>JD</Avatar>
              </Box>
            )}
          </Box>
        </Box>

        {/* CONTENEUR PLEINE LARGEUR (xl) */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          
          {/* 2. RECHERCHE */}
          <Box sx={{ background: 'linear-gradient(135deg, #05332c 0%, #0d5e45 100%)', borderRadius: 4, p: { xs: 3, md: 5 }, color: 'white', mt: 4, mb: 6, boxShadow: '0 10px 40px rgba(13, 94, 69, 0.15)' }}>
            <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="h3" sx={{ mb: 1 }}>Investissez dans le foncier <Box component="span" sx={{ color: '#4ade80' }}>certifié</Box></Typography>
                <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 4 }}>Plateforme de numérisation et sécurisation notariale au Cameroun.</Typography>
                <Paper sx={{ display: 'flex', alignItems: 'center', p: '4px 20px', borderRadius: 100, maxWidth: 500 }}>
                  <Search color="#0a5c44" size={20} />
                  <InputBase sx={{ ml: 2, flex: 1, py: 1.5, fontWeight: 600 }} placeholder="Ville, quartier ou n° TF..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                <Button variant="contained" onClick={onPublishRequest} sx={{ bgcolor: 'white', color: 'primary.dark', '&:hover': { bgcolor: '#f1f5f9' }, fontWeight: 800, gap: 1, py: 2, px: 4, borderRadius: 3 }}>
                  <Plus size={20} /> Publier un terrain
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* 3. CATÉGORIES (CORRECTION : OCCUPE TOUTE LA LARGEUR ET S'ÉTIRE) */}
          <Typography variant="h5" sx={{ mb: 3 }}>Rechercher par type de terrain</Typography>
          <Box className="hide-scrollbar" sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 5 }}>
            {CATEGORIES.map((cat) => (
              <Box 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                sx={{ 
                  flex: 1, minWidth: 160, cursor: 'pointer', textAlign: 'center', /* flex: 1 permet d'occuper tout l'espace disponible */
                  transition: 'all 0.2s', '&:hover': { transform: 'translateY(-5px)' }
                }}
              >
                <Box sx={{ 
                  width: '100%', height: 120, borderRadius: 3, overflow: 'hidden', mb: 1,
                  border: selectedCategory === cat.id ? '3px solid #0a5c44' : '1px solid #e2e8f0',
                  boxShadow: selectedCategory === cat.id ? '0 8px 20px rgba(10,92,68,0.15)' : 'none'
                }}>
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Typography variant="subtitle2" color={selectedCategory === cat.id ? 'primary.main' : 'text.primary'}>{cat.name}</Typography>
              </Box>
            ))}
          </Box>

          {/* 4. GRILLE DES TERRAINS (CORRECTION : 4 CARTES PAR LIGNE SUR ÉCRAN LARGE) */}
          <Typography variant="h5" sx={{ mb: 3 }}>Parcelles recommandées</Typography>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {filteredTerrains.map((terrain) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={terrain.id}> {/* lg={3} force 4 cartes par ligne (12/3 = 4) */}
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 3, '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transform: 'translateY(-4px)' }, transition: 'all 0.2s' }}>
                  <Box sx={{ position: 'relative', pt: '65%', bgcolor: '#f0f0f0' }}>
                    <CardMedia component="img" image={terrain.image} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                    <Chip label={terrain.certified ? "✓ Titre Certifié" : "En attente"} size="small" sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 800, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.9)', color: terrain.certified ? 'primary.main' : '#b45309' }} />
                  </Box>
                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }} noWrap>{terrain.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{terrain.city}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 'auto' }}>{terrain.price}</Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button fullWidth variant="outlined" size="small" onClick={() => onViewDetails(terrain)}>Détails</Button>
                    <Button fullWidth variant="contained" size="small" disableElevation onClick={() => onBuy(terrain)}>Acheter</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* 5. DESTINATIONS EN VOGUE */}
          <Typography variant="h5" sx={{ mb: 3 }}>Destinations en vogue</Typography>
          <Box sx={{ width: '100%', overflow: 'hidden', py: 2, mb: 6 }}>
            <div className="slider-track">
              {INFINITE_CITIES.map((city, idx) => (
                <Card key={idx} onClick={() => setSelectedCity(city.id)} sx={{ width: 280, height: 160, flexShrink: 0, position: 'relative', borderRadius: 4, cursor: 'pointer', border: selectedCity === city.id ? '3px solid #0a5c44' : '1px solid #e2e8f0' }}>
                  <CardMedia component="img" image={city.image} sx={{ height: '100%', filter: 'brightness(0.95)' }} />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', p: 2 }}>
                    <Typography variant="h6" color="white">{city.name} {city.flag}</Typography>
                  </Box>
                </Card>
              ))}
            </div>
          </Box>

        </Container>
      </Box>

      {/* 6. NOUVEAU FOOTER (COMPACT, 3 COLONNES) */}
      <Box sx={{ bgcolor: 'primary.dark', color: '#cbd5e1', pt: 4, pb: 2 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
          
          <Grid container spacing={4} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 3 }}>
            {/* Colonne 1 : À propos (Liée à l'ancre #about) */}
            <Grid item xs={12} md={4} id="about" sx={{ scrollMarginTop: '100px' }}>
              <Typography variant="subtitle1" color="white" fontWeight="800" mb={1}>À propos de nous</Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.5, pr: 2 }}>
                MBOALAND est la première plateforme de numérisation foncière au Cameroun. Nous centralisons, vérifions et sécurisons vos transactions immobilières.
              </Typography>
            </Grid>
            
            {/* Colonne 2 : Aide & Contact (Liée à l'ancre #support) */}
            <Grid item xs={12} md={4} id="support" sx={{ scrollMarginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' } }}>
              <Box>
                <Typography variant="subtitle1" color="white" fontWeight="800" mb={1}>Aide & Contact</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2">📞 +237 600 00 00 00</Typography>
                  <Typography variant="body2">✉️ support@mboaland.cm</Typography>
                  <Typography variant="body2">📍 Douala, Cameroun</Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Colonne 3 : Engagement Qualité */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box>
                <Typography variant="subtitle1" color="white" fontWeight="800" mb={1}>Engagement Qualité</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Globe size={16} color="#34d399" /><Typography variant="body2">Cameroun · Français</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Shield size={16} color="#34d399" /><Typography variant="body2">Achat 100% garanti</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PhoneCall size={16} color="#34d399" /><Typography variant="body2">Support 7j/7</Typography></Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* LIGNE DES LIENS LÉGAUX */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mt: 2, gap: 1 }}>
            <Typography variant="caption">© 2026 Mboaland S.A. Tous droits réservés.</Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography component="a" href="#privacy" variant="caption" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white', textDecoration: 'underline' } }}>
                Politique de confidentialité
              </Typography>
              <Typography component="a" href="#terms" variant="caption" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white', textDecoration: 'underline' } }}>
                Mentions Légales
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* MODALE PUBLICATION */}
      <Dialog open={isPublishModalOpen} onClose={onClosePublishModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.dark' }}>Publier un terrain</DialogTitle>
        <DialogContent dividers>
          <form id="publishForm" onSubmit={handlePublishTerrain}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}><TextField size="small" fullWidth required label="Titre d'annonce" value={newTitle} onChange={e => setNewTitle(e.target.value)} /></Grid>
              <Grid item xs={12} sm={6}><TextField size="small" fullWidth required label="Ville" value={newCity} onChange={e => setNewCity(e.target.value)} /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Usage</InputLabel>
                  <Select label="Usage" value={newType} onChange={e => setNewType(e.target.value as any)}>
                    <MenuItem value="residentiel">Résidentiel</MenuItem>
                    <MenuItem value="agricole">Agricole</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="industriel">Industriel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField size="small" fullWidth required label="N° de Titre Foncier" value={newLandTitle} onChange={e => setNewLandTitle(e.target.value)} /></Grid>
              <Grid item xs={12} sm={6}><TextField size="small" fullWidth required label="Prix (FCFA)" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></Grid>
              <Grid item xs={12}><TextField size="small" fullWidth multiline rows={3} label="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} /></Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={onClosePublishModal} color="inherit">Annuler</Button>
          <Button type="submit" form="publishForm" variant="contained" color="primary" disableElevation>Publier</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}