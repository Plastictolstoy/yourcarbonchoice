/// Quick tab calculations
const lightEmissionFactors = {
    "none": 0,
    "some": 0.5,
    "many": 1.5
};

const incandescentEmissionFactor = 0.06;
const cflEmissionFactor = 0.02;
const halogenEmissionFactor = 0.06;
const fluorescentEmissionFactor = 0.04;

function calculateQuickEmissions() {
    const incandescentCount = document.getElementById('incandescent-count').value;
    const incandescentHours = parseFloat(document.getElementById('incandescent-hours').value);
    const cflCount = document.getElementById('cfl-count').value;
    const cflHours = parseFloat(document.getElementById('cfl-hours').value);
    const halogenCount = document.getElementById('halogen-count').value;
    const halogenHours = parseFloat(document.getElementById('halogen-hours').value);
    const fluorescentCount = document.getElementById('fluorescent-count').value;
    const fluorescentHours = parseFloat(document.getElementById('fluorescent-hours').value);

    let totalEmissions = 0;
    totalEmissions += lightEmissionFactors[incandescentCount] * incandescentHours * incandescentEmissionFactor;
    totalEmissions += lightEmissionFactors[cflCount] * cflHours * cflEmissionFactor;
    totalEmissions += lightEmissionFactors[halogenCount] * halogenHours * halogenEmissionFactor;
    totalEmissions += lightEmissionFactors[fluorescentCount] * fluorescentHours * fluorescentEmissionFactor;

    document.getElementById('total-emissions').innerText = totalEmissions.toFixed(2);
    updateghg1bar(); // Update the green bar based on the total emissions value
}

/// Detailed tab calculations
const detailedEmissionFactors = {
    "ordinary-incandescent": 0.06,
    "low-voltage-halogen": 0.06,
    "compact-fluorescent-downlight": 0.02,
    "led-halogen-replacement": 0.01,
    "compact-fluorescent-lamp": 0.02,
    "linear-or-circular-fluorescent-lamp": 0.04,
    "flood-light": 0.12,
    "other": 0.05
};

let lightCount = 1;

function addLight() {
    const tableBody = document.getElementById('lighting-table-body');
    const id = `L${lightCount++}`;
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><button onclick="removeLight('${id}')">X</button></td>
        <td id="${id}-ghgs" class="ghg-cell">0.00 kg CO2-eq/year</td>
        <td onclick="toggleInput('${id}-id')" id="${id}-id-td"><span>${id}</span><input type="text" id="${id}-id" value="${id}" class="hidden-input"></td>
        <td onclick="toggleInput('${id}-type')" id="${id}-type-td"><span>Ordinary (incandescent)</span><select id="${id}-type" class="hidden-input">
            <option value="ordinary-incandescent">Ordinary (incandescent)</option>
            <option value="low-voltage-halogen">Low voltage halogen</option>
            <option value="compact-fluorescent-downlight">Compact fluorescent downlight</option>
            <option value="led-halogen-replacement">LED (halogen replacement)</option>
            <option value="compact-fluorescent-lamp">Compact fluorescent lamp</option>
            <option value="linear-or-circular-fluorescent-lamp">Linear or circular fluorescent lamp</option>
            <option value="flood-light">Flood light</option>
            <option value="other">Other</option>
        </select></td>
        <td onclick="toggleInput('${id}-watts')" id="${id}-watts-td"><span>0</span><input type="number" id="${id}-watts" class="hidden-input" min="0" value="0"></td>
        <td onclick="toggleInput('${id}-number')" id="${id}-number-td"><span>0</span><input type="number" id="${id}-number" class="hidden-input" min="0" value="0"></td>
        <td onclick="toggleInput('${id}-summer')" id="${id}-summer-td"><span>0</span><input type="number" id="${id}-summer" class="hidden-input" min="0" value="0"></td>
        <td onclick="toggleInput('${id}-winter')" id="${id}-winter-td"><span>0</span><input type="number" id="${id}-winter" class="hidden-input" min="0" value="0"></td>
        <td onclick="toggleInput('${id}-dimming')" id="${id}-dimming-td"><span>0</span><input type="number" id="${id}-dimming" class="hidden-input" min="0" max="100" value="0"></td>
    `;

    tableBody.appendChild(row);

    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => calculateDetailedEmissions(id));
    });
}

function removeLight(id) {
    const row = document.querySelector(`#${id}-ghgs`).closest('tr');
    row.remove();
    updateTotalDetailedEmissions();
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
        calculateDetailedEmissions(id.split('-')[0]);
    });
}

function calculateDetailedEmissions(id) {
    const type = document.getElementById(`${id}-type`).value;
    const watts = parseFloat(document.getElementById(`${id}-watts`).value);
    const number = parseFloat(document.getElementById(`${id}-number`).value);
    const summerHours = parseFloat(document.getElementById(`${id}-summer`).value);
    const winterHours = parseFloat(document.getElementById(`${id}-winter`).value);
    const dimming = parseFloat(document.getElementById(`${id}-dimming`).value) / 100;

    const emissionFactor = detailedEmissionFactors[type] || 0;

    const Slamphrs = summerHours * 120;
    const Wlamphrs = winterHours * 245;
    const DimlampFactor = (0.86 * dimming + 0.16);

    const totalEmissions = number * watts / 1000 * DimlampFactor * (Slamphrs + Wlamphrs) * emissionFactor * 3.6;

    document.getElementById(`${id}-ghgs`).innerText = totalEmissions.toFixed(2) + " kg CO2-eq/year";
    updateTotalDetailedEmissions();
}

function updateTotalDetailedEmissions() {
    const ghgCells = document.querySelectorAll('#lighting-table-body td.ghg-cell');
    let totalGHG = 0;

    ghgCells.forEach(cell => {
        totalGHG += parseFloat(cell.textContent);
    });

    document.getElementById('total-emissions').innerText = totalGHG.toFixed(2);
    updateghg1bar(); // Update the green bar based on the total emissions value
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByClassName('tablinks')[0].click();
    addLight(); // Add initial light row for detailed tab

    document.getElementById('incandescent-count').addEventListener('change', calculateQuickEmissions);
    document.getElementById('incandescent-hours').addEventListener('change', calculateQuickEmissions);
    document.getElementById('cfl-count').addEventListener('change', calculateQuickEmissions);
    document.getElementById('cfl-hours').addEventListener('change', calculateQuickEmissions);
    document.getElementById('halogen-count').addEventListener('change', calculateQuickEmissions);
    document.getElementById('halogen-hours').addEventListener('change', calculateQuickEmissions);
    document.getElementById('fluorescent-count').addEventListener('change', calculateQuickEmissions);
    document.getElementById('fluorescent-hours').addEventListener('change', calculateQuickEmissions);
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

// Function to update the green bar based on the totalEmissions value
function updateghg1bar() {
    const ghg1bar = document.getElementById("ghg1bar");
    const bartooltip = document.getElementById("bartooltip");
    const totalEmissions = parseFloat(document.getElementById('total-emissions').innerText);

    if (!isNaN(totalEmissions)) {
        const percentage = (totalEmissions / 10) * 100;
        const limitedPercentage = Math.min(percentage, 100);

        ghg1bar.style.width = limitedPercentage + "%"; // Update the width of the green bar
        bartooltip.textContent = totalEmissions.toFixed(2) + " kg CO2-eq/year"; // Update the bartooltip content with the actual value
    }
}
