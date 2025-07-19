// Initialize an empty cart array
let cart = [];

// Function to add an item to the cart
function addToCart(name, price) {
    // Check if the item is already in the cart
    let existingItem = cart.find(item => item.name === name);
    
    // If item exists, increase its quantity
    if (existingItem) {
        existingItem.quantity++;
    } else {
        // Otherwise, add a new item to the cart
        cart.push({ name, price, quantity: 1 });
    }
    updateCartDisplay();
    saveCart();
}

// Function to update the cart on the page
function updateCartDisplay() {
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotalContainer = document.getElementById("cart-total");
    let placeOrderButton = document.getElementById("place-order");

    if (!cartItemsContainer || !cartTotalContainer || !placeOrderButton) {
        console.error("Cart elements not found!");
        return;
    }

    cartItemsContainer.innerHTML = "";
    let total = 0;

    // Loop through each item in the cart to display it
    cart.forEach(item => {
        total += item.price * item.quantity;
        let listItem = document.createElement("li");
        listItem.innerHTML = `${item.name} - ${item.quantity} x ₱${item.price} = ₱${(item.price * item.quantity).toFixed(2)} 
        <button onclick="removeFromCart('${item.name}')">Remove</button>`;
        cartItemsContainer.appendChild(listItem);
    });

    // Update the total price on the cart page
    cartTotalContainer.textContent = total.toFixed(2);

    // Display or hide the "Place Order" button
    placeOrderButton.style.display = cart.length > 0 ? "block" : "none";
    document.getElementById("cart-section").style.display = cart.length > 0 ? "block" : "none";
}

// Function to remove an item from the cart
function removeFromCart(name) {
    // Remove the item from the cart
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
    saveCart();
}

// Function to place the order
function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to the cart before placing an order.");
        return;
    }

    // Prepare the order data
    const orderData = { items: cart };

    // Save the order data in localStorage for access in order.html
    localStorage.setItem("orderData", JSON.stringify(orderData));

    // Redirect to order.html
    window.location.href = "order.html";
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Call the loadCart function when the page loads
document.addEventListener("DOMContentLoaded", function() {
    loadCart();
});

// Event listeners for adding items to the cart
document.querySelectorAll(".product-card button").forEach(button => {
    button.addEventListener("click", function() {
        const productCard = button.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = parseFloat(productCard.querySelector("p:nth-of-type(3)").textContent.replace("₱", ""));
        
        addToCart(productName, productPrice);
    });
});
