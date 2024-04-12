// Initialize an empty array to store artworks data
let artworks = [];
let cart = []; // Initialize an empty array to store items in the shopping cart

// Flag to keep track of sign-in status
let isLoggedIn = false;

// Fetching data from db.json using Fetch API
fetch('db.json')
  .then(response => response.json()) // Parse the response as JSON
  .then(data => {
    artworks = data.artwork.flat(); // Store the fetched data in the artworks array
    displayArtworksByCategory(); // Call a function to display artworks in each category
  })
  .catch(error => console.error('Error fetching data:', error)); // Log any errors that occur during fetch

// Function to display artworks in each category
function displayArtworksByCategory() {
  const categories = ['abstract', 'impressionism', 'surrealism', 'realism', 'modern'];
  categories.forEach(category => {
    // Filter artworks based on category
    const categoryArtworks = artworks.filter(artwork => artwork.category.toLowerCase() === category);
    const categoryContainer = document.getElementById(`${category}-artworks`);
    displayArtworksInContainer(categoryArtworks, categoryContainer);
  });
}
// Function to display artworks in a specific container
function displayArtworksInContainer(artworks, container) {
  container.innerHTML = ''; // Clear the previous content of the container
  artworks.forEach(artwork => {
    const artworkElement = createArtworkElement(artwork);
    container.appendChild(artworkElement); // Append each artwork element to the container
  });
}
// Function to create HTML elements for an artwork
function createArtworkElement(artwork) {
  const artworkElement = document.createElement('div'); // Create a <div> for the artwork
  artworkElement.classList.add('artwork'); // Add the 'artwork' class to the div
  artworkElement.innerHTML = `
    <img src="${artwork.image}" alt="${artwork.title}">
    <div class="artwork-info">
      <h3>${artwork.title}</h3>
      <p>By: ${artwork.artist}</p>
      <p>${artwork.description}</p>
      <p>Category: ${artwork.category}</p>
      <p>Price: $${artwork.price}</p>
      <button class="add-to-cart-button" onclick="addToCart(${artwork.id})">Add to Cart</button>
    </div>
  `; // Set the inner HTML of the artwork element

  return artworkElement; // Return the created artwork element
}
