// @ts-nocheck
import React, { useState } from 'react';
import { X, Mail, Lock, User, Briefcase } from 'lucide-react';
import { 
  Dialog, DialogTitle, DialogContent, IconButton, Typography, 
  Box, Tabs, Tab, Button, Divider, TextField, MenuItem, InputAdornment,
  ThemeProvider, createTheme
} from '@mui/material';

export type UserRole = 'Acheteur' | 'Vendeur' | 'Notaire' | 'Géomètre' | 'Admin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
  initialMode?: 'login' | 'register';
}

const theme = createTheme({
  palette: { primary: { main: '#0a5c44', dark: '#05332c' }, text: { primary: '#1e293b', secondary: '#64748b' } },
  typography: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
  shape: { borderRadius: 12 },
});

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>('Acheteur');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(role);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark' }}>Bienvenue sur MBOALAND</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}><X size={20} /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 4 }}>
          <Tabs value={mode} onChange={(e, newVal) => setMode(newVal)} variant="fullWidth" sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tab value="login" label="Se connecter" sx={{ fontWeight: 700 }} />
            <Tab value="register" label="S'inscrire" sx={{ fontWeight: 700 }} />
          </Tabs>

          <Button fullWidth variant="outlined" onClick={() => onSuccess(role)} sx={{ color: '#334155', borderColor: '#cbd5e1', py: 1.2, mb: 2, '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' } }} startIcon={<img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />}>
            Continuer avec Google
          </Button>

          <Divider sx={{ mb: 3 }}><Typography variant="body2" color="text.secondary">ou avec votre e-mail</Typography></Divider>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {mode === 'register' && (
              <>
                {/* CORRECTION : Ajout de variant="outlined" */}
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  required 
                  label="Nom complet" 
                  placeholder="Jean Dupont" 
                  InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color="#94a3b8" /></InputAdornment> }} 
                />
                
                {/* CORRECTION : Ajout de variant="outlined" */}
                <TextField 
                  select 
                  variant="outlined" 
                  fullWidth 
                  required 
                  label="Je suis un(e) :" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole)} 
                  InputProps={{ startAdornment: <InputAdornment position="start"><Briefcase size={18} color="#94a3b8" /></InputAdornment> }} 
                  SelectProps={{ sx: { fontWeight: 600 } }}
                >
                  <MenuItem value="Acheteur">Acheteur (Acquérir un terrain)</MenuItem>
                  <MenuItem value="Vendeur">Vendeur (Publier des terrains)</MenuItem>
                  <MenuItem value="Notaire">Notaire (Étude notariale)</MenuItem>
                  <MenuItem value="Géomètre">Géomètre (Expert ONIGE)</MenuItem>
                </TextField>
              </>
            )}

            {/* CORRECTION : Ajout de variant="outlined" */}
            <TextField 
              variant="outlined" 
              fullWidth 
              required 
              type="email" 
              label="Adresse e-mail" 
              placeholder="votre@email.com" 
              InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color="#94a3b8" /></InputAdornment> }} 
            />
            
            {/* CORRECTION : Ajout de variant="outlined" */}
            <TextField 
              variant="outlined" 
              fullWidth 
              required 
              type="password" 
              label="Mot de passe" 
              placeholder="••••••••" 
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={18} color="#94a3b8" /></InputAdornment> }} 
            />

            <Button type="submit" variant="contained" color="primary" fullWidth disableElevation sx={{ py: 1.5, mt: 1, fontSize: '1rem' }}>
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}