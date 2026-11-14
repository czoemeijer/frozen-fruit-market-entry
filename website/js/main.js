document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    en: {
      page_title: 'KRUNCHIES | Real frozen fruit, serious crunch',
      meta_description: 'Krunchies is real frozen fruit coated in premium chocolate, enjoyed straight from the freezer. Explore the lineup and help shape the next European frozen treat brand.',
      nav_lineup: 'Lineup',
      nav_craft: 'The craft',
      nav_research: 'Research',
      nav_cta: 'Share your taste',
      hero_eyebrow: 'Frozen fruit / premium chocolate',
      hero_title: 'A sharper crunch for <em>better</em> snacking.',
      hero_lede: 'Real fruit, premium chocolate and perfectly frozen indulgence. Fruit pieces coated in chocolate that you enjoy straight from the freezer.',
      hero_survey: 'Take the 3-minute survey',
      hero_collection: 'See the collection',
      proof_format: 'flagship format',
      proof_fruit: 'real frozen fruit',
      proof_cocoa: 'dark cocoa shell',
      flavor_banana: 'Banana',
      flavor_strawberry: 'Strawberry',
      flavor_mango: 'Mango',
      ticker_fruit: 'REAL FRUIT',
      ticker_crunch: 'BIG CRUNCH',
      ticker_cocoa: 'PREMIUM COCOA',
      ticker_memory: 'MADE TO BE REMEMBERED',
      formula_fruit: 'fruit',
      formula_freeze: 'freeze',
      formula_cocoa: 'cocoa',
      collection_eyebrow: 'The collection',
      collection_title: 'Three ways to make fruit impossible to ignore.',
      collection_lede: 'One visual language, three distinct flavour directions. Real frozen fruit coated in rich chocolate, straight from the freezer case.',
      tile_banana_tag: '01 / FLAGSHIP',
      tile_strawberry_tag: '02 / BERRY',
      tile_mango_tag: '03 / TROPICAL',
      tile_size: '150 g box',
      tile_banana_title: 'Chocolate banana bites',
      tile_strawberry_title: 'Strawberry blast',
      tile_mango_title: 'Mango crunch',
      tile_banana_desc: 'Frozen banana pieces wrapped in rich dark cocoa. Creamy fruit center and crisp chocolate straight from the freezer.',
      tile_strawberry_desc: 'Whole frozen strawberries coated in delicious chocolate. An icy, sweet-tart fruit core with a crisp chocolate shell.',
      tile_mango_desc: 'Juicy frozen mango chunks encased in premium chocolate. Frosty tropical sweetness with a satisfying cocoa snap.',
      tile_vote: 'Vote on this concept',
      craft_formula: 'A simple formula',
      craft_note: 'Cold fruit, crisp chocolate. The contrast does the talking.',
      craft_eyebrow: 'The craft',
      craft_title: 'Less noise on the label. More character in the bite.',
      craft_lede: 'Krunchies pairs real pieces of frozen fruit with a generous layer of premium chocolate. The result is an irresistible contrast of a cold fruit centre and a crisp chocolate shell, enjoyed straight from the freezer.',
      craft_one_title: 'Real frozen fruit',
      craft_one_desc: 'Carefully selected fruit pieces that keep their natural juiciness and authentic flavour frozen inside.',
      craft_two_title: 'Crisp chocolate shell',
      craft_two_desc: 'A rich chocolate coating envelops each frozen piece and creates a satisfying crunch when you bite in.',
      craft_three_title: 'Straight from the freezer',
      craft_three_desc: 'Not a typical ice cream, but a modern frozen dessert ready in the freezer case for snacking and sharing.',
      research_eyebrow: 'Open research',
      research_title: 'Help decide what reaches the freezer aisle next.',
      research_lede: 'Tell us which flavour, format and price feel right for frozen fruit in chocolate. The research takes around three minutes and directly informs the launch strategy.',
      research_start: 'Start the survey',
      research_dashboard: 'View research dashboard',
      footer_tagline: 'Frozen fruit in premium chocolate with a serious crunch.',
      footer_survey: 'Market survey',
      footer_dashboard: 'Research dashboard',
      footer_note: 'Market-entry research / 2026',
      footer_usage: 'Usage & copyright',
      footer_commercial: 'Commercial use requires a paid written license.',
      flavor_banana_name: 'Chocolate banana bites',
      flavor_strawberry_name: 'Strawberry blast',
      flavor_mango_name: 'Mango crunch',
      flavor_banana_label: 'banana edit',
      flavor_strawberry_label: 'berry edit',
      flavor_mango_label: 'tropical edit',
      flavor_banana_note: 'creamy frozen banana / dark cocoa',
      flavor_strawberry_note: 'cold tart berry / rich chocolate',
      flavor_mango_note: 'frosty sunny mango / dark cocoa'
    },
    cs: {
      page_title: 'KRUNCHIES | Mražené ovoce v prémiové čokoládě',
      meta_description: 'Krunchies spojuje pravé mražené ovoce s prémiovou čokoládou přímo z mrazáku. Prozkoumejte naši nabídku a pomozte utvářet nový koncept mražených dezertů.',
      nav_lineup: 'Příchutě',
      nav_craft: 'Jak vzniká',
      nav_research: 'Výzkum',
      nav_cta: 'Podělte se o chuť',
      hero_eyebrow: 'Mražené ovoce / prémiová čokoláda',
      hero_title: 'Výraznější křup pro <em>lepší</em> mlsání.',
      hero_lede: 'Skutečné ovoce, prémiová čokoláda a dokonale mražené potěšení. Ovocné kousky obalené v čokoládě, které si vychutnáš přímo z mrazáku.',
      hero_survey: 'Vyplnit 3minutový dotazník',
      hero_collection: 'Prohlédnout příchutě',
      proof_format: 'vlajkové balení',
      proof_fruit: '100% mražené ovoce',
      proof_cocoa: '70 % kakaová vrstva',
      flavor_banana: 'Banán',
      flavor_strawberry: 'Jahoda',
      flavor_mango: 'Mango',
      ticker_fruit: 'SKUTEČNÉ OVOCE',
      ticker_crunch: 'POŘÁDNÝ KŘUP',
      ticker_cocoa: 'PRÉMIOVÉ KAKAO',
      ticker_memory: 'NEZAPOMENUTELNÁ CHUŤ',
      formula_fruit: 'ovoce',
      formula_freeze: 'mráz',
      formula_cocoa: 'kakao',
      collection_eyebrow: 'Kolekce',
      collection_title: 'Tři způsoby, jak udělat ovoce nepřehlédnutelné.',
      collection_lede: 'Jeden vizuální jazyk, tři odlišné chuťové směry. Pravé mražené ovoce zalité bohatou čokoládou přímo z mrazicího boxu.',
      tile_banana_tag: '01 / HLAVNÍ',
      tile_strawberry_tag: '02 / BOBULOVÁ',
      tile_mango_tag: '03 / TROPICKÁ',
      tile_size: 'krabička 150 g',
      tile_banana_title: 'Čokoládové banánové bites',
      tile_strawberry_title: 'Jahodový výbuch',
      tile_mango_title: 'Mangový křup',
      tile_banana_desc: 'Mražené plátky banánu v bohaté kakaové polevě. Krémový ovocný střed a křupavá čokoláda přímo z mrazáku.',
      tile_strawberry_desc: 'Celé mražené jahody v poctivé vrstvě čokolády. Šťavnatý ledový střed a křupavá poleva v každém soustu.',
      tile_mango_desc: 'Šťavnaté kousky mraženého manga obalené v prémiové čokoládě. Exotická sladkost a ledové osvěžení přímo z mrazicího boxu.',
      tile_vote: 'Hlasovat pro tento koncept',
      craft_formula: 'Jednoduchý vzorec',
      craft_note: 'Mražené ovoce, křupavá čokoláda. Kontrast mluví sám za sebe.',
      craft_eyebrow: 'Jak vzniká',
      craft_title: 'Méně hluku na etiketě. Více charakteru v soustu.',
      craft_lede: 'Krunchies spojuje poctivé kusy mraženého ovoce s velkorysou vrstvou prémiové čokolády. Výsledkem je neodolatelný kontrast studeného ovocného středu a křupavé čokoládové polevy, který si vychutnáš přímo z mrazáku.',
      craft_one_title: 'Skutečné mražené ovoce',
      craft_one_desc: 'Pečlivě vybrané kousky jahod, banánů a manga, které si zmrazením uchovávají přirozenou chuť a šťavnatost.',
      craft_two_title: 'Křupavá čokoládová vrstva',
      craft_two_desc: 'Poctivá čokoládová poleva obalí každý mražený kousek a při kousnutí vytvoří ten pravý křupavý moment.',
      craft_three_title: 'Přímo z mrazáku',
      craft_three_desc: 'Žádná klasická zmrzlina, ale moderní mražený dezert v mrazicím boxu připravený ke sdílení i vlastní odměně.',
      research_eyebrow: 'Otevřený výzkum',
      research_title: 'Pomozte rozhodnout, co zamíří do mrazicích boxů.',
      research_lede: 'Řekněte nám, která příchuť, velikost balení a cena vám u mraženého ovoce v čokoládě dávají největší smysl. Výzkum trvá přibližně 3 minuty a přímo ovlivní strategii diplomové práce pro uvedení na trh.',
      research_start: 'Začít dotazník',
      research_dashboard: 'Zobrazit výzkumný dashboard',
      footer_tagline: 'Mražené ovoce v prémiové čokoládě s pořádným křupem.',
      footer_survey: 'Průzkum trhu',
      footer_dashboard: 'Výzkumný dashboard',
      footer_note: 'Výzkum vstupu na trh / 2026',
      footer_usage: 'Použití a autorská práva',
      footer_commercial: 'Komerční použití vyžaduje placenou písemnou licenci.',
      flavor_banana_name: 'Čokoládové banánové bites',
      flavor_strawberry_name: 'Jahodový výbuch',
      flavor_mango_name: 'Mangový křup',
      flavor_banana_label: 'banánová edice',
      flavor_strawberry_label: 'jahodová edice',
      flavor_mango_label: 'tropická edice',
      flavor_banana_note: 'krémový mražený banán / hořké kakao',
      flavor_strawberry_note: 'ledová svěží jahoda / bohatá čokoláda',
      flavor_mango_note: 'mražené slunečné mango / hořké kakao'
    }
  };
  const languageStorageKey = 'krunchies_language';
  const preferredBrowserLanguage = (navigator.languages || [navigator.language || 'en']).some((lang) => lang.toLowerCase().startsWith('cs')) ? 'cs' : 'en';
  let currentLanguage = localStorage.getItem(languageStorageKey) || preferredBrowserLanguage;
  if (!translations[currentLanguage]) currentLanguage = 'en';
  const t = (key) => translations[currentLanguage][key] || translations.en[key] || key;

  let refreshFlavorCopy = () => {};

  function applyLanguage(language) {
    currentLanguage = language;
    localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
    document.title = t('page_title');
    document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((element) => { element.innerHTML = t(element.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-content]').forEach((element) => { element.setAttribute('content', t(element.dataset.i18nContent)); });
    document.querySelectorAll('[data-site-lang]').forEach((button) => {
      const isActive = button.dataset.siteLang === language;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    refreshFlavorCopy();
  }

  document.querySelectorAll('[data-site-lang]').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.siteLang)));
  applyLanguage(currentLanguage);
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const carousel = document.querySelector('[data-flavor-carousel]');
  if (!carousel) return;

  const flavors = [
    { id: 'banana', image: 'images/krunchies-banana-bites.png' },
    { id: 'strawberry', image: 'images/krunchies-strawberry-blast.png' },
    { id: 'mango', image: 'images/krunchies-mango-crunch.png' }
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const image = document.getElementById('hero-product-image');
  const card = document.getElementById('hero-product-card');
  const name = document.getElementById('hero-product-name');
  const count = document.getElementById('hero-product-count');
  const number = document.getElementById('hero-flavor-number');
  const label = document.getElementById('hero-flavor-label');
  const note = document.getElementById('hero-flavor-note');
  const controls = [...carousel.querySelectorAll('[data-flavor]')];
  let activeIndex = 0;
  let rotationTimer;
  let touchStartX = null;

  flavors.forEach((flavor) => { const preload = new Image(); preload.src = flavor.image; });

  function showFlavor(index, shouldAnimate = true) {
    activeIndex = (index + flavors.length) % flavors.length;
    const flavor = flavors[activeIndex];
    const update = () => {
      image.src = flavor.image;
      image.alt = `Krunchies ${t(`flavor_${flavor.id}_name`)} packaging`;
      name.textContent = t(`flavor_${flavor.id}_name`);
      count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / 03`;
      number.textContent = String(activeIndex + 1).padStart(2, '0');
      label.textContent = t(`flavor_${flavor.id}_label`);
      note.textContent = t(`flavor_${flavor.id}_note`);
      carousel.dataset.activeFlavor = flavor.id;
      controls.forEach((control) => {
        const isActive = control.dataset.flavor === flavor.id;
        control.classList.toggle('is-active', isActive);
        control.setAttribute('aria-selected', String(isActive));
      });
    };
    if (!shouldAnimate || reduceMotion) { update(); return; }
    card.classList.add('is-changing');
    window.setTimeout(() => { update(); card.classList.remove('is-changing'); }, 150);
  }

  refreshFlavorCopy = () => showFlavor(activeIndex, false);

  function restartRotation() {
    window.clearInterval(rotationTimer);
    if (!reduceMotion) rotationTimer = window.setInterval(() => showFlavor(activeIndex + 1), 5500);
  }

  controls.forEach((control) => control.addEventListener('click', () => {
    showFlavor(flavors.findIndex((flavor) => flavor.id === control.dataset.flavor));
    restartRotation();
  }));
  controls.forEach((control) => control.addEventListener('pointerenter', () => {
    showFlavor(flavors.findIndex((flavor) => flavor.id === control.dataset.flavor));
    window.clearInterval(rotationTimer);
  }));
  carousel.querySelector('.hero-arrow-prev').addEventListener('click', () => { showFlavor(activeIndex - 1); restartRotation(); });
  carousel.querySelector('.hero-arrow-next').addEventListener('click', () => { showFlavor(activeIndex + 1); restartRotation(); });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showFlavor(activeIndex - 1); restartRotation(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showFlavor(activeIndex + 1); restartRotation(); }
  });
  carousel.addEventListener('mouseenter', () => window.clearInterval(rotationTimer));
  carousel.addEventListener('mouseleave', restartRotation);
  carousel.addEventListener('focusin', () => window.clearInterval(rotationTimer));
  carousel.addEventListener('focusout', restartRotation);
  carousel.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.screenX ?? null; }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0]?.screenX;
    if (touchStartX !== null && endX !== undefined && Math.abs(endX - touchStartX) > 45) {
      showFlavor(activeIndex + (endX < touchStartX ? 1 : -1));
      restartRotation();
    }
    touchStartX = null;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? window.clearInterval(rotationTimer) : restartRotation());

  showFlavor(0, false);
  restartRotation();
});
