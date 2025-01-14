let timeout;
    let controller;

    function debounceSearch() {
        clearTimeout(timeout);
        timeout = setTimeout(searchCountries, 300); 
    }

async function searchCountries() {
    closeFilterDialog();
    const query = document.getElementById('search-bar').value;
    const region = document.getElementById('region-filter').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 

    if (controller) {
        controller.abort();
    }

    controller = new AbortController();
        const signal = controller.signal;

    if (query.length === 0 && !region) {
        return; 
    }

    const validInput = /^[a-zA-Z\s]*$/;
    if (!validInput.test(query)) {
        resultsDiv.innerHTML = '<p>Unsupported characters entered. Please use letters only.</p>';
        return;
    }

    try {
        let apiUrl
        let countries = [];
        let filteredCountries = [];
        if(query){
            apiUrl = `https://restcountries.com/v3.1/name/${query}`;
            const response = await fetch(apiUrl, {signal});
            if(!response.ok){
                handleHttpError(response.status); 
                return;
            }
            countries = await response.json();
            if(region && response.status === 200){
                filteredCountries = countries.filter(country => country.region === region)
                countries =  filteredCountries
            }


        }else if(!query){
            return
        }

        if (!countries.length) {
            resultsDiv.innerHTML = '<h5>No country found</h5>';
            return;
        }

        // code that creats card by fetching values from the api using given query
        countries.forEach(country => {
                const card = document.createElement('div');
                card.classList.add('card');
    
                card.innerHTML = `
                    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                    <h3>${country.name.common}</h3>
                `;
    
                // adding event listener to go to result page 
                card.addEventListener('click', () => showDetails(country));
    
                resultsDiv.appendChild(card);
            });
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request aborted due to a new request');
        } else {
            console.error('Error fetching country data:', error);
            resultsDiv.innerHTML = '<h5>We are facing some issues in fetching data</h5>';
        }
    }
}

function handleHttpError(status) {
    const resultsDiv = document.getElementById('results');
    switch (status) {
        case 404:
            resultsDiv.innerHTML = '<h5>No country found. Please try a different search.</h5>';
            break;
        case 500:
            resultsDiv.innerHTML = '<h5>Server error. Please try again later.</h5>';
            break;
        default:
            resultsDiv.innerHTML = `<h5>Error: ${status}. Please try again later.</h5>`;
    }
}

function showDetails(country) {
    // creats a detail card about the selected country using the api data.
    document.getElementById('search-section').classList.add('hidden');
    document.getElementById('details-section').classList.remove('hidden');

    const detailsDiv = document.getElementById('country-details');
    detailsDiv.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="200">
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion}</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
        <p><strong>Currencies:</strong> ${Object.values(country.currencies).map(c => c.name).join(', ')}</p>
        
    `;
}

function goBack() {
    document.getElementById('search-section').classList.remove('hidden');
    document.getElementById('details-section').classList.add('hidden');
}

async function populateRegions() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        
        // Extract unique regions
        const regions = new Set(countries.map(country => country.region).filter(Boolean));
        
        // Get the region filter dropdown
        const regionFilter = document.getElementById('region-filter');

        // Populate the dropdown with the unique regions
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching regions:', error);
    }
}
window.onload = populateRegions;


function openFilterDialog() {
    document.getElementById('filter-modal').style.display = 'block';
}

function closeFilterDialog() {
    document.getElementById('filter-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('filter-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

window.searchCountries = searchCountries;
window.showDetails = showDetails;



document.addEventListener("DOMContentLoaded", function() {

    const searchBar = document.getElementById("search-bar");
    const clearButton = document.getElementById("clear-button");

    clearButton.disabled = true;


    searchBar.addEventListener("input", function() {
        
        searchCountries();
    
        
        if (searchBar.value.trim() !== '') {
          clearButton.disabled = false;
        } else {
          clearButton.disabled = true;
        }
      });

      clearButton.addEventListener("click", function() {
        searchBar.value = '';
        clearButton.disabled = true;
    
        searchCountries();
      });

  
    
    document.getElementById("filter-icon").addEventListener("click", openFilterDialog);
    document.querySelector(".close").addEventListener("click", closeFilterDialog);
    document.getElementById("apply-button").addEventListener("click", searchCountries);
  
    
    document.getElementById("back-button").addEventListener("click", goBack);
  });