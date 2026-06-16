import React, { createContext, useState, useEffect, useContext } from 'react';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [panier, setPanier] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [compteurJour, setCompteurJour] = useState(0);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', icon: '⚠️' });
  const { showToast } = useToast();

  const vibrate = (duration = 10) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(duration);
    }
  };

  const showModal = (title, message, icon = '⚠️') => {
    setModal({ isOpen: true, title, message, icon });
  };
  
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
      vibrate(50);
      showModal('Limite atteinte', 'Maximum 3 prestations par commande.', '⚠️');
      return false;
    }
    vibrate(10);
    setPanier([...panier, prestation]);
    showToast(`${prestation.nom} ajouté au panier`, 'success');
    return true;
  };

  const retirerDuPanier = (id) => {
    vibrate(10);
    const prestation = panier.find(p => p.id === id);
    setPanier(panier.filter(item => item.id !== id));
    if (prestation) {
      showToast(`${prestation.nom} retiré`, 'error');
    }
  };

  const incrementerCompteur = () => {
    const newCount = compteurJour + 1;
    setCompteurJour(newCount);
    localStorage.setItem('nails_lash_compteur', JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      count: newCount
    }));
    
    // Save order history here to make sure Admin can see it
    const savedCommandes = localStorage.getItem('nails_lash_commandes');
    let commandes = savedCommandes ? JSON.parse(savedCommandes) : [];
    commandes.push({
      date: new Date().toISOString(),
      prestations: panier,
      total: panier.reduce((sum, item) => sum + item.prix, 0)
    });
    localStorage.setItem('nails_lash_commandes', JSON.stringify(commandes));
  };
  
  return (
    <CartContext.Provider value={{
      panier,
      ajouterAuPanier,
      retirerDuPanier,
      viderPanier: () => setPanier([]),
      compteurJour,
      incrementerCompteur,
      setCompteurJour,
      showModal
    }}>
      {children}
      <Modal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        icon={modal.icon}
        title={modal.title}
        message={modal.message}
      />
    </CartContext.Provider>
  );
};
