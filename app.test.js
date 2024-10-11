const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { waitFor } = require('@testing-library/dom');

const { JSDOM } = require('jsdom');
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

// Load the HTML file and initialize jsdom
const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf8');

let dom;
let document;
let window;

beforeEach(() => {
  // Create a JSDOM instance before each test
  dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  document = dom.window.document;
  window = dom.window;

  // Mock window functions
  global.window = window;
  global.document = document;
  global.fetch = fetchMock;

  // Load the script (make sure this is path to your script)
  window.searchCountries =  require('./script.js').searchCountries;


});

afterEach(() => {
  // Cleanup after each test
  fetchMock.resetMocks();
});

// Test for successful landing page
test('renders the landing page correctly', () => {
  const heading = document.querySelector('.heading');
  expect(heading.textContent).toBe('Country Explorer');
  
  const searchBar = document.getElementById('search-bar');
  expect(searchBar).toBeDefined();
});


describe('Search Countries functionality', () => {
    beforeEach(() => {
      // Reset DOM before each test
      document.getElementById('results').innerHTML = '';
      document.getElementById('search-bar').value = '';
    });

    test('should handle empty search input', async () => {
      // No input in the search bar
      const searchBar = document.getElementById('search-bar');
      searchBar.value = '';
  
      await window.searchCountries;
  
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toBe('');
    });
  });
