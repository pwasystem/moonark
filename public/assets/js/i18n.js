export const translations = {
  pt: {
    nav_mission: "Missão",
    nav_tech: "Tecnologia",
    nav_partners: "Parcerias",
    nav_invest: "Investimento",
    nav_terminal: "Acessar Terminal",
    hero_title: "A inteligência humana não deve ser <span class='text-primary'>prisioneira</span> de um único planeta.",
    hero_desc: "Repositório de IA na Lua para reconstruir a civilização em caso de catástrofe global. O arquivista definitivo do conhecimento humano.",
    hero_btn1: "Seja um Guardião da Civilização",
    hero_btn2: "Explorar Arquivos",
    mission_title: "Uma apólice de seguro para a consciência coletiva.",
    mission_desc: "A Terra é um sistema frágil. Eventos de extinção, sejam naturais ou antropogênicos, ameaçam milênios de progresso científico, cultural e ético. O MoonArk é uma infraestrutura autônoma e resiliente projetada para persistir por eras no vácuo lunar.",
    tech_title: "Arquitetura de Sobrevivência",
    invest_title: "Garanta o futuro. Invista na continuidade.",
    newsletter_title: "Pronto para transcender o horizonte terrestre?",
    newsletter_btn: "Cadastrar-se"
  },
  en: {
    nav_mission: "Mission",
    nav_tech: "Technology",
    nav_partners: "Partnerships",
    nav_invest: "Investment",
    nav_terminal: "Access Terminal",
    hero_title: "Human intelligence must not be <span class='text-primary'>imprisoned</span> on a single planet.",
    hero_desc: "AI repository on the Moon to rebuild civilization in case of global catastrophe. The ultimate archivist of human knowledge.",
    hero_btn1: "Be a Guardian of Civilization",
    hero_btn2: "Explore Archives",
    mission_title: "An insurance policy for collective consciousness.",
    mission_desc: "Earth is a fragile system. Extinction events, natural or anthropogenic, threaten millennia of scientific, cultural, and ethical progress. MoonArk is an autonomous, resilient infrastructure designed to persist for aeons in the lunar vacuum.",
    tech_title: "Survival Architecture",
    invest_title: "Secure the future. Invest in continuity.",
    newsletter_title: "Ready to transcend the earthly horizon?",
    newsletter_btn: "Subscribe"
  }
};

const selectorMap = {
  "nav a[href='/']": "nav_mission",
  "nav a[href='/tech']": "nav_tech",
  "nav a[href='/partner']": "nav_partners",
  "nav a[href='/invest']": "nav_invest",
  "#terminalBtn": "nav_terminal",
  "h1.font-headline": "hero_title",
  "h1.font-headline + p": "hero_desc",
  "section#missao h3": "mission_title",
  "section#missao h3 + p": "mission_desc",
  "section#tecnologia h3": "tech_title",
  "section#investimento h3": "invest_title",
  "section.py-32 h2": "newsletter_title",
  "#submit-btn": "newsletter_btn"
};

export function initI18n() {
  const savedLang = localStorage.getItem('moonark_lang') || navigator.language.split('-')[0] || 'pt';
  const lang = savedLang === 'en' ? 'en' : 'pt';
  setLanguage(lang);

  window.toggleLanguage = () => {
    const currentLang = document.documentElement.lang;
    setLanguage(currentLang === 'pt' ? 'en' : 'pt');
  };
}

export function setLanguage(lang) {
  localStorage.setItem('moonark_lang', lang);
  document.documentElement.lang = lang;
  
  const label = document.getElementById('currentLangLabel');
  if (label) label.innerText = lang.toUpperCase();

  for (const [selector, key] of Object.entries(selectorMap)) {
    const el = document.querySelector(selector);
    if (el && translations[lang] && translations[lang][key]) {
      if (selector === '#terminalBtn' && el.innerHTML.includes('Terminal:')) continue; // Skip if logged in
      
      if (translations[lang][key].includes('<span')) {
        el.innerHTML = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
  }
}
