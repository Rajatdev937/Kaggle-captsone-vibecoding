const disasterDB = {
  cyclone: {
    name: "Cyclone Winston (Category 4)",
    alertLevel: "Critical",
    alertClass: "level-critical",
    tickerMessage: "CRITICAL ALERT: Category 4 Cyclone Winston expected to make landfall in 4 hours. Evacuation orders active for Zone A and coastal areas.",
    stats: {
      activeShelters: 12,
      blockedRoads: 8,
      medicalStations: 5,
      activeVolunteers: 245
    },
    mapCenter: [25.7617, -80.1918], // Miami-like coordinates
    shelters: [
      {
        id: "s1",
        name: "North Miami Recreation Center",
        lat: 25.8901,
        lng: -80.1830,
        address: "12300 NE 8th Ave, North Miami",
        phone: "+1 (305) 555-0191",
        capacity: 92, // %
        status: "Near Capacity",
        statusClass: "status-danger",
        resources: { beds: "Low", food: "Medium", water: "High", medicine: "Medium" }
      },
      {
        id: "s2",
        name: "Coral Gables Senior High",
        lat: 25.7483,
        lng: -80.2592,
        address: "4000 Bird Rd, Coral Gables",
        phone: "+1 (305) 555-0192",
        capacity: 45,
        status: "Space Available",
        statusClass: "status-success",
        resources: { beds: "High", food: "High", water: "High", medicine: "High" }
      },
      {
        id: "s3",
        name: "Coconut Grove Exhibition Center",
        lat: 25.7289,
        lng: -80.2378,
        address: "2700 S Bayshore Dr, Coconut Grove",
        phone: "+1 (305) 555-0193",
        capacity: 78,
        status: "Moderate Space",
        statusClass: "status-warning",
        resources: { beds: "Medium", food: "Low", water: "Medium", medicine: "Low" }
      },
      {
        id: "s4",
        name: "Tamiami Park Shelter",
        lat: 25.7512,
        lng: -80.3756,
        address: "11201 SW 24th St, Miami",
        phone: "+1 (305) 555-0194",
        capacity: 15,
        status: "Plenty of Space",
        statusClass: "status-success",
        resources: { beds: "High", food: "High", water: "High", medicine: "High" }
      }
    ],
    roads: [
      {
        id: "r1",
        name: "Biscayne Boulevard (NE 79th St to 87th St)",
        lat: 25.8490,
        lng: -80.1868,
        status: "Blocked",
        statusClass: "road-blocked",
        reason: "Fallen powerlines and heavy trees blocking all lanes."
      },
      {
        id: "r2",
        name: "Rickenbacker Causeway",
        lat: 25.7454,
        lng: -80.1982,
        status: "Closed",
        statusClass: "road-blocked",
        reason: "Closed due to high storm surge risk and extreme winds."
      },
      {
        id: "r3",
        name: "US-1 Southbound near SW 27th Ave",
        lat: 25.7388,
        lng: -80.2390,
        status: "Slow Traffic",
        statusClass: "road-slow",
        reason: "Debris on right two lanes. Volunteers clearing path."
      }
    ],
    medical: [
      {
        id: "m1",
        name: "Jackson Memorial ER",
        lat: 25.7905,
        lng: -80.2098,
        status: "Overloaded",
        statusClass: "med-danger",
        phone: "+1 (305) 555-0911",
        type: "Level 1 Trauma Center"
      },
      {
        id: "m2",
        name: "Mercy Hospital Triage Station",
        lat: 25.7423,
        lng: -80.2198,
        status: "Operational",
        statusClass: "med-success",
        phone: "+1 (305) 555-0912",
        type: "Temporary Triage Clinic"
      }
    ],
    emergencyContacts: [
      { label: "State Disaster Helpline", number: "1-800-555-WIND" },
      { label: "Red Cross Evacuation Coordination", number: "1-800-RED-CROSS" },
      { label: "Coast Guard Search & Rescue", number: "+1 (305) 555-0100" }
    ],
    chatbotResponses: {
      shelter: "The nearest shelters for Cyclone Winston are Coral Gables Senior High (45% capacity) and Tamiami Park (15% capacity). Avoid coastal shelters like Coconut Grove which are near storm surge paths.",
      road: "Avoid Rickenbacker Causeway (Closed due to storm surge) and Biscayne Boulevard near 79th St (Blocked by fallen power lines). US-1 is slow but passable.",
      supplies: "For a cyclone, you need: 1) Clean drinking water (1 gal/person/day), 2) Non-perishable food (3-day supply), 3) Battery-powered radio, 4) Flashlights with extra batteries, and 5) Sturdy tarps and tape for window protection.",
      medical: "If you have a medical emergency, go to the Mercy Hospital Triage Station which is operational and running. Jackson Memorial ER is currently overloaded. Call 911 if life-threatening.",
      wind: "With winds up to 130mph, stay indoors in an interior room (like a bathroom or closet) away from windows. Keep your phone charged and listen to NOAA weather broadcasts."
    }
  },
  flood: {
    name: "Riverine Flooding - Red River Valley",
    alertLevel: "Severe Warning",
    alertClass: "level-warning",
    tickerMessage: "SEVERE FLOOD WARNING: River level has exceeded flood stage by 6 feet and is rising. Residents in low-lying zones must evacuate immediately.",
    stats: {
      activeShelters: 8,
      blockedRoads: 15,
      medicalStations: 4,
      activeVolunteers: 188
    },
    mapCenter: [25.7780, -80.2200],
    shelters: [
      {
        id: "s1",
        name: "St. Jude Community Center (Elevated)",
        lat: 25.7980,
        lng: -80.2450,
        address: "520 SW 12th Ave, Miami",
        phone: "+1 (305) 555-0211",
        capacity: 88,
        status: "Near Capacity",
        statusClass: "status-danger",
        resources: { beds: "Low", food: "Medium", water: "Medium", medicine: "High" }
      },
      {
        id: "s2",
        name: "West Miami High Gymnasium",
        lat: 25.7588,
        lng: -80.2910,
        address: "7100 SW 8th St, West Miami",
        phone: "+1 (305) 555-0212",
        capacity: 30,
        status: "Space Available",
        statusClass: "status-success",
        resources: { beds: "High", food: "High", water: "High", medicine: "Medium" }
      },
      {
        id: "s3",
        name: "Northside Civic Arena",
        lat: 25.8288,
        lng: -80.2210,
        address: "1850 NW 66th St, Miami",
        phone: "+1 (305) 555-0213",
        capacity: 65,
        status: "Moderate Space",
        statusClass: "status-warning",
        resources: { beds: "Medium", food: "Medium", water: "High", medicine: "Low" }
      }
    ],
    roads: [
      {
        id: "r1",
        name: "NW 36th Street Underpass",
        lat: 25.8105,
        lng: -80.2250,
        status: "Blocked",
        statusClass: "road-blocked",
        reason: "Completely submerged under 4 feet of water. Cars stranded."
      },
      {
        id: "r2",
        name: "LeJeune Road near Miami Canal",
        lat: 25.8010,
        lng: -80.2620,
        status: "Closed",
        statusClass: "road-blocked",
        reason: "Canal has overflowed. Roadway is closed for safety checks."
      },
      {
        id: "r3",
        name: "I-95 Northbound (Exit 4 to 8)",
        lat: 25.8320,
        lng: -80.2010,
        status: "Slow Traffic",
        statusClass: "road-slow",
        reason: "Severe ponding on outer lanes. Speed limit restricted to 30mph."
      }
    ],
    medical: [
      {
        id: "m1",
        name: "Miami VA Hospital",
        lat: 25.7915,
        lng: -80.2185,
        status: "Operational",
        statusClass: "med-success",
        phone: "+1 (305) 555-0811",
        type: "Major Regional Medical Center"
      },
      {
        id: "m2",
        name: "Red Cross Mobile Clinic 3",
        lat: 25.7650,
        lng: -80.2750,
        status: "Operational",
        statusClass: "med-success",
        phone: "+1 (305) 555-0812",
        type: "Mobile Clinic / First Aid Unit"
      }
    ],
    emergencyContacts: [
      { label: "Flood Action Center Helpline", number: "1-800-555-FLOOD" },
      { label: "FEMA Assistance Hotline", number: "1-800-621-FEMA" },
      { label: "Water Level & Rescue Despatch", number: "1-800-555-BOAT" }
    ],
    chatbotResponses: {
      shelter: "For the flooding scenario, St. Jude Community Center is safe from high-water risks but at 88% capacity. The West Miami High Gym is on high ground and has plenty of capacity (30% full).",
      road: "Do not attempt to drive through NW 36th Street Underpass (4ft deep water) or LeJeune Road near the canal (Closed). Use I-95 Northbound with extreme caution, avoiding the outer lanes due to deep ponding.",
      supplies: "Flood emergencies require: 1) Waterproof dry bags for papers and electronics, 2) Clean bottled water (never drink tap water during a flood due to contamination), 3) Rubber boots and rain gear, 4) Bleach or chlorine tablets for sanitation.",
      medical: "For medical assistance, Miami VA Hospital and Red Cross Mobile Clinic 3 are fully operational and accessible via flood-free routes.",
      water: "Remember: 'Turn Around, Don't Drown!' Just 6 inches of moving water can knock you down, and 12 inches can sweep a car away. Avoid walking or driving in floodwaters."
    }
  },
  earthquake: {
    name: "Magnitude 6.8 Earthquake - East Faultline",
    alertLevel: "Emergency Alert",
    alertClass: "level-critical",
    tickerMessage: "EMERGENCY BROADCAST: M6.8 earthquake struck at 10:42 AM. Strong aftershocks expected. Do not enter damaged structures. Move to open areas.",
    stats: {
      activeShelters: 6,
      blockedRoads: 14,
      medicalStations: 7,
      activeVolunteers: 312
    },
    mapCenter: [25.7650, -80.2100],
    shelters: [
      {
        id: "s1",
        name: "Marlins Park Open Field Shelter",
        lat: 25.7782,
        lng: -80.2196,
        address: "501 Marlins Way, Miami",
        phone: "+1 (305) 555-0311",
        capacity: 25,
        status: "Plenty of Space",
        statusClass: "status-success",
        resources: { beds: "High", food: "Medium", water: "High", medicine: "Medium" }
      },
      {
        id: "s2",
        name: "Curtis Park Emergency Camp",
        lat: 25.7950,
        lng: -80.2255,
        address: "1901 NW 24th Ave, Miami",
        phone: "+1 (305) 555-0312",
        capacity: 82,
        status: "Near Capacity",
        statusClass: "status-danger",
        resources: { beds: "Low", food: "Low", water: "Medium", medicine: "High" }
      },
      {
        id: "s3",
        name: "Douglas Park Soccer Field",
        lat: 25.7410,
        lng: -80.2435,
        address: "2755 SW 37th Ave, Miami",
        phone: "+1 (305) 555-0313",
        capacity: 58,
        status: "Moderate Space",
        statusClass: "status-warning",
        resources: { beds: "Medium", food: "High", water: "High", medicine: "Low" }
      }
    ],
    roads: [
      {
        id: "r1",
        name: "Overpass at NW 12th Ave & SR-836",
        lat: 25.7830,
        lng: -80.2140,
        status: "Blocked",
        statusClass: "road-blocked",
        reason: "Structural concrete damage on the overpass columns. Structural integrity check pending."
      },
      {
        id: "r2",
        name: "SW 8th Street (Brickell to SW 10th Ave)",
        lat: 25.7651,
        lng: -80.2050,
        status: "Closed",
        statusClass: "road-blocked",
        reason: "Facade collapse and debris on road from tall buildings. Extremely hazardous."
      },
      {
        id: "r3",
        name: "NW 20th St near 22nd Ave",
        lat: 25.7942,
        lng: -80.2315,
        status: "Slow Traffic",
        statusClass: "road-slow",
        reason: "Pavement cracking and minor bucklings on road surface. Proceed with caution at 10mph."
      }
    ],
    medical: [
      {
        id: "m1",
        name: "U-Health Emergency Triage Area",
        lat: 25.7890,
        lng: -80.2155,
        status: "Overloaded",
        statusClass: "med-danger",
        phone: "+1 (305) 555-0711",
        type: "Field Triage & Trauma Hub"
      },
      {
        id: "m2",
        name: "Douglas Park First Aid Station",
        lat: 25.7410,
        lng: -80.2435,
        status: "Operational",
        statusClass: "med-success",
        phone: "+1 (305) 555-0712",
        type: "Emergency Clinic (Outdoors)"
      }
    ],
    emergencyContacts: [
      { label: "Earthquake Search & Rescue", number: "1-800-555-RESCUE" },
      { label: "Gas Leak & Utility Emergency", number: "1-800-555-GASLINE" },
      { label: "Structural Evaluation Hotline", number: "1-800-555-SAFEBUILD" }
    ],
    chatbotResponses: {
      shelter: "For the earthquake, open field shelters are safest to avoid aftershock structural collapse. Marlins Park Field (25% capacity) and Douglas Park Soccer Field (58% capacity) are open and safe.",
      road: "Avoid all overpasses, especially NW 12th Ave Overpass (structural damage), and SW 8th Street near Brickell (facade debris). NW 20th St has pavement cracking and should be crossed very slowly.",
      supplies: "Earthquake kits need: 1) Sturdy thick-soled shoes (to walk over glass and debris), 2) Heavy-duty work gloves, 3) Whistle (to signal for help if trapped), 4) Dust masks (N95) for debris dust, 5) Wrench or pliers to turn off gas utilities.",
      medical: "If you have injuries, head to Douglas Park First Aid Station. The U-Health Emergency Triage Hub is currently overloaded. Call 911 or the Rescue Hotline only for entrapments.",
      aftershock: "When an aftershock occurs: Drop, Cover, and Hold On! If outdoors, move to an open area away from buildings, powerlines, and trees. If inside, take shelter under a sturdy table."
    }
  }
};
