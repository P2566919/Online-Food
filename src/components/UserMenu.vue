<template>
    <div class="home-container">
        <!-- Top Navigation -->
        <div class="top-nav">
            <div class="logo"> Dangote Foodie</div>
            <div class="nav-links">
                <button @click="goToLogin" v-if="!isAuthenticated">Login</button>
                <button @click="goToSignup" v-if="!isAuthenticated">Sign Up</button>
                <div class="profile-dropdown" v-else>
                    <button @click="toggleDropdown">
                        <i class="fas fa-user-circle"></i>
                    </button>
                    <div class="dropdown-menu" v-if="showDropdown">
                        <button @click="logout">Logout</button>
                    </div>
                </div>
                <button class="cart-button" @click="goToCart">
                    <i class="fas fa-shopping-cart"></i>
                    <span v-if="cartItems.length" class="cart-count">{{ cartItems.length }}</span>
                </button>
            </div>
        </div>

        <!-- Hero Section -->
        <div class="hero-section">
            <h1>Order Your Favorite Food Online</h1>
            <p>Discover the best dishes from top restaurants near you.</p>
            <button class="cta-button" @click="scrollToMenu">Explore Menus</button>
        </div>

        <!-- Food Categories -->
        <div class="food-categories">
            <h2>Explore by Category</h2>
            <div class="category-list">
                <div class="category-item">
                    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Burger" />
                    <h3>Burgers</h3>
                </div>
                <div class="category-item">
                    <img src="https://images.unsplash.com/photo-1593560704563-f176a2eb61db?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pizza" />
                    <h3>Native Rice</h3>
                </div>
                <div class="category-item">
                    <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pasta" />
                    <h3> Abacha </h3>
                </div>
            </div>
        </div>

        <!-- Menu Section -->
        <div class="menu-section" id="menu">
            <h2>Explore Our Menu</h2>
            <div class="menu-list">
                <div v-for="menu in menus" :key="menu._id" class="menu-item">
                    <img :src="menu.images[0]" :alt="menu.itemName" class="menu-image" />
                    <div class="menu-details">
                        <h3>{{ menu.itemName }}</h3>
                        <p>{{ menu.description }}</p>
                        <p class="menu-price">₦ {{ menu.price.toLocaleString() }}</p>
                        <div class="quantity-container">
                            <label for="quantity">Quantity:</label>
                            <input type="number" v-model.number="menu.quantity" min="1" class="quantity-input" />
                        </div>
                        <button class="add-to-cart" @click="addToCart(menu)">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div> 
        <!-- How It Works -->
        <div class="how-it-works">
            <h2>How It Works</h2>
            <div class="steps">
                <div class="step">
                    <i class="fas fa-utensils"></i>
                    <h3>Choose Your Meal</h3>
                    <p>Browse through our wide selection of dishes.</p>
                </div>
                <div class="step">
                    <i class="fas fa-truck"></i>
                    <h3>Fast Delivery</h3>
                    <p>Get your food delivered in under 30 minutes.</p>
                </div>
                <div class="step">
                    <i class="fas fa-smile"></i>
                    <h3>Enjoy Your Meal</h3>
                    <p>Savor delicious food from the comfort of your home.</p>
                </div>
            </div>
        </div>

        <!-- Customer Reviews -->
        <div class="customer-reviews">
            <h2>What Our Customers Say</h2>
            <div class="reviews">
                <div class="review-item">
                    <!-- <img src="https://via.placeholder.com/50x50?text=JD" alt="John Doe" /> -->
                    <h3>John Doe</h3>
                    <p>Amazing food and fast delivery!</p>
                    <div class="rating">
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                    </div>
                </div>
                <div class="review-item">
                    <!-- <img src="https://via.placeholder.com/50x50?text=JD" alt="John Doe" /> -->
                    <h3>Ibrahim joe</h3>
                    <p> The food was great and fast delivery!</p>
                    <div class="rating">
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                    </div>
                </div>
                <div class="review-item">
                    <!-- <img src="https://via.placeholder.com/50x50?text=JS" alt="Jane Smith" /> -->
                    <h3>Adams faruk</h3>
                    <p>Great variety and excellent service.</p>
                    <div class="rating">
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star active"></i>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>About Us</h3>
                    <p>We are dedicated to delivering the best food experience right to your doorstep.</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Menu</a></li>
                        <li><a href="#">How It Works</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Follow Us</h3>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: support@foodie.com</p>
                    <p>Phone: +234 123 456 7890</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2023 Foodie. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menus: [],
            cartItems: [],
            isAuthenticated: false,
            showDropdown: false,
        };
    },
    methods: {
        fetchMenus() {
            fetch("https://food-backend-rz86.onrender.com/api/all-menus")
                .then((res) => res.json())
                .then((data) => {
                    this.menus = data.allMenus.map((menu) => ({
                        ...menu,
                        quantity: 1,
                    }));
                });
        },
        addToCart(item) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(cartItem => cartItem._id === item._id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({ ...item, quantity: item.quantity });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            this.cartItems = cart;
            alert(`${item.itemName} has been added to your cart!`);
        },
        goToCart() {
            this.$router.push({ name: 'CartPage' });
        },
        goToLogin() {
            this.$router.push({ name: 'Login' });
        },
        goToSignup() {
            this.$router.push({ name: 'Register' });
        },
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        logout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            this.isAuthenticated = false;
            this.showDropdown = false;
            this.$router.push({ name: 'Login' });
        },
        scrollToMenu() {
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        },
    },
    mounted() {
        this.fetchMenus();
        this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        this.isAuthenticated = !!localStorage.getItem('accessToken');
    },
};
</script>

<style scoped>
/* General Styles */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
}

.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Top Navigation */
.top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: #007bff;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 15px;
}

.nav-links button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #333;
}

.cart-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: #007bff;
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
}

.profile-dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Hero Section */
.hero-section {
    text-align: center;
    padding: 100px 20px;
    background-color: #007bff;
    color: white;
    border-radius: 8px;
    margin-bottom: 40px;
}

.hero-section h1 {
    font-size: 36px;
    margin-bottom: 10px;
}

.hero-section p {
    font-size: 18px;
    margin-bottom: 20px;
}

.cta-button {
    background-color: white;
    color: #007bff;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.cta-button:hover {
    background-color: #f0f0f0;
}

/* Food Categories */
.food-categories {
    margin-bottom: 40px;
}

.food-categories h2 {
    text-align: center;
    margin-bottom: 20px;
}

.category-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.category-item {
    text-align: center;
    width: 30%;
}

.category-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}

.category-item h3 {
    margin-top: 10px;
    font-size: 18px;
}

/* Menu Section */
.menu-section {
    margin-bottom: 40px;
}

.menu-section h2 {
    text-align: center;
    margin-bottom: 20px;
}

.menu-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.menu-item {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.menu-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.menu-details {
    padding: 16px;
    text-align: center;
}

.menu-details h3 {
    font-size: 20px;
    margin-bottom: 8px;
}

.menu-details p {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.menu-price {
    font-size: 18px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 12px;
}

.quantity-container {
    margin-bottom: 12px;
}

.quantity-input {
    width: 60px;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
}

.add-to-cart {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
}

.add-to-cart:hover {
    background-color: #0056b3;
}

/* How It Works */
.how-it-works {
    margin-bottom: 40px;
}

.how-it-works h2 {
    text-align: center;
    margin-bottom: 20px;
}

.steps {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.step {
    text-align: center;
    max-width: 200px;
}

.step i {
    font-size: 36px;
    color: #007bff;
    margin-bottom: 10px;
}

.step h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.step p {
    color: #666;
}

/* Customer Reviews */
.customer-reviews {
    margin-bottom: 40px;
}

.customer-reviews h2 {
    text-align: center;
    margin-bottom: 20px;
}

.reviews {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.review-item {
    text-align: center;
    max-width: 200px;
}

.review-item img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.review-item h3 {
    margin-top: 10px;
    font-size: 18px;
}

.review-item p {
    color: #666;
}

.rating {
    color: #ffcc00;
}

.rating .active {
    color: #ffcc00;
}

/* Footer */
.footer {
    background-color: #333;
    color: white;
    padding: 40px 20px;
    margin-top: 40px;
}

.footer-content {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-section {
    flex: 1;
    min-width: 200px;
}

.footer-section h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.footer-section p {
    font-size: 14px;
    color: #ccc;
}

.footer-section ul {
    list-style: none;
    padding: 0;
}

.footer-section ul li {
    margin-bottom: 8px;
}

.footer-section ul li a {
    color: #ccc;
    text-decoration: none;
}

.footer-section ul li a:hover {
    color: #007bff;
}

.social-icons {
    display: flex;
    gap: 10px;
}

.social-icons a {
    color: #ccc;
    font-size: 20px;
}

.social-icons a:hover {
    color: #007bff;
}

.footer-bottom {
    text-align: center;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #444;
    font-size: 14px;
    color: #ccc;
}
</style>