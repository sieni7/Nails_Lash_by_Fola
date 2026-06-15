import React, { useState, useEffect } from 'react';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalCA: 0,
    commandesJour: 0,
    topPrestations: [],
    evolution: []
  });

  useEffect(() => {
    const commandes = JSON.parse(localStorage.getItem('nails_lash_commandes') || '[]');
    
    // Total CA
    const totalCA = commandes.reduce((sum, cmd) => sum + (cmd.total || 0), 0);
    
    // Commandes aujourd'hui
    const today = new Date().toDateString();
    const commandesJour = commandes.filter(cmd => 
      new Date(cmd.date).toDateString() === today
    ).length;
    
    // Top prestations
    const prestationsCount = {};
    commandes.forEach(cmd => {
      cmd.prestations?.forEach(p => {
        prestationsCount[p.nom] = (prestationsCount[p.nom] || 0) + 1;
      });
    });
    const topPrestations = Object.entries(prestationsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    setStats({ totalCA, commandesJour, topPrestations, evolution: [] });
  }, []);

  return (
    <div className="admin-stats" style={{ marginBottom: '20px' }}>
      <div className="stats-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div className="stat-card" style={{ background: 'var(--gray-100)', padding: '15px', borderRadius: '16px', textAlign: 'center' }}>
          <div className="stat-icon" style={{ fontSize: '24px', marginBottom: '5px' }}>💰</div>
          <div className="stat-value" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--whatsapp-green-dark)' }}>{stats.totalCA.toLocaleString()} FCFA</div>
          <div className="stat-label" style={{ fontSize: '12px', color: 'var(--gray-600)' }}>Chiffre d'affaires total</div>
        </div>
        <div className="stat-card" style={{ background: 'var(--gray-100)', padding: '15px', borderRadius: '16px', textAlign: 'center' }}>
          <div className="stat-icon" style={{ fontSize: '24px', marginBottom: '5px' }}>📦</div>
          <div className="stat-value" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--whatsapp-teal)' }}>{stats.commandesJour}</div>
          <div className="stat-label" style={{ fontSize: '12px', color: 'var(--gray-600)' }}>Commandes aujourd'hui</div>
        </div>
      </div>
      
      {stats.topPrestations.length > 0 && (
        <div className="top-prestations" style={{ background: 'var(--gray-100)', padding: '15px', borderRadius: '16px' }}>
          <h4 style={{ marginBottom: '10px', borderBottom: '1px solid var(--gray-300)', paddingBottom: '5px' }}>🏆 Top prestations</h4>
          {stats.topPrestations.map(([nom, count]) => (
            <div key={nom} className="top-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span style={{ fontSize: '14px' }}>{nom}</span>
              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--whatsapp-teal)' }}>{count} cmds</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStats;
