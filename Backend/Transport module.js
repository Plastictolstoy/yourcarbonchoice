document.addEventListener("DOMContentLoaded", function () {
    const current_year = new Date().getFullYear();

    // Fuel emission factors
    const fuelEmissionFactors = {
        petrol: { energyDensity: 34.2, emissionFactor: 0.072 }, // MJ/L, kg CO2e/MJ
        diesel: { energyDensity: 38.6, emissionFactor: 0.075 },
        lpg: { energyDensity: 26.2, emissionFactor: 0.060 },
        cng: { energyDensity: 48.1, emissionFactor: 0.056 },
        electric: { energyDensity: 3.6, emissionFactor: 0.1 } // MJ/kWh, example value
    };

    // Car data
    const carData = {
        "light-car": { fuelcfin: 8.0, veff: 0.21, vmass: 916 },
        "small-car": { fuelcfin: 8.5, veff: 0.20, vmass: 1028 },
        "medium-car": { fuelcfin: 9.0, veff: 0.20, vmass: 1248 },
        "large-car": { fuelcfin: 10.0, veff: 0.18, vmass: 1393 },
        "very-large-car": { fuelcfin: 11.0, veff: 0.18, vmass: 1527 },
        "people-mover": { fuelcfin: 10.5, veff: 0.21, vmass: 1388 },
        "small-4wd": { fuelcfin: 10.0, veff: 0.18, vmass: 1341 },
        "medium-4wd": { fuelcfin: 12.0, veff: 0.18, vmass: 1878 },
        "large-4wd": { fuelcfin: 14.0, veff: 0.18, vmass: 2103 },
        "van": { fuelcfin: 11.0, veff: 0.18, vmass: 1248 },
        "utility-6cyl": { fuelcfin: 12.0, veff: 0.18, vmass: 1393 },
        "utility-8cyl": { fuelcfin: 14.0, veff: 0.18, vmass: 1527 },
        "light-truck": { fuelcfin: 12.0, veff: 0.18, vmass: 1341 },
        "motor-scooter": { fuelcfin: 3.0, veff: 0.22, vmass: 100 },
        "motorcycle": { fuelcfin: 5.0, veff: 0.188, vmass: 450 },
        "electric-bike": { fuelcfin: 0.5, veff: 0.75, vmass: 20 }
    };

    // Public transport data
    const publicTransportData = {
        "urban-train-6car": { ptghfact: 0.27, ptmass: 200000, ptCroll: 0.001, ptaero: 1.183, ptlight: 0.555, pthandc: 1.9, ptpassno: 600 },
        "double-decker-urban-train-8car": { ptghfact: 0.27, ptmass: 242000, ptCroll: 0.001, ptaero: 1.447, ptlight: 0.606, pthandc: 4.7, ptpassno: 800 },
        "underground-urban-train-4-6car": { ptghfact: 0.27, ptmass: 200000, ptCroll: 0.001, ptaero: 1.183, ptlight: 0.555, pthandc: 1.9, ptpassno: 600 },
        "outer-urban-train-6car": { ptghfact: 0.27, ptmass: 260000, ptCroll: 0.001, ptaero: 1.460, ptlight: 0.476, pthandc: 3.1, ptpassno: 700 },
        "regional-train-3car": { ptghfact: 0.27, ptmass: 130000, ptCroll: 0.001, ptaero: 0.756, ptlight: 0.139, pthandc: 0.8, ptpassno: 300 },
        "high-speed-intercity-train-130-200kmh": { ptghfact: 0.27, ptmass: 460000, ptCroll: 0.001, ptaero: 1.190, ptlight: 0.204, pthandc: 1.1, ptpassno: 900 },
        "very-high-speed-train-200-300kmh": { ptghfact: 0.27, ptmass: 634000, ptCroll: 0.001, ptaero: 1.258, ptlight: 0.267, pthandc: 1.5, ptpassno: 1200 },
        "suburban-diesel-train-2car": { ptghfact: 0.27, ptmass: 91000, ptCroll: 0.001, ptaero: 0.583, ptlight: 0.178, pthandc: 1.1, ptpassno: 200 },
        "regional-diesel-train-2car": { ptghfact: 0.27, ptmass: 110000, ptCroll: 0.001, ptaero: 1.516, ptlight: 0.253, pthandc: 1.2, ptpassno: 200 },
        "interstate-high-speed-diesel-train-7car": { ptghfact: 0.27, ptmass: 447000, ptCroll: 0.001, ptaero: 1.516, ptlight: 0.253, pthandc: 1.2, ptpassno: 700 },
        "old-melbourne-tram": { ptghfact: 0.27, ptmass: 25800, ptCroll: 0.0015, ptaero: 0.498, ptlight: 0.132, pthandc: 1.0, ptpassno: 50 },
        "modern-64seat-tram": { ptghfact: 0.27, ptmass: 35300, ptCroll: 0.0015, ptaero: 0.583, ptlight: 0.198, pthandc: 1.5, ptpassno: 64 },
        "modern-94seat-light-rail-or-tram": { ptghfact: 0.27, ptmass: 35300, ptCroll: 0.0015, ptaero: 0.451, ptlight: 0.132, pthandc: 0.7, ptpassno: 94 },
        "suburban-bus": { ptghfact: 0.27, ptmass: 9500, ptCroll: 0.006, ptaero: 0.396, ptlight: 0.054, pthandc: 0.2, ptpassno: 40 },
        "intercity-bus": { ptghfact: 0.27, ptmass: 9500, ptCroll: 0.006, ptaero: 0.396, ptlight: 0.054, pthandc: 0.2, ptpassno: 40 }
    };

    // Quick calculation for cars
    function calculateCarEmissions(vehicleType, vkms, fuelType, yearvm) {
        const vehicle = carData[vehicleType];
        const fuel = fuelEmissionFactors[fuelType];

        const vagefact = 1 + 0.002 * (current_year - yearvm);
        const annual_fuel_consumption = (vkms / 100) * vehicle.fuelcfin * vagefact;
        const annual_energy_consumption = annual_fuel_consumption * fuel.energyDensity;
        const annual_ghg_emissions = annual_energy_consumption * fuel.emissionFactor;

        return annual_ghg_emissions.toFixed(2);
    }

    function updateCarEmissions() {
        const vehicleType = document.getElementById("car-type").value;
        const vkms = parseFloat(document.getElementById("vkms").value);
        const fuelType = document.getElementById("fuel-type").value;
        const yearvm = parseInt(document.getElementById("yearvm").value);

        const emissions = calculateCarEmissions(vehicleType, vkms, fuelType, yearvm);
        document.getElementById("total-emissions").innerText = emissions;
        document.getElementById("emission-gauge").value = emissions;
    }

    document.getElementById("car-type").addEventListener("change", updateCarEmissions);
    document.getElementById("vkms").addEventListener("input", updateCarEmissions);
    document.getElementById("fuel-type").addEventListener("change", updateCarEmissions);
    document.getElementById("yearvm").addEventListener("input", updateCarEmissions);

    // Quick calculation for public transport
    function calculatePublicTransportEmissions(ptType, tripDistance, tripsPerWeek) {
        const transport = publicTransportData[ptType];

        const ptanndist = tripDistance * tripsPerWeek * 52;  // Annual Distance Calculation
        const ptmjvkm = (transport.ptmass * transport.ptCroll * transport.ptaero) + (transport.ptlight + transport.pthandc);  // MJ/vkm Calculation
        const ptannghgs = ptanndist * ptmjvkm * transport.ptghfact;  // Annual GHG Emissions Calculation
        const ptpassghg = ptannghgs / transport.ptpassno;  // GHG per Passenger

        return ptpassghg.toFixed(2);
    }

    function updatePublicTransportEmissions() {
        const ptType = document.getElementById("public-transport-type").value;
        const tripDistance = parseFloat(document.getElementById("trip-distance").value);
        const tripsPerWeek = parseInt(document.getElementById("trips-per-week").value);

        const emissions = calculatePublicTransportEmissions(ptType, tripDistance, tripsPerWeek);
        document.getElementById("total-emissions").innerText = emissions;
        document.getElementById("emission-gauge").value = emissions;
    }

    document.getElementById("public-transport-type").addEventListener("change", updatePublicTransportEmissions);
    document.getElementById("trip-distance").addEventListener("input", updatePublicTransportEmissions);
    document.getElementById("trips-per-week").addEventListener("input", updatePublicTransportEmissions);

    // Functions to add and remove car entries
    let carCount = 1;

    function addCar() {
        const tableBody = document.getElementById('cars-table-body');
        const id = `C${carCount++}`;
        const row = document.createElement('tr');

        row.innerHTML = `
        <td><button onclick="removeCar('${id}')">X</button></td>
        <td id="${id}-ghgs" class="ghg-cell">0.00 kg CO2-eq/year</td>
        <td onclick="toggleInput('${id}-id')" id="${id}-id-td"><span>${id}</span><input type="text" id="${id}-id" class="hidden-input"></td>
        <td onclick="toggleInput('${id}-type')" id="${id}-type-td"><span>Light car</span><select id="${id}-type" class="hidden-input">
            <option value="light-car">Light car</option>
            <option value="small-car">Small car</option>
            <option value="medium-car">Medium car</option>
            <option value="large-car">Large car</option>
            <option value="very-large-car">Very large car</option>
            <option value="people-mover">People Mover</option>
            <option value="small-4wd">Small 4WD</option>
            <option value="medium-4wd">Medium 4WD</option>
            <option value="large-4wd">Large 4WD</option>
            <option value="van">Van</option>
            <option value="utility-6cyl">Utility (6 cyl)</option>
            <option value="utility-8cyl">Utility (8 cyl)</option>
            <option value="light-truck">Light truck</option>
            <option value="motor-scooter">Motor scooter</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="electric-bike">Electric bike</option>
        </select></td>
        <td onclick="toggleInput('${id}-vkms')" id="${id}-vkms-td"><span>0</span><input type="number" id="${id}-vkms" class="hidden-input" min="0" value="0"></td>
        <td onclick="toggleInput('${id}-yearvm')" id="${id}-yearvm-td"><span>0</span><input type="number" id="${id}-yearvm" class="hidden-input" min="0" value="0"></td>
        <td onclick="toggleInput('${id}-service')" id="${id}-service-td"><span>Regular</span><select id="${id}-service" class="hidden-input">
            <option value="regular">Regularly serviced</option>
            <option value="performance">Serviced when performance declines</option>
            <option value="breakdown">Serviced when it breaks down</option>
        </select></td>
        <td onclick="toggleInput('${id}-ac')" id="${id}-ac-td"><span>Yes</span><select id="${id}-ac" class="hidden-input">
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select></td>
        <td onclick="toggleInput('${id}-fuel')" id="${id}-fuel-td"><span>Petrol</span><select id="${id}-fuel" class="hidden-input">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="lpg">LPG</option>
            <option value="cng">CNG</option>
            <option value="electric">Electric</option>
        </select></td>
        <td onclick="toggleInput('${id}-other')" id="${id}-other-td"><span>0</span><input type="text" id="${id}-other" class="hidden-input" min="0" value="0"></td>
    `;

        tableBody.appendChild(row);

        const inputs = row.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                const span = document.querySelector(`#${input.id}-td span`);
                span.innerText = input.tagName === 'SELECT' ? input.options[input.selectedIndex].text : input.value;
                calculateDetailedCarEmissions(id);
            });
        });
    }

    function removeCar(id) {
        const row = document.querySelector(`#${id}-ghgs`).closest('tr');
        row.remove();
    }

    function calculateDetailedCarEmissions(id) {
        const type = document.getElementById(`${id}-type`).value;
        const vkms = parseFloat(document.getElementById(`${id}-vkms`).value);
        const yearvm = parseFloat(document.getElementById(`${id}-yearvm`).value);
        const vservText = document.getElementById(`${id}-service`).value;
        const acfittedText = document.getElementById(`${id}-ac`).value;
        const fuelType = document.getElementById(`${id}-fuel`).value;

        const vserv = {
            "regular": 1,
            "performance": 1.05,
            "breakdown": 1.1
        }[vservText];

        const acfitted = {
            "yes": 1,
            "no": 0
        }[acfittedText];

        const vehicle = carData[type];
        const fuel = fuelEmissionFactors[fuelType];

        const vagefact = 1 + 0.002 * (current_year - yearvm);
        const veff_adj = vehicle.veff;
        const adjusted_mass = vehicle.vmass;
        const fuel_consumption = vehicle.fuelcfin * vserv * vagefact;
        const annual_energy_consumption = (vkms / 100) * fuel_consumption * fuel.energyDensity;

        // Air conditioning related calculations
        let acenergy = 0, acleak = 0, acmass = 0;
        if (acfitted) {
            acenergy = 200; // Example value: Energy used by air conditioning
            acleak = 0.5; // Example value: Refrigerant leaks
            acmass = 30; // Example value: Mass of air conditioning unit
        }

        const total_energy_consumption = annual_energy_consumption + acenergy;
        const annual_ghg_emissions = total_energy_consumption * fuel.emissionFactor + acleak * 1300; // 1300 is GWPac (Global Warming Potential)

        document.getElementById(`${id}-ghgs`).innerText = annual_ghg_emissions.toFixed(2) + " kg CO2-eq/year";
    }

    // Functions to add and remove public transport entries
    let publicCount = 1;

    function addPublicTransport() {
        const tableBody = document.getElementById('public-table-body');
        const id = `P${publicCount++}`;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><button onclick="removePublicTransport('${id}')">X</button></td>
            <td id="${id}-ghgs" class="ghg-cell">0.00 kg CO2-eq/year</td>
            <td onclick="toggleInput('${id}-id')" id="${id}-id-td"><span>${id}</span><input type="text" id="${id}-id" class="hidden-input"></td>
            <td onclick="toggleInput('${id}-type')" id="${id}-type-td"><span>Urban train</span><select id="${id}-type" class="hidden-input">
                <option value="urban-train-6car">Urban train</option>
                <option value="double-decker-urban-train-8car">Double decker urban train</option>
                <option value="underground-urban-train-4-6car">Under-ground urban train</option>
                <option value="outer-urban-train-6car">Outer urban train</option>
                <option value="regional-train-3car">Regional train</option>
                <option value="high-speed-intercity-train-130-200kmh">High speed intercity train</option>
                <option value="very-high-speed-train-200-300kmh">Very high speed train</option>
                <option value="suburban-diesel-train-2car">Suburban diesel train</option>
                <option value="regional-diesel-train-2car">Regional diesel train</option>
                <option value="interstate-high-speed-diesel-train-7car">Interstate high speed diesel train</option>
                <option value="old-melbourne-tram">Older melbourne tram</option>
                <option value="modern-64seat-tram">Modern 64 seat tram</option>
                <option value="modern-94seat-light-rail-or-tram">Modern 94 seat light rail or tram</option>
                <option value="suburban-bus">Suburban bus</option>
                <option value="intercity-bus">Intercity bus</option>
            </select></td>
            <td onclick="toggleInput('${id}-trips')" id="${id}-trips-td"><span>Very few</span><select id="${id}-trips" class="hidden-input">
                <option value="1">Very few</option>
                <option value="5">Daily</option>
                <option value="10">To and from work/school</option>
                <option value="20">Often</option>
            </select></td>
            <td onclick="toggleInput('${id}-distance')" id="${id}-distance-td"><span>Short trip</span><select id="${id}-distance" class="hidden-input">
                <option value="5">Short trip (5km)</option>
                <option value="15">Medium trip (15km)</option>
                <option value="15">Typical</option>
                <option value="20">Suburban trip (20km)</option>
                <option value="50">Short intercity trip< (50km)/option>
                <option value="200">Long intercity trip (200km)</option>
                <option value="1000">Interstate trip (1000km)</option>
            </select></td>
            <td onclick="toggleInput('${id}-stops')" id="${id}-stops-td"><span>0</span><input type="number" id="${id}-stops" class="hidden-input" value="0"></td>
            <td onclick="toggleInput('${id}-speed')" id="${id}-speed-td"><span>0</span><input type="number" id="${id}-speed" class="hidden-input" value="0"></td>
            <td onclick="toggleInput('${id}-energy')" id="${id}-energy-td"><span>Normal</span><select id="${id}-energy" class="hidden-input">
                <option value="normal">Normal</option>
                <option value="25">25% more efficient</option>
                <option value="50">50% more efficient</option>
                <option value="custom">Custom</option>
            </select></td>
            <td onclick="toggleInput('${id}-occupancy')" id="${id}-occupancy-td"><span>Typical</span><select id="${id}-occupancy" class="hidden-input">
                <option value="all-seats-occupied">All seats occupied</option>
                <option value="full">Full</option>
                <option value="commuting">Commuting</option>
                <option value="typical">Typical</option>
                <option value="low-occupancy">Low occupancy</option>
                <option value="custom">Custom</option>
            </select></td>
            <td onclick="toggleInput('${id}-percentGreenEnergy')" id="${id}-percentGreenEnergy-td"><span>0</span><input type="number" id="${id}-percentGreenEnergy" class="hidden-input" value="0"></td>
            <td onclick="toggleInput('${id}-energyRecoveryFactor')" id="${id}-energyRecoveryFactor-td"><span>Normal</span><select id="${id}-energyRecoveryFactor" class="hidden-input">
                <option value="normal">Normal</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="very-good">Very good</option>
                <option value="excellent">Excellent</option>
            </select></td>
            <td onclick="toggleInput('${id}-dragFactor')" id="${id}-dragFactor-td"><span>0</span><input type="number" id="${id}-dragFactor" class="hidden-input" value="0"></td>
        `;

        tableBody.appendChild(row);

        const inputs = row.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                const span = document.querySelector(`#${input.id}-td span`);
                span.innerText = input.tagName === 'SELECT' ? input.options[input.selectedIndex].text : input.value;
                calculateDetailedPublicTransportEmissions(id);
            });
        });
    }
    function removePublicTransport(id) {
        const row = document.querySelector(`#${id}-ghgs`).closest('tr');
        row.remove();
    }

    function calculateDetailedPublicTransportEmissions(id) {
        const type = document.getElementById(`${id}-type`).value;
        const trips = parseInt(document.getElementById(`${id}-trips`).value);
        const distance = parseInt(document.getElementById(`${id}-distance`).value);
        const stops = parseFloat(document.getElementById(`${id}-stops`).value);
        const speed = parseFloat(document.getElementById(`${id}-speed`).value);
        const energyEfficiency = document.getElementById(`${id}-energy`).value;
        const occupancy = document.getElementById(`${id}-occupancy`).value;
        const percentGreenEnergy = parseFloat(document.getElementById(`${id}-percentGreenEnergy`).value);
        const energyRecoveryFactor = document.getElementById(`${id}-energyRecoveryFactor`).value;
        const dragFactor = parseFloat(document.getElementById(`${id}-dragFactor`).value);

        const transport = publicTransportData[type];

        if (!transport) {
            console.error(`Invalid transport type: ${type}`);
            return;
        }

        // Custom energy efficiency, if applicable
        let energyPerKM;
        if (energyEfficiency === 'normal') {
            energyPerKM = transport.ptghfact;
        } else if (energyEfficiency === '25') {
            energyPerKM = transport.ptghfact * 0.75;
        } else if (energyEfficiency === '50') {
            energyPerKM = transport.ptghfact * 0.50;
        } else {
            energyPerKM = parseFloat(document.getElementById(`${id}-energyCustom`).value);
        }

        // Custom occupancy, if applicable
        let occupancyFactor;
        if (occupancy === 'all-seats-occupied') {
            occupancyFactor = 1.0;
        } else if (occupancy === 'full') {
            occupancyFactor = 0.9;
        } else if (occupancy === 'commuting') {
            occupancyFactor = 0.7;
        } else if (occupancy === 'typical') {
            occupancyFactor = 0.5;
        } else if (occupancy === 'low-occupancy') {
            occupancyFactor = 0.3;
        } else {
            occupancyFactor = parseFloat(document.getElementById(`${id}-occupancyCustom`).value) / 100;
        }

        // Energy recovery factor
        let energyRecovery;
        if (energyRecoveryFactor === 'normal') {
            energyRecovery = 0.3;
        } else if (energyRecoveryFactor === 'none') {
            energyRecovery = 0.0;
        } else if (energyRecoveryFactor === 'low') {
            energyRecovery = 0.1;
        } else if (energyRecoveryFactor === 'very-good') {
            energyRecovery = 0.5;
        } else {
            energyRecovery = 0.7;
        }

        const annualDistance = 52 * trips * distance; // 연간 거리 계산
        const aerodynamicDrag = transport.ptaero * (dragFactor + stops * (transport.ptmass / transport.ptpassno) / Math.pow(transport.ptaero, 0.5)); // 공기 역학 항력 계산
        const lightEnergyUsage = transport.ptlight * transport.ptmass / 1000 * 3.6 / (speed * 0.7); // 조명 에너지 사용량 계산
        const handC = transport.pthandc * transport.ptmass * (1.5 * 2 * (transport.ptaero / 3 + 3) * 0.8 + 8 * 0.25 * 2 * (transport.ptaero / 3 + 3) * 0.8 + transport.ptaero * 1.23 / 3.6) * 3.6 / 1000 / (speed * 0.8); // 난방 및 냉방 에너지 사용량 계산

        const energyPerVehicleKM = (1 - percentGreenEnergy / 100) * ((1 / energyPerKM / 10 / (1 - energyRecovery) * ((transport.ptmass + occupancyFactor * 67) * 9.81 * transport.ptCroll + 1 / 2 * 1.225 * aerodynamicDrag * Math.pow((speed / 3.6), 2) + 1 / 2 * (transport.ptmass + occupancyFactor * 67) * Math.pow((speed / 3.6), 2) / stops) + (lightEnergyUsage + handC) / 3.6 * 100) / 100 * 3.6); // 차량 km당 에너지 사용량 계산

        const ptpassghg = energyPerVehicleKM / transport.ptpassno;
        const annualGHG = annualDistance * energyPerVehicleKM / transport.ptpassno * transport.ptghfact;
        /*     
        if(occupancyCalOption === "Absolute") {
        ghg = tempTransportObject.get_ptannghgs;
        }
        else{
        ghg = tempTransportObject.get_ptghgs;
        }
        
        return ghg; 
        */
        const ptghgs = ptpassghg * transport.ptpassno * annualDistance / 100000; // 제공된 코드와 동일하게 연간 GHG 계산

        document.getElementById(`${id}-ghgs`).innerText = isNaN([ptghgs]) ? "0.00 kg CO2-eq/year" : ptghgs.toFixed(2) + " kg CO2-eq/year";
    }

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

    function toggleOption(option) {
        const options = ["cars", "public", "cars-detail", "public-detail"];
        options.forEach(opt => {
            const element = document.getElementById(opt);
            if (element) {
                element.classList.add("hidden");
            }
        });
        const element = document.getElementById(option);
        if (element) {
            element.classList.remove("hidden");
        }
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
            span.innerText = input.tagName === 'SELECT' ? input.options[input.selectedIndex].text : input.value;
            if (id.startsWith('C')) {
                calculateDetailedCarEmissions(id.split('-')[0]);
            } else if (id.startsWith('P')) {
                calculateDetailedPublicTransportEmissions(id.split('-')[0]);
            }
        });
    }

    window.addCar = addCar;
    window.removeCar = removeCar;
    window.addPublicTransport = addPublicTransport;
    window.removePublicTransport = removePublicTransport;
    window.calculateDetailedCarEmissions = calculateDetailedCarEmissions;
    window.calculateDetailedPublicTransportEmissions = calculateDetailedPublicTransportEmissions;
    window.openTab = openTab;
    window.toggleOption = toggleOption;
    window.toggleInput = toggleInput;

    document.querySelector(".tablinks").click();
    addCar(); // Add initial car row for detailed tab
    addPublicTransport(); // Add initial public transport row for detailed tab
});
