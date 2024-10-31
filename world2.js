// Wait until the content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the selected country name from local storage
    const country = localStorage.getItem("country");
    if (country) {
        // Fetch country data from the REST API using the country name
        fetch(`https://restcountries.com/v3.1/name/${country}`)
            .then((response) => response.json())
            .then((data) => {
                const countryData = data[0];  // Access the first result

                // Display basic country details
                document.getElementById("demo1").innerHTML = `Country: ${countryData.name.common}`;
                document.getElementById("demo2").innerHTML = `Capital: ${countryData.capital ? countryData.capital[0] : "N/A"}`;
                document.getElementById("demo3").innerHTML = `Population: ${countryData.population.toLocaleString()}`;
                document.getElementById("area").innerHTML = `Area: ${countryData.area.toLocaleString()} km²`;
                document.getElementById("continent").innerHTML = `Continent: ${countryData.continents[0]}`;
                document.getElementById("region").innerHTML = `Region: ${countryData.region}`;
                document.getElementById("subregion").innerHTML = `Subregion: ${countryData.subregion}`;
                document.getElementById("languages").innerHTML = `Languages: ${Object.values(countryData.languages).join(", ")}`;
                document.getElementById("timezones").innerHTML = `Time Zone(s): ${countryData.timezones.join(", ")}`;
                document.getElementById("location").innerHTML = `Location: Latitude ${countryData.latlng[0]}, Longitude ${countryData.latlng[1]}`;

                // Set images for the country's flag and coat of arms (if available)
                document.getElementById("flag").src = countryData.flags.png;
                document.getElementById("coatOfArms").src = countryData.coatOfArms?.png || '';
                
                // Set link to open the country's location on Google Maps
                document.getElementById("mapLink").href = `https://www.google.com/maps/search/?api=1&query=${countryData.latlng[0]},${countryData.latlng[1]}`;

                // If there are nearby countries, fetch and display them
                if (countryData.borders) {
                    const borderCodes = countryData.borders.join(",");  // Join country codes for the API request
                    fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`)
                        .then((response) => response.json())
                        .then((neighborData) => {
                            // Display flags and names of nearby countries with clickable Google Maps links
                            const nearbyCountries = neighborData
                                .map((neighbor) => `
                                    <a href="https://www.google.com/maps/search/?api=1&query=${neighbor.latlng[0]},${neighbor.latlng[1]}" target="_blank" class="neighbor-country-link">
                                        <img src="${neighbor.flags.png}" alt="${neighbor.name.common} Flag" class="neighbor-country-flag">
                                        ${neighbor.name.common}
                                    </a>
                                `)
                                .join(", ");
                            document.getElementById("nearbyCountries").innerHTML = `Nearby Countries: ${nearbyCountries}`;
                        })
                        .catch((error) => {
                            console.error("Error fetching neighboring countries data:", error);
                            document.getElementById("nearbyCountries").innerHTML = "Nearby Countries: N/A";
                        });
                } else {
                    // Display message if no neighboring countries are found
                    document.getElementById("nearbyCountries").innerHTML = "Nearby Countries: None";
                }
                
                // Add to Favorites functionality
                document.getElementById("addToFavorite").addEventListener("click", () => {
                    // Prepare favorite country data to save
                    const favoriteData = {
                        name: countryData.name.common,
                        capital: countryData.capital ? countryData.capital[0] : "N/A",
                        population: countryData.population,
                        area: countryData.area,
                        continent: countryData.continents[0],
                        region: countryData.region,
                        flag: countryData.flags.png  // Save flag URL
                    };

                    // Retrieve existing favorites from local storage or initialize as an empty array
                    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                    // Add new favorite country to the list and save back to local storage
                    favorites.push(favoriteData);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    
                    // Show confirmation message
                    alert("Country added to favorites!");
                });

            })
            .catch((error) => {
                console.error("Error fetching country data:", error);
            });
    }
});
