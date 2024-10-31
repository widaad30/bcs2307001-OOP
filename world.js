// Function to handle button click, saving the country name and navigating to the results page
function buttonClicked() {
    const world = document.getElementById("world").value.trim();
    if (world) {
        localStorage.setItem("country", world); // Store the country name in local storage
        window.location.href = "world2.html";   // Redirect to results page
    } else {
        alert("Please enter a valid country name."); // Alert if the input is empty
    }
}

// Function to fetch and display random countries from a selected continent
async function showCountries(continent) {
    // Update the continent name and make the flags section visible
    document.getElementById("continent-name").innerText = continent;
    document.getElementById("flags-header").style.display = "block";
    document.getElementById("flags-section").style.display = "flex";

    // Fetch all country data from the API
    const response = await fetch("https://restcountries.com/v3.1/all");
    const allCountries = await response.json();

    // Filter countries based on the selected continent and pick a random subset
    const filteredCountries = allCountries.filter(country => country.continents.includes(continent));
    const randomCountries = filteredCountries.sort(() => 0.5 - Math.random()).slice(0, 5);

    // Display the country flags and names as clickable cards
    document.getElementById("flags-section").innerHTML = randomCountries.map(country => `
        <div class="country-card" onclick="selectCountry('${country.name.common}')">
            <img src="${country.flags.png}" alt="${country.name.common} Flag">
            <p>${country.name.common}</p>
        </div>
    `).join('');
}

// Function to save the selected country and navigate to the results page
function selectCountry(countryName) {
    localStorage.setItem("country", countryName); // Save country name in local storage
    window.location.href = "world2.html";         // Redirect to results page
}
