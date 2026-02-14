// Product data (dynamic - easy to edit)
const products = [
    { name: 'Plain Pan', price: 20, img: 'pan.jpg' },
    { name: 'Rose Masala Pan', price: 50, img: 'masala pan.jpg' },
    { name: 'Chocolate Masala Pan', price: 60, img: 'chocolate.jpg' },
];

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartDisplay();

// Function to display products dynamically
function displayProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;  // Prevent error if container doesn't exist
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" width="150">
            <h4>${product.name}</h4>
            <p>₹${product.price} per pack</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

// Add to cart
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    alert(`${name} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `<div>${item.name} x${item.quantity} - ₹${item.price * item.quantity}</div>`).join('');
    }
    if (cartTotal) cartTotal.textContent = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Checkout and modal logic
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('products-container'); // For products page
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log('Checkout clicked'); // Debug log - remove after testing
            if (cart.length === 0) {
                alert('Cart is empty!');
                return;
            }
            
            // Read name and phone from page fields
            const name = document.getElementById('customer-name').value.trim();
            const phone = document.getElementById('customer-phone').value.replace(/\s/g, '');
            
            // Validation
            if (!name) {
                alert('Please enter your name.');
                return;
            }
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }
            
            // Formatted order details
            const orderDetails = cart.map(item => `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`).join('\n');
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Structured WhatsApp message with your desired content
            const message = '🧾✨ Order Confirmed – Nilam Pan Shop 👑🍃\n\n' +
                            'Thank you for your royal order! 🎉\n' +
                            `*Customer Name:* ${name}\n` +
                            `*Mobile Number:* ${phone}\n\n` +
                            '📦 Order Details:\n' +
                            `*Order Details:*\n${orderDetails}\n\n` +
                            `*Total Bill:* ₹${total}\n\n` +
                            '💰 Total Amount: ₹' + total + '\n\n' +
                            'Your freshly handcrafted paan is being prepared with premium ingredients. 🍃✨\n\n' +
                            '📍 We’ll notify you once it’s ready!\n' +
                            'Thank you for choosing Nilam Pan Shop – Where Every Bite Feels Royal 👑';
            
            const whatsappURL = `https://wa.me/7507426786?text=${encodeURIComponent(message)}`;  // Your number
            window.open(whatsappURL, '_blank');
            
            // Reset cart
            cart = [];
            localStorage.removeItem('cart');
            updateCartDisplay();
            alert('Order submitted!');
        });
    }
});