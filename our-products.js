function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}

// Load crackers data from JSON file
let crackers = [];


// Initialize cart from localStorage or set it as an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Pagination variables
const itemsPerPage = 10;
let currentPage = 1;
let filteredCrackers = crackers; // Store the filtered list for pagination

// Load crackers on the main page (index.html)
document.addEventListener("DOMContentLoaded", async () => {
    if (document.getElementById("crackersList")) {
        try {
            const response = await fetch('/data/crackers.json');
            crackers = await response.json();
            displayCrackers(crackers);
            displayPagination(crackers);
        } catch (error) {
            console.error('Error loading crackers data:', error);
            document.getElementById("crackersList").innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
    }
});

// Function to display crackers on index.html with pagination
function displayCrackers(crackerList) {
    const crackersListDiv = document.getElementById("crackersList");
    if (!crackersListDiv) return;

    crackersListDiv.innerHTML = ""; // Clear previous content

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedList = crackerList.slice(startIndex, endIndex);

    paginatedList.forEach((cracker) => {
        const crackerDiv = document.createElement("div");
        crackerDiv.classList.add("cracker-item");
        crackerDiv.innerHTML = `
            <img src="${cracker.image}" alt="${cracker.name}">
            <div class="cracker-details">
                <h2>${cracker.name}</h2>
                <p>${cracker.description}</p>
                <p>Price: ₹${cracker.price} per unit</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(event, '${cracker.name}', -1)">-</button>
                    <span>${cracker.quantity}</span>
                    <button onclick="updateQuantity(event, '${cracker.name}', 1)">+</button>
                </div>
                <button class="buy-btn" onclick="addToCart('${cracker.name}')">Add to Cart</button>
            </div>
        `;
        crackersListDiv.appendChild(crackerDiv);
    });
}

// Function to display pagination controls
function displayPagination(crackerList) {
    const paginationDiv = document.getElementById("pagination");
    if (!paginationDiv) return;

    paginationDiv.innerHTML = ""; // Clear previous content

    const totalItems = crackerList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // If there's only one page, hide the pagination controls
    if (totalPages <= 1) {
        paginationDiv.style.display = "none";
        return;
    } else {
        paginationDiv.style.display = "flex";
    }

    // Previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.className = currentPage === 1 ? "disabled" : "";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayCrackers(crackerList);
            displayPagination(crackerList);
        }
    };
    paginationDiv.appendChild(prevButton);

    // Page numbers with ellipsis
    const maxVisiblePages = 5; // Show up to 5 page numbers at a time
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
        const firstPage = document.createElement("button");
        firstPage.textContent = "1";
        firstPage.onclick = () => {
            currentPage = 1;
            displayCrackers(crackerList);
            displayPagination(crackerList);
        };
        paginationDiv.appendChild(firstPage);

        if (startPage > 2) {
            const ellipsis = document.createElement("span");
            ellipsis.textContent = "...";
            ellipsis.className = "ellipsis";
            paginationDiv.appendChild(ellipsis);
        }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? "active" : "";
        pageButton.onclick = () => {
            currentPage = i;
            displayCrackers(crackerList);
            displayPagination(crackerList);
        };
        paginationDiv.appendChild(pageButton);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement("span");
            ellipsis.textContent = "...";
            ellipsis.className = "ellipsis";
            paginationDiv.appendChild(ellipsis);
        }

        const lastPage = document.createElement("button");
        lastPage.textContent = totalPages;
        lastPage.onclick = () => {
            currentPage = totalPages;
            displayCrackers(crackerList);
            displayPagination(crackerList);
        };
        paginationDiv.appendChild(lastPage);
    }

    // Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.className = currentPage === totalPages ? "disabled" : "";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayCrackers(crackerList);
            displayPagination(crackerList);
        }
    };
    paginationDiv.appendChild(nextButton);
}

// Function to update quantity
function updateQuantity(event, name, change) {
    event.preventDefault(); // Prevent any default behavior (e.g., page refresh)

    // Find the item in the original crackers array by name
    const cracker = crackers.find(item => item.name === name);
    if (cracker) {
        cracker.quantity += change;
        if (cracker.quantity < 1) cracker.quantity = 1; // Minimum quantity is 1
    }

    // Reapply the search filter to update the displayed list
    searchCrackers();
}

// Function to search crackers with sorting
function searchCrackers() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();

    // Reset to the first page when searching
    currentPage = 1;

    // If search term is empty, display all crackers in original order
    if (!searchTerm) {
        filteredCrackers = crackers;
        displayCrackers(filteredCrackers);
        displayPagination(filteredCrackers);
        return;
    }

    // Filter crackers that match the search term
    filteredCrackers = crackers.filter(cracker => 
        cracker.name.toLowerCase().includes(searchTerm) || 
        cracker.description.toLowerCase().includes(searchTerm)
    );

    // Sort filtered crackers based on relevance
    filteredCrackers.sort((a, b) => {
        const searchTermLower = searchTerm.toLowerCase();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        const aDescLower = a.description.toLowerCase();
        const bDescLower = b.description.toLowerCase();

        // Calculate scores for sorting
        let aScore = 0;
        let bScore = 0;

        // Exact match in name (highest priority)
        if (aNameLower === searchTermLower) aScore += 100;
        if (bNameLower === searchTermLower) bScore += 100;

        // Name starts with search term (high priority)
        if (aNameLower.startsWith(searchTermLower)) aScore += 50;
        if (bNameLower.startsWith(searchTermLower)) bScore += 50;

        // Search term found in name (medium priority)
        if (aNameLower.includes(searchTermLower)) aScore += 20;
        if (bNameLower.includes(searchTermLower)) bScore += 20;

        // Search term found in description (low priority)
        if (aDescLower.includes(searchTermLower)) aScore += 10;
        if (bDescLower.includes(searchTermLower)) bScore += 10;

        // Sort in descending order (higher score comes first)
        return bScore - aScore;
    });

    // Display the sorted filtered crackers with pagination
    displayCrackers(filteredCrackers);
    displayPagination(filteredCrackers);
}

// Function to add to cart
function addToCart(name) {
    // Find the item in the original crackers array by name
    const cracker = crackers.find(item => item.name === name);
    if (!cracker) return; // If the item isn't found, exit

    // Create a copy of the cracker object
    const crackerToAdd = { ...cracker };
    const cartItem = cart.find(item => item.name === crackerToAdd.name);

    if (cartItem) {
        cartItem.quantity += crackerToAdd.quantity; // Increase quantity if item already exists
    } else {
        cart.push({ ...crackerToAdd }); // Add new item to cart
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${crackerToAdd.name} added to cart!`);
}

// Function to display cart on cart.html
function displayCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    if (!cartItemsDiv) return;

    // Reload cart from localStorage to ensure we have the latest data
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItemsDiv.innerHTML = ""; // Clear previous content

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-details">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <p>Price: $${item.price} per unit</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });
}

// Function to clear the cart
function clearCart() {
    cart = []; // Empty the cart array
    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
    displayCart(); // Refresh the cart display
}

// Function to calculate total price and number of items
function calculateCartTotals() {
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        totalItems += item.quantity;
    });

    return { totalPrice: totalPrice.toFixed(2), totalItems };
}

// Function to trigger firecracker animation
function triggerFirecrackerAnimation() {
    const animationContainer = document.getElementById("animationContainer");
    if (!animationContainer) return;

    // Clear any existing animations
    animationContainer.innerHTML = "";

    // Create multiple rockets
    for (let i = 0; i < 5; i++) {
        const rocket = document.createElement("div");
        rocket.classList.add("rocket");
        // Randomize the horizontal position (between 10% and 90% of the viewport width)
        rocket.style.left = `${10 + Math.random() * 80}%`;
        // Randomize the animation delay (between 0 and 0.5s)
        rocket.style.animationDelay = `${Math.random() * 0.5}s`;

        // Add burst effect when the rocket reaches the top
        rocket.addEventListener("animationend", () => {
            // Create a burst container
            const burst = document.createElement("div");
            burst.classList.add("burst");
            burst.style.left = rocket.style.left;
            burst.style.top = "20%"; // Burst near the top of the screen

            // Add a flash effect
            const flash = document.createElement("div");
            flash.classList.add("flash");
            flash.style.left = `calc(${rocket.style.left} - 50px)`; // Center the flash
            flash.style.top = "20%";
            animationContainer.appendChild(flash);

            // First layer of sparkles (larger spread)
            for (let j = 0; j < 20; j++) {
                const sparkle = document.createElement("div");
                sparkle.classList.add("sparkle");
                // Randomize the direction and distance of the sparkle
                const angle = Math.random() * 360;
                const distance = 50 + Math.random() * 100; // Wider spread (50px to 150px)
                sparkle.style.setProperty("--x", `${Math.cos(angle * Math.PI / 180) * distance}px`);
                sparkle.style.setProperty("--y", `${Math.sin(angle * Math.PI / 180) * distance}px`);
                sparkle.style.animationDelay = `${Math.random() * 0.2}s`;
                burst.appendChild(sparkle);
            }

            // Second layer of sparkles (smaller spread, delayed)
            for (let j = 0; j < 15; j++) {
                const sparkle = document.createElement("div");
                sparkle.classList.add("sparkle", "secondary");
                // Randomize the direction and distance of the secondary sparkle
                const angle = Math.random() * 360;
                const distance = 30 + Math.random() * 70; // Smaller spread (30px to 100px)
                sparkle.style.setProperty("--x", `${Math.cos(angle * Math.PI / 180) * distance}px`);
                sparkle.style.setProperty("--y", `${Math.sin(angle * Math.PI / 180) * distance}px`);
                sparkle.style.animationDelay = `${Math.random() * 0.2 + 0.3}s`; // Delayed start
                burst.appendChild(sparkle);
            }

            animationContainer.appendChild(burst);
        });

        animationContainer.appendChild(rocket);
    }
}

// Function to download cart as PDF and clear the cart
function downloadCartPDF() {
    // Check if cart is empty
    if (cart.length === 0) {
        alert("Your cart is empty. Add items to download a PDF.");
        return;
    }

    // Trigger the firecracker animation
    triggerFirecrackerAnimation();

    // Delay the PDF generation slightly to let the animation start
    setTimeout(() => {
        // Get jsPDF from the global window object
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text("Cart List", 10, 10);

        // Add table header
        doc.setFontSize(12);
        doc.text("Item Name", 10, 20);
        doc.text("Quantity", 60, 20);
        doc.text("Price per Unit", 90, 20);
        doc.text("Total Price", 130, 20);

        // Add table rows
        let yPosition = 30;
        cart.forEach((item, index) => {
            doc.text(item.name, 10, yPosition);
            doc.text(item.quantity.toString(), 60, yPosition);
            doc.text(`$${item.price}`, 90, yPosition);
            doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 130, yPosition);
            yPosition += 10;
        });

        // Calculate totals
        const { totalPrice, totalItems } = calculateCartTotals();

        // Add totals
        yPosition += 10;
        doc.setFontSize(14);
        doc.text(`Total Items: ${totalItems}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Total Price: $${totalPrice}`, 10, yPosition);

        // Save the PDF
        doc.save("cart-list.pdf");

        // Clear the cart after PDF download
        clearCart();
        alert("PDF downloaded successfully! Your cart has been cleared.");
    }, 1000); // Increased delay to 1000ms to let the grand animation play out
}