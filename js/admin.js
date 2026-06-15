// Mode Admin - Gestion du compteur journalier
const ADMIN_PIN = "2025"; // PIN par défaut (à modifier par Fola)
let adminAuthenticated = false;

function checkAdminAccess() {
    const inputPin = prompt("🔐 Accès restreint - Veuillez entrer le code PIN:");
    
    if (inputPin === ADMIN_PIN) {
        adminAuthenticated = true;
        showToast("✅ Accès autorisé", "success");
        loadAdminPanel();
    } else {
        showToast("❌ Code incorrect", "error");
        window.location.href = "index.html";
    }
}

function loadAdminPanel() {
    const container = document.getElementById("admin-container");
    if (!container) return;
    
    const compteur = getCompteurJour();
    const today = new Date().toLocaleDateString("fr-FR", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    container.innerHTML = `
        <div class="admin-card">
            <div class="admin-header">
                <span class="admin-icon">📊</span>
                <h2>Tableau de bord</h2>
            </div>
            
            <div class="stats-card">
                <div class="stat">
                    <span class="stat-label">📅 Date</span>
                    <span class="stat-value">${today}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">📦 Commandes aujourd'hui</span>
                    <span class="stat-value ${compteur >= 10 ? 'danger' : compteur >= 7 ? 'warning' : 'success'}">
                        ${compteur} / 10
                    </span>
                </div>
                <div class="stat">
                    <span class="stat-label">✅ Places restantes</span>
                    <span class="stat-value">${10 - compteur}</span>
                </div>
            </div>
            
            <div class="admin-actions">
                <button class="btn btn-primary" onclick="resetQuota()">
                    🔄 Réinitialiser le compteur
                </button>
                <button class="btn btn-secondary" onclick="viewHistory()">
                    📜 Voir historique
                </button>
                <button class="btn btn-danger" onclick="resetAllData()">
                    ⚠️ Réinitialisation complète
                </button>
            </div>
            
            <div class="info-note">
                <small>ℹ️ La réinitialisation automatique se fait chaque jour à minuit (heure d'Abidjan).</small>
            </div>
        </div>
        
        <div id="history-container" style="display: none;"></div>
    `;
}

function resetQuota() {
    if (confirm("⚠️ Voulez-vous vraiment réinitialiser le compteur journalier ?\n\nCette action remet à zéro les commandes du jour.")) {
        // Forcer réinitialisation
        const today = new Date().toDateString();
        localStorage.setItem('nails_lash_compteur', JSON.stringify({
            date: today,
            count: 0
        }));
        
        showToast("✅ Compteur réinitialisé avec succès", "success");
        loadAdminPanel(); // Rafraîchir
    }
}

function resetAllData() {
    if (confirm("⚠️⚠️ RÉINITIALISATION COMPLÈTE ⚠️⚠️\n\nCette action supprime TOUTES les données :\n- Toutes les commandes\n- Le compteur journalier\n- Les préférences\n\nAction irréversible !\n\nConfirmez avec 'RÉINITIALISER'")) {
        const confirmation = prompt("Tapez 'RÉINITIALISER' pour confirmer:");
        if (confirmation === "RÉINITIALISER") {
            localStorage.clear();
            showToast("🗑️ Toutes les données ont été effacées", "warning");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }
    }
}

function viewHistory() {
    const commandes = getCommandesHistory();
    const historyContainer = document.getElementById("history-container");
    
    if (!historyContainer) return;
    
    if (commandes.length === 0) {
        historyContainer.innerHTML = `
            <div class="admin-card">
                <h3>📜 Historique des commandes</h3>
                <p style="text-align: center; color: #757575;">Aucune commande enregistrée</p>
            </div>
        `;
    } else {
        historyContainer.innerHTML = `
            <div class="admin-card">
                <h3>📜 Historique des ${commandes.length} commandes</h3>
                ${commandes.slice(-20).reverse().map(cmd => `
                    <div class="history-item">
                        <div class="history-date">${new Date(cmd.date).toLocaleString("fr-FR")}</div>
                        <div class="history-prestations">${cmd.prestations.map(p => p.nom).join(", ")}</div>
                        <div class="history-total">${cmd.total} FCFA</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    historyContainer.style.display = "block";
    historyContainer.scrollIntoView({ behavior: "smooth" });
}

function getCommandesHistory() {
    const commandes = localStorage.getItem('nails_lash_commandes');
    return commandes ? JSON.parse(commandes) : [];
}
