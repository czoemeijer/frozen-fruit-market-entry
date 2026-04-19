const translations = {
    cs: {
        title: "Spotřebitelský výzkum (CAWI)",
        subtitle: "Akademický výzkum pro diplomovou práci na téma vstupu značky prémiových potravin na trh.",
        welcome: "Vítejte ve výzkumu",
        intro_text: "Tento dotazník je součástí výzkumu trhu pro uvedení nové značky \"Berrie\" (mražené ovoce v čokoládě). Vyplnění zabere 3-4 minuty. Odpovědi jsou plně anonymní a slouží výhradně pro akademické účely.",
        privacy: "🔒 Data nebudou poskytnuta třetím stranám.",
        start_btn: "Začít výzkum",
        q1_title: "1. Demografické údaje",
        q1_age: "Do jaké věkové kategorie spadáte?",
        q1_children: "Máte v domácnosti děti mladší 15 let?",
        yes: "Ano",
        no: "Ne",
        back: "Zpět",
        next: "Další",
        q2_title: "2. Srovnání produktů (Franui vs. Berrie)",
        q2_intro: "Ohodnoťte na škále 1-10 (1 = nejhorší, 10 = nejlepší) následující parametry pro existující argentinskou značku Franui a náš nový český koncept Berrie.",
        visual_appeal: "Vizuální atraktivita",
        quality_perception: "Vnímaná kvalita surovin",
        health_perception: "Vnímání jako zdravá pochutina",
        q2_intent: "Koupili byste si značku Berrie, pokud by byla dostupná ve vašem obchodě?",
        intent_1: "Určitě ne",
        intent_2: "Spíše ne",
        intent_3: "Nevím",
        intent_4: "Spíše ano",
        intent_5: "Určitě ano",
        q3_title: "3. Cenová citlivost (Berrie 150g)",
        q3_intro: "Běžná velikost balení je 150 gramů (zhruba velikost menší bonboniéry). Na základě vašich dojmů, při jaké ceně za toto balení byste produkt považovali za:",
        psm_1: "Příliš levný (pochybovali byste o kvalitě)",
        psm_2: "Výhodný (skvělý nákup za tuto cenu)",
        psm_3: "Drahý (stále byste zvažovali koupi)",
        psm_4: "Příliš drahý (už byste jej nekoupili)",
        q4_title: "4. Postoje k lokálním potravinám",
        q4_local: "Nakolik je pro vás důležité, aby potraviny byly vyrobeny lokálně?",
        scale_low: "Vůbec (1)",
        scale_high: "Zcela (10)",
        q4_premium: "Jste ochotni zaplatit vyšší cenu za lokální výrobek oproti importovanému?",
        premium_no: "Ne",
        premium_10: "Ano, max do +10 %",
        premium_25: "Ano, +10 % až +25 %",
        premium_more: "Ano, i o více než 25 %",
        submit: "Odeslat dotazník",
        success_title: "Děkujeme za vyplnění!",
        success_text: "Vaše odpovědi byly úspěšně odeslány do akademické databáze."
    },
    en: {
        title: "Consumer Survey (CAWI)",
        subtitle: "Academic market research for a master's thesis on market entry of a premium food brand.",
        welcome: "Welcome to the research",
        intro_text: "This survey is part of market research for the launch of a new brand 'Berrie' (frozen fruit in chocolate). It takes 3-4 minutes. Responses are fully anonymous and for academic purposes only.",
        privacy: "🔒 Data will not be shared with third parties.",
        start_btn: "Start Survey",
        q1_title: "1. Demographics",
        q1_age: "What is your age category?",
        q1_children: "Do you have children under 15 in your household?",
        yes: "Yes",
        no: "No",
        back: "Back",
        next: "Next",
        q2_title: "2. Product Comparison (Franui vs. Berrie)",
        q2_intro: "Rate the following parameters on a scale of 1-10 (1 = worst, 10 = best) for the existing Argentine brand Franui and our new Czech concept Berrie.",
        visual_appeal: "Visual attractiveness",
        quality_perception: "Perceived ingredient quality",
        health_perception: "Perception as a healthy snack",
        q2_intent: "Would you buy the Berrie brand if it were available in your store?",
        intent_1: "Definitely not",
        intent_2: "Probably not",
        intent_3: "Don't know",
        intent_4: "Probably yes",
        intent_5: "Definitely yes",
        q3_title: "3. Price Sensitivity (Berrie 150g)",
        q3_intro: "A typical package is 150 grams. Based on your impressions, at what price for this package would you consider the product to be:",
        psm_1: "Too cheap (you'd doubt the quality)",
        psm_2: "A bargain (great buy at this price)",
        psm_3: "Expensive (but you'd still consider it)",
        psm_4: "Too expensive (you wouldn't buy it)",
        q4_title: "4. Attitudes to Local Food",
        q4_local: "How important is it to you that food is produced locally?",
        scale_low: "Not at all (1)",
        scale_high: "Crucial (10)",
        q4_premium: "Are you willing to pay a premium for a local product over an imported one?",
        premium_no: "No",
        premium_10: "Yes, up to +10%",
        premium_25: "Yes, +10% to +25%",
        premium_more: "Yes, over 25%",
        submit: "Submit Survey",
        success_title: "Thank you!",
        success_text: "Your responses have been securely submitted to the academic database."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- LANGUAGE SWITCHER ---
    let currentLang = 'cs';
    const langBtns = document.querySelectorAll('.lang-btn');
    const langInput = document.getElementById('lang-input');

    function updateLanguage(lang) {
        currentLang = lang;
        langInput.value = lang;
        
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => updateLanguage(btn.dataset.lang));
    });

    // --- NAVIGATION LOGIC ---
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const groups = document.querySelectorAll('.question-group');
    const progressBar = document.getElementById('progress');
    const form = document.getElementById('survey-form');
    const totalSteps = groups.length - 1; 

    function validateStep(stepIndex) {
        const currentGroup = document.getElementById(`step-${stepIndex}`);
        if (!currentGroup) return true;

        // Get all required inputs, and ALL radio buttons in this group
        const requiredInputs = currentGroup.querySelectorAll('input[required]');
        const allRadios = currentGroup.querySelectorAll('input[type="radio"]');
        let isValid = true;
        const radioGroups = {};
        
        // Find which radio groups actually have a required attribute
        const requiredRadioNames = new Set();
        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                requiredRadioNames.add(input.name);
            } else if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });

        // Group all radios by name, but only if they are in a required group
        allRadios.forEach(radio => {
            if (requiredRadioNames.has(radio.name)) {
                if (!radioGroups[radio.name]) {
                    radioGroups[radio.name] = [];
                }
                radioGroups[radio.name].push(radio);
            }
        });

        for (const groupName in radioGroups) {
            const isChecked = radioGroups[groupName].some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                radioGroups[groupName].forEach(radio => {
                    const card = radio.closest('.radio-card') || radio.parentElement;
                    card.style.outline = '1px solid red';
                    setTimeout(() => card.style.outline = '', 2000);
                });
            }
        }
        return isValid;
    }

    function goToStep(targetIndex) {
        groups.forEach(g => g.classList.remove('active'));
        document.getElementById(`step-${targetIndex}`).classList.add('active');
        
        if (targetIndex === 0) {
            progressBar.style.width = '0%';
        } else if (targetIndex === 'success') {
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor = 'var(--success)';
        } else {
            const progress = (targetIndex / (totalSteps - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStep = e.target.closest('.question-group').id.replace('step-', '');
            const targetStep = e.target.dataset.target;
            
            if (currentStep === '0' || validateStep(currentStep)) {
                goToStep(targetStep);
            } else {
                alert(currentLang === 'cs' ? 'Prosím vyplňte všechny povinné otázky.' : 'Please fill all required questions.');
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetStep = e.target.dataset.target;
            goToStep(targetStep);
        });
    });

    // --- SLIDERS UPDATE LOGIC ---
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const display = e.target.parentElement.querySelector('.val-display');
            if(display) display.textContent = `${e.target.value}/10`;
        });
    });

    // --- FORM SUBMISSION (WITH BACKEND) ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Anti-spam check
        const honeypot = document.querySelector('.honeypot').value;
        if (honeypot !== "") {
            console.log("Spam detected.");
            return;
        }
        
        if (validateStep(4)) { 
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = '...';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if(response.ok) {
                    goToStep('success');
                } else {
                    alert('Error saving data. Please try again.');
                    submitBtn.disabled = false;
                }
            } catch (err) {
                console.error('Submit error:', err);
                alert('Connection error.');
                submitBtn.disabled = false;
            }
        } else {
            alert(currentLang === 'cs' ? 'Prosím vyplňte všechny povinné otázky.' : 'Please fill all required questions.');
        }
    });
});
