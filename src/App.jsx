import React, { useState } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import PrestationGrid from './components/PrestationGrid';
import CartFab from './components/CartFab';
import CartModal from './components/CartModal';
import Admin from './components/Admin';
import { CartProvider } from './contexts/CartContext';
import './styles/variables.css';
import './styles/components.css';
import './styles/main.css';

function App() {
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('Toutes');
  
  React.useEffect(() => {
    fetch('/data/prestations.json')
      .then(res => res.json())
      .then(data => {
        setPrestations(data.prestations || data);
        setLoading(false);
      });
  }, []);

  const filteredPrestations = currentCategory === 'Toutes' 
    ? prestations 
    : prestations.filter(p => p.categorie === currentCategory);
    
  // Simple routing
  if (window.location.pathname === '/admin') {
    return (
      <CartProvider>
        <Admin />
      </CartProvider>
    );
  }
  
  return (
    <CartProvider>
      <div className="app-container">
        <Header />
        <div className="hours-banner" style={{ background: 'var(--whatsapp-light)', padding: '8px', textAlign: 'center', fontSize: '12px', borderBottom: '1px solid var(--gray-300)' }}>
          📍 Bingerville | 🕒 Mar-Dim 9h-21h
        </div>
        <CategoryFilter 
          prestations={prestations} 
          currentCategory={currentCategory} 
          onSelectCategory={setCurrentCategory} 
        />
        <PrestationGrid prestations={filteredPrestations} loading={loading} />
        <CartFab />
        <CartModal />
      </div>
    </CartProvider>
  );
}

export default App;
