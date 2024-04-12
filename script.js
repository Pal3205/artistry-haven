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

// Function to simulate buying an artwork
function addToCart(artworkId) {
    const artwork = artworks.find(art => art.id === artworkId);
    if (artwork && !cart.includes(artwork)) {
      cart.push(artwork); // Add artwork to cart if it's not already there
      updateCartButton(); // Update the Cart button text
    }
  }
  
  // Function to update the Cart button text
  function updateCartButton() {
    const cartButton = document.getElementById('cartButton');
    cartButton.textContent = `Cart (${cart.length})`;
  }
  
  // Function to display the cart modal
  function displayCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartModalContent = document.getElementById('cartModalContent');
    const buyButton = document.getElementById('buyButton');
  
    // Clear previous content
    cartModalContent.innerHTML = '';
  
    // Create list of cart items
    const cartList = document.createElement('ul');
    cart.forEach(artwork => {
      const cartItem = document.createElement('li');
      cartItem.textContent = artwork.title;
      cartList.appendChild(cartItem);
    });
  
    cartModalContent.appendChild(cartList);
  
    // Calculate total price
    const totalPrice = cart.reduce((total, artwork) => total + artwork.price, 0);
  
    // Display total price
    const totalPriceElement = document.createElement('p');
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
    cartModalContent.appendChild(totalPriceElement);
  
    // Display buy button
    buyButton.addEventListener('click', () => {
      alert(`Thank you for your purchase! Total: $${totalPrice}`);
      cart = []; // Clear the cart after purchase
      updateCartButton(); // Update the Cart button text
      cartModalContent.innerHTML = ''; // Clear the cart modal content
      cartModal.style.display = 'none'; // Hide the cart modal
    });
  
    cartModal.style.display = 'block'; // Display the cart modal
  }
  
  // Function to close the cart modal
  function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
  }
  
  // Event listener for the Cart button
  const cartButton = document.getElementById('cartButton');
  cartButton.addEventListener('click', displayCartModal);
  
  // Event listener for closing the cart modal
  const cartModalClose = document.getElementById('cartModalClose');
  cartModalClose.addEventListener('click', closeCartModal);
  
  // Event listener for clicking outside the cart modal
  window.addEventListener('click', event => {
    const cartModal = document.getElementById('cartModal');
    if (event.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });
  
  // Function to display artworks when the page loads
  function displayArtworksOnLoad() {
    const allArtworksContainer = document.getElementById('artworks-container');
    displayArtworksByCategory();
  }
  displayArtworksOnLoad(); // Call the function to display artworks when the page loads
  
  // Sell Artwork Modal
  const sellArtworkButton = document.getElementById('sellArtworkButton');
  const sellModal = document.getElementById('sellModal');
  const sellClose = document.getElementsByClassName('close')[1];
  
  sellArtworkButton.onclick = function() {
    sellModal.style.display = 'block';
  }
  
  sellClose.onclick = function() {
    sellModal.style.display = 'none';
  }
  
  window.onclick = function(event) {
    if (event.target == sellModal) {
      sellModal.style.display = 'none';
    }
  }
  
  // Sell Artwork Form Submission
  const sellForm = document.querySelector('#sellForm');
  sellForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(sellForm);
  
    // Function to handle form submission
    const handleFormSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(sellForm);
  
      // Create an object with form data
      const newArtwork = {
        id: artworks.length + 1, // Generate a new ID
        title: formData.get('title'),
        artist: formData.get('artist'),
        description: formData.get('description'),
        image: formData.get('image'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price'))
      };
  
      // Add the new artwork to the local array for display
      artworks.push(newArtwork);
      displayArtworksByCategory(); // Update the displayed artworks
  
      // Reset the form after submission
      sellForm.reset();
  
      // Simulating POST request to update data in db.json
      // You can replace this with your actual POST request if using a server
      fetch('http://localhost:3000/artwork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArtwork),
      })
        .then(response => response.json())
        .then(data => console.log('New artwork added:', data))
        .catch(error => console.error('Error adding artwork:', error));
    };
  
    // Event listener for form submission
    sellForm.addEventListener('submit', handleFormSubmit);
  });
  
  // Sign In Modal
  const signInButton = document.getElementById('signInButton');
  const signInModal = document.getElementById('signInModal');
  const signInClose = document.getElementsByClassName('close')[0];
  
  signInButton.onclick = function() {
    signInModal.style.display = 'block';
  }
  
  signInClose.onclick = function() {
    signInModal.style.display = 'none';
  }
  
  // Function to handle sign in form submission
  const handleSignInSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData(signInForm);
    const signInData = {
      email: formData.get('email'),         // Correctly named as 'email'
      username: formData.get('username'),   // Correctly named as 'username'
      password: formData.get('password')    // Correctly named as 'password'
    };
  
    // Reset the form after submission
    signInForm.reset();
  
    // Simulating POST request to store user data in db.json
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Sign In Failed');
      }
    })
    .then(data => {
      // Assuming the server sends back a response indicating success or failure
      if (data.success) {
        alert('Sign In Successful!');
        isLoggedIn = true; // Update sign-in status
        signInModal.style.display = 'none';
        updateUI(); // Update the UI to reflect sign-in status
      } else {
        alert('Sign In Failed. Please check your credentials.');
      }
    })
    .catch(error => {
      console.error('Error signing in:', error);
      alert('An error occurred while signing in. Please try again later.');
    });
  };
  
  // Event listener for sign in form submission
  const signInForm = document.getElementById('signInForm');
  signInForm.addEventListener('submit', handleSignInSubmit);
  
  // Function to update the UI based on sign-in status
  function updateUI() {
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
  
    if (isLoggedIn) {
      signInButton.style.display = 'none'; // Hide Sign In button if user is signed in
      signOutButton.style.display = 'block'; // Show Sign Out button if user is signed in
    } else {
      signInButton.style.display = 'block'; // Show Sign In button if user is not signed in
      signOutButton.style.display = 'none'; // Hide Sign Out button if user is not signed in
    }
  }
  