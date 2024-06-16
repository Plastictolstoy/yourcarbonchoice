// Common emission factors
const emissionFactors = {
    "none": 0,
    "electric-timer": 0.28,
    "electric-auto": 0.28,
    "electric-condenser": 0.28,
    "electric-heat-pump": 0.28,
    "gas-dryer": 0.058,
    "hot-water-sourced": 0.066
};

// Quick calculation
const usageFactors = {
    "never": 0,
    "low": 2,
    "high": 5
};

function calculateQuickEmissions() {
    const dryerType = document.getElementById('dryer-type').value;
    const winterUsage = document.getElementById('winter-usage').value;
    const summerUsage = document.getElementById('summer-usage').value;

    let emissionFactor = emissionFactors[dryerType] || 0;
    let winterUsageFactor = usageFactors[winterUsage] || 0;
    let summerUsageFactor = usageFactors[summerUsage] || 0;

    // Calculate total usage per year (52 weeks)
    let totalUsagePerYear = (winterUsageFactor * 13 + summerUsageFactor * 13); // Simplified average usage for winter and summer
    let totalEmissions = totalUsagePerYear * emissionFactor * 3.6; // Adjusting the calculation to match MJ

    // Update total emissions display
    document.getElementById('total-emissions').innerText = totalEmissions.toFixed(3);

    updateghg1bar(totalEmissions); // Update the GHG bar with the calculated emissions
}

// Detail calculation
let dryerCount = 1;

function addClothesDryer() {
    const tableBody = document.getElementById('dryer-table-body');
    const id = `CD${dryerCount++}`;
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><button onclick="removeRow('${id}')">X</button></td>
        <td id="${id}-ghgs" class="ghg-cell">0.00 kg CO2-eq/year</td>
        <td onclick="toggleInput('${id}-id')" id="${id}-id-td"><span>${id}</span><input type="text" id="${id}-id" value="${id}" class="hidden-input"></td>
        <td onclick="toggleInput('${id}-type')" id="${id}-type-td"><span>None</span><select id="${id}-type" class="hidden-input">
            <option value="none">None</option>
            <option value="electric-timer">Electric (timer)</option>
            <option value="electric-auto">Electric (auto timer)</option>
            <option value="electric-condenser">Electric (condenser)</option>
            <option value="electric-heat-pump">Electric heat pump</option>
            <option value="gas-dryer">Gas dryer</option>
            <option value="hot-water-sourced">Hot water sourced</option>
        </select></td>
        <td onclick="toggleInput('${id}-capacity')" id="${id}-capacity-td"><span>0</span><input type="number" id="${id}-capacity" class="hidden-input" min="0" max="10" value="0">        </td>
        <td onclick="toggleInput('${id}-loading')" id="${id}-loading-td"><span>0</span><input type="number" id="${id}-loading" class="hidden-input" min="0" max="100" value="0"></td>
        <td onclick="toggleInput('${id}-age')" id="${id}-age-td"><span>Pre 2000 star rating</span><select id="${id}-age" class="hidden-input">
            <option value="pre-2000">Pre 2000 star rating</option>
            <option value="new-star">New star rating</option>
        </select></td>
        <td onclick="toggleInput('${id}-rating')" id="${id}-rating-td"><span>Don't know</span><select id="${id}-rating" class="hidden-input">
            <option value="dont-know">Don't know</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4 (best late '90s)</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="user-specify">User specify:</option>
        </select></td>
        <td onclick="toggleInput('${id}-wetness')" id="${id}-wetness-td"><span>Clothes from washing machine</span><select id="${id}-wetness" class="hidden-input">
            <option value="from-washing-machine">Clothes from washing machine</option>
            <option value="very-wet">Clothes very wet</option>
            <option value="low-speed-spin">Low speed spin</option>
            <option value="moderate-high-speed-spin">Moderate-high speed spin</option>
            <option value="very-high-speed-spin">Very high speed spin</option>
            <option value="partly-air-dried">Partly air-dried clothes</option>
            <option value="user-specify">User specify:</option>
        </select></td>
        <td onclick="toggleInput('${id}-program')" id="${id}-program-td"><span>High heat (default)</span><select id="${id}-program" class="hidden-input">
            <option value="high-heat">High heat (default)</option>
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
        </select></td>
        <td onclick="toggleInput('${id}-summer')" id="${id}-summer-td"><span>0</span><input type="number" id="${id}-summer" class="hidden-input" min="0" max="15" value="0"></td>
        <td onclick="toggleInput('${id}-winter')" id="${id}-winter-td"><span>0</span><input type="number" id="${id}-winter" class="hidden-input" min="0" max="15" value="0"></td>
        <td onclick="toggleInput('${id}-location')" id="${id}-location-td"><span>In this home</span><select id="${id}-location" class="hidden-input">
            <option value="in-this-home">In this home</option>
            <option value="in-another-home">In another home</option>
            <option value="in-communal-laundry">In communal laundry</option>
            <option value="in-laundromat">In laundromat</option>
        </select></td>
        <td onclick="toggleInput('${id}-green')" id="${id}-green-td"><span>0</span><input type="number" id="${id}-green" class="hidden-input" min="0" max="100" value="0"></td>
    `;

    tableBody.appendChild(row);

    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => calculateDetailEmissions(id));
    });
}

function removeRow(id) {
    const row = document.querySelector(`#${id}-ghgs`).closest('tr');
    if (row) {
        row.remove();
    }
    updateTotalEmissions();
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
        calculateDetailEmissions(id.split('-')[0]);
    });
}

function calculateDetailEmissions(id) {
    const type = document.getElementById(`${id}-type`).value;
    const capacity = parseFloat(document.getElementById(`${id}-capacity`).value);
    const loading = parseFloat(document.getElementById(`${id}-loading`).value);
    const summerUsage = parseFloat(document.getElementById(`${id}-summer`).value);
    const winterUsage = parseFloat(document.getElementById(`${id}-winter`).value);
    const age = document.getElementById(`${id}-age`).value;
    const rating = parseFloat(document.getElementById(`${id}-rating`).value);
    const wetness = document.getElementById(`${id}-wetness`).value;
    const program = document.getElementById(`${id}-program`).value;
    const green = parseFloat(document.getElementById(`${id}-green`).value);

    // Standard Energy Consumption of the Dryer (Cdef)
    let Cdef;
    if (age === "pre-2000") {
        Cdef = ((12 - rating) * 0.89 / 8) * capacity;
    } else {
        Cdef = capacity * 53 * Math.exp(((rating - 1) * Math.log(1 - 0.15)) / 52);
    }

    // Loading Factor (CDL)
    const CDL = 0.0087 * loading + 0.13;

    // Program or Setting (CDP)
    const CDP = program === "high-heat" ? 1.0 : program === "warm" ? 0.9 : 0.85;

    // Wetness of Clothes (Cddry)
    const Cddry = wetness === "from-washing-machine" ? 1.0297 :
        wetness === "very-wet" ? 2.0 :
            wetness === "low-speed-spin" ? 1.0 :
                wetness === "moderate-high-speed-spin" ? 0.7 :
                    wetness === "very-high-speed-spin" ? 0.5 : 0.3;

    // Summer and Winter Usage (SU, WU)
    const SU = summerUsage * 17;
    const WU = winterUsage * 35;

    // Greenhouse Gas Emission Factor (Ghelect)
    const Ghelect = emissionFactors[type] || 0;
    const CDF = 1.0;

    // Annual Greenhouse Gas Emissions (Cdghg)
    const Cdghg = (WU + SU) * 3.6 * Cdef * CDL * Cddry * CDP * Ghelect * CDF;

    document.getElementById(`${id}-ghgs`).innerText = Cdghg.toFixed(2) + " kg CO2-eq/year";
    updateTotalEmissions(); // Update the total emissions after each detailed calculation
    updateghg1bar(); // Update the GHG bar with the calculated emissions
}

function updateTotalEmissions() {
    const ghgCells = document.querySelectorAll('#dryer-table-body td.ghg-cell');
    let totalGHG = 0;

    ghgCells.forEach(cell => {
        totalGHG += parseFloat(cell.textContent) || 0;
    });

    document.getElementById('total-emissions').innerText = totalGHG.toFixed(2);
}

// Tab switching function
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
function updateClothesDryerEmissions() {
    // Calculate clothes dryer emissions (example calculation, replace with actual logic)
    var emissions = calculateClothesDryerEmissions(); // You need to define or replace this function
    GlobalEmissionsData.clothesDryer = emissions; // Update the global data store
    updateMainChart(); // Refresh the chart with updated data
}

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for quick tab
    document.getElementById('dryer-type').addEventListener('change', calculateQuickEmissions);
    document.getElementById('winter-usage').addEventListener('change', calculateQuickEmissions);
    document.getElementById('summer-usage').addEventListener('change', calculateQuickEmissions);

    // Initial tab setup
    document.getElementsByClassName('tablinks')[0].click();

    addClothesDryer(); // Add initial dryer row for detailed tab
});
