// LifeBridge AI Core Controller & State Orchestrator
window.appState = {
  activeDisaster: 'cyclone',
  activeView: 'dashboard',
  sosBeacons: [
    { id: "b_init1", name: "Sarah Connor (Family of 4)", message: "Trapped on 2nd floor, water rising. No power.", time: "10 mins ago" },
    { id: "b_init2", name: "David Miller", message: "Elderly neighbor needs oxygen tank delivery. Blocked road.", time: "22 mins ago" }
  ],
  
  init: function() {
    this.changeDisaster(this.activeDisaster);
    this.setupViewRouting();
    this.setupSOSBroadcast();
    
    // Auto-update time on tickers
    setInterval(() => this.updateBeaconTimes(), 60000);
  },
  
  changeDisaster: function(disasterType) {
    this.activeDisaster = disasterType;
    const db = disasterDB[disasterType];
    if (!db) return;

    // 1. Update Core UI elements
    document.getElementById('active-disaster-title').innerText = db.name;
    
    // Update ticker alert levels
    const ticker = document.getElementById('emergency-ticker');
    const tickerText = document.getElementById('ticker-text-content');
    const tickerLabel = document.getElementById('ticker-label-badge');
    
    if (ticker && tickerText && tickerLabel) {
      ticker.className = `alert-ticker ${db.alertClass}`;
      tickerText.innerText = db.tickerMessage;
      tickerLabel.innerText = db.alertLevel;
    }

    // 2. Update Stats Counter Cards
    document.getElementById('stat-shelters-val').innerText = db.stats.activeShelters;
    document.getElementById('stat-roads-val').innerText = db.stats.blockedRoads;
    document.getElementById('stat-med-val').innerText = db.stats.medicalStations;
    document.getElementById('stat-volunteers-val').innerText = db.stats.activeVolunteers;

    // 3. Update Disaster Sidebar Details on Dashboard
    document.getElementById('disaster-summary-name').innerText = db.name;
    document.getElementById('disaster-summary-desc').innerText = `Active status: ${db.alertLevel}. Impact models indicate heavy resource pressure. Monitor emergency coordinates on the command map below.`;
    
    // Update Emergency Contact list
    const contactsContainer = document.getElementById('emergency-contacts-container');
    if (contactsContainer) {
      contactsContainer.innerHTML = '';
      db.emergencyContacts.forEach(contact => {
        contactsContainer.innerHTML += `
          <div class="contact-row">
            <span class="contact-label">${contact.label}</span>
            <a href="tel:${contact.number.replace(/\s/g, '')}" class="contact-num">${contact.number}</a>
          </div>
        `;
      });
    }

    // 4. Update Map Markers
    if (typeof updateMapMarkers === 'function') {
      updateMapMarkers(db);
    }

    // 5. Update Chatbot logs
    if (typeof initChatbot === 'function') {
      initChatbot();
    }

    // 6. Update view directories
    this.renderSheltersList();
    this.renderRoadsList();
    
    // Reload supplies checklists
    if (typeof initSuppliesSection === 'function') {
      initSuppliesSection();
    }

    this.renderBeaconsLog();
  },

  setupViewRouting: function() {
    const navLinks = document.querySelectorAll('.nav-link[data-view]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = link.getAttribute('data-view');
        this.switchView(viewId);
      });
    });
  },

  switchView: function(viewId) {
    this.activeView = viewId;
    
    // Update Nav Sidebar links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      }
    });

    // Update View Panels visibility
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const activePanel = document.getElementById(`view-${viewId}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // View-specific trigger refreshes
    if (viewId === 'dashboard') {
      setTimeout(() => {
        if (mainMap) mainMap.invalidateSize();
      }, 100);
    } else if (viewId === 'shelters') {
      this.renderSheltersList();
    } else if (viewId === 'medical') {
      if (typeof initMedicalSection === 'function') {
        initMedicalSection();
      }
    }
  },

  renderSheltersList: function() {
    const listContainer = document.getElementById('shelter-cards-container');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const db = disasterDB[this.activeDisaster];
    const shelters = db.shelters || [];

    if (shelters.length === 0) {
      listContainer.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--color-text-muted);">No shelters cataloged.</div>';
      return;
    }

    shelters.forEach((shelter, index) => {
      const distance = getDistanceInMiles(userLocation[0], userLocation[1], shelter.lat, shelter.lng);
      const card = document.createElement('div');
      card.className = `glass-card shelter-card ${index === 0 ? 'active' : ''}`;
      card.setAttribute('data-id', shelter.id);

      card.innerHTML = `
        <div class="shelter-card-top">
          <div class="shelter-card-name">${shelter.name}</div>
          <span class="shelter-badge ${shelter.statusClass}">${shelter.capacity}% Capacity</span>
        </div>
        <div class="shelter-card-details">
          <span><i class="fas fa-map-marker-alt"></i> ${shelter.address}</span>
          <span><i class="fas fa-road"></i> Distance: <b>${distance} miles</b></span>
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.shelter-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.displayShelterDetails(shelter);
      });

      listContainer.appendChild(card);
      
      // Auto display details of the first shelter
      if (index === 0) {
        this.displayShelterDetails(shelter);
      }
    });

    // Setup Shelter live search
    const filterInput = document.getElementById('shelter-search-input');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.shelter-card').forEach(card => {
          const name = card.querySelector('.shelter-card-name').innerText.toLowerCase();
          if (name.includes(query)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  },

  displayShelterDetails: function(shelter) {
    const detailsContainer = document.getElementById('shelter-detail-view');
    if (!detailsContainer) return;

    const distance = getDistanceInMiles(userLocation[0], userLocation[1], shelter.lat, shelter.lng);
    const color = shelter.capacity > 85 ? 'low' : (shelter.capacity > 50 ? 'medium' : 'high');

    // Update details display
    document.getElementById('shelter-detail-name').innerText = shelter.name;
    document.getElementById('shelter-detail-address').innerText = shelter.address;
    document.getElementById('shelter-detail-phone').innerText = shelter.phone;
    document.getElementById('shelter-detail-distance').innerText = `${distance} miles away`;

    document.getElementById('res-beds').innerText = shelter.resources.beds;
    document.getElementById('res-beds').className = `resource-status ${shelter.resources.beds.toLowerCase()}`;
    
    document.getElementById('res-food').innerText = shelter.resources.food;
    document.getElementById('res-food').className = `resource-status ${shelter.resources.food.toLowerCase()}`;
    
    document.getElementById('res-water').innerText = shelter.resources.water;
    document.getElementById('res-water').className = `resource-status ${shelter.resources.water.toLowerCase()}`;
    
    document.getElementById('res-medicine').innerText = shelter.resources.medicine;
    document.getElementById('res-medicine').className = `resource-status ${shelter.resources.medicine.toLowerCase()}`;

    // Update detail map
    if (typeof renderDetailMap === 'function') {
      renderDetailMap(shelter);
    }
  },

  viewShelter: function(shelterId) {
    this.switchView('shelters');
    setTimeout(() => {
      const card = document.querySelector(`.shelter-card[data-id="${shelterId}"]`);
      if (card) {
        card.click();
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  },

  onUserLocationChange: function(lat, lng) {
    // Redraw distance calculations
    if (this.activeView === 'shelters') {
      this.renderSheltersList();
    } else if (this.activeView === 'dashboard') {
      // Refresh current coordinates display
      console.log(`User coordinates adjusted: ${lat}, ${lng}`);
    }
  },

  renderRoadsList: function() {
    const tbody = document.getElementById('roads-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const db = disasterDB[this.activeDisaster];
    const roads = db.roads || [];

    if (roads.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--color-text-muted);">All routes report clear.</td></tr>';
      return;
    }

    roads.forEach(road => {
      tbody.innerHTML += `
        <tr>
          <td style="font-weight: 600;">${road.name}</td>
          <td><span class="road-badge ${road.statusClass}">${road.status}</span></td>
          <td style="color: var(--color-text-muted); font-size: 0.85rem;">${road.reason}</td>
        </tr>
      `;
    });
  },

  renderBeaconsLog: function() {
    const list = document.getElementById('sos-beacons-list');
    if (!list) return;

    list.innerHTML = '';
    this.sosBeacons.forEach(beacon => {
      list.innerHTML += `
        <div class="beacon-item">
          <div class="beacon-main">
            <div class="beacon-name">${beacon.name}</div>
            <div class="beacon-msg">${beacon.message}</div>
          </div>
          <div class="beacon-meta">
            <span></span>${beacon.time}
          </div>
        </div>
      `;
    });
  },

  updateBeaconTimes: function() {
    // Simply cycles text simulated times for UI freshness
    this.renderBeaconsLog();
  },

  setupSOSBroadcast: function() {
    const sosOpen = document.getElementById('open-sos-btn');
    const sosModal = document.getElementById('sos-modal');
    const sosClose = document.getElementById('sos-modal-close');
    const sosCancel = document.getElementById('sos-modal-cancel');
    const sosSubmit = document.getElementById('sos-modal-submit');

    if (!sosOpen || !sosModal) return;

    sosOpen.addEventListener('click', () => {
      sosModal.classList.add('active');
    });

    const closeModal = () => {
      sosModal.classList.remove('active');
      // Reset fields
      document.getElementById('sos-input-name').value = '';
      document.getElementById('sos-input-phone').value = '';
      document.getElementById('sos-input-people').value = '1';
      document.getElementById('sos-input-details').value = '';
    };

    sosClose.addEventListener('click', closeModal);
    sosCancel.addEventListener('click', closeModal);

    sosSubmit.addEventListener('click', () => {
      const name = document.getElementById('sos-input-name').value.trim();
      const phone = document.getElementById('sos-input-phone').value.trim();
      const people = document.getElementById('sos-input-people').value;
      const details = document.getElementById('sos-input-details').value.trim();

      if (name === '' || details === '') {
        alert("Please fill in your name and emergency details.");
        return;
      }

      // Add to state
      const newBeacon = {
        id: `sos_${Date.now()}`,
        name: `${name} (Family of ${people})`,
        message: details,
        time: "Just now"
      };

      this.sosBeacons.unshift(newBeacon);
      this.renderBeaconsLog();

      // Plot new SOS beacon marker on map if Leaflet is active
      if (mainMap && typeof L !== 'undefined') {
        const sosMarkerIcon = L.divIcon({
          className: 'sos-live-marker',
          html: `<div style="background-color: var(--accent-critical); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 15px rgba(239,68,68,0.7); animation: pulse 1s infinite;"><i class="fas fa-exclamation-triangle" style="color: white; font-size: 11px;"></i></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        // Add slightly offset user coordinates to mimic neighborhood beacon
        const offsetLat = userLocation[0] + (Math.random() - 0.5) * 0.02;
        const offsetLng = userLocation[1] + (Math.random() - 0.5) * 0.02;

        const sosMarker = L.marker([offsetLat, offsetLng], { icon: sosMarkerIcon })
          .addTo(mainMap)
          .bindPopup(`
            <div style="font-family: 'Outfit', sans-serif;">
              <h4 style="margin:0 0 5px 0; color: var(--accent-critical); font-size: 14px;">LIVE SOS BEACON</h4>
              <p style="margin:0 0 5px 0; font-weight:600;">${newBeacon.name}</p>
              <p style="margin:0; font-size: 11px; color:#94a3b8;">${newBeacon.message}</p>
              <span style="font-size:10px; color:var(--accent-critical); font-weight:700; display:block; margin-top:5px;">Contact: ${phone || 'Not Provided'}</span>
            </div>
          `)
          .openPopup();
        
        mapMarkers.push(sosMarker);
        mainMap.setView([offsetLat, offsetLng], 12);
      }

      closeModal();
      alert("Emergency Beacon Broadcasted! The mock coordinate transmission is active.");
    });
  }
};

// Window onload initialization
window.addEventListener('DOMContentLoaded', () => {
  // Bind disaster select box change
  const selectBox = document.getElementById('disaster-select-dropdown');
  if (selectBox) {
    selectBox.addEventListener('change', (e) => {
      window.appState.changeDisaster(e.target.value);
    });
  }

  // Bind chatbot trigger enter button
  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input-field');
  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => {
      const text = chatInput.value;
      if (typeof handleUserSubmit === 'function') {
        handleUserSubmit(text);
      }
      chatInput.value = '';
    });
  }

  // Initialize App State & Map
  window.appState.init();
  initMap(disasterDB.cyclone.mapCenter);
});
