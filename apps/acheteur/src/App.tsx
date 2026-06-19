import React, { useState } from 'react';
import Home, { type Terrain } from './pages/Home';
import Details from './pages/Details';
import Purchase from './pages/Purchase';
import Dashboard from './pages/Dashboard';
import AuthModal, { type UserRole } from './pages/AuthModal'; 
import { CircleCheck } from 'lucide-react';
import './pages/pages.css';

type ViewState = 'home' | 'details' | 'purchase' | 'dashboard' | 'success';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [assignedNotary, setAssignedNotary] = useState<string>('');

  // ================= LOGIQUE GLOBALE D'AUTHENTIFICATION =================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [pendingAction, setPendingAction] = useState<{ type: 'buy' | 'publish', payload?: any } | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false); // Gère l'ouverture du formulaire vendeur

  // INTERCEPTEUR : Quand on clique sur ACHETER (depuis Home ou Details)
  const handleAttemptBuy = (terrain: Terrain) => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'buy', payload: terrain });
      setAuthMode('register'); // Propose l'inscription par défaut
      setAuthModalOpen(true);
    } else {
      // Déjà connecté ? On lance l'achat !
      setSelectedTerrain(terrain);
      setView('purchase');
    }
  };

  // INTERCEPTEUR : Quand on clique sur PUBLIER UN TERRAIN
  const handleAttemptPublish = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'publish' });
      setAuthMode('register');
      setAuthModalOpen(true);
    } else {
      setIsPublishModalOpen(true);
    }
  };

  // CONNEXION RÉUSSIE
  const handleAuthSuccess = (role: UserRole) => {
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    // On exécute l'action qui était en attente avant la connexion
    if (pendingAction?.type === 'buy') {
      setSelectedTerrain(pendingAction.payload);
      setView('purchase');
    } else if (pendingAction?.type === 'publish') {
      setIsPublishModalOpen(true);
    }
    setPendingAction(null);
  };
  // ======================================================================

  const handleViewDetails = (terrain: Terrain) => {
    setSelectedTerrain(terrain);
    setView('details');
  };

  const handlePurchaseSuccess = (notaryName: string) => {
    setAssignedNotary(notaryName);
    setView('dashboard'); 
  };

  const handleRestart = () => {
    setSelectedTerrain(null);
    setAssignedNotary('');
    setView('home'); 
  };

  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      
      {/* La Modale est maintenant disponible par-dessus TOUTES les pages */}
      <AuthModal 
        isOpen={authModalOpen} 
        initialMode={authMode}
        onClose={() => { setAuthModalOpen(false); setPendingAction(null); }} 
        onSuccess={handleAuthSuccess} 
      />

      {/* 1. PORTAIL CATALOGUE ACCUEIL */}
      {view === 'home' && (
        <Home 
          onViewDetails={handleViewDetails} 
          onBuy={handleAttemptBuy} /* On injecte l'intercepteur sécurisé */
          
          /* Nouveaux paramètres passés au Home pour piloter l'authentification */
          isAuthenticated={isAuthenticated}
          onLoginRequest={() => { setAuthMode('login'); setAuthModalOpen(true); }}
          onRegisterRequest={() => { setAuthMode('register'); setAuthModalOpen(true); }}
          onPublishRequest={handleAttemptPublish}
          isPublishModalOpen={isPublishModalOpen}
          onClosePublishModal={() => setIsPublishModalOpen(false)}
        />
      )}

      {/* 2. FICHE DE DÉTAILS DU TERRAIN */}
      {view === 'details' && selectedTerrain && (
        <Details 
          terrain={selectedTerrain}
          onBack={() => setView('home')}
          onBuy={handleAttemptBuy} /* On injecte le MÊME intercepteur sécurisé ici ! */
        />
      )}

      {/* 3. DESIGNATION DU CABINET NOTAIRE */}
      {view === 'purchase' && selectedTerrain && (
        <Purchase 
          terrain={selectedTerrain}
          onBack={() => setView('details')}
          onSubmitSuccess={handlePurchaseSuccess}
        />
      )}

     {/* 4. TABLEAU DE BORD INTERACTIF DE L'ACHETEUR */}
      {view === 'dashboard' && selectedTerrain && (
        <Dashboard 
          terrain={selectedTerrain}
          notaryName={assignedNotary || 'Cabinet Notaire Partenaire'}
          onRestart={handleRestart}
          onLogout={() => {
            setIsAuthenticated(false); // On déconnecte l'utilisateur
            handleRestart();           // On le renvoie à l'accueil
          }}
        />
      )}
      
    </div>
  );
}