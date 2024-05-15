// predefines both quick and detailed totals
let ghgClothQuickTotal = 0;
let ghgClothDetailedTotal = 0;

/*
CODE FOR Quick view
*/

//SECTION 1: calculate GHG for Quick view
    //1.1 Make a function that contains variables that refers to each of the elementIDs
    /*function calculateGHGQuick() {
    var typicalDomesticTrips = parseInt(document.getElementById("typicalDomestic").value) 
    }*/

    //1.2 Make variables to be used in components
    //Variables for Dryer Type Efficiency
    var energyUse = 3000;
    var efficiencyFactor = 0.8;
    var ghgCoEf = 0.9;

    //Variables for Usage Frequenecy 
    var dailyUsage = 1;
    var daysActive = 200;

    //Variables for Load Capacity and Wetness
    var baseEnergy = 2000;
    var loadFactor = 0.75;
    var wetnessFact = 1.1;

    //Water Usage (Condenser) 
    var waterUse = 0;
    var waterGHGFactor = 0;

    //Venting and Usage Environment 
    var baseEmissions =  2.16;
    var ventingFactor = 1.05;

    //Ambient Temperature 
    var ambEmmissions = 2.16;
    var tempAdj = 0.95;

    //Alternative Energy Sources 
    var altEmmissions = 2.16;
    var greenENFactor = 0.5;

    //Seasonal Variability 
    var seasonalEmmissions = 2.16;
    var seasonalFactor = 1.1; 
    
    //1.3: Formulas
    //Formula for Dryer Type Efficiency
    var DryerEff = (energyUse *efficiencyFactor *ghgCoEf)/100 ;
    // Enter rest of formulas... 
    var usageFrequency = 0;
    var loadCap = 0;
    var waterUsage =0;
    var ventUsage = 0;
    var ambTemp = 0;
    var altEnergySource = 0;
    var seasonalVariabiliy = 0;

    //1.4 Calculate total emissions for clothes
    var totalResultAir = (typicalDomesticGHG + sydneyPerthGHG + typicalAusAsiaGHG + typicalAusUsaEuropeGHG).toFixed(2);

    ghgAirQuickTotal = parseFloat(totalResultAir);
    //console.log("Total Quick AirTravel GHG:", ghgAirQuickTotal); // Log the value
   
    totalAirTravelGHG();
    //This is a function from global.js that calculates all air

    // 1.5: Change ID's vased on calculated values 
    document.getElementById("typicalDomestic").addEventListener("change", calculateGHGQuick);
    document.getElementById("sydneyPerth").addEventListener("change", calculateGHGQuick);
    document.getElementById("typicalAusAsia").addEventListener("change", calculateGHGQuick);
    document.getElementById("typicalAusUsaEurope").addEventListener("change", calculateGHGQuick);

/*
CODE FOR DETAILED view
*/
    // 1.Gathers values from table
    document.getElementById('detailedFlightOptions').addEventListener('change', function() {
        const selectedValue = this.value; //value from dropdwon user selects for first time
        const tableContainer = document.getElementById('tableContainer');
        const addJourneyDiv = document.getElementById('addJourneyDiv');
        const tableBody = document.getElementById('tableBody');


        //1.1for newly created rows
        // Remove previous event listener for distanceSelect
        distanceSelect.removeEventListener('change', handleDistanceSelectChange);

        //1.2Attach new event listener for distanceSelect
        distanceSelect.addEventListener('change', handleDistanceSelectChange);
        
        //1.3 lears dropdown 
        tableBody.innerHTML = '';
    
        //1.4 Set default values for the columns
        const defaultValues = {
            ghgs: '0.000',
            Id: 'AT1',
            Trips: '0',
            Distance: selectedValue,
            SeatType: 'Economy'
        };
    
        //1.5 Generate and populate table rows based on the default values
        const newRow = document.createElement('tr');
        for (const key in defaultValues) {
            const cell = document.createElement('td');
            cell.textContent = defaultValues[key];
            newRow.appendChild(cell);
        }
        tableBody.appendChild(newRow);
    
        //2. Hide the dropdown and label
        this.style.display = 'none';
        this.previousElementSibling.style.display = 'none';
    
        //2.1Show the table container and add journey button
        tableContainer.style.display = 'block';
        addJourneyDiv.style.display = 'block';
});


//3. Script for Jounery button
    const addJourneyButton = document.getElementById('addJourneyButton');
    const tableBody = document.getElementById('tableBody');
    let idCounter = 2; // Starts Id column from  from AT2
// 3.1 event loop for each time the jounery button is pressed
addJourneyButton.addEventListener('click', function() {
        // 3.12 Make a default value 
        const defaultDistance = "Australia domestic flight";
        const defaultTrips = "0";
        const newId = "AT" + idCounter++;
    
        // 3.13 Allow yourself to make new row 
        const newRow = document.createElement('tr');
        // 3.14 Set column names 
        const columns = ['ghgs', 'Id', 'Trips', 'Distance', 'SeatType'];
    
        //3.15 After creating the new column, set the default values
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

        //    
        tableBody.appendChild(newRow);

    //4. Code for deleting a row in the table
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
        updateTotalDetailedGHG(); // 4.1 Update total GHG after deletion
    });
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);
    newRow.setAttribute('data-row-id', newId);
});

//  4.2 event listener for delete buttons
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
            updateTotalDetailedGHG(); // 4.3 Update total GHG after deletion
        }
    }
});

    // Section 5: Close buttons 
    const flightDetailsModal = document.getElementById('flightDetailsModal');
    const closeModalButton = document.getElementById('closeModalButton');
    
    
// 6. if user leaves a row empty will set it to the default setting
tableBody.addEventListener('click', function(event) {
        const clickedRow = event.target.closest('tr');
        if (!clickedRow) return;
    
        selectedRow = clickedRow;
    
        const cells = clickedRow.querySelectorAll('td');
        tripsInput.value = cells[2].textContent;
        seatTypeSelect.value = cells[4].textContent;
    
        flightDetailsModal.style.display = 'block';
});
    



    // 7.Listen for input changes input modal(Dropdown)

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
    //Make a function that updates the table row values
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

//SECTIONFunction to calculate and update totalGHG
    // Update the global variable with the new value
    // console.log('Total Detailed  AirTravel GHG:', ghgAirDetailedTotal.toFixed(2)); // Log to the console
    // Recalculate the total of both values whenever this function is called

//SECTION: CALLING UPON UPDATE
// Call the updateTotalDetailedGHG function whenever the page loads or the table is updated
// Call the updateTotalDetailedGHG function after adding a new journey
// Call the updateTotalDetailedGHG function after updating a row
// Call the updateTotalDetailedGHG function after changing a distance or seat type

//SECTION: Error Messages
//Console log error messages

