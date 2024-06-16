
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('ghgChart').getContext('2d');


    //** THESE ARE STILL SAMPLE VALUES WHICH IS HARDOCDED AND STILL NOT DYNAMIC */
    // Fetch data from hidden divs
    const airTravelEmissions = parseFloat(document.getElementById('totalAirGHG').textContent);
    const transportEmissions = parseFloat(document.getElementById('totalTransport').textContent);
    const clothesDryerEmissions = parseFloat(document.getElementById('totalClothesDryerGHG').textContent);
    const lightingEmissions = parseFloat(document.getElementById('totalLightingGHG').textContent);

    // Prepare the data for the chart
    const data = {
        labels: ['Transport','Air Travel',  'Clothes Dryer', 'Lighting'],
        datasets: [{
            label: 'Total GHG Emissions (kg CO2-eq)',
            data: [transportEmissions , airTravelEmissions,  clothesDryerEmissions, lightingEmissions],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Configuration for the chart
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    // Render the chart
    const ghgChart = new Chart(ctx, config);

    // PDF Export
    document.getElementById('exportButton').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text('GHG Emissions Report', 10, 10);
        doc.addPage();
        doc.text('Details of GHG Emissions:', 10, 20);

        // List emissions data
        doc.text(`Air Travel: ${airTravelEmissions} kg CO2-eq`, 10, 30);
        doc.text(`Transport: ${transportEmissions} kg CO2-eq`, 10, 40);
        doc.text(`Clothes Dryer: ${clothesDryerEmissions} kg CO2-eq`, 10, 50);
        doc.text(`Lighting: ${lightingEmissions} kg CO2-eq`, 10, 60);

        // Save the PDF
        doc.save('GHG_Emissions_Report.pdf');
    });
});
