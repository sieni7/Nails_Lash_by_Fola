import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

const ADMIN_PIN = "2025";

const Admin = () => {
  const { compteurJour, setCompteurJour } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('nails_lash_commandes');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
    } else {
      alert("❌ Code incorrect");
      setPin('');
    }
  };

  const resetQuota = () => {
    if (window.confirm("⚠️ Voulez-vous vraiment réinitialiser le compteur journalier ?")) {
      setCompteurJour(0);
      localStorage.setItem('nails_lash_compteur', JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        count: 0
      }));
      alert("✅ Compteur réinitialisé avec succès");
    }
  };

  const resetAllData = () => {
    if (window.confirm("⚠️⚠️ RÉINITIALISATION COMPLÈTE ⚠️⚠️\n\nCette action supprime TOUTES les données :\n- Toutes les commandes\n- Le compteur journalier\n- Le panier\n\nAction irréversible !")) {
      const confirmation = window.prompt("Tapez 'RÉINITIALISER' pour confirmer:");
      if (confirmation === "RÉINITIALISER") {
        localStorage.clear();
        alert("🗑️ Toutes les données ont été effacées");
        window.location.href = "/";
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
        <div className="admin-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div className="admin-icon" style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ marginBottom: '20px' }}>Mode Admin</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Code PIN" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', textAlign: 'center' }}
              autoFocus
            />
            <button type="submit" className="custom-modal-btn custom-modal-btn-primary" style={{ width: '100%' }}>
              Valider
            </button>
          </form>
          <a href="/" style={{ display: 'block', marginTop: '20px', color: 'var(--whatsapp-teal)' }}>Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="app-container" style={{ padding: '20px', paddingBottom: '100px' }}>
      <header className="wa-header" style={{ borderRadius: '16px', marginBottom: '20px' }}>
        <div className="wa-header__info">
          <h1>🛠️ Mode Admin</h1>
          <div className="status">🔒 Accès restreint</div>
        </div>
      </header>
      
      <div className="admin-card" style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--whatsapp-light)', paddingBottom: '15px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <h2 style={{ margin: 0 }}>Tableau de bord</h2>
        </div>
        
        <div style={{ background: 'var(--gray-100)', borderRadius: '16px', padding: '15px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-300)' }}>
            <span style={{ fontWeight: 500, color: 'var(--gray-600)' }}>📅 Date</span>
            <span style={{ fontWeight: 700 }}>{today}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-300)' }}>
            <span style={{ fontWeight: 500, color: 'var(--gray-600)' }}>📈 Commandes aujourd'hui</span>
            <span style={{ fontWeight: 700, color: compteurJour >= 10 ? '#dc3545' : compteurJour >= 7 ? '#ff9800' : 'var(--whatsapp-green-dark)' }}>
              {compteurJour} / 10
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ fontWeight: 500, color: 'var(--gray-600)' }}>✅ Places restantes</span>
            <span style={{ fontWeight: 700 }}>{Math.max(0, 10 - compteurJour)}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="custom-modal-btn custom-modal-btn-primary" onClick={resetQuota}>
            🔄 Réinitialiser le compteur
          </button>
          <button className="custom-modal-btn custom-modal-btn-secondary" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Masquer l'historique" : "📋 Voir historique"}
          </button>
          <button className="custom-modal-btn" style={{ background: '#dc3545', color: 'white' }} onClick={resetAllData}>
            ⚠️ Réinitialisation complète
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="admin-card" style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '15px', borderBottom: '1px solid var(--gray-300)', paddingBottom: '10px' }}>📋 Historique des commandes</h3>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#757575', margin: '20px 0' }}>Aucune commande enregistrée</p>
          ) : (
            <div>
              {history.slice(-20).reverse().map((cmd, idx) => (
                <div key={idx} style={{ padding: '10px', borderBottom: '1px solid var(--gray-300)', marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--whatsapp-teal)', fontWeight: 500, marginBottom: '4px' }}>
                    {new Date(cmd.date).toLocaleString("fr-FR")}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    {cmd.prestations.map(p => p.nom).join(", ")}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--whatsapp-green-dark)' }}>
                    {cmd.total} FCFA
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--whatsapp-teal)', fontWeight: 500, textDecoration: 'none' }}>
        🔙 Retour à l'accueil client
      </a>
    </div>
  );
};

export default Admin;
