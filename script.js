// Product data (dynamic - easy to edit)
const products = [
    { name: 'Plain Pan', price: 20, img: 'Fresh pan leaves.jpg' },
    { name: 'Rose Masala Pan', price: 50, img: 'masala pan.jpg' },
    { name: 'Chocolate Masala Pan', price: 60, img: 'chocolate.jpg' },
    { name: 'Mint Masala Pan', price: 55, img: 'mint-masala.jpg' },
    { name: 'Spicy Masala Pan', price: 65, img: 'spicy-masala.jpg' }
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
    // Featured products removed, so no call here
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log('Checkout clicked'); // Debug log - remove after testing
            if (cart.length === 0) {
                alert('Cart is empty!');
                return;
            }
            const modal = document.getElementById('order-modal');
            if (modal) modal.style.display = 'block';  // Prevent error if modal missing
        });
    }
    
    // Modal close
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }
    if (modal) {
        window.onclick = (event) => {
            if (event.target === modal) modal.style.display = 'none';
        };
    }
    
    // Confirm order
    const confirmBtn = document.getElementById('confirm-order');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const phone = document.getElementById('modal-phone').value.replace(/\s/g, '');
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }
            const orderDetails = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
            const message = `Order: ${orderDetails}, Total: ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}, Phone: ${phone}`;
            const whatsappURL = `https://wa.me/7507426786?text=${encodeURIComponent(message)}`;  // Replace with your number
            window.open(whatsappURL, '_blank');
            cart = [];
            localStorage.removeItem('cart');
            updateCartDisplay();
            if (modal) modal.style.display = 'none';
            alert('Order submitted!');
        });
    }
});