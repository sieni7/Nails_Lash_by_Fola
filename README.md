# 💅 Nails & Lash by Fola

<div align="center">
  <img src="public/images/logo.png" alt="Nails & Lash by Fola" width="120" style="border-radius: 20px;">
  
  ## Salon de beauté - Commandes WhatsApp à Bingerville, Côte d'Ivoire
  
  [![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://nailsandlash.netlify.app)
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  **📱 [Voir l'application en ligne](https://nailsandlash.netlify.app)**
</div>

---

## 📋 À propos du projet

Application web **mobile-first** permettant aux clientes du salon *Nails & Lash by Fola* de :
- Parcourir les **26 prestations** (Nail Art, Pieds, Construction Gel, Extension de Cils...)
- Sélectionner jusqu'à **3 prestations** par commande
- Choisir un **créneau horaire** (date et heure)
- Commander directement via **WhatsApp** avec message pré-rempli

Interface 100% **WhatsApp look & feel** : bulles vertes, dark mode, animations fluides.

---

## ✨ Fonctionnalités complètes

### 👩🦱 Côté client
| Fonctionnalité | Description |
|----------------|-------------|
| 🎨 **26 prestations** | 6 catégories (Nail Art, Pieds, Construction Gel, Gainage, Semi-Extension, Extension) |
| 🛒 **Panier intelligent** | Limite de 3 prestations, sélection/désélection par clic |
| 💚 **Badges prix WhatsApp** | Style bulle verte avec effet de clic |
| ❤️ **Double clic = cœur** | Animation volante + vibration haptique (mobile) |
| 📅 **Créneaux horaires** | Sélection date + heure (12 créneaux de 9h à 21h) |
| 🌙 **Dark mode** | Thème sombre WhatsApp avec persistance |
| 🔔 **Notifications toast** | Feedback visuel non intrusif |
| 📱 **PWA** | Installation sur mobile comme une application native |

### 👩💼 Côté administration
| Fonctionnalité | Description |
|----------------|-------------|
| 🔐 **Accès sécurisé** | Code PIN `2025` (ou 5 clics sur le logo) |
| 📊 **Tableau de bord** | CA total, commandes du jour, Top 5 prestations |
| 📜 **Historique** | Liste complète des commandes passées |
| 🔄 **Réinitialisation** | Remise à zéro du compteur journalier |

### ⚙️ Techniques
| Fonctionnalité | Description |
|----------------|-------------|
| ⚡ **React + Vite** | Performance optimale, build < 70 KB |
| 🎨 **CSS personnalisé** | 0 framework, design pixel perfect |
| 💾 **LocalStorage** | Persistance des données (panier, commandes, préférences) |
| 📱 **Responsive** | Mobile-first, compatible tous appareils |
| 🚀 **Netlify** | Déploiement continu automatique |

---

## 🏗️ Architecture technique

```
nails-lash-fola/
├── public/
│   ├── data/
│   │   ├── prestations.json    # 26 prestations réelles
│   │   └── config.json          # Configuration salon + créneaux
│   └── images/
│       ├── logo.png             # Logo du salon
│       └── flyer.png            # Flyer promotionnel
│
├── src/
│   ├── components/
│   │   ├── Header.jsx           # En-tête WhatsApp + dark mode
│   │   ├── PrestationCard.jsx   # Carte prestation (double clic cœur)
│   │   ├── PrestationGrid.jsx   # Grille + skeleton loader
│   │   ├── CategoryFilter.jsx   # Filtres catégories
│   │   ├── CartFab.jsx          # Bouton panier flottant
│   │   ├── CartModal.jsx        # Modale panier + créneaux
│   │   ├── DateTimeModal.jsx    # Sélecteur date/heure
│   │   ├── Admin.jsx            # Panneau d'administration
│   │   ├── AdminStats.jsx       # Statistiques (CA, top prestations)
│   │   ├── Modal.jsx            # Modale réutilisable
│   │   ├── PromptModal.jsx      # Modale avec input (PIN)
│   │   ├── Toast.jsx            # Notifications toast
│   │   └── HeartAnimation.jsx   # Animation cœur volant
│   │
│   ├── contexts/
│   │   ├── CartContext.jsx      # État global (panier, commandes)
│   │   └── ThemeContext.jsx     # Dark mode persistant
│   │
│   ├── styles/
│   │   ├── main.css             # Styles globaux
│   │   ├── components.css       # Composants (cartes, modales...)
│   │   ├── dark-mode.css        # Thème sombre
│   │   └── variables.css        # Variables CSS (couleurs WhatsApp)
│   │
│   ├── App.jsx                  # Composant principal
│   └── main.jsx                 # Point d'entrée
│
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
└── README.md
```

---

## 🚀 Installation et développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/sieni7/nails-lash-fola.git
cd nails-lash-fola

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

### Variables d'environnement (optionnel)
```env
VITE_ADMIN_PIN=2025
VITE_WHATSAPP_NUMBER=2250161210647
```

---

## 📊 Données intégrées

### 26 prestations réparties en 6 catégories

| Catégorie | Exemples | Prix (FCFA) |
|-----------|----------|-------------|
| **Nail Art** | Vernis permanent, French, Nail Art | 3 000 - 5 000 |
| **Pieds** | Vernis permanent, Gainage | 1 500 - 5 000 |
| **Construction Gel** | Court, Moyen, Long | 8 000 - 15 000 |
| **Construction Gainage** | Court, Moyen, Long | 5 000 - 12 000 |
| **Semi-Extension Cils** | Classic, Hybride, Volume, Mega | 3 000 - 12 000 |
| **Extension Cils** | Classic, Hybride, Volume, Mega | 10 000 - 25 000 |

### Créneaux horaires
- **Mardi - Dimanche** : 9h00 - 21h00 (12 créneaux de 1h)
- **Lundi** : Fermé

---

## 🎨 Crédits visuels

- **Logo & Flyer** : Fournis par *Nails & Lash by Fola*
- **Design** : Inspiré de WhatsApp (Meta)

---

## 📞 Contact & Support

| | |
|---|---|
| **Salon** | Nails & Lash by Fola |
| **Adresse** | 947G+5FX, Bingerville, Côte d'Ivoire |
| **WhatsApp** | [+225 01 61 21 06 47](https://wa.me/2250161210647) |
| **TikTok** | [@folakemi8786](https://tiktok.com/@folakemi8786) |
| **Facebook** | Nails & Lash by Fola |
| **Développeur** | [GitHub - sieni7](https://github.com/sieni7) |

---

## 📄 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, de le modifier et de le distribuer.

---

## 🙏 Remerciements

Merci à l'équipe **Antigravity** et à **Google** pour les outils qui ont accéléré le développement.

---

<div align="center">
  **Fait avec ❤️ pour Nails & Lash by Fola**
  
  *Révélez votre beauté, affirmez votre style*
</div>
