// FUNCTION TO OPEN INFO BOX
document.addEventListener("DOMContentLoaded", function () {
    const infoButton = document.getElementById("infoButton");
    const infoBox = document.getElementById("infoBox");
    const closeInfoBoxButton = document.getElementById("closeInfoBoxButton");

    if (infoButton && infoBox && closeInfoBoxButton) {
        infoButton.addEventListener("click", function () {
            // Show the infoBox
            infoBox.style.display = "block";
        });

        closeInfoBoxButton.addEventListener("click", function () {
            // Hide the infoBox when close button is clicked
            infoBox.style.display = "none";
        });
    }
});