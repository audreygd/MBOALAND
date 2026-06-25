// @ts-nocheck
import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, ArrowLeft, Send, Plus, Minus, 
  User, Mail, Phone, Landmark 
} from 'lucide-react';
import { type Terrain } from './Home';
import { 
  Box, Container, Typography, Button, Paper, Avatar, 
  Grid, TextField, Alert, Divider, InputAdornment 
} from '@mui/material';

interface PurchaseProps { 
  terrain: Terrain; 
  onBack: () => void; 
  onSubmitSuccess: (notaryName: string) => void; 
}

export default function Purchase({ terrain, onBack, onSubmitSuccess }: PurchaseProps) {
  const [selectedNotaire, setSelectedNotaire] = useState<{ id: string | null; name: string; fee: number }>({ id: null, name: '', fee: 0 });
  const [customFormOpen, setCustomFormOpen] = useState(false);
  
  // États pour le notaire personnel
  const [customNotary, setCustomNotary] = useState({ name: '', email: '', phone: '', cabinet: '' });
  const [error, setError] = useState(false);

  const fmt = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';

  const notairesPartenaires = [
    { id: 'n1', name: 'Me Mireille Dubois', detail: 'Cabinet Littoral · Douala', fee: 40000, initial: 'MD' },
    { id: 'n2', name: 'Me Jean-Paul Nkodo', detail: 'Cabinet Centre · Yaoundé', fee: 35000, initial: 'JN' },
  ];

  const handleSelectPartner = (n: any) => {
    setSelectedNotaire(n);
    setCustomFormOpen(false); // Ferme le formulaire perso si on choisit un partenaire
    setError(false);
  };

  const toggleCustomForm = () => {
    setCustomFormOpen(!customFormOpen);
    if (!customFormOpen) {
      setSelectedNotaire({ id: 'custom', name: '', fee: 0 }); // Reset la sélection partenaire
    }
  };

  const handleSubmit = () => {
    // Si formulaire perso ouvert, on vérifie le nom saisi
    const finalName = customFormOpen ? customNotary.name : selectedNotaire.name;
    
    if (!finalName || (customFormOpen && !customNotary.email)) {
      setError(true);
      return;
    }
    onSubmitSuccess(finalName);
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        
        {/* BOUTON RETOUR COMPACT */}
        <Button 
          startIcon={<ArrowLeft size={16} />} 
          onClick={onBack} 
          variant="outlined" 
          size="small"
          sx={{ mb: 3, bgcolor: 'white', borderColor: '#e2e8f0', color: 'text.primary', fontWeight: 700 }}
        >
          Retour
        </Button>

        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, border: '1px solid #e2e8f0' }}>
          
          {/* ENTÊTE */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: '#e2f2ec', color: '#0a5c44' }}>
              <Landmark size={20} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                Choix du cabinet de notaire
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dossier de mutation pour la parcelle : <strong>{terrain.refCode}</strong>
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* SECTION 1 : PARTENAIRES */}
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 2 }}>
            Notaires certifiés MBOALAND
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {notairesPartenaires.map((n) => {
              const isActive = selectedNotaire.id === n.id;
              return (
                <Grid item xs={12} key={n.id}>
                  <Paper 
                    elevation={0} 
                    onClick={() => handleSelectPartner(n)} 
                    sx={{ 
                      p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', 
                      border: '1.5px solid',
                      borderColor: isActive ? '#0a5c44' : '#e2e8f0', 
                      bgcolor: isActive ? '#f0fdf4' : 'white',
                      transition: '0.2s',
                      '&:hover': { borderColor: '#0a5c44' }
                    }}
                  >
                    <Avatar sx={{ bgcolor: isActive ? '#0a5c44' : '#f1f5f9', color: isActive ? 'white' : '#64748b', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {n.initial}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{n.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{n.detail}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#0a5c44', fontSize: '0.9rem' }}>{fmt(n.fee)}</Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary' }}>FRAIS D'ACTE</Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* SECTION 2 : NOTAIRE PERSONNEL */}
          <Box sx={{ mb: 4 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              color="inherit"
              onClick={toggleCustomForm}
              startIcon={customFormOpen ? <Minus size={16} /> : <Plus size={16} />}
              sx={{ borderStyle: 'dashed', borderWidth: '2px', py: 1.5, borderColor: '#cbd5e1', fontSize: '0.8rem', color: 'text.secondary' }}
            >
              {customFormOpen ? "Annuler l'ajout personnel" : "Désigner mon propre notaire personnel"}
            </Button>

            {customFormOpen && (
              <Box sx={{ mt: 3, p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Informations du Notaire</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth size="small" label="Nom Complet" 
                      value={customNotary.name}
                      onChange={(e) => setCustomNotary({...customNotary, name: e.target.value})}
                      InputProps={{ startAdornment: <InputAdornment position="start"><User size={16}/></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth size="small" label="Nom du Cabinet" 
                      placeholder="Etude de Me..."
                      value={customNotary.cabinet}
                      onChange={(e) => setCustomNotary({...customNotary, cabinet: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth size="small" label="E-mail" 
                      value={customNotary.email}
                      onChange={(e) => setCustomNotary({...customNotary, email: e.target.value})}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={16}/></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth size="small" label="Téléphone" 
                      value={customNotary.phone}
                      onChange={(e) => setCustomNotary({...customNotary, phone: e.target.value})}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={16}/></InputAdornment> }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  * Les frais seront à convenir directement avec votre notaire hors plateforme.
                </Typography>
              </Box>
            )}
          </Box>

          {/* ALERTE ERREUR */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, fontSize: '0.8rem', fontWeight: 600 }}>
              Veuillez sélectionner un notaire ou compléter les champs obligatoires du notaire personnel.
            </Alert>
          )}

          {/* FOOTER ACTIONS */}
          <Box sx={{ pt: 3, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0a5c44' }}>
              <ShieldCheck size={20} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>PAIEMENT SÉCURISÉ</Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              disableElevation
              endIcon={<Send size={16} />}
              onClick={handleSubmit}
              sx={{ px: 4, py: 1.2, borderRadius: 2 }}
            >
              Envoyer le dossier
            </Button>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}