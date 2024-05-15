// Public Tranportation data

let ghgPublicTransQuickTotal = 0;
let ghgPublicTransDetailedTotal = 0;

// Call the pageContent function ensuring that quick tab is displayed first
document.addEventListener("DOMContentLoaded", function () {
    // Get references to your buttons and tab contents
    const quickTabButton = document.getElementById("quickTabButton");
    const detailedTabButton = document.getElementById("detailedTabButton");
    const quickTabContent = document.getElementById("QuickTabContent");
    const detailedTabContent = document.getElementById("DetailedTabContent");

    // Function to switch tabs
    function switchTab(tabName) {
      if (tabName === "Quick") {
        quickTabContent.style.display = "block";
        detailedTabContent.style.display = "none";
      } else if (tabName === "Detailed") {
        quickTabContent.style.display = "none";
        detailedTabContent.style.display = "block";
      }
    }

    // Add event listeners to the buttons
    quickTabButton.addEventListener("click", function () {
      switchTab("Quick");
      setActiveTab(quickTabButton);
    });

    detailedTabButton.addEventListener("click", function () {
      switchTab("Detailed");
      setActiveTab(detailedTabButton);
    });

    // Function to set the active tab
    function setActiveTab(button) {
      // Remove 'active' class from all buttons
      const tablinks = document.querySelectorAll(".tablinks");
      tablinks.forEach((tablink) => {
        tablink.classList.remove("active");
      });

      // Add 'active' class to the clicked button
      button.classList.add("active");
    }

    // Set the "Quick" button as active by default
    switchTab("Quick");
    setActiveTab(quickTabButton);
  });

  // Get the modal element and buttons for Information box
  const modal = document.getElementById('infoBox');
  const openInfoBoxButton = document.getElementById('openInfoBoxButton');
  const closeInfoBoxButton = document.getElementById('closeInfoBoxButton');

  // Open the modal when the button is clicked
  openInfoBoxButton.addEventListener('click', () => {
      modal.style.display = 'block';
  });

  // Close the modal when the close button is clicked
  closeInfoBoxButton.addEventListener('click', () => {
      modal.style.display = 'none';
  });

/* 
Scripts for updating the value of the bar next to 
"My household's ghg emissions" based on the current value of totalPublicTransportGHG
*/

// Function to update the green bar based on the totalPublicTransportGHG value
function updateghg1bar() {
    const totalPublicTGHG = document.getElementById("totalTransport");
    const ghg1bar = document.getElementById("ghg1bar");
    const bartooltip = document.getElementById("bartooltip");
    const value = parseFloat(totalPublicTGHG.textContent);

    if (!isNaN(value)) {
        // Calculate the percentage of the value relative to the maximum (10000)
        const percentage = value;

        // Limit the percentage to a maximum of 100%
        const limitedPercentage = Math.min(percentage, 100);

        ghg1bar.style.width = limitedPercentage * 100 + "%"; // Update the width of the green bar
        bartooltip.textContent = value; // Update the bartooltip content with the actual value
        // console.log("Current Value of first Bar: " + value); //console log for bar 
    }
}


// Initialize MutationObserver
const observer = new MutationObserver(updateghg1bar);

// Add a MutationObserver to watch for changes in the totalPublicTransportGHG element
const totalPublicTGHG = document.getElementById("totalTransport");
if (totalPublicTGHG) {
    observer.observe(totalPublicTGHG, { childList: true, subtree: true });
}


updateghg1bar();
    
// Add event listener to show bartooltip on green bar hover
const ghg1bar = document.getElementById("ghg1bar");
const bartooltip = document.getElementById("bartooltip");

if (ghg1bar && bartooltip) {
    ghg1bar.addEventListener("mouseover", () => {
        bartooltip.style.visibility = "visible";
    });

    ghg1bar.addEventListener("mouseout", () => {
        bartooltip.style.visibility = "hidden";
    });

    // Add a mousemove event listener to continuously update the bartooltip position
    ghg1bar.addEventListener("mousemove", (event) => {
        // Calculate the position relative to the green bar's width
        const xPosition = (event.offsetX / ghg1bar.offsetWidth) * 100;

        // Set the bartooltip position based on the mouse position
        bartooltip.style.left = xPosition + "%";
    });
}

const publicTransportObject = {
        ptghgs: 0.0,     // GHG adjusted distance       :calculated
        ptpassghg: 0.0,  // GHG per passenger per km    :calculated
        ptannghgs: 0.0,  // Annual GHGs (kg)            :calculated
        ptanndist: 0,    // Annual distance             :calculated
        ptghfact: 0.0,   // Greenhouse cefficient       :from table
        pttrip: 0,       // Typical trip distance       :select option
        ptnotrips: 0,    // No. of trips per week       :select option
        stopdist: 0,     // Typical distance between stops (metres) :from table
        ptopspd: 0,      // Typical operating speed (km/h)          :from table
        ptaero: 0.0,     // Cd x frontal area and other aero drag factors :calculated
        ptelectadj: 0.0, // Conversion from kWh to MJ (for elect)   :from table
        pteff: 0.0,      // Motor/drive efficiency      :from table
        ptmass: 0,       // Mass of empty vehicle (kg)  :from table
        ptCroll: 0.0,    // Rolling resistance coefficient :from table
        ptaf: 0.0,       // Frontal Area (sqm)          :from table
        ptenrec: 0.0,    // Energy recovery factor      :from table
        Cdlead: 0.0,     // Cd of leading car or loco   :from table
        Cdback: 0.0,     // Cd effect of back end       :from table
        frict: 0.0,      // Friction factor along length of vehicle :from table
        ptlength: 0,     // Length of vehicle           :from table
        ptloco: 0,       // Length of locomotive or first car       :from table
        windadj: 0.0,    // Adjustment factor for wind effects      :from table
        ptlight: 0.0,    // Lighting energy use(MJ/v-km)            :calculated
        pthandc: 0.0,    // Heating and cooling energy (MJ/vkm)     :calculated
        pttemp: 0,       // Typical temp diff           :from table
        ptairch: 0,      // Typical air changes/hour    :from table
        pteleff: 0.0,    // Efficiency of electricity supply (within rail system) :from table
        ptmjvkm: 0.0,    // Energy per vehicle km (MJ/vkm)          :calculated
        ptpassno: 0,     // No. of passengers           :changes based on selected option
        ptmarocc: 0,     // Default (extra person on existing service) :calculated
        ptseats: 0,      // Max seated                  :from table
        ptmaxocc: 0,     // Full (inc standing passengers in urban PT) :from table
        ptpeakocc: 0,    // Commuting #                 :from table
        pttypocc: 0,     // Typical                     :from table
        ptlowocc: 0,     // Low occupany ##             :from table
        
        // Method to calculate/overwrite annual distance (ptanndist)
        calculateGHCoEff() {
            this.ptanndist = 52 * this.pttrip * this.ptnotrips;
        },
        // Method to calculate aero (ptaero)
        calculateAero() {
            this.ptaero = this.ptaf * (this.Cdlead + this.Cdback + this.frict * 
                (this.ptlength - this.ptloco) / Math.pow(this.ptaf, 0.5)) * this.windadj;
        },
        // Method to calculate lighting energy use (ptlight)
        calculateLight() {
            this.ptlight = this.ptlength * 45 / 1000 * 3.6 / (this.ptopspd * 0.7);
        },
        // Method to calculate heating and cooling energy (pthandc)
        calculateHandC() {
            this.pthandc = this.pttemp * this.ptlength * 
            (1.5 * 2 * (this.ptaf / 3 + 3) * 0.8 + 8 * 0.25 * 2 *
            (this.ptaf / 3 + 3) * 0.8 + this.ptairch * this.ptaf * 1.23 / 3.6) *
            3.6 / 1000 / (this.ptopspd * 0.8);
        },
        // Method to calculate energy per vehicle km (ptmjvkm)
        calculateEnergyPerVehicle() {
            this.ptmjvkm = 1 / this.pteleff * (1 / this.pteff / 10 / this.ptelectadj * 
            ((this.ptmass + this.ptpassno * 67) * 9.81 * this.ptCroll + 1/2 * 1.225 * 
            this.ptaero * Math.pow((this.ptopspd / 3.6), 2) + 1 / 2 * 
            (this.ptmass + this.ptpassno * 67) * Math.pow((this.ptopspd / 3.6), 2) / 
            this.stopdist * (1 - this.ptenrec)) + (this.ptlight + this.pthandc) / 3.6 * 100) 
            / 100 * 3.6;
        },
        // Method to calculate extra person on existing service (ptmarocc)
        calculateExtraPerson() {
            this.ptmarocc = 1 / this.pteleff * (1 / this.pteff / 10 / this.ptelectadj *
            ((this.ptmass + (this.pttypocc + 1) * 67) * 9.81 * this.ptCroll + 1/2 
            * 1.225 * this.ptaero * Math.pow((this.ptopspd / 3.6), 2) + 1 / 2 * 
            (this.ptmass + (this.pttypocc + 1) * 67) * (Math.pow((this.ptopspd / 3.6), 2)) /
            this.stopdist * (1 - this.ptenrec)) + (this.ptlight + this.pthandc) / 3.6 * 100) /
            100 * 3.6 - this.ptmjvkm;
        },
        // Method to calculate annual GHG (ptannghgs)
        calculateAnnualGHG() {
            this.ptannghgs = this.ptanndist  * this.ptmjvkm / this.ptpassno * this.ptghfact;
        },
        // Method to calculate GHG per passengers per km (ptghgpass)
        calculatePassGHG() {
            this.ptpassghg = this.ptmjvkm / this.ptpassno;
        },
        calculateGHG() {
            this.ptghgs = this.ptpassghg * this.ptpassno * this.ptanndist / 100000; 
        },
        // Setters for variables.
        set set_ptpassno(new_ptpassno) {
            this.ptpassno = new_ptpassno;
        },
        set set_ptmjvkm(new_ptmjvkm) {
            this.ptmjvkm = new_ptmjvkm;
        },
        get get_ptghgs() {
            return this.ptghgs;
        },
        // Getters for variables.
        get get_ptpassghg() {
            return this.ptpassghg;
        },
        get get_ptannghgs() {
            return this.ptannghgs;
        },
        get get_ptanndist() {
            return this.ptanndist;
        },
        get get_ptghfact() {
            return this.ptghfact;
        },
        get get_pttrip() {
            return this.pttrip;
        },
        get get_ptnotrips() {
            return this.ptnotrips;
        },
        get get_stopdist() {
            return this.stopdist;
        },
        get get_ptopspd() {
            return this.ptopspd;
        },
        get get_ptaero() {
            return this.ptaero;
        },
        get get_ptelectadj() {
            return this.ptelectadj;
        },
        get get_pteff() {
            return this.pteff;
        },
        get get_ptmass() {
            return this.ptmass;
        },
        get get_ptCroll() {
            return this.ptCroll;
        },
        get get_ptaf() {
            return this.ptaf;
        },
        get get_ptenrec() {
            return this.ptenrec;
        },
        get get_Cdlead() {
            return this.Cdlead;
        },
        get get_Cdback() {
            return this.Cdback;
        },
        get get_frict() {
            return this.frict;
        },
        get get_ptlength() {
            return this.ptlength;
        },
        get get_ptloco() {
            return this.ptloco;
        },
        get get_windadj() {
            return this.windadj;
        },
        get get_ptlight() {
            return this.ptlight;
        },
        get get_pthandc() {
            return this.pthandc;
        },
        get get_pttemp() {
            return this.pttemp;
        },
        get get_ptairch() {
            return this.ptairch;
        },
        get get_pteleff() {
            return this.pteleff;
        },
        get get_ptmjvkm() {
            return this.ptmjvkm;
        },
        get get_ptpassno() {
            return this.ptpassno;
        },
        get get_ptmarocc() {
            return this.ptmarocc;
        },
        get get_ptseats() {
            return this.ptseats;
        },
        get get_ptmaxocc() {
            return this.ptmaxocc;
        },
        get get_ptpeakocc() {
            return this.ptpeakocc;
        },
        get get_pttypocc() {
            return this.pttypocc;
        },
        get get_ptlowocc() {
            return this.ptlowocc;
        },

        
    }

// Common Value for Variables
const com_ptanndist = 10400;

const com_elect_ptghfact = 0.27;
const com_diesel_ptghfact = 0.072;

const com_base_pttrip = 20;
const com_base_n = 10;

const com_elect_ptelectadj = 3.6;
const com_diesel_ptelectadj = 1;

const com_normal_ptCroll = 0.001;
const com_tram_ptCroll = 0.0015;
const com_bus_ptCroll = 0.006;

const com_tram_ptaf = 9.6725;
const com_bus_ptaf = 8.4;

const com_normal_Cdback = 0.11;

const com_normal_pteff = 0.85;
const com_diesel_pteff = 0.35;
const com_bus_pteff = 0.4;

// Public Transport Vehicles

// Typical Electric Trains
// UGUET, under-ground urban (4-6 car) (Generic/London)
const UGUET = Object.create(publicTransportObject);
Object.assign(UGUET, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 750, ptopspd: 50, ptelectadj: com_elect_ptelectadj,
    pteff: 0.8, ptmass: 200000, ptCroll: com_normal_ptCroll, ptaf: 8.25, ptenrec: 0.1,
    Cdlead: 0.4, Cdback: 0.013, frict: 0.025, ptlength: 120, ptloco: 20, 
    windadj: 1, pttemp: 4, ptairch: 5, pteleff: 0.90, ptpassno: 180, ptseats: 264,
    ptmaxocc: 900, ptpeakocc: 540, pttypocc: 180, ptlowocc: 113,
});
UGUET.calculateGHCoEff();
UGUET.calculateAero();
UGUET.calculateLight();
UGUET.calculateHandC();
UGUET.calculateEnergyPerVehicle();
UGUET.calculateExtraPerson();
UGUET.calculateAnnualGHG();
UGUET.calculatePassGHG();
UGUET.calculateGHG();

// UET, urban train (6 car) (Melbourne)
const UET = Object.create(publicTransportObject);
Object.assign(UET, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 750, ptopspd: 55, ptelectadj: com_elect_ptelectadj,
    pteff: com_normal_pteff, ptmass: 242000, ptCroll: com_normal_ptCroll, ptaf: 10.8, ptenrec: 0,
    Cdlead: 0.33, Cdback: com_normal_Cdback, frict: 0.025, ptlength: 144, ptloco: 24, 
    windadj: 1.1, pttemp: 6, ptairch: 10, pteleff: 0.90, ptpassno: 160, ptseats: 528,
    ptmaxocc: 1200, ptpeakocc: 240, pttypocc: 160, ptlowocc: 120,
});
UET.calculateGHCoEff();
UET.calculateAero();
UET.calculateLight();
UET.calculateHandC();
UET.calculateEnergyPerVehicle();
UET.calculateExtraPerson();
UET.calculateAnnualGHG();
UET.calculatePassGHG();
UET.calculateGHG();

// DDUET, double decker urban train (8 car) (Sydney)
const DDUET = Object.create(publicTransportObject);
Object.assign(DDUET, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 750, ptopspd: 55, ptelectadj: com_elect_ptelectadj,
    pteff: com_normal_pteff, ptmass: 364000, ptCroll: com_normal_ptCroll, ptaf: 13.2, ptenrec: 0.2,
    Cdlead: 0.35, Cdback: com_normal_Cdback, frict: 0.027, ptlength: 160, ptloco: 20, 
    windadj: 1.1, pttemp: 6, ptairch: 8, pteleff: 0.90, ptpassno: 275, ptseats: 904,
    ptmaxocc: 1625, ptpeakocc: 540, pttypocc: 275, ptlowocc: 205,
});
DDUET.calculateGHCoEff();
DDUET.calculateAero();
DDUET.calculateLight();
DDUET.calculateHandC();
DDUET.calculateEnergyPerVehicle();
DDUET.calculateExtraPerson();
DDUET.calculateAnnualGHG();
DDUET.calculatePassGHG();
DDUET.calculateGHG();

// OUET, outer urban (6 car) (up to 130 km/h) (Brisbane)
const OUET = Object.create(publicTransportObject);
Object.assign(OUET, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 1200, ptopspd: 70, ptelectadj: com_elect_ptelectadj,
    pteff: com_normal_pteff, ptmass: 260000, ptCroll: com_normal_ptCroll, ptaf: 10.53, ptenrec: 0,
    Cdlead: 0.3, Cdback: com_normal_Cdback, frict: 0.0248, ptlength: 144, ptloco: 24, 
    windadj: 1.1, pttemp: 6, ptairch: 7, pteleff: 0.90, ptpassno: 160, ptseats: 528,
    ptmaxocc: 1000, ptpeakocc: 240, pttypocc: 160, ptlowocc: 120,
});
OUET.calculateGHCoEff();
OUET.calculateAero();
OUET.calculateLight();
OUET.calculateHandC();
OUET.calculateEnergyPerVehicle();
OUET.calculateExtraPerson();
OUET.calculateAnnualGHG();
OUET.calculatePassGHG();
OUET.calculateGHG();

// RET, regional (3 car) (up to 130 km/h) (Western Australia)
const RET = Object.create(publicTransportObject);
Object.assign(RET, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 5000, ptopspd: 120, ptelectadj: com_elect_ptelectadj,
    pteff: com_normal_pteff, ptmass: 130000, ptCroll: com_normal_ptCroll, ptaf: 10.44, ptenrec: 0,
    Cdlead: 0.25, Cdback: com_normal_Cdback, frict: 0.022, ptlength: 72, ptloco: 24, 
    windadj: 1.1, pttemp: 6, ptairch: 6, pteleff: 0.90, ptpassno: 80, ptseats: 264,
    ptmaxocc: 264, ptpeakocc: 140, pttypocc: 80, ptlowocc: 60,
});
RET.calculateGHCoEff();
RET.calculateAero();
RET.calculateLight();
RET.calculateHandC();
RET.calculateEnergyPerVehicle();
RET.calculateExtraPerson();
RET.calculateAnnualGHG();
RET.calculatePassGHG();
RET.calculateGHG();

// HSICET, high speed intercity (130-200 km/h) (UK Pendolino) 
const HSICET = Object.create(publicTransportObject);
Object.assign(HSICET, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 30000, ptopspd: 160, ptelectadj: com_elect_ptelectadj,
    pteff: com_normal_pteff, ptmass: 460000, ptCroll: com_normal_ptCroll, ptaf: 10.5, ptenrec: 0,
    Cdlead: 0.2, Cdback: com_normal_Cdback, frict: 0.02, ptlength: 150, ptloco: 25, 
    windadj: 1.1, pttemp: 6, ptairch: 4, pteleff: 0.90, ptpassno: 140, ptseats: 439,
    ptmaxocc: 439, ptpeakocc: 265, pttypocc: 140, ptlowocc: 100,
});
HSICET.calculateGHCoEff();
HSICET.calculateAero();
HSICET.calculateLight();
HSICET.calculateHandC();
HSICET.calculateEnergyPerVehicle();
HSICET.calculateExtraPerson();
HSICET.calculateAnnualGHG();
HSICET.calculatePassGHG();
HSICET.calculateGHG();

// VHSET, Very high speed (200-300 km/h) (Japan Shinkasen)
const VHSET = Object.create(publicTransportObject);
Object.assign(VHSET, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 40000, ptopspd: 250, ptelectadj: com_elect_ptelectadj,
    pteff: 0.9, ptmass: 634000, ptCroll: com_normal_ptCroll, ptaf: 13, ptenrec: 0,
    Cdlead: 0.15, Cdback: 0.1, frict: 0.012, ptlength: 300, ptloco: 25, 
    windadj: 1.08, pttemp: 6, ptairch: 3, pteleff: 0.93, ptpassno: 1000, ptseats: 1323,
    ptmaxocc: 1323, ptpeakocc: 1250, pttypocc: 1000, ptlowocc: 500,
});
VHSET.calculateGHCoEff();
VHSET.calculateAero();
VHSET.calculateLight();
VHSET.calculateHandC();
VHSET.calculateEnergyPerVehicle();
VHSET.calculateExtraPerson();
VHSET.calculateAnnualGHG();
VHSET.calculatePassGHG();
VHSET.calculateGHG();

// Diesel Trains
// SUDT, suburban (2 car) (Adelaide)
const SUDT = Object.create(publicTransportObject);
Object.assign(SUDT, {
    ptanndist: com_ptanndist, ptghfact: com_diesel_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 15000, ptopspd: 65, ptelectadj: com_diesel_ptelectadj,
    pteff: 0.35, ptmass: 110000, ptCroll: com_normal_ptCroll, ptaf: 10.5, ptenrec: 0,
    Cdlead: 0.3, Cdback: 0.11, frict: 0.022, ptlength: 50, ptloco: 25, 
    windadj: 1.1, pttemp: 6, ptairch: 6, pteleff: 1.00, ptpassno: 25, ptseats: 64,
    ptmaxocc: 130, ptpeakocc: 65, pttypocc: 25, ptlowocc: 10,
});
SUDT.calculateGHCoEff();
SUDT.calculateAero();
SUDT.calculateLight();
SUDT.calculateHandC();
SUDT.calculateEnergyPerVehicle();
SUDT.calculateExtraPerson();
SUDT.calculateAnnualGHG();
SUDT.calculatePassGHG();
SUDT.calculateGHG();

// RDT, 2 car regional (up to 150 km/h) (Victoria)
const RDT = Object.create(publicTransportObject);
Object.assign(RDT, {
    ptanndist: com_ptanndist, ptghfact: com_diesel_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 15000, ptopspd: 130, ptelectadj: com_diesel_ptelectadj,
    pteff: 0.35, ptmass: 91000, ptCroll: com_normal_ptCroll, ptaf: 10.5, ptenrec: 0,
    Cdlead: 0.25, Cdback: 0.11, frict: 0.022, ptlength: 50, ptloco: 25, 
    windadj: 1.1, pttemp: 6, ptairch: 3, pteleff: 1.00, ptpassno: 40, ptseats: 120,
    ptmaxocc: 120, ptpeakocc: 72, pttypocc: 40, ptlowocc: 30,
});
RDT.calculateGHCoEff();
RDT.calculateAero();
RDT.calculateLight();
RDT.calculateHandC();
RDT.calculateEnergyPerVehicle();
RDT.calculateExtraPerson();
RDT.calculateAnnualGHG();
RDT.calculatePassGHG();
RDT.calculateGHG();

// ISHSDT, Interstate 7 car high speed (130-200 km/h) (UK/NSW)
const ISHSDT = Object.create(publicTransportObject);
Object.assign(ISHSDT, {
    ptanndist: com_ptanndist, ptghfact: com_diesel_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 30000, ptopspd: 160, ptelectadj: com_diesel_ptelectadj,
    pteff: 0.35, ptmass: 447000, ptCroll: com_normal_ptCroll, ptaf: 10.5, ptenrec: 0,
    Cdlead: 0.25, Cdback: 0.11, frict: 0.022, ptlength: 175, ptloco: 25, 
    windadj: 1.1, pttemp: 6, ptairch: 3, pteleff: 1.00, ptpassno: 170, ptseats: 540,
    ptmaxocc: 540, ptpeakocc: 324, pttypocc: 170, ptlowocc: 120,
});
ISHSDT.calculateGHCoEff();
ISHSDT.calculateAero();
ISHSDT.calculateLight();
ISHSDT.calculateHandC();
ISHSDT.calculateEnergyPerVehicle();
ISHSDT.calculateExtraPerson();
ISHSDT.calculateAnnualGHG();
ISHSDT.calculatePassGHG();
ISHSDT.calculateGHG();

// Tram
// OMT, Older melbourne tram (A&J)
const OMT = Object.create(publicTransportObject);
Object.assign(OMT, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 250, ptopspd: 35, ptelectadj: com_elect_ptelectadj,
    pteff: 0.8, ptmass: 35300, ptCroll: com_tram_ptCroll, ptaf: com_tram_ptaf, ptenrec: 0.2,
    Cdlead: 0.35, Cdback: 0.11, frict: 0.027, ptlength: 25, ptloco: 8, 
    windadj: 1.1, pttemp: 6, ptairch: 10, pteleff: 0.90, ptpassno: 30, ptseats: 50,
    ptmaxocc: 100, ptpeakocc: 40, pttypocc: 30, ptlowocc: 25,
});
OMT.calculateGHCoEff();
OMT.calculateAero();
OMT.calculateLight();
OMT.calculateHandC();
OMT.calculateEnergyPerVehicle();
OMT.calculateExtraPerson();
OMT.calculateAnnualGHG();
OMT.calculatePassGHG();
OMT.calculateGHG();

// MT, Modern 64 seat tram (Siemens Combino 3 car with energy recovery)
const MT = Object.create(publicTransportObject);
Object.assign(MT, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 250, ptopspd: 35, ptelectadj: com_elect_ptelectadj,
    pteff: 0.85, ptmass: 25800, ptCroll: com_tram_ptCroll, ptaf: com_tram_ptaf, ptenrec: 0.45,
    Cdlead: 0.2, Cdback: 0.11, frict: 0.025, ptlength: 27, ptloco: 10, 
    windadj: 1.1, pttemp: 6, ptairch: 10, pteleff: 0.90, ptpassno: 26, ptseats: 64,
    ptmaxocc: 115.2, ptpeakocc: 69.12, pttypocc: 26, ptlowocc: 22,
});
MT.calculateGHCoEff();
MT.calculateAero();
MT.calculateLight();
MT.calculateHandC();
MT.calculateEnergyPerVehicle();
MT.calculateExtraPerson();
MT.calculateAnnualGHG();
MT.calculatePassGHG();
MT.calculateGHG();

// MLRT, Modern 94 seat light rail or tram (Siemens Combino 5 car with energy recovery)
const MLRT = Object.create(publicTransportObject);
Object.assign(MLRT, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 500, ptopspd: 50, ptelectadj: com_elect_ptelectadj,
    pteff: 0.85, ptmass: 35300, ptCroll: com_tram_ptCroll, ptaf: com_tram_ptaf, ptenrec: 0.45,
    Cdlead: 0.2, Cdback: 0.11, frict: 0.025, ptlength: 40, ptloco: 10, 
    windadj: 1.1, pttemp: 6, ptairch: 10, pteleff: 0.90, ptpassno: 38, ptseats: 94,
    ptmaxocc: 169.2, ptpeakocc: 101.52, pttypocc: 38, ptlowocc: 32,
});
MLRT.calculateGHCoEff();
MLRT.calculateAero();
MLRT.calculateLight();
MLRT.calculateHandC();
MLRT.calculateEnergyPerVehicle();
MLRT.calculateExtraPerson();
MLRT.calculateAnnualGHG();
MLRT.calculatePassGHG();
MLRT.calculateGHG();

// Bus
// SUB, suburban (A&J, PTUA)
const SUB = Object.create(publicTransportObject);
Object.assign(SUB, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 600, ptopspd: 35, ptelectadj: 1,
    pteff: com_bus_pteff, ptmass: 9500, ptCroll: com_bus_ptCroll, ptaf: com_bus_ptaf, ptenrec: 0,
    Cdlead: 0.3, Cdback: 0.11, frict: 0.022, ptlength: 20, ptloco: 20, 
    windadj: 1.1, pttemp: 6, ptairch: 6, pteleff: 1.00, ptpassno: 12, ptseats: 42,
    ptmaxocc: 75.6, ptpeakocc: 27, pttypocc: 12, ptlowocc: 6,
});
SUB.calculateGHCoEff();
SUB.calculateAero();
SUB.calculateLight();
SUB.calculateHandC();
SUB.calculateEnergyPerVehicle();
SUB.calculateExtraPerson();
SUB.calculateAnnualGHG();
SUB.calculatePassGHG();
SUB.calculateGHG();

// ICB, intercity (A&J, PTUA)
const ICB = Object.create(publicTransportObject);
Object.assign(ICB, {
    ptanndist: com_ptanndist, ptghfact: com_elect_ptghfact, pttrip: com_base_pttrip,
    ptnotrips: com_base_n, stopdist: 15000, ptopspd: 90, ptelectadj: 1,
    pteff: com_bus_pteff, ptmass: 9500, ptCroll: com_bus_ptCroll, ptaf: com_bus_ptaf, ptenrec: 0,
    Cdlead: 0.25, Cdback: 0.11, frict: 0.022, ptlength: 20, ptloco: 20, 
    windadj: 1.1, pttemp: 6, ptairch: 3, pteleff: 1.00, ptpassno: 42, ptseats: 42,
    ptmaxocc: 42, ptpeakocc: 25, pttypocc: 15, ptlowocc: 8,
});
ICB.calculateGHCoEff();
ICB.calculateAero();
ICB.calculateLight();
ICB.calculateHandC();
ICB.calculateEnergyPerVehicle();
ICB.calculateExtraPerson();
ICB.calculateAnnualGHG();
ICB.calculatePassGHG();
ICB.calculateGHG();

// calculate total GHG for Quick view
function calculateGHGQuick() {
    ghgPublicTransQuickTotal = 0;
    //Bus Dropdown
    var dropDowns1 = parseInt(document.getElementById("dropDowns1").value);

    //Electric Train Dropdown
    var dropDowns2 = document.getElementById("dropDowns2").value;

    //Tram Dropdown
    var dropDowns3 = document.getElementById("dropDowns3").value;

    //Diesel Train Dropdown 
    var dropDowns4 = document.getElementById("dropDowns4").value;

    // Bus Selected Option
    if (dropDowns1 === 100 || dropDowns1 === NaN) { // The "None" option is selected.
        ghgPublicTransQuickTotal += 0;

    } else if (dropDowns1 === 200) { // The "Suburban" option is selected.
        ghgPublicTransQuickTotal += SUB.get_ptghgs;
        
    } else if (dropDowns1 === 300) { // The "Intercity bus" option is selected.
        ghgPublicTransQuickTotal += ICB.get_ptghgs;   
    }

    // Electric Train Selected Option
    if (dropDowns2 === "type-number0" || dropDowns2 === NaN) { // The "None" option is selected.
        ghgPublicTransQuickTotal += 0;

    } else if (dropDowns2 === "type-number1") { // The "Urban train" option is selected.
        ghgPublicTransQuickTotal += UET.get_ptghgs;
        
    } else if (dropDowns2 === "type-number2") { // The "Urban-ground train" option is selected.
        ghgPublicTransQuickTotal += UGUET.get_ptghgs; 

    } else if (dropDowns2 === "type-number3") { // The "Double decker urban train" option is selected.
        ghgPublicTransQuickTotal += DDUET.get_ptghgs; 

    } else if (dropDowns2 === "type-number4") { // The "Outer urban" option is selected.
        ghgPublicTransQuickTotal += OUET.get_ptghgs; 

    } else if (dropDowns2 === "type-number5") { // The "Regional train" option is selected.
        ghgPublicTransQuickTotal += RET.get_ptghgs; 
          
    } else if (dropDowns2 === "type-number6") { // The "High speed intercity train" option is selected.
        ghgPublicTransQuickTotal += HSICET.get_ptghgs; 
          
    } else if (dropDowns2 === "type-number7") { // The "Very high speed train" option is selected.
        ghgPublicTransQuickTotal += VHSET.get_ptghgs; 
          
    }
    
    // Tram Selected Option
    if (dropDowns3 === "type-number0" || dropDowns3 === NaN) { // The "None" option is selected.
        ghgPublicTransQuickTotal += 0;

    } else if (dropDowns3 === "type-number1") { // The "Older Melbourne tram" option is selected.
        ghgPublicTransQuickTotal += OMT.get_ptghgs;
        
    } else if (dropDowns3 === "type-number2") { // The "Modern 64 seat tram" option is selected.
        ghgPublicTransQuickTotal += MT.get_ptghgs;  

    } else if (dropDowns3 === "type-number3") { // The "Modern 94 seat light or tram" option is selected.
        ghgPublicTransQuickTotal += MLRT.get_ptghgs;  
         
    }

    // Diesel Train Selected Option
    if (dropDowns4 === "type-number0" || dropDowns4 === NaN) { // The "None" option is selected.
        ghgPublicTransQuickTotal += 0;

    } else if (dropDowns4 === "type-number1") { // The "Suburban diesel train" option is selected.
        ghgPublicTransQuickTotal += SUDT.get_ptghgs;
        
    } else if (dropDowns4 === "type-number2") { // The "Regional diesel train" option is selected.
        ghgPublicTransQuickTotal += RDT.get_ptghgs;  

    } else if (dropDowns4 === "type-number3") { // The "Interstate high speed diesel train" option is selected.
        ghgPublicTransQuickTotal += ISHSDT.get_ptghgs;  
         
    }
    totalPublicTransportGHG();
}

document.getElementById("dropDowns1").addEventListener("change", calculateGHGQuick);
document.getElementById("dropDowns2").addEventListener("change", calculateGHGQuick);
document.getElementById("dropDowns3").addEventListener("change", calculateGHGQuick);
document.getElementById("dropDowns4").addEventListener("change", calculateGHGQuick);


// CODE FOR DETAILED TABLE

// Gathers values from table
document.getElementById('detailedPublicTransportOptions').addEventListener('change', function() {
    const selectedValue = this.value; //value from dropdown user selects for first time
    const tableContainer = document.getElementById('tableContainer');
    const addItemDiv = document.getElementById('addItemDiv');
    const tableBody = document.getElementById('tableBody');

    const selectedVehicle = typeMapping[selectedValue] || "Unknown";

    // for newly created rows
    // Remove previous event listener for typeSelect
    typeSelect.removeEventListener('change', handletypeSelectChange);

    // Attach new event listener for typeSelect
    typeSelect.addEventListener('change', handletypeSelectChange);
    
    // Clears dropdown 
    tableBody.innerHTML = '';

    // Default values for the columns
    const defaultValues = {
        ghgs: selectedVehicle.get_ptghgs.toFixed(2),
        Id: 'TLR1',
        AnnualKMS: '3900',
        Type: selectedValue,
        TripsPerWeek: '5',
        TripDistanceKMS: 'Typical',
        Occupancy: 'Typical'
    };

    // Generate and populate table rows based on the default values
    const newRow = document.createElement('tr');
    for (const key in defaultValues) {
        const cell = document.createElement('td');
        cell.textContent = defaultValues[key];
        newRow.appendChild(cell);
    }
    tableBody.appendChild(newRow);

    // Hide the dropdown and label
    this.style.display = 'none';
    this.previousElementSibling.style.display = 'none';

    // Show the table container and add item button
    tableContainer.style.display = 'block';
    addItemDiv.style.display = 'block';
    updateTotalDetailedGHG();
});

// Script for addItem button
const addItemButton = document.getElementById('addItemButton');
const tableBody = document.getElementById('tableBody');
let idCounter = 2; // Starts Id column from TLR1

// event loop for each time the add item button is pressed
addItemButton.addEventListener('click', function() {      
        const newId = "TLR" + idCounter++;
    
        const newRow = document.createElement('tr');
        const columns = ['ghgs', 'Id', 'Annual kms', 'Type', 'Trips per week', 'Trip distance', 'Occupancy'];
    
        columns.forEach(column => {
            const cell = document.createElement('td');
            if (column === 'ghgs') {
                cell.textContent = '0.000';
            } else if (column === 'Id') {
                cell.textContent = newId;
            } else if (column === 'Annual kms') {
                cell.textContent = 10400;
            } else if (column === 'Type') {
                cell.textContent = 'None';
            } else if (column === 'Trips per week') {
                cell.textContent = 'To and from work/school (10)';
            } else if (column === 'Trip distance') {
                cell.textContent = 'Sururban trip (typical train trip) (20km)';
            } else if (column === 'Occupancy') {
                cell.textContent = 'Typical';
            }
            newRow.appendChild(cell);
        });
        
        tableBody.appendChild(newRow);

    //Code for deleting a row in the table
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation();
        tableBody.removeChild(newRow);
        if (tableBody.children.length === 0) {
            tableContainer.style.display = 'none';
            addItemButton.style.display = 'none';
            typeSelect.style.display = 'block';
        }
        updateTotalDetailedGHG(); // Update total GHG after deletion
    });
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);
    newRow.setAttribute('data-row-id', newId);
});

//  event listener for delete buttons
tableBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
        const rowToDelete = event.target.closest('tr[data-row-id]');
        if (rowToDelete) {
            tableBody.removeChild(rowToDelete);
            if (tableBody.children.length === 0) {
                tableContainer.style.display = 'none';
                addItemButton.style.display = 'none';
                typeSelect.style.display = 'block';
            }
            updateTotalDetailedGHG(); // Update total GHG after deletion
        }
    }
});

const publicTransDetailsModal = document.getElementById('publicTransDetailsModal');
const closeModalButton = document.getElementById('closeModalButton');

// if user leaves a row empty will set it to the default setting
tableBody.addEventListener('click', function(event) {
    const clickedRow = event.target.closest('tr');
    if (!clickedRow) return;

    selectedRow = clickedRow;

    const cells = clickedRow.querySelectorAll('td');
    typeSelect.value = cells[3].textContent;

    publicTransDetailsModal.style.display = 'block';
});

// Listen for input changes input modal to update table row value
typeSelect.addEventListener('change', updateTableRowValues); 
tripsSelect.addEventListener('change', updateTableRowValues); 
distanceSelect.addEventListener('change', updateTableRowValues); 
distanceBetweenStopsSelect.addEventListener('change', updateTableRowValues); 
operatingSpeedSelect.addEventListener('change', updateTableRowValues); 
energyPerKMSelect.addEventListener('change', updateTableRowValues); 
occupancySelect.addEventListener('change', updateTableRowValues); 
occupancyCalSelect.addEventListener('change', updateTableRowValues); 
percentGreenEnergySelect.addEventListener('change', updateTableRowValues); 
energyRecoveryFactorSelect.addEventListener('change', updateTableRowValues); 
dragFactorSelect.addEventListener('change', updateTableRowValues); 

// Event listeners for checking if user input is selected from the dropdowns
typeSelect.addEventListener('change', handletypeSelectChange);
tripsSelect.addEventListener('change', handleTripsSelectChange); 
distanceSelect.addEventListener('change', handleDistanceSelectChange); 
distanceBetweenStopsSelect.addEventListener('change', handleDistanceBetweenStopsSelectChange); 
operatingSpeedSelect.addEventListener('change', handleOperatingSpeedSelectChange); 
energyPerKMSelect.addEventListener('change', handleEnergyPerKMSelectChange); 
occupancySelect.addEventListener('change', handleOccupancySelectChange);
percentGreenEnergySelect.addEventListener('change', handlePercentGreenEnergySelectChange); 
energyRecoveryFactorSelect.addEventListener('change', handleEnergyRecoveryFactorSelectChange); 
dragFactorSelect.addEventListener('change', handleDragFactorSelectChange);

// Functions to if user specific option is chosen
function handletypeSelectChange() {
    updateTableRowValues(); // Update the row immediately for other options
}

function handleTripsSelectChange() {
    const selectedOption = tripsSelect.value;
    console.log("selectedOption: ", selectedOption   )
        if (selectedOption === 'user-specify-trips') {
            userSpecifyTripsInput.style.display = 'block';
        } else {
            userSpecifyTripsInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleDistanceSelectChange() {
    const selectedOption = distanceSelect.value;
        if (selectedOption === 'user-specify-distance') {
            userSpecifyDistanceInput.style.display = 'block';
        } else {
            userSpecifyDistanceInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleDistanceBetweenStopsSelectChange() {
    const selectedOption = distanceBetweenStopsSelect.value;
        if (selectedOption === 'user-specify-distanceBetweenStops') {
            userSpecifyDistanceBetweenStopsInput.style.display = 'block';
        } else {
            userSpecifyDistanceBetweenStopsInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleOperatingSpeedSelectChange() {
    const selectedOption = operatingSpeedSelect.value;
        if (selectedOption === 'user-specify-operatingSpeed') {
            userSpecifyOperatingSpeedInput.style.display = 'block';
        } else {
            userSpecifyOperatingSpeedInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleEnergyPerKMSelectChange() {
    const selectedOption = energyPerKMSelect.value;
        if (selectedOption === 'user-specify-energyPerKM') {
            userSpecifyEnergyPerKMInput.style.display = 'block';
        } else {
            userSpecifyEnergyPerKMInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleOccupancySelectChange() {
    const selectedOption = occupancySelect.value;
        if (selectedOption === 'user-specify-occupancy') {
            userSpecifyOccupancyInput.style.display = 'block';
        } else {
            userSpecifyOccupancyInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handlePercentGreenEnergySelectChange() {
    const selectedOption = percentGreenEnergySelect.value;
        if (selectedOption === 'user-specify-greenEnergy') {
            userSpecifyGreenEnergyInput.style.display = 'block';
        } else {
            userSpecifyGreenEnergyInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleEnergyRecoveryFactorSelectChange() {
    const selectedOption = energyRecoveryFactorSelect.value;
        if (selectedOption === 'user-specify-energyRecoveryFactor') {
            userSpecifyEnergyRecoveryFactorInput.style.display = 'block';
        } else {
            userSpecifyEnergyRecoveryFactorInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleDragFactorSelectChange() {
    const selectedOption = dragFactorSelect.value;
        if (selectedOption === 'user-specify-dragFactor') {
            userSpecifyDragFactorInput.style.display = 'block';
        } else {
            userSpecifyDragFactorInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

// Input event listener for user specific input
userSpecifyTripsInput.addEventListener('input', updateTableRowValues); 
userSpecifyDistanceInput.addEventListener('input', updateTableRowValues); 
userSpecifyDistanceBetweenStopsInput.addEventListener('input', updateTableRowValues); 
userSpecifyOperatingSpeedInput.addEventListener('input', updateTableRowValues); 
userSpecifyEnergyPerKMInput.addEventListener('input', updateTableRowValues); 
userSpecifyOccupancyInput.addEventListener('input', updateTableRowValues);
userSpecifyGreenEnergyInput.addEventListener('input', updateTableRowValues); 
userSpecifyEnergyRecoveryFactorInput.addEventListener('input', updateTableRowValues); 
userSpecifyDragFactorInput.addEventListener('input', updateTableRowValues);

// Done button
closeModalButton.addEventListener('click', function () {
    publicTransDetailsModal.style.display = 'none';
    selectedRow = null;
});

// Code for values of dropdown options in modal
const typeMapping = {
    'None': 'None',
    'Urban train': UET,
    'Double decker urban train': DDUET,
    'Under-ground urban train': UGUET,
    'Outer urban train': OUET,
    'Regional train': RET,
    'High speed intercity train': HSICET,
    'Very high speed train': VHSET,
    'Sururban diesel train': SUDT,
    'Regional diesel train': RDT,
    'Interstate high speed diesel train': ISHSDT,
    'Older melbourne tram': OMT,
    'Modern 64 seat tram': MT,
    'Modern 94 seat light rail or tram': MLRT,
    'Sururban bus': SUB,
    'Intercity bus': ICB
};

const tripsMapping = {
    'Very few': 1,
    'Daily': 5,
    'To and from work/school': 10,
    'Often': 20
};

const distanceMapping = {
    'Short trip': 5,
    'Medium trip': 15,
    'Typical': 15,
    'Suburban trip': 20,
    'Short intercity trip': 50,
    'Long intercity trip': 200,
    'Interstate trip': 1000
};

const energyPerKMMapping = {
    'Normal': 'Normal',
    '25% more efficient': 25,
    '50% more efficient': 50,
};

const occupancyMapping = {
    'All seats occupied': 0,
    'Full': 1,
    'Commuting': 2,
    'Typical': 3,
    'Low occupancy': 4,
};

const energyRecoveryMapping = {
    'Normal': 'Normal',
    'None': 0,
    'Low': 0.2,
    'Very good': 0.45,
    'Excellent': 0.6,
};

function calculateGHGS(typeOption, tripsOption, distanceOption, distanceBetweenStopsOption, 
    operatingSpeedOption, energyPerKMOption, occupancyOption, occupancyCalOption, percentGreenEnergyOption,
    energyRecoveryOption, dragFactorOption){
    let ghg = 0;
    
    let typeValue = typeMapping[typeOption];
    // console.log("typeValue: ", typeValue);
    // console.log("tripsOption: ", tripsOption);
    // console.log("distanceOption: ", distanceOption);
    // console.log("distanceBetweenStopsOption: ", distanceBetweenStopsOption);
    // console.log("operatingSpeedOption: ", operatingSpeedOption);
    // console.log("energyPerKMOption: ", energyPerKMOption);
    // console.log("occupancyOption: ", occupancyOption);
    // console.log("occupancyCalOption: ", occupancyCalOption);
    // console.log("percentGreenEnergyOption: ", percentGreenEnergyOption);
    // console.log("energyRecoveryOption: ", energyRecoveryOption);
    // console.log("dragFactorOption: ", dragFactorOption);

    let tempTransportObject = Object.create(typeValue);
    tempTransportObject.ptnotrips = tripsOption;
    tempTransportObject.pttrip = distanceOption;
    tempTransportObject.stopdist = distanceBetweenStopsOption;
    tempTransportObject.ptopspd = operatingSpeedOption;
    tempTransportObject.ptpassno = occupancyOption;
    tempTransportObject.ptghfact = percentGreenEnergyOption;
    tempTransportObject.ptenrec = energyRecoveryOption;
    tempTransportObject.ptaero = dragFactorOption;

    tempTransportObject.calculateGHCoEff();
    tempTransportObject.calculateLight();
    tempTransportObject.calculateHandC();
    tempTransportObject.calculateExtraPerson();
    tempTransportObject.calculateEnergyPerVehicle();
    tempPtmjvkm = tempTransportObject.get_ptmjvkm;
    tempTransportObject.set_ptmjvkm = (energyPerKMOption / 100 * tempPtmjvkm);
    tempTransportObject.calculateAnnualGHG();
    tempTransportObject.calculatePassGHG();
    tempTransportObject.calculateGHG();

    if(occupancyCalOption === "Absolute") {
        ghg = tempTransportObject.get_ptannghgs;
    }
    else{
        ghg = tempTransportObject.get_ptghgs;
    }

    
    return ghg;
}

// Listen for input changes input modal to update table row value
typeSelect.addEventListener('change', updateTableRowValues); 
tripsSelect.addEventListener('change', updateTableRowValues); 
distanceSelect.addEventListener('change', updateTableRowValues); 
distanceBetweenStopsSelect.addEventListener('change', updateTableRowValues); 
operatingSpeedSelect.addEventListener('change', updateTableRowValues); 
energyPerKMSelect.addEventListener('change', updateTableRowValues); 
occupancySelect.addEventListener('change', updateTableRowValues); 
occupancyCalSelect.addEventListener('change', updateTableRowValues); 
percentGreenEnergySelect.addEventListener('change', updateTableRowValues); 
energyRecoveryFactorSelect.addEventListener('change', updateTableRowValues); 
dragFactorSelect.addEventListener('change', updateTableRowValues); 

// Input event listener for user specific input
userSpecifyTripsInput.addEventListener('input', updateTableRowValues); 
userSpecifyDistanceInput.addEventListener('input', updateTableRowValues); 
userSpecifyDistanceBetweenStopsInput.addEventListener('input', updateTableRowValues); 
userSpecifyOperatingSpeedInput.addEventListener('input', updateTableRowValues); 
userSpecifyEnergyPerKMInput.addEventListener('input', updateTableRowValues); 
userSpecifyOccupancyInput.addEventListener('input', updateTableRowValues);
userSpecifyGreenEnergyInput.addEventListener('input', updateTableRowValues); 
userSpecifyEnergyRecoveryFactorInput.addEventListener('input', updateTableRowValues); 
userSpecifyDragFactorInput.addEventListener('input', updateTableRowValues);

function updateTableRowValues() {
    if (selectedRow) {
        const selectedCells = selectedRow.querySelectorAll('td');

        const updatedType = typeSelect.value;
        const updatedTrips = tripsSelect.value;
        const updatedDistance = distanceSelect.value;
        const updatedDistanceBetweenStops = distanceBetweenStopsSelect.value;
        const updatedOperatingSpeed = operatingSpeedSelect.value;
        const updatedEnergyPerKM = energyPerKMSelect.value;
        const updatedOccupancy = occupancySelect.value;
        const updatedOccupancyCal = occupancyCalSelect.value;
        const updatedPercentGreenEnergy = percentGreenEnergySelect.value;
        const updatedEnergyRecoveryFactor = energyRecoveryFactorSelect.value;
        const updatedDragFactor = dragFactorSelect.value;

        let typeValue = typeMapping[updatedType];

        let tripsValue = updatedTrips === 'user-specify-trips'
        ? (parseInt(userSpecifyTripsInput.value) || 0)
        : tripsMapping[updatedTrips];
        
        let distanceValue = updatedDistance === 'user-specify-distance'
        ? (parseInt(userSpecifyDistanceInput.value) || 0)
        : distanceMapping[updatedDistance];

        let distanceBetweenStopsValue;
        if (updatedDistanceBetweenStops === 'user-specify-distanceBetweenStops') {
            distanceBetweenStopsValue = parseInt(userSpecifyDistanceBetweenStopsInput.value) || 0;
        }
        else {
            distanceBetweenStopsValue = typeValue.get_stopdist;
        }

        let operatingSpeedValue;
        if (updatedOperatingSpeed === 'user-specify-operatingSpeed') {
            operatingSpeedValue = parseInt(userSpecifyOperatingSpeedInput.value) || 0;
        }
        else {
            operatingSpeedValue = typeValue.get_ptopspd;
        }

        let energyPerKMValue;
        
        if (updatedEnergyPerKM === 'user-specify-energyPerKM') {
            energyPerKMValue = (100 - parseInt(userSpecifyEnergyPerKMInput.value))|| 0;
        }
        else if (updatedEnergyPerKM === 'Normal') {
            energyPerKMValue = 100;
        }
        else {
            energyPerKMSelected = energyPerKMMapping[updatedEnergyPerKM];
            energyPerKMValue = 100 - energyPerKMSelected;
        }

        let occupancyValue;
        if (updatedOccupancy === 'user-specify-occupancy'){
            typeValue.set_ptpassno = parseInt(userSpecifyOccupancyInput.value) / 100 * typeValue.get_ptmaxocc;
            occupancyValue = typeValue.get_ptpassno || 0;
        }
        else {
            occupancySelected = occupancyMapping[updatedOccupancy];
            if (occupancySelected === 0) { //All seats occupied
                typeValue.set_ptpassno = typeValue.get_ptseats;
            }
            else if (occupancySelected === 1) { // Full
                typeValue.set_ptpassno = typeValue.get_ptmaxocc;
            }
            else if (occupancySelected === 2) { // Commuting
                typeValue.set_ptpassno = typeValue.get_ptpeakocc;
            }
            else if (occupancySelected === 3) { // Typical
                typeValue.set_ptpassno = typeValue.get_pttypocc;
            }
            else if (occupancySelected === 4) { // Low Occupancy
                typeValue.set_ptpassno = typeValue.get_ptlowocc;
            }
            occupancyValue = typeValue.get_ptpassno;
        }

        let percentGreenEnergyValue;
        if (updatedPercentGreenEnergy === 'user-specify-greenEnergy') {
            percentGreenEnergyValue = (100 - parseInt(userSpecifyGreenEnergyInput.value)) / 100 * typeValue.get_ptghfact;
        }
        else {
            percentGreenEnergyValue = typeValue.get_ptghfact;
        }

        let energyRecoveryValue;
        if (updatedEnergyRecoveryFactor === 'user-specify-energyRecoveryFactor') {
            energyRecoveryValue = parseFloat(userSpecifyEnergyRecoveryFactorInput.value);
        }
        else if (updatedEnergyRecoveryFactor === 'Normal') {
            energyRecoveryValue = typeValue.get_ptenrec;
        }
        else {
            energyRecoveryValue = energyRecoveryMapping[updatedEnergyRecoveryFactor];
        }
        
        let dragFactorValue = updatedDragFactor === 'user-specify-dragFactor'
        ? parseInt(userSpecifyDragFactorInput.value)
        : typeValue.get_ptaero;

        let tempTransportObject = Object.create(typeValue);
        tempTransportObject.ptnotrips = tripsValue;
        tempTransportObject.pttrip = distanceValue;
        tempTransportObject.stopdist = distanceBetweenStopsValue;
        tempTransportObject.ptopspd = operatingSpeedValue;
        tempTransportObject.ptpassno = occupancyValue;
        tempTransportObject.ptghfact = percentGreenEnergyValue;
        tempTransportObject.ptenrec = energyRecoveryValue;
        tempTransportObject.ptaero = dragFactorValue;

        tempTransportObject.calculateGHCoEff();
        tempTransportObject.calculateLight();
        tempTransportObject.calculateHandC();
        tempTransportObject.calculateEnergyPerVehicle();
        tempPtmjvkm = tempTransportObject.get_ptmjvkm;
        tempTransportObject.set_ptmjvkm = energyPerKMValue / 100 * tempPtmjvkm;
        tempTransportObject.calculateExtraPerson();
        tempTransportObject.calculateAnnualGHG();
        tempTransportObject.calculatePassGHG();

        const ghgs = calculateGHGS(updatedType,tripsValue,distanceValue,distanceBetweenStopsValue
            ,operatingSpeedValue,energyPerKMValue,occupancyValue,updatedOccupancyCal,
            percentGreenEnergyValue,energyRecoveryValue,dragFactorValue);
        // console.log(ghgs);
        
        selectedCells[0].textContent = ghgs.toFixed(2);
        selectedCells[2].textContent = tempTransportObject.get_ptanndist;
        selectedCells[3].textContent = updatedType;
        selectedCells[4].textContent = tripsValue;
        
        
        // Handle the user-specified values  in the table view
        if (updatedDistance === 'user-specify-distance') {
            selectedCells[5].textContent = distanceValue + ' km';
        } else {
            selectedCells[5].textContent = updatedDistance;
        }

        if (updatedOccupancy === 'user-specify-occupancy') {
            selectedCells[6].textContent = occupancyValue + ' %';
        } else {
            selectedCells[6].textContent = updatedOccupancy;
        }
        
    }
}

function updateTotalDetailedGHG() {
    const ghgCells = document.querySelectorAll('#publicTransportTable tbody td:first-child');
    let totalGHG = 0;

    ghgCells.forEach(cell => {
        totalGHG += parseFloat(cell.textContent)
    });

    // Update the global variable with the new value
    ghgPublicTransDetailedTotal = totalGHG;

    // Recalculate the total of both values whenever this function is called
    totalPublicTransportGHG();
}

// Call the updateTotalDetailedGHG function whenever the page loads or the table is updated
window.addEventListener('load', updateTotalDetailedGHG);
// Call the updateTotalDetailedGHG function after adding a new journey
addItemButton.addEventListener('click', updateTotalDetailedGHG);

// Call the updateTotalDetailedGHG function after updating a row
publicTransDetailsModal.addEventListener('click', updateTotalDetailedGHG);

// Call the updateTotalDetailedGHG function after changing any variable
typeSelect.addEventListener('change', updateTotalDetailedGHG); 
tripsSelect.addEventListener('change', updateTotalDetailedGHG); 
distanceSelect.addEventListener('change', updateTotalDetailedGHG); 
distanceBetweenStopsSelect.addEventListener('change', updateTotalDetailedGHG); 
operatingSpeedSelect.addEventListener('change', updateTotalDetailedGHG); 
energyPerKMSelect.addEventListener('change', updateTotalDetailedGHG); 
occupancySelect.addEventListener('change', updateTotalDetailedGHG); 
occupancyCalSelect.addEventListener('change', updateTotalDetailedGHG); 
percentGreenEnergySelect.addEventListener('change', updateTotalDetailedGHG); 
energyRecoveryFactorSelect.addEventListener('change', updateTotalDetailedGHG); 
dragFactorSelect.addEventListener('change', updateTotalDetailedGHG); 

userSpecifyTripsInput.addEventListener('input', updateTotalDetailedGHG); 
userSpecifyDistanceInput.addEventListener('input', updateTotalDetailedGHG); 
userSpecifyDistanceBetweenStopsInput.addEventListener('input', updateTotalDetailedGHG); 
userSpecifyOperatingSpeedInput.addEventListener('input', updateTotalDetailedGHG); 
userSpecifyEnergyPerKMInput.addEventListener('input', updateTotalDetailedGHG); 
userSpecifyOccupancyInput.addEventListener('input', updateTotalDetailedGHG);
userSpecifyGreenEnergyInput.addEventListener('input', updateTotalDetailedGHG); 
userSpecifyEnergyRecoveryFactorInput.addEventListener('input', updateTotalDetailedGHG); 
userSpecifyDragFactorInput.addEventListener('input', updateTotalDetailedGHG);

/*pUV
Console log error messages
*/

function validateInput(inputValue) {
    if (isNaN(inputValue) || inputValue < 0) {
      return false; // Return false for invalid input
    }
    return true; // Return true for valid input
  }

// userSpecifyTripsInput field
userSpecifyTripsInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyTripsInput.value);
    if (!validateInput(inputValue)) {
        console.error('Invalid input for number of trips: Please enter a valid or non-negative number.');
        userSpecifyTripsInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyDistanceInput field
userSpecifyDistanceInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyDistanceInput.value);
    if (!validateInput(inputValue)) {
        console.error('Invalid input for user-specified distance: Please enter a valid or non-negative number.');
        userSpecifyDistanceInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyDistanceBetweenStopsInput field
userSpecifyDistanceBetweenStopsInput.addEventListener('change', function() {
    const inputValue = parseInt(userSpecifyDistanceBetweenStopsInput.value);
    if (!validateInput(inputValue) || inputValue > 1000000 || inputValue < 100) {
        console.error('Invalid input for user-specified distance between stops: Please enter a valid or non-negative number.');
        userSpecifyDistanceBetweenStopsInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyOperatingSpeedInput field
userSpecifyOperatingSpeedInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyOperatingSpeedInput.value);
    if (!validateInput(inputValue)) {
        console.error('Invalid input for user-specified operating speed: Please enter a valid or non-negative number.');
        userSpecifyOperatingSpeedInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyEnergyPerKMInput field
userSpecifyEnergyPerKMInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyEnergyPerKMInput.value);
    if (!validateInput(inputValue) || inputValue > 100) {
        console.error('Invalid input for user-specified energy per km: Please enter a valid or non-negative number.');
        userSpecifyEnergyPerKMInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyOccupancyInput field
userSpecifyOccupancyInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyOccupancyInput.value);
    if (!validateInput(inputValue) || inputValue > 400) {
        console.error('Invalid input for user-specified occupancy: Please enter a valid or non-negative number.');
        userSpecifyOccupancyInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyGreenEnergyInput field
userSpecifyGreenEnergyInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyGreenEnergyInput.value);
    if (!validateInput(inputValue) || inputValue > 100) {
        console.error('Invalid input for user-specified green energy: Please enter a valid or non-negative number.');
        userSpecifyGreenEnergyInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyEnergyRecoveryFactorInput field
userSpecifyEnergyRecoveryFactorInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyEnergyRecoveryFactorInput.value);
    if (!validateInput(inputValue) || inputValue > 1) {
        console.error('Invalid input for user-specified energy recovery factor: Please enter a valid or non-negative number.');
        userSpecifyEnergyRecoveryFactorInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});

// userSpecifyDragFactorInput field
userSpecifyDragFactorInput.addEventListener('input', function() {
    const inputValue = parseInt(userSpecifyDragFactorInput.value);
    if (!validateInput(inputValue) || inputValue > 50) {
        console.error('Invalid input for user-specified energy recovery factor: Please enter a valid or non-negative number.');
        userSpecifyDragFactorInput.value = '';
    } 
    else {
        updateTableRowValues();
    }
});