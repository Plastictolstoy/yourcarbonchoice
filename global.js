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

    // Add event listeners to the buttons
    quickTabButton.addEventListener("click", function () {
        switchTab("Quick");
        setActiveTab(quickTabButton);
    });

    detailedTabButton.addEventListener("click", function () {
        switchTab("Detailed");
        setActiveTab(detailedTabButton);
    });

    // Call switchTab to ensure Quick tab is displayed first
    switchTab("Quick");
    setActiveTab(quickTabButton); // Set the "Quick" button as active by default
});


// FUNCTION TO OPEN INFO BOX
document.addEventListener("DOMContentLoaded", function() {
    const infoButton = document.getElementById("infoButton");
    const infoBox = document.getElementById("infoBox");
    const closeInfoBoxButton = document.getElementById("closeInfoBoxButton");

    if (infoButton && infoBox && closeInfoBoxButton) {
        infoButton.addEventListener("click", function() {
            // Show the infoBox
            infoBox.style.display = "block";
        });

        closeInfoBoxButton.addEventListener("click", function() {
            // Hide the infoBox when close button is clicked
            infoBox.style.display = "none";
        });
    }
});


//@@TEST getting from old global file
// Function to update the total GHG for air travel
function totalAirTravelGHG() {
    // Calculate ghgAirDetailedTotal here
    const ghgCells = document.querySelectorAll('#flightTable tbody td:first-child');
    let totalGHG = 0;

    ghgCells.forEach(cell => {
        totalGHG += parseFloat(cell.textContent);
    });

    ghgAirDetailedTotal = totalGHG;

    const totalOfBothAir = ghgAirQuickTotal + ghgAirDetailedTotal;

    if (!isNaN(totalOfBothAir)) {
       // console.log('Total of Both:', totalOfBothAir.toFixed(2));

        // Update the HTML element with the calculated total
        document.getElementById('totalAirGHG').innerHTML = totalOfBothAir.toFixed(2);

        // Trigger combinedTotalGHG when air travel GHG changes
        combinedTotalGHG();

        return totalOfBothAir;
    } else {
        console.error('Error: Total of Both is not a valid number.');
        return null; // Handle the error gracefully
    }
}

// Function to update the total GHG for public transport
function totalPublicTransportGHG() {
    // Calculate ghgPublicTransDetailedTotal here
    const ghgCells = document.querySelectorAll('#publicTransportTable tbody td:first-child');
    let totalGHG = 0;

    ghgCells.forEach(cell => {
        totalGHG += parseFloat(cell.textContent);
    });

    ghgAirDetailedTotal = totalGHG;

    const totalOfBothPublicTransport = ghgPublicTransQuickTotal + ghgPublicTransDetailedTotal;

    if(!isNaN(totalOfBothPublicTransport)){
        // Update the HTML element with the calculated total
        document.getElementById('totalTransport').innerHTML = totalOfBothPublicTransport.toFixed(2);

        combinedTotalGHG();

        return totalOfBothPublicTransport;
    }
    else{
        console.error('Error: Total of Both is not a valid number.');
        return null; // Handle the error gracefully
    }
}

// Function to update the combined total GHG
function combinedTotalGHG() {
    // Get the latest values for air travel and transport GHG
    const airTravelGHG = parseFloat(document.getElementById('totalAirGHG').textContent) || 0;
    const transportGHG = parseFloat(document.getElementById("totalTransport").textContent) || 0;

    // Calculate the combined total
    const result = airTravelGHG + transportGHG;

    // Display the result in the "totalGHG" div
    const totalGHGDiv = document.getElementById("totalGHG");
    if (totalGHGDiv) {
        totalGHGDiv.textContent = result.toFixed(2); // Display the result with two decimal places
    } else {
        console.error('Error: "totalGHG" div not found.');
    }
}

// Call the functions when needed, for example, when the page loads
window.addEventListener('load', function () {
    totalAirTravelGHG();
    totalPublicTransportGHG();
    combinedTotalGHG();
});
