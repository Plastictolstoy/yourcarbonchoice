// Function to generate the flight details table
function generateFlightTable() {
    // Get the selected option from the dropdown
    const selectedOption = document.getElementById("detailedFlightOptions").value;

    // Define table headers
    const tableHeaders = ["GHG", "ID", "Trips", "Distance", "Seat Type"];

    // Create the table element
    const table = document.createElement("table");
    table.classList.add("flight-details-table");

    // Create table header row
    const headerRow = table.insertRow();
    tableHeaders.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Append the table to the container
    const tableContainer = document.getElementById("flightTableContainer");
    tableContainer.innerHTML = ""; // Clear existing content
    tableContainer.appendChild(table);

    // Update the table with initial rows based on selected option
    // For example, you can add some initial rows here based on the selected option
}

// Function to add a new row to the flight details table
function addJourneyRow() {
    const table = document.querySelector(".flight-details-table");

    if (table) {
        const newRow = table.insertRow();

        // Add cells to the new row
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);

        // You can set initial values or leave them empty for user input
        cell1.textContent = ""; // GHG
        cell2.textContent = ""; // ID
        cell3.textContent = ""; // Trips
        cell4.textContent = ""; // Distance
        cell5.textContent = ""; // Seat Type
    }
}

// Event listener for dropdown change
const dropdown = document.getElementById("detailedFlightOptions");
dropdown.addEventListener("change", generateFlightTable);

// Event listener for "Add a journey" button
const addButton = document.getElementById("addJourneyButton");
addButton.addEventListener("click", addJourneyRow);

// Function to add a new row to the flight details table
function addJourneyRow() {
    const table = document.querySelector(".flight-details-table");

    if (table) {
        const newRow = table.insertRow();

        // Add cells to the new row
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);

        // Set initial values for the cells (replace with actual values)
        cell1.textContent = "0.000"; // GHG
        cell2.textContent = "AT1"; // ID
        cell3.textContent = "0"; // Trips
        cell4.textContent = ""; // Distance (to be filled dynamically)
        cell5.textContent = "Economy"; // Seat Type
    }
}

// Event listener for dropdown change
document.getElementById('detailedFlightOptions').addEventListener('change', function() {
    const selectedValue = this.value; // Value from the dropdown selected by the user
    const tableContainer = document.getElementById('flightTableContainer');
    const addJourneyButton = document.getElementById('addJourneyButton');
    const tableBody = document.getElementById('tableBody');

    // Clears table body content
    tableBody.innerHTML = '';

    // Default values for the columns (adjust as needed)
    const defaultValues = {
        ghg: '0.000',
        id: 'AT1',
        trips: '0',
        distance: selectedValue,
        seatType: 'Economy'
    };

    // Generate and populate table row with default values
    const newRow = document.createElement('tr');
    for (const key in defaultValues) {
        const cell = document.createElement('td');
        cell.textContent = defaultValues[key];
        newRow.appendChild(cell);
    }
    tableBody.appendChild(newRow);

    // Show the table container and "Add a journey" button
    tableContainer.style.display = 'block';
    addJourneyButton.style.display = 'block';
});

// Event listener for "Add a journey" button
document.getElementById('addJourneyButton').addEventListener('click', addJourneyRow);
