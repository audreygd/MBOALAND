// @ts-nocheck
import React from 'react';
import { ArrowLeft, Compass, FileText, CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { type Terrain } from './Home';
import { ThemeProvider, createTheme, Box, Container, Typography, Button, Grid, Paper, Chip } from '@mui/material';

const theme = createTheme({
  palette: { 
    primary: { main: '#0a5c44', dark: '#05332c' }, 
    background: { default: '#f8fafc' }, 
    text: { primary: '#1e293b', secondary: '#64748b' } 
  },
  typography: { 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: { fontSize: '1.3rem', fontWeight: 800 },
    h5: { fontSize: '1.1rem', fontWeight: 800 },
    h6: { fontSize: '0.95rem', fontWeight: 800 },
    subtitle1: { fontSize: '0.85rem', fontWeight: 800 },
    subtitle2: { fontSize: '0.8rem', fontWeight: 700 },
    body1: { fontSize: '0.8rem' },
    body2: { fontSize: '0.7rem' },
    button: { textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' } 
  },
  shape: { borderRadius: 12 },
});

interface DetailsProps { terrain: Terrain; onBack: () => void; onBuy: (terrain: Terrain) => void; }

export default function Details({ terrain, onBack, onBuy }: DetailsProps) {
  const getGoogleMapsEmbedUrl = (gpsString: string) => `https://maps.google.com/maps?q=${encodeURIComponent(gpsString.replace(/°\s*[NESOW]/gi, (m) => m.includes('S') || m.includes('O') || m.includes('W') ? '-' : '').trim())}&t=k&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="lg">
          
          {/* ENTÊTE RETOUR */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button startIcon={<ArrowLeft size={16} />} onClick={onBack} variant="outlined" sx={{ bgcolor: 'white', borderColor: '#e2e8f0', color: 'text.primary', py: 0.5, px: 2 }}>Retour</Button>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{terrain.landTitle}</Typography>
          </Box>

          <Grid container spacing={3}>
            
            {/* COLONNE GAUCHE (8/12) : Images compactes, Description, Carte, Documents */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                
                {/* Galerie d'images - TAILLE RÉDUITE */}
                <Paper elevation={0} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0.75, borderRadius: 2, overflow: 'hidden' }}>
                  <img src={terrain.image} alt={terrain.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80" alt="Satellite" style={{ width: '100%', flex: 1, objectFit: 'cover' }} />
                    <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80" alt="Env" style={{ width: '100%', flex: 1, objectFit: 'cover' }} />
                  </Box>
                </Paper>

                {/* Description - COMPACTE */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>{terrain.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>{terrain.city} · Cameroun</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.dark', borderBottom: '1px solid #e2e8f0', pb: 0.75, mb: 1.5 }}>Description du terrain</Typography>
                  <Typography variant="body2" lineHeight={1.6}>{terrain.desc}</Typography>
                </Paper>

                {/* Localisation Google Maps - COMPACTE */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.dark', borderBottom: '1px solid #e2e8f0', pb: 0.75, mb: 1.5 }}>Localisation Google Maps</Typography>
                  <Box sx={{ width: '100%', height: 250, borderRadius: 2, overflow: 'hidden', mb: 1.5, border: '1px solid #e2e8f0' }}>
                    <iframe title="Map" src={getGoogleMapsEmbedUrl(terrain.gps)} width="100%" height="100%" style={{ border: 0 }}></iframe>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Coordonnées GPS : <strong>{terrain.gps}</strong></Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}><Compass size={14} /> Position vérifiée</Typography>
                  </Box>
                </Paper>

                {/* Documents - COMPACTE */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.dark', borderBottom: '1px solid #e2e8f0', pb: 0.75, mb: 1.5 }}>
                    Documents administratifs
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <FileText size={24} color="#be123c" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight="800">Copie conforme du Titre Foncier</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Document PDF officiel · {terrain.landTitle}</Typography>
                    </Box>
                    <Button variant="outlined" color="inherit" startIcon={<Download size={14} />} sx={{ borderColor: '#cbd5e1', bgcolor: 'white', py: 0.5, px: 1.5, fontSize: '0.7rem' }}>
                      Télécharger
                    </Button>
                  </Box>
                </Paper>

              </Box>
            </Grid>

            {/* COLONNE DROITE (4/12) : CARTE "LANCER L'ACQUISITION" - RÉORGANISÉE ET COMPACTE */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                border: '2px solid #0a5c44', 
                position: 'sticky', 
                top: 80,
                bgcolor: 'white'
              }}>
                <Chip 
                  icon={<ShieldCheck size={14} />} 
                  label="Parcelle 100% Certifiée" 
                  color="success" 
                  sx={{ 
                    bgcolor: '#e2f2ec', 
                    color: 'primary.dark', 
                    fontWeight: 700, 
                    mb: 2,
                    height: 24,
                    '& .MuiChip-label': { fontSize: '0.7rem', px: 1 }
                  }} 
                />
                
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>Prix d'acquisition</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>{terrain.price}</Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <CheckCircle2 size={16} color="#059669" /> 
                    <Typography variant="body2" fontWeight={600}>Superficie : {terrain.area}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <CheckCircle2 size={16} color="#059669" /> 
                    <Typography variant="body2" fontWeight={600}>Vendeur : {terrain.owner}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <CheckCircle2 size={16} color="#059669" /> 
                    <Typography variant="body2" fontWeight={600}>Titre libre d'hypothèque</Typography>
                  </Box>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large" 
                  disableElevation 
                  onClick={() => onBuy(terrain)} 
                  sx={{ 
                    py: 1.25, 
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}
                >
                  Lancer l'acquisition
                </Button>
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}