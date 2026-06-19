import React, { useState } from 'react';
import Home, { type Terrain } from './pages/Home';
import Details from './pages/Details';
import Purchase from './pages/Purchase';
import Dashboard from './pages/Dashboard';
import AuthModal, { type UserRole } from './pages/AuthModal';
import './pages/pages.css';

type ViewState = 'home' | 'details' | 'purchase' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [assignedNotary, setAssignedNotary] = useState<string>('');

  // ================= LOGIQUE GLOBALE D'AUTHENTIFICATION =================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [pendingAction, setPendingAction] = useState<{ type: 'buy' | 'publish', payload?: any } | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false); // Formulaire de publication vendeur

  // INTERCEPTEUR : Lors d'un clic sur Acheter
  const handleAttemptBuy = (terrain: Terrain) => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'buy', payload: terrain });
      setAuthMode('register'); // Propose l'inscription d'abord
      setAuthModalOpen(true);
    } else {
      setSelectedTerrain(terrain);
      setView('purchase');
    }
  };

  // INTERCEPTEUR : Lors d'un clic sur Publier un terrain
  const handleAttemptPublish = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'publish' });
      setAuthMode('register');
      setAuthModalOpen(true);
    } else {
      setIsPublishModalOpen(true);
    }
  };

  // Authentification réussie
  const handleAuthSuccess = (role: UserRole) => {
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    // On exécute l'action mise en attente
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
    <div>
      {/* Fenêtre d'authentification globale */}
      <AuthModal 
        isOpen={authModalOpen} 
        initialMode={authMode}
        onClose={() => { setAuthModalOpen(false); setPendingAction(null); }} 
        onSuccess={handleAuthSuccess} 
      />

      {/* 1. PORTAIL CATALOGUE ACCUEIL (CORRIGÉ : Toutes les propriétés sont transmises) */}
      {view === 'home' && (
        <Home 
          onViewDetails={handleViewDetails} 
          onBuy={handleAttemptBuy} 
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
          onBuy={handleAttemptBuy}
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
            setIsAuthenticated(false);
            handleRestart();
          }}
        />
      )}
    </div>
  );
}