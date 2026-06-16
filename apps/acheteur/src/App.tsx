import React, { useState } from 'react';
import Home, { type Terrain } from './pages/Home';
import Details from './pages/Details';
import Purchase from './pages/Purchase';
import Dashboard from './pages/Dashboard';
import "./pages/pages.css";

type ViewState = 'home' | 'details' | 'purchase' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [assignedNotary, setAssignedNotary] = useState<string>('');

  const handleViewDetails = (terrain: Terrain) => {
    setSelectedTerrain(terrain);
    setView('details');
  };

  const handleBuy = (terrain: Terrain) => {
    setSelectedTerrain(terrain);
    setView('purchase');
  };

  const handlePurchaseSuccess = (notaryName: string) => {
    setAssignedNotary(notaryName);
    setView('dashboard'); // Dès que l'achat est lancé, on va directement au Tableau de Bord !
  };

  const handleRestart = () => {
    setSelectedTerrain(null);
    setAssignedNotary('');
    setView('home'); // Retour au catalogue
  };

  return (
    <div>
      {/* 1. PORTAIL CATALOGUE ACCUEIL */}
      {view === 'home' && (
        <Home 
          onViewDetails={handleViewDetails} 
          onBuy={handleBuy} 
        />
      )}

      {/* 2. FICHE DE DÉTAILS DU TERRAIN */}
      {view === 'details' && selectedTerrain && (
        <Details 
          terrain={selectedTerrain}
          onBack={() => setView('home')}
          onBuy={handleBuy}
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
        />
      )}
    </div>
  );
}