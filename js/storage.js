// Gestion localStorage
const STORAGE_KEYS = {
  PANIER: 'nails_lash_panier',
  COMMANDES: 'nails_lash_commandes',
  COMPTEUR_JOUR: 'nails_lash_compteur'
};

let prestationsData = null;

async function loadPrestations() {
  try {
    const response = await fetch('data/prestations.json');
    const data = await response.json();
    prestationsData = data.prestations;
    console.log('✅ Prestations chargées:', prestationsData.length);
    return prestationsData;
  } catch (error) {
    console.error('❌ Erreur chargement prestations:', error);
    return [];
  }
}

function getPanier() {
  const panier = localStorage.getItem(STORAGE_KEYS.PANIER);
  return panier ? JSON.parse(panier) : [];
}

function savePanier(panier) {
  localStorage.setItem(STORAGE_KEYS.PANIER, JSON.stringify(panier));
}

function ajouterAuPanier(prestation) {
  let panier = getPanier();
  
  // Vérifier limite 3
  if (panier.length >= 3) {
    alert(`⚠️ Maximum ${appConfig?.regles_commande.max_prestations_par_commande} prestations par commande`);
    return false;
  }
  
  // Vérifier doublon
  if (panier.some(item => item.id === prestation.id)) {
    alert('⚠️ Cette prestation est déjà dans votre panier');
    return false;
  }
  
  panier.push({
    id: prestation.id,
    nom: prestation.nom,
    prix: prestation.prix,
    prix_texte: prestation.prix_texte,
    duree: prestation.duree
  });
  
  savePanier(panier);
  return true;
}

function retirerDuPanier(prestationId) {
  let panier = getPanier();
  panier = panier.filter(item => item.id !== prestationId);
  savePanier(panier);
  return panier;
}

function viderPanier() {
  localStorage.removeItem(STORAGE_KEYS.PANIER);
}

function getCommandesHistory() {
    const commandes = localStorage.getItem('nails_lash_commandes');
    return commandes ? JSON.parse(commandes) : [];
}

function enregistrerCommande(panier, total) {
    const commandes = getCommandesHistory();
    
    const nouvelleCommande = {
        id: Date.now(),
        date: new Date().toISOString(),
        prestations: panier.map(p => ({
            id: p.id,
            nom: p.nom,
            prix: p.prix,
            prix_texte: p.prix_texte
        })),
        total: total,
        statut: "confirmée"
    };
    
    commandes.unshift(nouvelleCommande); // Ajouter au début
    localStorage.setItem('nails_lash_commandes', JSON.stringify(commandes));
    
    return nouvelleCommande;
}

function getCompteurJour() {
    const today = new Date().toDateString();
    const data = localStorage.getItem('nails_lash_compteur');
    
    if (data) {
        const parsed = JSON.parse(data);
        // Vérifier si la date est aujourd'hui
        if (parsed.date === today) {
            return parsed.count;
        }
    }
    
    // Nouveau jour : réinitialiser
    return 0;
}

function incrementerCompteurJour() {
    const today = new Date().toDateString();
    let count = getCompteurJour();
    count++;
    
    localStorage.setItem('nails_lash_compteur', JSON.stringify({
        date: today,
        count: count
    }));
    
    return count;
}

function getPlacesRestantes() {
    const limite = appConfig?.regles_commande.limite_quotidienne_commandes || 10;
    const actuel = getCompteurJour();
    return Math.max(0, limite - actuel);
}

function commandesDisponibles() {
    return getPlacesRestantes() > 0;
}
