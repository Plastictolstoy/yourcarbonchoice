// Quick View GHG Calculation Constants
const quickViewFactors = {
    typicalDomestic: {
        fa: 1,
        occ: 0.773,
        dist: 708,
        ltoDist: 30,
        cruisegh: 100,
        ltoN: 1,
        ltogh: 21,
        seatType: 1,
        lvar: 0
    },
    sydneyPerth: {
        fa: 1,
        occ: 0.773,
        dist: 3290,
        ltoDist: 30,
        cruisegh: 100,
        ltoN: 1,
        ltogh: 21,
        seatType: 1,
        lvar: 0
    },
    typicalAusAsia: {
        fa: 1,
        occ: 0.773,
        dist: 7825,
        ltoDist: 30,
        cruisegh: 100,
        ltoN: 1,
        ltogh: 21,
        seatType: 1,
        lvar: 0
    },
    typicalAusUsaEurope: {
        fa: 1,
        occ: 0.773,
        dist: 15184,
        ltoDist: 30,
        cruisegh: 100,
        ltoN: 1,
        ltogh: 21,
        seatType: 1,
        lvar: 0
    }
};

// Event listeners for Quick View dropdowns
document.getElementById("typicalDomestic").addEventListener("change", calculateQuickGHG);
document.getElementById("sydneyPerth").addEventListener("change", calculateQuickGHG);
document.getElementById("typicalAusAsia").addEventListener("change", calculateQuickGHG);
document.getElementById("typicalAusUsaEurope").addEventListener("change", calculateQuickGHG);

// Function to calculate GHG for Quick View
function calculateQuickGHG() {
    const typicalDomesticTrips = parseInt(document.getElementById("typicalDomestic").value);
    const sydneyPerthTrips = parseInt(document.getElementById("sydneyPerth").value);
    const typicalAusAsiaTrips = parseInt(document.getElementById("typicalAusAsia").value);
    const typicalAusUsaEuropeTrips = parseInt(document.getElementById("typicalAusUsaEurope").value);

    const typicalDomesticGHG = calculateFlightGHG(typicalDomesticTrips, quickViewFactors.typicalDomestic);
    const sydneyPerthGHG = calculateFlightGHG(sydneyPerthTrips, quickViewFactors.sydneyPerth);
    const typicalAusAsiaGHG = calculateFlightGHG(typicalAusAsiaTrips, quickViewFactors.typicalAusAsia);
    const typicalAusUsaEuropeGHG = calculateFlightGHG(typicalAusUsaEuropeTrips, quickViewFactors.typicalAusUsaEurope);

    const totalQuickGHG = typicalDomesticGHG + sydneyPerthGHG + typicalAusAsiaGHG + typicalAusUsaEuropeGHG;

    document.getElementById('total-emissions').innerText = totalQuickGHG.toFixed(2);

    // Check if the emission-gauge element exists before setting its value
    const emissionGauge = document.getElementById('emission-gauge');
    if (emissionGauge) {
        emissionGauge.value = totalQuickGHG;
    }

    updateghg1bar(); // Update the green bar based on the total emissions value
}

// Function to calculate GHG for a single flight
function calculateFlightGHG(trips, factors) {
    return trips * ((factors.dist - factors.ltoDist) * factors.fa * factors.cruisegh / 1000 + factors.ltoN * factors.ltogh) * (1 - factors.lvar / 100) / factors.occ * factors.seatType;
}

// Detailed View GHG Calculation
let flightCount = 1;

// Function to add a new flight row in Detailed View
function addFlight() {
    const tableBody = document.getElementById('flight-table-body');
    const id = `F${flightCount++}`;
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><button onclick="removeFlight('${id}')">X</button></td>
        <td id="${id}-ghgs" class="ghg-cell">0.00 kg CO2-eq</td>
        <td onclick="toggleInput('${id}-id')" id="${id}-id-td"><span>${id}</span><input type="text" id="${id}-id" value="${id}" class="hidden-input"></td>
        <td onclick="toggleInput('${id}-trips')" id="${id}-trips-td"><span>0</span><input type="number" id="${id}-trips" class="hidden-input" min="0" value="0"></td>
        <td onclick="toggleInput('${id}-distance')" id="${id}-distance-td"><span>Australia domestic flight</span><select id="${id}-distance" class="hidden-input">
            <option value="Australia domestic flight">Australia domestic flight</option>
            <option value="Approx Melbourne-Sydney, Sydney-Brisbane or Melbourne-Adelaide flight">Approx Melbourne-Sydney, Sydney-Brisbane or Melbourne-Adelaide flight</option>
            <option value="Approx Sydney-Perth flight">Approx Sydney-Perth flight</option>
            <option value="Typical flight Aust to Asia">Typical flight Aust to Asia</option>
            <option value="Typical flight Aust to US or Europe">Typical flight Aust to US or Europe</option>
            <option value="User Specify international flight">User Specify international flight</option>
        </select></td>
        <td onclick="toggleInput('${id}-seatType')" id="${id}-seatType-td"><span>Economy</span><select id="${id}-seatType" class="hidden-input">
            <option value="Economy">Economy</option>
            <option value="Premium economy (domestic)">Premium economy (domestic)</option>
            <option value="Premium economy (international)">Premium economy (international)</option>
            <option value="Business (domestic)">Business (domestic)</option>
            <option value="Business (international - sleeper)">Business (international - sleeper)</option>
            <option value="First class (international - sleeper)">First class (international - sleeper)</option>
            <option value="user-specify-seatType">User Specify area occupied relative to economy</option>
        </select></td>
        <td onclick="toggleInput('${id}-airCraft')" id="${id}-airCraft-td"><span>Typical domestic passenger jet</span><select id="${id}-airCraft" class="hidden-input">
            <option value="Typical domestic passenger jet">Typical domestic passenger jet</option>
            <option value="Typical international passenger">Typical international passenger</option>
            <option value="new fuel-effcient aircraft">new fuel-effcient aircraft</option>
            <option value="typical propellor-driven passenger plane">typical propellor-driven passenger plane</option>
            <option value="user-specify-airCraft">User Specify Aircraft</option>
        </select></td>
        <td onclick="toggleInput('${id}-lTOgh')" id="${id}-lTOgh-td"><span>LTOgh Typical domestic passenger jet</span><select id="${id}-lTOgh" class="hidden-input">
            <option value="LTOgh Typical domestic passenger jet">LTOgh Typical domestic passenger jet</option>
            <option value="LTOgh Typical international passenger">LTOgh Typical international passenger</option>
            <option value="LTOgh new fuel-effcient aircraft">LTOgh new fuel-effcient aircraft</option>
            <option value="LTOgh typical propellor-driven passenger plane">LTOgh typical propellor-driven passenger plane</option>
            <option value="user-specify-LTOgh">User Specify landing take off</option>
        </select></td>
        <td onclick="toggleInput('${id}-stopOver')" id="${id}-stopOver-td"><span>stop Over None</span><select id="${id}-stopOver" class="hidden-input">
            <option value="stop Over None">stop Over None</option>
            <option value="stop Over 1">stop Over 1</option>
            <option value="stop Over 2">stop Over 2</option>
            <option value="stop Over 3">stop Over 3</option>
            <option value="user-specify-StopOver">User specify stop over</option>
        </select></td>
        <td onclick="toggleInput('${id}-warmingFactor')" id="${id}-warmingFactor-td"><span>combustion only</span><select id="${id}-warmingFactor" class="hidden-input">
            <option value="combustion only">combustion only</option>
            <option value="full cycle emissions">full cycle emissions</option>
            <option value="combustion+indirect impacts of soot">combustion+indirect impacts of soot</option>
            <option value="low end impact of combustion">low end impact of combustion</option>
            <option value="high end impact of combustion">high end impact of combustion</option>
            <option value="user-specify-WarmingFactor">User specify warming factor</option>
        </select></td>
        <td onclick="toggleInput('${id}-occupancy')" id="${id}-occupancy-td"><span>Average Australian domestic occupancy</span><select id="${id}-occupancy" class="hidden-input">
            <option value="Average Australian domestic occupancy">Average Australian domestic occupancy</option>
            <option value="Average international flight occupancy">Average international flight occupancy</option>
            <option value="user-specify-Occupancy">user specify (fraction of full occupancy)</option>
        </select></td>
        <td onclick="toggleInput('${id}-lTODist')" id="${id}-lTODist-td"><span>default loading factor</span><select id="${id}-lTODist" class="hidden-input">
            <option value="default loading factor">default loading factor</option>
            <option value="user-specify-LTODist">user specify LTO distance</option>
        </select></td>
        <td onclick="toggleInput('${id}-loadingFactor')" id="${id}-loadingFactor-td"><span>default loading factor</span><select id="${id}-loadingFactor" class="hidden-input">
            <option value="default loading factor">default loading factor</option>
            <option value="user-specify-LoadingFactor">user specify loading factor</option>
        </select></td>
    `;

    tableBody.appendChild(row);

    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => calculateDetailedGHG(id));
    });
}

function removeFlight(id) {
    const row = document.querySelector(`#${id}-ghgs`).closest('tr');
    row.remove();
    updateTotalDetailedGHG();
}

function toggleInput(id) {
    const span = document.querySelector(`#${id}-td span`);
    const input = document.getElementById(id);
    document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    document.querySelector(`#${id}-td`).classList.add('active');

    if (input.classList.contains('hidden-input')) {
        input.classList.remove('hidden-input');
        span.style.display = 'none';
        input.style.display = 'block';
        input.focus();
    }

    input.addEventListener('blur', () => {
        input.classList.add('hidden-input');
        span.style.display = 'block';
        input.style.display = 'none';
        span.innerText = input.value;
        calculateDetailedGHG(id.split('-')[0]);
    });
}

// Function to calculate GHG for a single row in Detailed View
function calculateDetailedGHG(id) {
    const trips = parseInt(document.getElementById(`${id}-trips`).value);
    const distanceOption = document.getElementById(`${id}-distance`).value;
    const seatTypeOption = document.getElementById(`${id}-seatType`).value;
    const airCraftOption = document.getElementById(`${id}-airCraft`).value;
    const lTOghOption = document.getElementById(`${id}-lTOgh`).value;
    const stopOverOption = document.getElementById(`${id}-stopOver`).value;
    const warmingFactorOption = document.getElementById(`${id}-warmingFactor`).value;
    const occupancyOption = document.getElementById(`${id}-occupancy`).value;
    const lTODistOption = document.getElementById(`${id}-lTODist`).value;
    const loadingFactorOption = document.getElementById(`${id}-loadingFactor`).value;

    let distanceValue;
    let seatTypeValue;
    let airCraftTypeValue;
    let lTOghTypeValue;
    let lTOValue;
    let warmingFactorValue;
    let occupancyValue;
    let lTODistValue;
    let loadingFactorValue;

    if (distanceOption === 'User Specify international flight') {
        distanceValue = parseInt(document.getElementById(`${id}-distance`).value) || 0;
    } else {
        distanceValue = distanceMapping[distanceOption] || parseInt(distanceOption) || 0;
    }

    if (seatTypeOption === 'user-specify-seatType') {
        seatTypeValue = parseFloat(document.getElementById(`${id}-seatType`).value) || 0;
    } else {
        seatTypeValue = seatTypeMapping[seatTypeOption] || parseFloat(seatTypeOption) || 0;
    }

    if (airCraftOption === 'user-specify-airCraft') {
        airCraftTypeValue = parseInt(document.getElementById(`${id}-airCraft`).value) || 0;
    } else {
        airCraftTypeValue = airCraftMapping[airCraftOption] || parseInt(airCraftOption) || 0;
    }

    if (lTOghOption === 'user-specify-LTOgh') {
        lTOghTypeValue = parseInt(document.getElementById(`${id}-lTOgh`).value) || 0;
    } else {
        lTOghTypeValue = lTOghMapping[lTOghOption] || parseInt(lTOghOption) || 0;
    }

    if (stopOverOption === 'user-specify-StopOver') {
        lTOValue = parseInt(document.getElementById(`${id}-stopOver`).value) || 0;
    } else {
        lTOValue = lTOMapping[stopOverOption] || parseInt(stopOverOption) || 0;
    }

    if (warmingFactorOption === 'user-specify-WarmingFactor') {
        warmingFactorValue = parseFloat(document.getElementById(`${id}-warmingFactor`).value) || 0;
    } else {
        warmingFactorValue = warmingFactorMapping[warmingFactorOption] || parseFloat(warmingFactorOption) || 0;
    }

    if (occupancyOption === 'user-specify-Occupancy') {
        occupancyValue = parseFloat(document.getElementById(`${id}-occupancy`).value) || 0;
    } else {
        occupancyValue = occupancyMapping[occupancyOption] || parseFloat(occupancyOption) || 0;
    }

    if (lTODistOption === 'user-specify-LTODist') {
        lTODistValue = parseInt(document.getElementById(`${id}-lTODist`).value) || 0;
    } else {
        lTODistValue = lTODistMapping[lTODistOption] || parseInt(lTODistOption) || 0;
    }

    if (loadingFactorOption === 'user-specify-LoadingFactor') {
        loadingFactorValue = parseInt(document.getElementById(`${id}-loadingFactor`).value) || 0;
    } else {
        loadingFactorValue = LoadingFactorMapping[loadingFactorOption] || parseInt(loadingFactorOption) || 0;
    }

    const ghg = calculateFlightGHG(trips, {
        dist: distanceValue,
        fa: warmingFactorValue,
        occ: occupancyValue,
        ltoDist: lTODistValue,
        cruisegh: airCraftTypeValue,
        ltoN: lTOValue,
        ltogh: lTOghTypeValue,
        seatType: seatTypeValue,
        lvar: loadingFactorValue
    });

    document.getElementById(`${id}-ghgs`).innerText = ghg.toFixed(2) + " kg CO2-eq";
    updateTotalDetailedGHG();
}

// Function to calculate and update the total GHG for Detailed View
function updateTotalDetailedGHG() {
    const ghgCells = document.querySelectorAll('#flight-table-body td.ghg-cell');
    let totalGHG = 0;

    ghgCells.forEach(cell => {
        totalGHG += parseFloat(cell.textContent);
    });

    // Update the global variable with the new value
    ghgAirDetailedTotal = totalGHG;

    // Log to the console
    console.log('Total Detailed AirTravel GHG:', ghgAirDetailedTotal.toFixed(2));

    // Recalculate the total of both values whenever this function is called
    totalAirTravelGHG();
}

// Function to calculate and update the total GHG
function totalAirTravelGHG() {
    const totalGHG = ghgAirQuickTotal + ghgAirDetailedTotal;
    console.log('Total Air Travel GHG:', totalGHG.toFixed(2));
    document.getElementById('total-emissions').innerText = totalGHG.toFixed(2);

    // Check if the emission-gauge element exists before setting its value
    const emissionGauge = document.getElementById('emission-gauge');
    if (emissionGauge) {
        emissionGauge.value = totalGHG;
    }

    updateghg1bar(); // Update the green bar based on the total emissions value
}

// Function to update the green bar based on the totalAirGHG value
function updateghg1bar() {
    const ghg1bar = document.getElementById("ghg1bar");
    const bartooltip = document.getElementById("bartooltip");
    const totalEmissions = parseFloat(document.getElementById('total-emissions').innerText);

    if (!isNaN(totalEmissions)) {
        const percentage = (totalEmissions / 10000) * 100;
        const limitedPercentage = Math.min(percentage, 100);

        ghg1bar.style.width = limitedPercentage + "%"; // Update the width of the green bar
        bartooltip.textContent = totalEmissions.toFixed(2) + " kg CO2-eq/year"; // Update the bartooltip content with the actual value
    }
}

// Event listener for DOMContentLoaded to initialize the first tab and add event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByClassName('tablinks')[0].click();
    addFlight(); // Add initial flight row for detailed tab

    document.getElementById('typicalDomestic').addEventListener('change', calculateQuickGHG);
    document.getElementById('sydneyPerth').addEventListener('change', calculateQuickGHG);
    document.getElementById('typicalAusAsia').addEventListener('change', calculateQuickGHG);
    document.getElementById('typicalAusUsaEurope').addEventListener('change', calculateQuickGHG);
});

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablinks");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Mappings for dropdown values to actual values
const distanceMapping = {
    'Australia domestic flight': 700,
    'Approx Melbourne-Sydney, Sydney-Brisbane or Melbourne-Adelaide flight': 708,
    'Approx Sydney-Perth flight': 3290,
    'Typical flight Aust to Asia': 7825,
    'Typical flight Aust to US or Europe': 15184
};

const seatTypeMapping = {
    'Economy': 1,
    'Premium economy (domestic)': 1,
    'Premium economy (international)': 1.6,
    'Business (domestic)': 2.2,
    'Business (international - sleeper)': 3.3,
    'First class (international - sleeper)': 4.8
};

const airCraftMapping = {
    'Typical domestic passenger jet': 100,
    'Typical international passenger': 120,
    'new fuel-effcient aircraft': 80,
    'typical propellor-driven passenger plane': 145,
};

const lTOghMapping = {
    'LTOgh Typical domestic passenger jet': 21,
    'LTOgh Typical international passenger': 29,
    'LTOgh new fuel-effcient aircraft': 20,
    'LTOgh typical propellor-driven passenger plane': 40,
};

const lTOMapping = {
    'stop Over None': 0,
    'stop Over 1': 1,
    'stop Over 2': 2,
    'stop Over 3': 3,
};

const warmingFactorMapping = {
    'combustion only': 1,
    'full cycle emissions': 1.08,
    'combustion+indirect impacts of soot': 1.9,
    'low end impact of combustion': 3.3,
    'high end impact of combustion': 5.5,
};

const occupancyMapping = {
    'Average Australian domestic occupancy': 0.79,
    'Average international flight occupancy': 0.77,
};

const lTODistMapping = {
    'default loading factor': 30,
};

const LoadingFactorMapping = {
    'default loading factor': 20,
};

// Global variables to store GHG totals
let ghgAirQuickTotal = 0;
let ghgAirDetailedTotal = 0;

// Event listeners for input elements
document.querySelectorAll('#flight-table-body input, #flight-table-body select').forEach(input => {
    input.addEventListener('change', function () {
        const rowId = this.closest('tr').querySelector('td:nth-child(3)').innerText;
        calculateDetailedGHG(rowId);
    });
});
