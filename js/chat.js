// AI Crisis Responder (Chatbot) Module for LifeBridge AI
const chatMessagesContainer = document.getElementById('chat-messages');
const chatInputField = document.getElementById('chat-input-field');

function initChatbot() {
  if (!chatMessagesContainer) return;
  
  // Clear chat logs and insert initial system greeting
  chatMessagesContainer.innerHTML = '';
  sendBotMessage("Greetings, I am your LifeBridge AI Crisis Assistant. I am loaded with offline-first protocols for the current crisis. How can I assist you with shelters, road safety, first aid, or supplies?");
  
  // Setup quick questions
  setupQuickQuestions();
}

function setupQuickQuestions() {
  const quickBtns = document.querySelectorAll('.quick-q-btn');
  quickBtns.forEach(btn => {
    // Replace with fresh listener to prevent duplicates
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', () => {
      const question = newBtn.getAttribute('data-q');
      handleUserSubmit(question);
    });
  });
}

function handleUserSubmit(text) {
  if (!text || text.trim() === '') return;
  
  // 1. Render User Message
  renderChatMessage(text, 'user');
  
  // 2. Show Typing Indicator
  const typingIndicator = showTypingIndicator();
  
  // 3. Process answer with simulated network delay
  setTimeout(() => {
    removeTypingIndicator(typingIndicator);
    const response = generateAIResponse(text);
    sendBotMessage(response);
  }, 750);
}

function renderChatMessage(text, sender) {
  if (!chatMessagesContainer) return;
  
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  
  bubble.innerHTML = `
    <div class="chat-bubble-text">${text}</div>
    <span class="chat-bubble-time">${timeString}</span>
  `;
  
  chatMessagesContainer.appendChild(bubble);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function sendBotMessage(text) {
  renderChatMessage(text, 'bot');
}

function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'chat-bubble bot typing-indicator-bubble';
  indicator.innerHTML = `
    <div style="display: flex; gap: 4px; align-items: center; height: 16px;">
      <span style="width: 6px; height: 6px; background-color: var(--color-text-muted); border-radius: 50%; animation: pulse 0.8s infinite 0s;"></span>
      <span style="width: 6px; height: 6px; background-color: var(--color-text-muted); border-radius: 50%; animation: pulse 0.8s infinite 0.2s;"></span>
      <span style="width: 6px; height: 6px; background-color: var(--color-text-muted); border-radius: 50%; animation: pulse 0.8s infinite 0.4s;"></span>
    </div>
  `;
  chatMessagesContainer.appendChild(indicator);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  return indicator;
}

function removeTypingIndicator(indicatorElement) {
  if (indicatorElement && indicatorElement.parentNode) {
    indicatorElement.parentNode.removeChild(indicatorElement);
  }
}

// Simple keyword matching AI response engine based on current disaster
function generateAIResponse(query) {
  const activeDisaster = window.appState ? window.appState.activeDisaster : 'cyclone';
  const db = disasterDB[activeDisaster];
  const q = query.toLowerCase();
  
  // 1. Shelter triggers
  if (q.includes('shelter') || q.includes('refuge') || q.includes('stay') || q.includes('evacuate') || q.includes('where to go')) {
    return db.chatbotResponses.shelter;
  }
  
  // 2. Road triggers
  if (q.includes('road') || q.includes('street') || q.includes('bridge') || q.includes('route') || q.includes('drive') || q.includes('highway') || q.includes('traffic')) {
    return db.chatbotResponses.road;
  }
  
  // 3. Supplies triggers
  if (q.includes('supply') || q.includes('supplies') || q.includes('kit') || q.includes('water') || q.includes('food') || q.includes('pack') || q.includes('eat') || q.includes('drink')) {
    return db.chatbotResponses.supplies;
  }
  
  // 4. Medical / Injured triggers
  if (q.includes('medical') || q.includes('hurt') || q.includes('wound') || q.includes('bleed') || q.includes('doctor') || q.includes('hospital') || q.includes('first aid') || q.includes('cpr') || q.includes('fracture')) {
    return db.chatbotResponses.medical;
  }
  
  // 5. Disaster specific triggers
  if (activeDisaster === 'cyclone' && (q.includes('wind') || q.includes('storm') || q.includes('window') || q.includes('glass') || q.includes('shutter'))) {
    return db.chatbotResponses.wind;
  }
  if (activeDisaster === 'flood' && (q.includes('water') || q.includes('drown') || q.includes('river') || q.includes('rain') || q.includes('surge'))) {
    return db.chatbotResponses.water;
  }
  if (activeDisaster === 'earthquake' && (q.includes('aftershock') || q.includes('shake') || q.includes('drop') || q.includes('table') || q.includes('collapse'))) {
    return db.chatbotResponses.aftershock;
  }
  
  // 6. Generic queries / Fallbacks
  if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
    return `Hello! I am standing by to assist with emergency protocols for the active ${activeDisaster} scenario. What critical question can I answer for you right now?`;
  }
  
  if (q.includes('thank') || q.includes('thanks')) {
    return "You're welcome. Stay safe, monitor official channels, and keep this application open for offline access to safety guidelines.";
  }
  
  if (q.includes('sos') || q.includes('emergency') || q.includes('help me') || q.includes('save')) {
    return "If you are in immediate life-threatening danger, please click the RED 'SOS BROADCAST' button in the sidebar to transmit your coordinates, or dial 911 immediately. My chatbot cannot dispatch rescue crews directly.";
  }
  
  // Default advice
  return `Under the current ${db.name} scenario, we recommend checking the 'Interactive Map' and 'Shelter Status' sections for immediate guidance. If you have a specific query about road closures or supply prep, let me know!`;
}

// Attach event listeners for typing submit
if (chatInputField) {
  chatInputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = chatInputField.value;
      handleUserSubmit(text);
      chatInputField.value = '';
    }
  });
}
