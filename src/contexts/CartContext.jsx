import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [panier, setPanier] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [compteurJour, setCompteurJour] = useState(0);
  
  // Charger localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('nails_lash_panier');
    if (saved) setPanier(JSON.parse(saved));
    
    // Charger le compteur
    const savedCompteur = localStorage.getItem('nails_lash_compteur');
    if (savedCompteur) {
      const data = JSON.parse(savedCompteur);
      if (data.date === new Date().toISOString().split('T')[0]) {
        setCompteurJour(data.count);
      } else {
        setCompteurJour(0);
      }
    }
  }, []);
  
  // Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem('nails_lash_panier', JSON.stringify(panier));
  }, [panier]);
  
  const ajouterAuPanier = (prestation) => {
    if (panier.length >= 3) {
      alert('Maximum 3 prestations par commande');
      return false;
    }
    setPanier([...panier, prestation]);
    return true;
  };
  
  const retirerDuPanier = (id) => {
    setPanier(panier.filter(item => item.id !== id));
  };

  const incrementerCompteur = () => {
    const newCount = compteurJour + 1;
    setCompteurJour(newCount);
    localStorage.setItem('nails_lash_compteur', JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      count: newCount
    }));
  };
  
  return (
    <CartContext.Provider value={{
      panier,
      ajouterAuPanier,
      retirerDuPanier,
      viderPanier: () => setPanier([]),
      compteurJour,
      incrementerCompteur
    }}>
      {children}
    </CartContext.Provider>
  );
};
