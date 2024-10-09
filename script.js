async function searchCountries() {
    const query = document.getElementById('search-bar').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 

    if (query.length === 0) {
        return; 
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
        const countries = await response.json();

        countries.forEach(country => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                <h3>${country.name.common}</h3>
            `;

            card.addEventListener('click', () => showDetails(country));

            resultsDiv.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching country data:', error);
    }
}

function showDetails(country) {
    document.getElementById('search-section').style.display = 'none';
    document.getElementById('details-section').style.display = 'block';

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
    document.getElementById('search-section').style.display = 'block';
    document.getElementById('details-section').style.display = 'none';
}
