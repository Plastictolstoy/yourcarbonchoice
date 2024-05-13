// predefines both quick and detailed totals
let ghgAirQuickTotal = 0;
let ghgAirDetailedTotal = 0;


/* 
Scripts for updating the value of the bar next to 
"My household's ghg emissions" based on the current value of totalAirGHG
*/

// Function to update the green bar based on the totalAirGHG value
function updateghg1bar() {
    const totalAirGHG = document.getElementById("totalAirGHG");
    const ghg1bar = document.getElementById("ghg1bar");
    const bartooltip = document.getElementById("bartooltip");
    const value = parseFloat(totalAirGHG.textContent);

    if (!isNaN(value)) {
        // Calculate the percentage of the value relative to the maximum (10000)
        const percentage = (value / 10000) * 40;

        // Limit the percentage to a maximum of 100%
        const limitedPercentage = Math.min(percentage, 100);

        ghg1bar.style.width = limitedPercentage + "%"; // Update the width of the green bar
        bartooltip.textContent = value; // Update the bartooltip content with the actual value

        //console.log("Current Value of first Bar: " + value); //console log for bar 
    }
}


// Initialize MutationObserver
const observer = new MutationObserver(updateghg1bar);

// Add a MutationObserver to watch for changes in the totalAirGHG element
const totalAirGHG = document.getElementById("totalAirGHG");
if (totalAirGHG) {
    observer.observe(totalAirGHG, { childList: true, subtree: true });
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

/*
CODE FOR Quick view
*/

// calculate GHG for Quick view
  function calculateGHGQuick() {
    // Number of trips for typicalDomestic from user input
    var typicalDomesticTrips = parseInt(document.getElementById("typicalDomestic").value);
    
    // Number of trips for sydneyPerth from user input
    var sydneyPerthTrips = parseInt(document.getElementById("sydneyPerth").value);

    // Number of trips for typicalAusAsia from user input
    var typicalAusAsiaTrips = parseInt(document.getElementById("typicalAusAsia").value);

    // Number of trips for typicalAusUsaEurope from user input
    var typicalAusUsaEuropeTrips = parseInt(document.getElementById("typicalAusUsaEurope").value);

    // Variables for typicalDomestic
    var typicalFa = 1; // Warming Factor for typicalDomestic
    var typicalOcc = 0.773; // Occupancy for typicalDomestic
    var typicalDist = 708; // Distance for typicalDomestic
    var typicalLtoDist = 30; // LandingTakeOffDistance for typicalDomestic
    var typicalCruisegh = 100; // AirCraftType for typicalDomestic
    var typicalLtoN = 1; // Stopovers for typicalDomestic
    var typicalLtogh = 21; // Landing Take Off Emissions for typicalDomestic
    var typicalSeatType = 1; // Seat type for typicalDomestic
    var typicalLvar = 0; // Loading Factor for typicalDomestic


    // Variables for sydneyPerth
    var sydneyPerthFa = 1; // Warming Factor for sydneyPerth
    var sydneyPerthOcc = 0.773; // Occupancy for sydneyPerth
    var sydneyPerthDist = 3290; // Distance for sydneyPerth
    var sydneyPerthLtoDist = 30; // LandingTakeOffDistance for sydneyPerth
    var sydneyPerthCruisegh = 100; // AirCraftType for sydneyPerth
    var sydneyPerthLtoN = 1; // Stopovers for sydneyPerth
    var sydneyPerthLtogh = 21; // Landing Take Off Emissions for sydneyPerth
    var sydneyPerthSeatType = 1; // Seat type for sydneyPerth
    var sydneyPerthLvar = 0; // Loading Factor for sydneyPerth

    // Variables for typicalAusAsia
    var typicalAusAsiafa = 1; // Warming Factor for typicalAusAsia
    var typicalAusAsiaOcc = 0.773; // Occupancy for typicalAusAsia
    var typicalAusAsiaDist = 7825; // Distance for typicalAusAsia
    var typicalAusAsiaLtoDist = 30; // LandingTakeOffDistance for typicalAusAsia
    var typicalAusAsiaCruisegh = 100; // AirCraftType for typicalAusAsia
    var typicalAusAsiaLtoN = 1; // Stopovers for typicalAusAsia
    var typicalAusAsiaLtoGh = 21; // Landing Take Off Emissions for typicalAusAsia
    var typicalAusAsiaSeatType = 1; // Seat type for typicalAusAsia
    var typicalAusAsiaLvar = 0; // Loading Factor for typicalAusAsia

    // Variables for typicalAusUsaEurope
    var typicalAusUsaEuropeFa = 1; // Warming Factor for typicalAusUsaEurope
    var typicalAusUsaEuropeOcc = 0.773; // Occupancy for typicalAusUsaEurope
    var typicalAusUsaEuropeDist = 15184; // Distance for typicalAusUsaEurope
    var typicalAusUsaEuropeLtoDist = 30; // LandingTakeOffDistance for typicalAusUsaEurope
    var typicalAusUsaEuropeCruisegh = 100; // AirCraftType for typicalAusUsaEurope
    var typicalAusUsaEuropeLtoN = 1; // Stopovers for typicalAusUsaEurope
    var typicalAusUsaEuropeLtoGh = 21; // Landing Take Off Emissions for typicalAusUsaEurope
    var typicalAusUsaEuropeSeatType = 1; // Seat type for typicalAusUsaEurope
    var typicalAusUsaEuropeLvar = 0; // Loading Factor for typicalAusUsaEurope

    

    // Formula for typical domestic ghg
    var typicalDomesticGHG = (typicalDomesticTrips * ((typicalDist - typicalLtoDist) * typicalFa * typicalCruisegh / 1000 + typicalLtoN * typicalLtogh) 
    * (1 - typicalLvar / 100) / typicalOcc * typicalSeatType);

    // Formula for Sydney-Perth ghg
    var sydneyPerthGHG = (sydneyPerthTrips * ((sydneyPerthDist - sydneyPerthLtoDist) * sydneyPerthFa * sydneyPerthCruisegh / 1000 + sydneyPerthLtoN * sydneyPerthLtogh) 
    * (1 - sydneyPerthLvar / 100) / sydneyPerthOcc * sydneyPerthSeatType);

     // Formula for typicalAusAsia ghg
     var typicalAusAsiaGHG = (typicalAusAsiaTrips * ((typicalAusAsiaDist - typicalAusAsiaLtoDist) * typicalAusAsiafa * typicalAusAsiaCruisegh / 1000 + typicalAusAsiaLtoN * typicalAusAsiaLtoGh) 
    * (1 - typicalAusAsiaLvar / 100) / typicalAusAsiaOcc * typicalAusAsiaSeatType);

    // Formula for typicalAusUsaEurope ghg
    var typicalAusUsaEuropeGHG = (typicalAusUsaEuropeTrips * ((typicalAusUsaEuropeDist - typicalAusUsaEuropeLtoDist) * typicalAusUsaEuropeFa * typicalAusUsaEuropeCruisegh / 1000 + typicalAusUsaEuropeLtoN * typicalAusUsaEuropeLtoGh) 
    * (1 - typicalAusUsaEuropeLvar / 100) / typicalAusUsaEuropeOcc * typicalAusUsaEuropeSeatType);


    // Calculate total emissions
    var totalResultAir = (typicalDomesticGHG + sydneyPerthGHG + typicalAusAsiaGHG + typicalAusUsaEuropeGHG).toFixed(2);

    ghgAirQuickTotal = parseFloat(totalResultAir);
    //console.log("Total Quick AirTravel GHG:", ghgAirQuickTotal); // Log the value
   

    totalAirTravelGHG();

}

document.getElementById("typicalDomestic").addEventListener("change", calculateGHGQuick);
document.getElementById("sydneyPerth").addEventListener("change", calculateGHGQuick);
document.getElementById("typicalAusAsia").addEventListener("change", calculateGHGQuick);
document.getElementById("typicalAusUsaEurope").addEventListener("change", calculateGHGQuick);

/*
CODE FOR DETAILED view
*/
    // Gathers values from table
    document.getElementById('detailedFlightOptions').addEventListener('change', function() {
        const selectedValue = this.value; //value from dropdwon user selects for first time
        const tableContainer = document.getElementById('tableContainer');
        const addJourneyDiv = document.getElementById('addJourneyDiv');
        const tableBody = document.getElementById('tableBody');


        //for newly created rows
        // Remove previous event listener for distanceSelect
        distanceSelect.removeEventListener('change', handleDistanceSelectChange);

        // Attach new event listener for distanceSelect
        distanceSelect.addEventListener('change', handleDistanceSelectChange);
        
        // Clears dropdown 
        tableBody.innerHTML = '';
    
        // Default values for the columns
        const defaultValues = {
            ghgs: '0.000',
            Id: 'AT1',
            Trips: '0',
            Distance: selectedValue,
            SeatType: 'Economy'
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
    
        // Show the table container and add journey button
        tableContainer.style.display = 'block';
        addJourneyDiv.style.display = 'block';
});


// Script for Jounery button
    const addJourneyButton = document.getElementById('addJourneyButton');
    const tableBody = document.getElementById('tableBody');
    let idCounter = 2; // Starts Id column from  from AT2
// event loop for each time the jounery button is pressed
addJourneyButton.addEventListener('click', function() {
        const defaultDistance = "Australia domestic flight";
        const defaultTrips = "0";
        const newId = "AT" + idCounter++;
    
        const newRow = document.createElement('tr');
        const columns = ['ghgs', 'Id', 'Trips', 'Distance', 'SeatType'];
    
        columns.forEach(column => {
            const cell = document.createElement('td');
            if (column === 'ghgs') {
                cell.textContent = '0.000';
            } else if (column === 'Id') {
                cell.textContent = newId;
            } else if (column === 'Trips') {
                cell.textContent = defaultTrips;
            } else if (column === 'Distance') {
                cell.textContent = defaultDistance;
            } else if (column === 'SeatType') {
                cell.textContent = 'Economy';
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
            addJourneyDiv.style.display = 'none';
            distanceSelect.style.display = 'block';
            distanceLabel.style.display = 'block';
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
                addJourneyDiv.style.display = 'none';
                distanceSelect.style.display = 'block';
                distanceLabel.style.display = 'block';
            }
            updateTotalDetailedGHG(); // Update total GHG after deletion
        }
    }
});



    
    const flightDetailsModal = document.getElementById('flightDetailsModal');
    const closeModalButton = document.getElementById('closeModalButton');
    
    
// if user leaves a row empty will set it to the default setting
tableBody.addEventListener('click', function(event) {
        const clickedRow = event.target.closest('tr');
        if (!clickedRow) return;
    
        selectedRow = clickedRow;
    
        const cells = clickedRow.querySelectorAll('td');
        tripsInput.value = cells[2].textContent;
        seatTypeSelect.value = cells[4].textContent;
    
        flightDetailsModal.style.display = 'block';
});
    



    // Listen for input changes input modal 

    tripsInput.addEventListener('input', updateTableRowValues);
    distanceSelect.addEventListener('change', updateTableRowValues); 
    seatTypeSelect.addEventListener('input', updateTableRowValues);
    airCraftSelect.addEventListener('input', updateTableRowValues);
    lTOghSelect.addEventListener('input', updateTableRowValues);
    stopOverSelect.addEventListener('input', updateTableRowValues);
    warmingFactorSelect.addEventListener('input', updateTableRowValues);
    occupancySelect.addEventListener('input', updateTableRowValues);
    lTODistSelect.addEventListener('input', updateTableRowValues);
    loadingFactorSelect.addEventListener('input', updateTableRowValues);

    // Event listeners for checking if user input is selected from  the dropdowns
    distanceSelect.addEventListener('change', handleDistanceSelectChange);
    seatTypeSelect.addEventListener('change', handleSeatTypeSelectChange);
    airCraftSelect.addEventListener('change', handleAirCraftSelectChange);
    lTOghSelect.addEventListener('change', handleLTOghSelectChange);
    stopOverSelect.addEventListener('input', handleStopOverSelectChange);
    warmingFactorSelect.addEventListener('input', handleWarmingFactorSelectChange);
    occupancySelect.addEventListener('input', handleOccupancySelectChange);
    lTODistSelect.addEventListener('input', handlelTODistSelectChange);
    loadingFactorSelect.addEventListener('input', handleLoadingFactorSelectChange);


    
    // Function to handle changes in distanceSelect dropdown
function handleDistanceSelectChange() {
        const selectedOption = distanceSelect.value;
        if (selectedOption === 'user-specify-distance') {
            userSpecifydistanceInput.style.display = 'block';
        } else {
            userSpecifydistanceInput.style.display = 'none';
            updateTableRowValues(); // Update the row immediately for other options
        }
}

function handleDistanceSelectChange() {
    const selectedOption = seatTypeSelect.value;
    if (selectedOption === 'user-specify-seatType') {
        userSpecifyseatTypeInput.style.display = 'block';
    }

    else {
        userSpecifyseatTypeInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}

function handleAirCraftSelectChange() {
    const selectedOption = airCraftSelect.value;
    if (selectedOption === 'user-specify-airCraft') {
        userSpecifyCruiseghInput.style.display = 'block';
    }
    else {
        userSpecifyCruiseghInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}

function handleLTOghSelectChange() {
    const selectedOption = lTOghSelect.value;
    if (selectedOption === 'user-specify-LTOgh') {
        userSpecifyLTOghInput.style.display = 'block';
    }
    else {
        userSpecifyLTOghInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}

function handleStopOverSelectChange() {
    const selectedOption = stopOverSelect.value;
    if (selectedOption === 'user-specify-StopOver') {
        userSpecifyStopOverInput.style.display = 'block';
    }
    else {
        userSpecifyStopOverInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}

function handleWarmingFactorSelectChange() {
    const selectedOption = warmingFactorSelect.value;
    if (selectedOption === 'user-specify-WarmingFactor') {
        userSpecifyWarmingFactorInput.style.display = 'block';
    }
    else {
        userSpecifyWarmingFactorInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}

function handleOccupancySelectChange() {
    const selectedOption = occupancySelect.value;
    if (selectedOption === 'user-specify-Occupancy') {
        userSpecifyOccupancyInput.style.display = 'block';
    }
    else {
        userSpecifyOccupancyInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}

function handlelTODistSelectChange() {
    const selectedOption = lTODistSelect.value;
    if (selectedOption === 'user-specify-LTODist') {
        userSpecifyLTODistInput.style.display = 'block';
    }
    else {
        userSpecifyLTODistInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}

function handleLoadingFactorSelectChange() {
    const selectedOption = loadingFactorSelect.value;
    if (selectedOption === 'user-specify-LoadingFactor') {
        userSpecifyLoadingFactorInput.style.display = 'block';
    }
    else {
        userSpecifyLoadingFactorInput.style.display = 'none';
        updateTableRowValues(); // Update the row immediately for other options
    }
}
    
    //input event listner for user input
    userSpecifydistanceInput.addEventListener('input', updateTableRowValues);
    userSpecifyseatTypeInput.addEventListener('input', updateTableRowValues);
    userSpecifyCruiseghInput.addEventListener('input', updateTableRowValues);
    userSpecifyLTOghInput.addEventListener('input', updateTableRowValues);
    userSpecifyStopOverInput.addEventListener('input', updateTableRowValues);
    userSpecifyWarmingFactorInput.addEventListener('input', updateTableRowValues);
    userSpecifyOccupancyInput.addEventListener('input', updateTableRowValues);
    userSpecifyLTODistInput.addEventListener('input', updateTableRowValues);
    userSpecifyLoadingFactorInput.addEventListener('input', updateTableRowValues);
    
closeModalButton.addEventListener('click', function () {
        flightDetailsModal.style.display = 'none';
        selectedRow = null;

        if (distanceSelect.value === 'user-specify-distance') {
            updateTableRowValues();
        }

            
});
    
    


//Code for values of dropdown options in modal
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
    //Cruisegh
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
    //Stop Over
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
    
    

// Step 1: function to calculate ghgs
function calculateGHGS(trips, distanceOption, seatTypeOption, airCraftOption,lTOghOption,stopOverSelect,
    warmingFactorSelect,occupancySelect,lTODistSelect,loadingFactorSelect) {

    let distanceValue;
    
    if (distanceOption === 'User Specify international flight') {
        distanceValue = parseInt(userSpecifydistanceInput.value);
    } 
    else {
        distanceValue = distanceMapping[distanceOption] || parseInt(distanceOption);
    }
    if (seatTypeOption === 'User Specify area occupied relative to economy') {
        seatTypeValue = parseFloat(userSpecifyseatTypeInput.value);
    } else {
        seatTypeValue = seatTypeMapping[seatTypeOption] || parseFloat(seatTypeOption);
    }

    if (airCraftOption === 'User Specify Aircraft') {
        airCraftTypeValue = parseInt(userSpecifyCruiseghInput.value);
    } else {
        airCraftTypeValue = airCraftMapping[airCraftOption] || parseInt(airCraftOption);
    }

    if (lTOghOption === 'User Specify landing take off') {
        lTOghValue = parseInt(userSpecifyLTOghInput.value);
    } else {
        lTOghValue = lTOghMapping[lTOghOption] || parseInt(lTOghOption);
    }

    if (stopOverSelect === 'User specify stop over') {
        lTOValue = parseInt(userSpecifyStopOverInput.value);
    } else {
        lTOValue = lTOMapping[stopOverSelect] || parseInt(stopOverSelect);
    }

    if (warmingFactorSelect === 'User specify warming factor') {
        warmingFactorValue = parseFloat(userSpecifyWarmingFactorInput.value);
    } else {
        warmingFactorValue = warmingFactorMapping[warmingFactorSelect] || parseFloat(warmingFactorSelect);
    }

    if (occupancySelect === 'user specify (fraction of full occupancy)') {
        occupancyValue = parseFloat(userSpecifyOccupancyInput.value);
    } else {
        occupancyValue = occupancyMapping[occupancySelect] || parseFloat(occupancySelect);
    }

    if (lTODistSelect === 'user specify LTO distance') {
        lTODistValue = parseInt(userSpecifyLTODistInput.value);
    } else {
        lTODistValue = lTODistMapping[lTODistSelect] || parseInt(lTODistSelect);
    }

    if (loadingFactorSelect === 'user specify loading factor') {
        loadingFactorValue = parseInt(userSpecifyLoadingFactorInput.value);
    } else {
        loadingFactorValue = LoadingFactorMapping[loadingFactorSelect] || parseInt(loadingFactorSelect);
    }
    
    
    //forulma  
  const ghg = (trips*((distanceValue-lTODistValue*lTOValue)*warmingFactorValue*airCraftTypeValue/1000+lTOValue*lTOghTypeValue)
  *(1-loadingFactorValue/100)/occupancyValue*seatTypeValue);

    return ghg;
}

// Step 2: event listeners to input elements
tripsInput.addEventListener('input', updateTableRowValues);
distanceSelect.addEventListener('change', updateTableRowValues);
seatTypeSelect.addEventListener('change', updateTableRowValues);
airCraftSelect.addEventListener('change', updateTableRowValues);
lTOghSelect.addEventListener('change', updateTableRowValues);
stopOverSelect.addEventListener('change', updateTableRowValues);
warmingFactorSelect.addEventListener('change', updateTableRowValues);
occupancySelect.addEventListener('change', updateTableRowValues);
lTODistSelect.addEventListener('change', updateTableRowValues);
loadingFactorSelect.addEventListener('change', updateTableRowValues);

userSpecifydistanceInput.addEventListener('input', updateTableRowValues);
userSpecifyseatTypeInput.addEventListener('input', updateTableRowValues);
userSpecifyCruiseghInput.addEventListener('input', updateTableRowValues);
userSpecifyLTOghInput.addEventListener('input', updateTableRowValues);
userSpecifyStopOverInput.addEventListener('input', updateTableRowValues);
userSpecifyWarmingFactorInput.addEventListener('input', updateTableRowValues);
userSpecifyOccupancyInput.addEventListener('input', updateTableRowValues);
userSpecifyLTODistInput.addEventListener('input', updateTableRowValues);
userSpecifyLoadingFactorInput.addEventListener('input', updateTableRowValues);



// Step 3: Update ghg value in the table
function updateTableRowValues() {
    if (selectedRow) {
        const selectedCells = selectedRow.querySelectorAll('td');

        const updatedTrips = parseInt(tripsInput.value);
        const updatedDistance = distanceSelect.value;
        const updatedSeatType = seatTypeSelect.value;
        const updatedAircraftType = airCraftSelect.value;
        const updatedLTOgh = lTOghSelect.value;
        const updateLTO = stopOverSelect.value;
        const updateWarmingFactor = warmingFactorSelect.value;
        const updateOccupancy = occupancySelect.value;
        const updateLTODist = lTODistSelect.value;
        const updateLoadingFactor = loadingFactorSelect.value;


        let distanceValue; 
            // Handle the user-specified distance in the modal view
        if (updatedDistance === 'user-specify-distance') {
            distanceValue = parseInt(userSpecifydistanceInput.value) || 0;
        } else {
            distanceValue = distanceMapping[updatedDistance] || parseInt(updatedDistance) || 0;
        }

        if (updatedSeatType === 'user-specify-seatType') {
            seatTypeValue = parseFloat(userSpecifyseatTypeInput.value) || 0;
        } else {
            seatTypeValue = seatTypeMapping[updatedSeatType] || parseFloat(updatedSeatType) || 0;
        }

        if (updatedAircraftType === 'user-specify-airCraft') {
            airCraftTypeValue = parseInt(userSpecifyCruiseghInput.value) || 0;
        } else {
            airCraftTypeValue = airCraftMapping[updatedAircraftType] || parseInt(updatedAircraftType) || 0;
        }

        if (updatedLTOgh === 'user-specify-LTOgh') {
            lTOghTypeValue = parseInt(userSpecifyLTOghInput.value) || 0;
        } else {
            lTOghTypeValue = lTOghMapping[updatedLTOgh] || parseInt(updatedLTOgh) || 0;
        }

        if (updateLTO === 'user-specify-StopOver') {
            lTOValue = parseInt(userSpecifyStopOverInput.value) || 0;
        } else {
            lTOValue = lTOMapping[updateLTO] || parseInt(updateLTO) || 0;
        }

        if (updateWarmingFactor === 'user-specify-WarmingFactor') {
            warmingFactorValue = parseFloat(userSpecifyWarmingFactorInput.value) || 0;
        } else {
            warmingFactorValue = warmingFactorMapping[updateWarmingFactor] || parseFloat(updateWarmingFactor) || 0;
        }

        if (updateOccupancy === 'user-specify-Occupancy') {
            occupancyValue = parseFloat(userSpecifyOccupancyInput.value) || 0;
        } else {
            occupancyValue = occupancyMapping[updateOccupancy] || parseFloat(updateOccupancy) || 0;
        }

        if (updateLTODist === 'user-specify-LTODist') {
            lTODistValue = parseInt(userSpecifyLTODistInput.value) || 0;
        } else {
            lTODistValue = lTODistMapping[updateLTODist] || parseInt(updateLTODist) || 0;
        }

        if (updateLoadingFactor === 'user-specify-LoadingFactor') {
            loadingFactorValue = parseInt(userSpecifyLoadingFactorInput.value) || 0;
        } else {
            loadingFactorValue = LoadingFactorMapping[updateLoadingFactor] || parseInt(updateLoadingFactor) || 0;
        }

        const ghgs = calculateGHGS(updatedTrips, distanceValue, seatTypeValue, airCraftTypeValue, lTOghTypeValue,lTOValue, warmingFactorValue,occupancyValue,lTODistValue,loadingFactorValue);

        

        selectedCells[0].textContent = ghgs.toFixed(2);
        selectedCells[2].textContent = updatedTrips;

        // Handle the user-specified values  in the table view
        if (updatedDistance === 'user-specify-distance') {
            selectedCells[3].textContent = distanceValue + ' km';
        } else {
            selectedCells[3].textContent = updatedDistance;
        }

        // Handle the user-specified seat type
        if (updatedSeatType === 'user-specify-seatType') {
            selectedCells[4].textContent = seatTypeValue + ' km';
        } else {
            selectedCells[4].textContent = updatedSeatType;
        }
  
    }
    
}

// Function to calculate and update total GHG
function updateTotalDetailedGHG() {
    const ghgCells = document.querySelectorAll('#flightTable tbody td:first-child');
    let totalGHG = 0;

    ghgCells.forEach(cell => {
        totalGHG += parseFloat(cell.textContent);
    });

    // Update the global variable with the new value
    ghgAirDetailedTotal = totalGHG;

   // console.log('Total Detailed  AirTravel GHG:', ghgAirDetailedTotal.toFixed(2)); // Log to the console

    // Recalculate the total of both values whenever this function is called
    totalAirTravelGHG();
}





// Call the updateTotalDetailedGHG function whenever the page loads or the table is updated
window.addEventListener('load', updateTotalDetailedGHG);
// Call the updateTotalDetailedGHG function after adding a new journey
addJourneyButton.addEventListener('click', updateTotalDetailedGHG);

// Call the updateTotalDetailedGHG function after updating a row
flightDetailsModal.addEventListener('click', updateTotalDetailedGHG);

// Call the updateTotalDetailedGHG function after changing a distance or seat type
distanceSelect.addEventListener('change', updateTotalDetailedGHG);
seatTypeSelect.addEventListener('change', updateTotalDetailedGHG);
airCraftSelect.addEventListener('change', updateTotalDetailedGHG);
lTOghSelect.addEventListener('change', updateTableRowValues);
stopOverSelect.addEventListener('change', updateTableRowValues);
warmingFactorSelect.addEventListener('change', updateTableRowValues);
occupancySelect.addEventListener('change', updateTableRowValues);
lTODistSelect.addEventListener('change', updateTableRowValues);
loadingFactorSelect.addEventListener('change', updateTableRowValues);

userSpecifydistanceInput.addEventListener('input', updateTotalDetailedGHG);
userSpecifyseatTypeInput.addEventListener('input', updateTotalDetailedGHG);
userSpecifyCruiseghInput.addEventListener('input', updateTotalDetailedGHG);
userSpecifyLTOghInput.addEventListener('input', updateTableRowValues);
userSpecifyLTOghInput.addEventListener('input', updateTableRowValues);
userSpecifyWarmingFactorInput.addEventListener('input', updateTableRowValues);
userSpecifyOccupancyInput.addEventListener('input', updateTableRowValues);
userSpecifyLTODistInput.addEventListener('input', updateTableRowValues);
userSpecifyLoadingFactorInput.addEventListener('input', updateTableRowValues);


/*
Console log error messages
*/

function validateInput(inputValue) {
    if (isNaN(inputValue) || inputValue < 0) {
      return false; // Return false for invalid input
    }
    return true; // Return true for valid input
  }
  

//  tripsInput field
tripsInput.addEventListener('input', function () {
    const inputValue = parseInt(tripsInput.value);
    if (!validateInput(inputValue)) {
      console.error('Invalid input for trips: Please enter a vaild or non-negative number.');
      tripsInput.value = '';
    } else {
      // Proceed with the calculation
      updateTableRowValues();
    }
  });

  // userSpecifydistanceInput field
userSpecifydistanceInput.addEventListener('input', function () {
    const inputValue = parseInt(userSpecifydistanceInput.value);
    if (!validateInput(inputValue)) {
      console.error('Invalid input for user-specified distance: Please enter a vaild or non-negative number.');
      // Clear the input field:
      userSpecifydistanceInput.value = '';
    } else {
      // Proceed with the calculation
      updateTableRowValues();
    }
  });
    // userSpecifyseatTypeInput field
  userSpecifyseatTypeInput.addEventListener('input', function () {
    const inputValue = parseInt(userSpecifyseatTypeInput.value);
    if (!validateInput(inputValue)) {
      console.error('Invalid input for user-specified seat type: Please enter a vaild or non-negative number.');
      // Clear the input field:
      userSpecifyseatTypeInput.value = '';
    } else {
      // Proceed with the calculation
      updateTableRowValues();
    }
  });
    // userSpecifyCruiseghInput field
    userSpecifyCruiseghInput.addEventListener('input', function () {
    const inputValue = parseInt(userSpecifyCruiseghInput.value);
    if (!validateInput(inputValue)) {
      console.error('Invalid input for user-specified aircraft type: Please enter a vaild or non-negative number.');
      // Clear the input field:
      userSpecifyCruiseghInput.value = '';
    } else {
      // Proceed with the calculation
      updateTableRowValues();
    }
  });

    // userSpecifyLTOghInput field
    userSpecifyLTOghInput.addEventListener('input', function () {
        const inputValue = parseInt(userSpecifyLTOghInput.value);
        if (!validateInput(inputValue)) {
          console.error('Invalid input for user-specified landing emissons: Please enter a vaild or non-negative number.');
          // Clear the input field:
          userSpecifyLTOghInput.value = '';
        } else {
          // Proceed with the calculation
          updateTableRowValues();
        }
      });

    // userSpecifyStopOverInput field
    userSpecifyStopOverInput.addEventListener('input', function () {
        const inputValue = parseInt(userSpecifyStopOverInput.value);
        if (!validateInput(inputValue)) {
          console.error('Invalid input for user-specified Stop Over: Please enter a vaild or non-negative number.');
          // Clear the input field:
          userSpecifyStopOverInput.value = '';
        } else {
          // Proceed with the calculation
          updateTableRowValues();
        }
      });

    // userSpecifyWarmingFactorInput field
    userSpecifyWarmingFactorInput.addEventListener('input', function () {
        const inputValue = parseInt(userSpecifyWarmingFactorInput.value);
        if (!validateInput(inputValue)) {
          console.error('Invalid input for user-specified Warming Factor: Please enter a vaild or non-negative number.');
          // Clear the input field:
          userSpecifyWarmingFactorInput.value = '';
        } else {
          // Proceed with the calculation
          updateTableRowValues();
        }
      });

    // userSpecifyOccupancyInput field
    userSpecifyOccupancyInput.addEventListener('input', function () {
        const inputValue = parseInt(userSpecifyOccupancyInput.value);
        if (!validateInput(inputValue)) {
          console.error('Invalid input for user-specified Occupancy: Please enter a vaild or non-negative number.');
          // Clear the input field:
          userSpecifyOccupancyInput.value = '';
        } else {
          // Proceed with the calculation
          updateTableRowValues();
        }
      });

    // userSpecifyLTODistInput field
    userSpecifyLTODistInput.addEventListener('input', function () {
        const inputValue = parseInt(userSpecifyLTODistInput.value);
        if (!validateInput(inputValue)) {
          console.error('Invalid input for user-specified landing distance: Please enter a vaild or non-negative number.');
          // Clear the input field:
          userSpecifyLTODistInput.value = '';
        } else {
          // Proceed with the calculation
          updateTableRowValues();
        }
      });

    // userSpecifyLoadingFactorInput field
    userSpecifyLoadingFactorInput.addEventListener('input', function () {
        const inputValue = parseInt(userSpecifyLoadingFactorInput.value);
        if (!validateInput(inputValue)) {
          console.error('Invalid input for user-specified loading factor: Please enter a vaild or non-negative number.');
          // Clear the input field:
          userSpecifyLoadingFactorInput.value = '';
        } else {
          // Proceed with the calculation
          updateTableRowValues();
        }
      });



      