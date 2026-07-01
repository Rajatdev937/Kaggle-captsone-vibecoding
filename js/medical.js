// Medical First Aid & Triage Database and Controller
const medicalGuides = [
  {
    id: "g1",
    title: "Severe Bleeding Control",
    description: "Crucial steps to control hemorrhage and prevent shock before emergency services arrive.",
    icon: "fa-tint",
    steps: [
      { title: "Safety First", text: "Ensure the scene is safe for you and the victim. Put on gloves if available." },
      { title: "Direct Pressure", text: "Place a clean sterile dressing, cloth, or even your hand directly over the wound. Apply firm, continuous pressure." },
      { title: "Elevate the Wound", text: "If the injury is on a limb, raise it above the heart level while maintaining direct pressure to reduce blood flow." },
      { title: "Apply a Pressure Bandage", text: "Wrap the dressing firmly with a bandage. If blood leaks through, do not remove the first dressing; add more padding on top and continue pressure." },
      { title: "Tourniquet (If life-threatening)", text: "For extreme arterial bleeding on limbs, place a tourniquet 2-3 inches above the wound (never on a joint). Tighten until bleeding stops and write down the application time." }
    ],
    criticalTip: "DO NOT remove embedded foreign objects. Apply pressure around the object, not directly on it, and stabilize it in place."
  },
  {
    id: "g2",
    title: "Bone Fracture & Splinting",
    description: "How to safely immobilize broken limbs to prevent secondary nerve or muscle damage.",
    icon: "fa-band-aid",
    steps: [
      { title: "Stop Bleeding First", text: "Address any active bleeding wounds before attempting to stabilize the bone." },
      { title: "Immobilize the Joint", text: "Do not attempt to push a bone back in or realign it. Keep the limb in the exact position you found it." },
      { title: "Create a Splint", text: "Use rigid materials (boards, rolled newspapers, heavy cardboard). Position the splint above and below the fractured joint." },
      { title: "Secure the Splint", text: "Tie the splint to the limb using cloth, bandages, or tape. Ensure it is snug but does not cut off blood circulation (check for warmth/pulse in fingers/toes)." },
      { title: "Apply Cold Compress", text: "Apply ice wrapped in a towel to reduce swelling and ease intense localized pain." }
    ],
    criticalTip: "If the bone has broken through the skin (open fracture), cover it with a clean sterile dressing and do not touch it or try to push it back."
  },
  {
    id: "g3",
    title: "CPR (Cardiopulmonary Resuscitation)",
    description: "Immediate life-saving action for an unconscious individual who is not breathing normally.",
    icon: "fa-heartbeat",
    steps: [
      { title: "Check Responsiveness", text: "Tap the victim's shoulder and shout, 'Are you okay?' Check for normal breathing for no more than 10 seconds." },
      { title: "Call for Backup", text: "Loudly instruct someone nearby to call 911 (or local rescue) and fetch an AED if one is available." },
      { title: "Perform Chest Compressions", text: "Place the heel of one hand in the center of the chest, and the other hand on top. Push hard and fast: 2 inches deep at 100-120 compressions per minute (to the beat of 'Stayin' Alive')." },
      { title: "Deliver Rescue Breaths", text: "If trained, tilt the head back, lift the chin, pinch the nose, and give 2 rescue breaths after every 30 compressions." },
      { title: "Continue Until Help Arrives", text: "Do not stop compressions unless the victim starts breathing, you are physically exhausted, or paramedics take over." }
    ],
    criticalTip: "Hands-Only CPR (just compressions, no breaths) is highly effective and recommended if you are untrained or uncomfortable with rescue breaths."
  },
  {
    id: "g4",
    title: "Severe Burn Treatment",
    description: "Essential care steps for thermal, electrical, or chemical burns to minimize tissue damage.",
    icon: "fa-fire",
    steps: [
      { title: "Eliminate the Source", text: "Safely extinguish flames, disconnect power, or brush off dry chemical agents." },
      { title: "Cool the Burn", text: "Run cool (not cold/ice) clean water over the burned area for 10 to 20 minutes. Ice can worsen skin tissue damage." },
      { title: "Remove Tight Items", text: "Gently slip off rings, bracelets, or shoes before swelling begins, but do not peel off clothing stuck to the burn." },
      { title: "Cover Loosely", text: "Apply a sterile, non-adhesive bandage or clean plastic wrap loosely over the burn to protect from dirt and air." },
      { title: "Treat for Shock", text: "Lay the victim flat, elevate feet if there are no leg fractures, and cover with a blanket to maintain core temperature." }
    ],
    criticalTip: "Never pop blisters or apply butter, grease, or ointments to severe burns. They trap heat and greatly increase the risk of infection."
  },
  {
    id: "g5",
    title: "Choking Rescue (Heimlich)",
    description: "Emergency technique to clear an obstructed airway in a conscious adult or child.",
    icon: "fa-user-alt-slash",
    steps: [
      { title: "Identify Choking", text: "Look for the universal sign: hands clutching the throat. Ask, 'Are you choking?' If they can speak or cough loudly, do not interfere." },
      { title: "Give Back Blows", text: "Lean the person forward. Deliver 5 firm blows between the shoulder blades using the heel of your hand." },
      { title: "Perform Abdominal Thrusts", text: "Stand behind the person, wrap your arms around their waist. Make a fist with one hand, place it just above the navel, grab it with your other hand." },
      { title: "Thrust Inward and Upward", text: "Deliver 5 quick, sharp upward thrusts. Repeat cycles of 5 back blows and 5 abdominal thrusts until the object is expelled." },
      { title: "Unconscious Protocol", text: "If the person becomes unresponsive, carefully lower them to the ground and start CPR compressions immediately." }
    ],
    criticalTip: "For choking infants (under 1 year), use a combination of 5 downward back slaps and 5 chest thrusts while supporting their head."
  }
];

// UI Controller
let activeGuideId = "g1";

function initMedicalSection() {
  renderMedicalMenu();
  renderActiveGuide();
  
  // Setup Search Event
  const searchInput = document.getElementById('medical-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterMedicalMenu(e.target.value);
    });
  }
}

function renderMedicalMenu(filterText = "") {
  const menuContainer = document.getElementById('medical-menu-list');
  if (!menuContainer) return;
  
  menuContainer.innerHTML = '';
  const filtered = medicalGuides.filter(g => 
    g.title.toLowerCase().includes(filterText.toLowerCase()) || 
    g.description.toLowerCase().includes(filterText.toLowerCase())
  );
  
  if (filtered.length === 0) {
    menuContainer.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--color-text-muted); font-size:0.85rem;">No guides found.</div>';
    return;
  }
  
  filtered.forEach(guide => {
    const item = document.createElement('div');
    item.className = `medical-menu-item ${guide.id === activeGuideId ? 'active' : ''}`;
    item.setAttribute('data-id', guide.id);
    
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <i class="fas ${guide.icon}" style="color: var(--accent-critical); font-size:1.1rem; width:16px; text-align:center;"></i>
        <div class="med-menu-title">${guide.title}</div>
      </div>
      <i class="fas fa-chevron-right" style="font-size:0.8rem; color:var(--color-text-muted);"></i>
    `;
    
    item.addEventListener('click', () => {
      activeGuideId = guide.id;
      // Update active styling
      document.querySelectorAll('.medical-menu-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      renderActiveGuide();
    });
    
    menuContainer.appendChild(item);
  });
}

function renderActiveGuide() {
  const container = document.getElementById('medical-guide-display');
  if (!container) return;
  
  const guide = medicalGuides.find(g => g.id === activeGuideId);
  if (!guide) return;
  
  let stepsHTML = '';
  guide.steps.forEach((step, idx) => {
    stepsHTML += `
      <div class="guide-step-card">
        <div class="step-num">${idx + 1}</div>
        <div class="step-details">
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = `
    <div class="shelter-title-block">
      <h2 style="display:flex; align-items:center; gap:0.75rem;">
        <i class="fas ${guide.icon}" style="color:var(--accent-critical);"></i>
        ${guide.title}
      </h2>
      <p style="margin-top:0.25rem;">${guide.description}</p>
    </div>
    
    <div style="flex-grow: 1; margin-bottom: 1.5rem;">
      <div class="section-label">Follow these steps carefully</div>
      ${stepsHTML}
    </div>
    
    <div class="modal-info-alert" style="margin-top:auto;">
      <i class="fas fa-exclamation-triangle" style="font-size: 1.1rem; color:var(--accent-critical); margin-top: 2px;"></i>
      <div>
        <strong style="display:block; margin-bottom: 0.15rem; color: white;">CRITICAL ADVICE</strong>
        ${guide.criticalTip}
      </div>
    </div>
  `;
}

function filterMedicalMenu(query) {
  renderMedicalMenu(query);
}
