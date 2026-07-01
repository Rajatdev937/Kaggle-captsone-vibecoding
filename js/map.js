// Leaflet Map Integration for LifeBridge AI
let mainMap = null;
let detailMap = null;
let mapMarkers = [];
let detailMarkers = [];
let userLocation = [25.7337, -80.2312]; // Default location: Coconut Grove area
let userLocationMarker = null;

// Initial location tracker
function initMap(centerCoords) {
  if (typeof L === 'undefined') {
    console.error("Leaflet library not loaded.");
    return;
  }

  // 1. Initialize Main Map
  const mapElement = document.getElementById('leaflet-map');
  if (mapElement && !mainMap) {
    mainMap = L.map('leaflet-map').setView(centerCoords, 11);
    
    // Add tile layer (OSM with custom CSS dark styling via style.css filter)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mainMap);

    // Track map click to let user update location
    mainMap.on('click', function(e) {
      updateUserLocation(e.latlng.lat, e.latlng.lng);
    });

    // Render initial user location marker
    renderUserMarker(mainMap);
  }
}

// Update User Location
function updateUserLocation(lat, lng) {
  userLocation = [lat, lng];
  
  if (mainMap) {
    renderUserMarker(mainMap);
  }
  
  // Trigger update across app to recalculate shelter distances
  if (window.appState && typeof window.appState.onUserLocationChange === 'function') {
    window.appState.onUserLocationChange(lat, lng);
  }
}

function renderUserMarker(mapInstance) {
  if (typeof L === 'undefined' || !mapInstance) return;

  if (userLocationMarker) {
    mapInstance.removeLayer(userLocationMarker);
  }

  // Custom pulse icon for user location
  const userPulseIcon = L.divIcon({
    className: 'user-location-pulse',
    html: '<div style="width: 14px; height: 14px; background: #3b82f6; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px #3b82f6; animation: pulse 1.5s infinite;"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  userLocationMarker = L.marker(userLocation, { icon: userPulseIcon })
    .addTo(mapInstance)
    .bindPopup("<b>Your Simulated Location</b><br>Click anywhere on the map to change location.")
    .openPopup();
}

// Render markers on main map based on disaster scenario data
function updateMapMarkers(disasterData) {
  if (!mainMap || typeof L === 'undefined') return;

  // Clear existing markers
  mapMarkers.forEach(m => mainMap.removeLayer(m));
  mapMarkers = [];

  const shelters = disasterData.shelters || [];
  const roads = disasterData.roads || [];
  const medical = disasterData.medical || [];

  // 1. Add Shelters
  shelters.forEach(shelter => {
    // Custom DivIcon for shelters
    const color = shelter.capacity > 85 ? '#ef4444' : (shelter.capacity > 50 ? '#f59e0b' : '#10b981');
    const shelterIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"><i class="fas fa-home" style="color: white; font-size: 10px;"></i></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon })
      .addTo(mainMap)
      .bindPopup(`
        <div style="font-family: 'Outfit', sans-serif;">
          <h4 style="margin:0 0 5px 0; color: #f8fafc; font-size: 14px;">${shelter.name}</h4>
          <p style="margin:0 0 5px 0; font-size: 11px; color:#94a3b8;">${shelter.address}</p>
          <div style="display:flex; justify-content:space-between; font-size: 11px; margin-top:8px;">
            <span>Capacity: <b>${shelter.capacity}%</b></span>
            <span style="color: ${color}; font-weight:700;">${shelter.status}</span>
          </div>
          <button onclick="window.appState.viewShelter('${shelter.id}')" style="margin-top:10px; width:100%; border:none; padding:4px 8px; border-radius:4px; background:#3b82f6; color:white; font-size:11px; font-weight:600; cursor:pointer;">View Resource Details</button>
        </div>
      `);
    mapMarkers.push(marker);
  });

  // 2. Add Road Blocks / Hazards
  roads.forEach(road => {
    const color = road.status === "Blocked" || road.status === "Closed" ? '#ef4444' : '#f59e0b';
    const iconClass = road.status === "Blocked" || road.status === "Closed" ? 'fa-ban' : 'fa-exclamation-triangle';
    
    const roadIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"><i class="fas ${iconClass}" style="color: white; font-size: 10px;"></i></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([road.lat, road.lng], { icon: roadIcon })
      .addTo(mainMap)
      .bindPopup(`
        <div style="font-family: 'Outfit', sans-serif;">
          <h4 style="margin:0 0 5px 0; color: #ef4444; font-size: 14px;">${road.status}: ${road.name}</h4>
          <p style="margin:0; font-size: 11px; color:#94a3b8;">${road.reason}</p>
        </div>
      `);
    mapMarkers.push(marker);
  });

  // 3. Add Medical Stations
  medical.forEach(med => {
    const color = med.status === "Overloaded" ? '#ef4444' : '#10b981';
    
    const medIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"><i class="fas fa-plus-square" style="color: white; font-size: 10px;"></i></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([med.lat, med.lng], { icon: medIcon })
      .addTo(mainMap)
      .bindPopup(`
        <div style="font-family: 'Outfit', sans-serif;">
          <h4 style="margin:0 0 5px 0; color: #f8fafc; font-size: 14px;">${med.name}</h4>
          <p style="margin:0 0 5px 0; font-size: 11px; color:#94a3b8;">${med.type}</p>
          <div style="display:flex; justify-content:space-between; font-size: 11px; margin-top:8px;">
            <span>Status: <b style="color: ${color};">${med.status}</b></span>
            <span>Phone: <b>${med.phone}</b></span>
          </div>
        </div>
      `);
    mapMarkers.push(marker);
  });

  // Pan map to new center
  mainMap.panTo(disasterData.mapCenter);
}

// Initialize and manage detail view map for individual shelters
function renderDetailMap(shelter) {
  if (typeof L === 'undefined') return;

  const mapContainer = document.getElementById('shelter-detail-map');
  if (!mapContainer) return;

  // Clear container to reset Leaflet instance
  mapContainer.innerHTML = "<div id='detail-leaflet-map' style='width:100%; height:100%;'></div>";

  detailMap = L.map('detail-leaflet-map').setView([shelter.lat, shelter.lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(detailMap);

  // User location marker in detail map
  const userPulseIcon = L.divIcon({
    className: 'user-location-pulse',
    html: '<div style="width: 12px; height: 12px; background: #3b82f6; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px #3b82f6;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
  L.marker(userLocation, { icon: userPulseIcon }).addTo(detailMap).bindPopup("Your Location");

  // Shelter location marker
  const color = shelter.capacity > 85 ? '#ef4444' : (shelter.capacity > 50 ? '#f59e0b' : '#10b981');
  const shelterIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"><i class="fas fa-home" style="color: white; font-size: 10px;"></i></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  L.marker([shelter.lat, shelter.lng], { icon: shelterIcon }).addTo(detailMap).bindPopup(`<b>${shelter.name}</b><br>${shelter.address}`);

  // Draw line representing straight-line distance
  const path = L.polyline([userLocation, [shelter.lat, shelter.lng]], {
    color: '#3b82f6',
    weight: 3,
    opacity: 0.7,
    dashArray: '5, 10'
  }).addTo(detailMap);

  // Fit boundaries to show both user and shelter
  const group = new L.featureGroup([
    L.marker(userLocation),
    L.marker([shelter.lat, shelter.lng])
  ]);
  detailMap.fitBounds(group.getBounds().pad(0.2));
}

// Helper: Haversine formula to compute distance in miles
function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d.toFixed(1);
}
