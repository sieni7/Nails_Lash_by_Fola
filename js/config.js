// Configuration globale
let appConfig = null;

async function loadConfig() {
  try {
    const response = await fetch('config.json');
    appConfig = await response.json();
    console.log('✅ Configuration chargée', appConfig);
    return appConfig;
  } catch (error) {
    console.error('❌ Erreur chargement config:', error);
    return null;
  }
}

function getHorairesAujourdhui() {
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const aujourdhui = jours[new Date().getDay()];
  return appConfig?.horaires[aujourdhui] || 'Fermé';
}

function isOpenNow() {
  const horaires = getHorairesAujourdhui();
  if (horaires === 'Fermé') return false;
  
  const now = new Date();
  const [openHour, closeHour] = horaires.split(' - ');
  const currentHour = now.getHours();
  
  return currentHour >= parseInt(openHour) && currentHour < parseInt(closeHour);
}
