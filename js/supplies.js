// Emergency Supplies Checklist & Runway Calculator Module
const commonSupplies = [
  { id: "c1", name: "Portable Flashlight & Spare Batteries", category: "Utility" },
  { id: "c2", name: "Comprehensive First-Aid Kit", category: "Medical" },
  { id: "c3", name: "Heavy-duty Multi-tool or Pocket Knife", category: "Utility" },
  { id: "c4", name: "Emergency Whistle (to signal for help)", category: "SOS" },
  { id: "c5", name: "Important Documents in Waterproof Bag", category: "Admin" },
  { id: "c6", name: "Fully Charged Power Bank & Cables", category: "Utility" },
  { id: "c7", name: "Warm Blankets or Compact Sleeping Bags", category: "Comfort" }
];

const disasterSpecificSupplies = {
  cyclone: [
    { id: "ds_cy1", name: "Sturdy Plastic Tarps & Window Duct Tape", category: "Protection" },
    { id: "ds_cy2", name: "Battery-powered NOAA Weather Radio", category: "Info" },
    { id: "ds_cy3", name: "Emergency Boarding/Plywood Sheets", category: "Protection" }
  ],
  flood: [
    { id: "ds_fl1", name: "High-grade Water Purification Tablets", category: "Water" },
    { id: "ds_fl2", name: "Thick Rubber Rain Boots & Waterproof Ponchos", category: "Clothing" },
    { id: "ds_fl3", name: "Dry Bags for Electronics & Matches", category: "Protection" }
  ],
  earthquake: [
    { id: "ds_eq1", name: "Heavy-duty Leather Work Gloves", category: "Safety" },
    { id: "ds_eq2", name: "Adjustable Wrench (to turn off gas valves)", category: "Utility" },
    { id: "ds_eq3", name: "N95 Dust Masks (to filter airborne debris)", category: "Safety" }
  ]
};

// Store checked items state in memory
let checkedItems = {};

function initSuppliesSection() {
  renderChecklist();
  setupCalculator();
}

function renderChecklist() {
  const container = document.getElementById('checklist-items-list');
  if (!container) return;
  
  container.innerHTML = '';
  const activeDisaster = window.appState ? window.appState.activeDisaster : 'cyclone';
  
  // Combine core lists
  const currentDisasterList = disasterSpecificSupplies[activeDisaster] || [];
  const fullList = [...commonSupplies, ...currentDisasterList];
  
  fullList.forEach(item => {
    const isChecked = checkedItems[item.id] || false;
    const card = document.createElement('label');
    card.className = `checklist-item ${isChecked ? 'checked' : ''}`;
    card.setAttribute('for', `chk-${item.id}`);
    
    card.innerHTML = `
      <input type="checkbox" id="chk-${item.id}" data-id="${item.id}" ${isChecked ? 'checked' : ''}>
      <span style="font-size:0.9rem; font-weight:500;">${item.name}</span>
      <span style="margin-left:auto; font-size:0.7rem; padding: 0.15rem 0.4rem; background:rgba(255,255,255,0.05); color:var(--color-text-muted); border-radius:4px; font-weight:600; text-transform:uppercase;">${item.category}</span>
    `;
    
    // Add checkbox toggle listener
    const checkbox = card.querySelector('input');
    checkbox.addEventListener('change', (e) => {
      checkedItems[item.id] = e.target.checked;
      if (e.target.checked) {
        card.classList.add('checked');
      } else {
        card.classList.remove('checked');
      }
      updateChecklistProgress(fullList.length);
    });
    
    container.appendChild(card);
  });
  
  updateChecklistProgress(fullList.length);
}

function updateChecklistProgress(totalCount) {
  const activeDisaster = window.appState ? window.appState.activeDisaster : 'cyclone';
  const currentDisasterList = disasterSpecificSupplies[activeDisaster] || [];
  const fullList = [...commonSupplies, ...currentDisasterList];
  
  let checkedCount = 0;
  fullList.forEach(item => {
    if (checkedItems[item.id]) checkedCount++;
  });
  
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const progressText = document.getElementById('checklist-progress-text');
  if (progressText) {
    progressText.innerText = `Kit Preparedness: ${checkedCount}/${totalCount} items (${pct}%)`;
  }
}

function setupCalculator() {
  const waterSlider = document.getElementById('calc-water');
  const foodSlider = document.getElementById('calc-food');
  const familySlider = document.getElementById('calc-family');
  
  const waterVal = document.getElementById('calc-water-val');
  const foodVal = document.getElementById('calc-food-val');
  const familyVal = document.getElementById('calc-family-val');
  
  if (!waterSlider || !foodSlider || !familySlider) return;
  
  // Input event triggers
  const recalculate = () => {
    waterVal.innerText = waterSlider.value;
    foodVal.innerText = foodSlider.value;
    familyVal.innerText = familySlider.value;
    
    const water = parseInt(waterSlider.value);
    const food = parseInt(foodSlider.value);
    const family = parseInt(familySlider.value);
    
    // Formulas:
    // Water: 1 Gallon per person per day
    const waterDays = water / (family * 1);
    // Food: 3 non-perishable meals per person per day
    const foodDays = food / (family * 3);
    
    // Overall buffer is limited by whichever runs out first
    const survivalDays = Math.min(waterDays, foodDays);
    
    const resultBox = document.getElementById('calc-result-box');
    const resultDays = document.getElementById('calc-result-days');
    const resultAdvice = document.getElementById('calc-result-advice');
    
    if (resultBox && resultDays && resultAdvice) {
      if (survivalDays === Infinity || isNaN(survivalDays)) {
        resultDays.innerText = "0";
        resultAdvice.innerText = "Set parameters to calculate supply duration.";
        resultBox.className = "calc-result-box danger-result";
        return;
      }
      
      const roundedDays = survivalDays.toFixed(1);
      resultDays.innerText = roundedDays;
      
      if (survivalDays < 3.0) {
        resultBox.className = "calc-result-box danger-result";
        resultDays.style.color = "var(--accent-critical)";
        resultAdvice.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right:4px;"></i> CRITICAL: Under recommended 3-day emergency buffer. Secure more provisions!`;
      } else {
        resultBox.className = "calc-result-box";
        resultDays.style.color = "var(--accent-safe)";
        resultAdvice.innerHTML = `<i class="fas fa-check-circle" style="margin-right:4px;"></i> SAFE: Meets and exceeds the baseline 3-day emergency resource reserves.`;
      }
    }
  };
  
  waterSlider.addEventListener('input', recalculate);
  foodSlider.addEventListener('input', recalculate);
  familySlider.addEventListener('input', recalculate);
  
  // Initial run
  recalculate();
}
