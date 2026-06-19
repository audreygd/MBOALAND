import React, { useState } from 'react';
import { X, Mail, Lock, User, Briefcase } from 'lucide-react';
import './pages.css';

export type UserRole = 'Acheteur' | 'Vendeur' | 'Notaire' | 'Géomètre' | 'Admin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>('Acheteur');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'authentification réussie
    onSuccess(role);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-box animate-fade-in" style={{ maxWidth: '420px', padding: '0' }}>
        
        {/* Header de la modale */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-primary-dark)' }}>
            Bienvenue sur MBOALAND
          </h3>
          <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={onClose} />
        </div>

        {/* Corps de la modale */}
        <div style={{ padding: '1.5rem' }}>
          
          <div className="auth-tabs">
            <div className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
              Se connecter
            </div>
            <div className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
              S'inscrire
            </div>
          </div>

          <button className="btn-google" onClick={() => onSuccess(role)}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
            Continuer avec Google
          </button>

          <div className="auth-separator">ou avec votre e-mail</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {mode === 'register' && (
              <>
                <div>
                  <label className="form-group-label">Nom complet</label>
                  <div style={{ position: 'relative' }}>
                    <User className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                    <input type="text" placeholder="Jean Dupont" className="form-group-input" style={{ paddingLeft: '2.25rem' }} required />
                  </div>
                </div>

                <div>
                  <label className="form-group-label">Je suis un(e) :</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                    <select 
                      className="form-group-input" 
                      style={{ paddingLeft: '2.25rem', fontWeight: 600 }}
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                      <option value="Acheteur">Acheteur (Acquérir un terrain)</option>
                      <option value="Vendeur">Vendeur (Publier des terrains)</option>
                      <option value="Notaire">Notaire (Étude notariale)</option>
                      <option value="Géomètre">Géomètre (Expert ONIGE)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="form-group-label">Adresse e-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input type="email" placeholder="votre@email.com" className="form-group-input" style={{ paddingLeft: '2.25rem' }} required />
              </div>
            </div>

            <div>
              <label className="form-group-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input type="password" placeholder="••••••••" className="form-group-input" style={{ paddingLeft: '2.25rem' }} required />
              </div>
            </div>

            <button type="submit" className="btn btn-airbnb btn-airbnb-buy" style={{ marginTop: '0.5rem', padding: '0.85rem' }}>
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}