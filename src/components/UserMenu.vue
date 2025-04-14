<template>
    <div class="home-container">
        <!-- Top Navigation -->
        <div class="top-nav">
            <div class="logo">Dangote Foodie</div>
            <div class="nav-links">
                <button @click="goToLogin" v-if="!isAuthenticated">Login</button>
                <button @click="goToSignup" v-if="!isAuthenticated">Partner with Us</button>
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
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1>Order Your Favorite Food Online</h1>
                <p>Discover the best dishes from top restaurants near you.</p>
                <button class="cta-button" @click="scrollToMenu">Explore Menus</button>
            </div>
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
                    <h3>Abacha</h3>
                </div>
                <div class="category-item">
                    <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pasta" />
                    <h3>Pizza</h3>
                </div>
                <div class="category-item">
                    <img src="https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pasta" />
                    <h3>BreakFast Combo</h3>
                </div>
                <div class="category-item">
                    <img src="https://images.unsplash.com/photo-1497888329096-51c27beff665?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pasta" />
                    <h3>Cake</h3>
                </div>
            </div>
        </div>

        <!-- Menu Section -->
      <div class="menu-section" id="menu">
    <h2 class="menu-title">Explore Our Menu</h2>
    <div class="menu-list">
        <div v-for="menu in menus" :key="menu._id" class="menu-item">
            <img :src="menu.images[0]" :alt="menu.itemName" class="menu-image" />
            <div class="delivery-time">
                <i class="fas fa-clock"></i> 25-35 min
            </div>
            <div class="menu-details">
                <h3>{{ menu.itemName }}</h3>
                <p>{{ menu.description }}</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>4.8 (120+)</span>
                </div>
                <p class="menu-price">₦ {{ menu.price.toLocaleString() }}</p>
                <div class="quantity-container">
                    <label for="quantity">Quantity:</label>
                    <input type="number" v-model.number="menu.quantity" min="1" class="quantity-input" />
                </div>
                <button class="add-to-cart" @click="addToCart(menu)">Add to Cart</button>
                <!-- Navigate to Menu Item Detail Page -->
                <router-link :to="`/menu/${menu._id}`" class="view-details-link">
                    View Details
                </router-link>
            </div>
        </div>
    </div>
</div>


        <!-- How It Works -->
        <div class="how-it-works">
            <h2>How It Works</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <h3>Choose Your Meal</h3>
                    <p>Browse through our wide selection of dishes.</p>
                </div>
                <div class="step">
                    <div class="step-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <h3>Fast Delivery</h3>
                    <p>Get your food delivered in under 30 minutes.</p>
                </div>
                <div class="step">
                    <div class="step-icon">
                        <i class="fas fa-smile"></i>
                    </div>
                    <h3>Enjoy Your Meal</h3>
                    <p>Savor delicious food from the comfort of your home.</p>
                </div>
            </div>
        </div>

        <!-- Customer Reviews -->
        <div class="customer-reviews">
            <h2>What Our Customers Say</h2>
            <div class="reviews-container">
                <div class="reviews">
                    <div class="review-item">
                        <div class="review-content">
                            <div class="reviewer-info">
                                <div class="reviewer-avatar">JD</div>
                                <div class="reviewer-details">
                                    <h3>John Doe</h3>
                                    <div class="rating">
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                    </div>
                                </div>
                            </div>
                            <p>"Amazing food and fast delivery! The burger was still crispy when it arrived."</p>
                        </div>
                    </div>
                    <div class="review-item">
                        <div class="review-content">
                            <div class="reviewer-info">
                                <div class="reviewer-avatar">IJ</div>
                                <div class="reviewer-details">
                                    <h3>Ibrahim Joe</h3>
                                    <div class="rating">
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                    </div>
                                </div>
                            </div>
                            <p>"The food was great and arrived piping hot. Will definitely order again!"</p>
                        </div>
                    </div>
                    <div class="review-item">
                        <div class="review-content">
                            <div class="reviewer-info">
                                <div class="reviewer-avatar">AF</div>
                                <div class="reviewer-details">
                                    <h3>Adams Faruk</h3>
                                    <div class="rating">
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star active"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                            <p>"Great variety and excellent service. The native rice was particularly delicious."</p>
                        </div>
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
                    <p>Email: support@dangotefoodie.com</p>
                    <p>Phone: +234 123 456 7890</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2023 Dangote Foodie. All rights reserved.</p>
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
            
            // Create flying item animation
            const flyingItem = document.createElement('div');
            flyingItem.classList.add('flying-item');
            flyingItem.textContent = '+1';
            document.body.appendChild(flyingItem);
            
            // Animation logic
            setTimeout(() => {
                flyingItem.remove();
            }, 1000);
            
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
:root {
  --primary: #00ccbc;
  --primary-dark: #00a396;
  --secondary: #e8f5f3;
  --accent: #ff8000;
  --dark: #2e3333;
  --light: #f8f8f8;
  --review-bg: #f9f5ff;
}

/* General Styles */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--light);
    color: var(--dark);
    line-height: 1.6;
}

.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Top Navigation */
.top-nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.logo {
    font-size: 28px;
    font-weight: 700;
    color: var(--primary);
    display: flex;
    align-items: center;
}

.logo:before {
    content: "🍔";
    margin-right: 10px;
    font-size: 24px;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
}

.nav-links button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: var(--dark);
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 4px;
    transition: all 0.2s;
}

.nav-links button:hover {
    background: var(--secondary);
}

.cart-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: var(--primary);
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -10px;
    background-color: var(--accent);
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
}

.profile-dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-width: 150px;
}

.dropdown-menu button {
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--dark);
}

.dropdown-menu button:hover {
    background: var(--secondary);
}

/* Hero Section */
.hero-section {
    position: relative;
    width: 100%;
    height: 500px;
    background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin: 20px 0 40px;
    overflow: hidden;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    padding: 20px;
    max-width: 800px;
}

.hero-content h1 {
    font-size: 48px;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-content p {
    font-size: 20px;
    margin-bottom: 30px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.cta-button {
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 30px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-button:hover {
    background-color: #e67300;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Food Categories */
.food-categories {
    margin: 60px 0;
    padding: 0 20px;
}

.food-categories h2 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 32px;
    color: var(--dark);
    font-weight: 700;
}

.category-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
    padding: 20px 0;
    max-width: 1200px;
    margin: 0 auto;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 calc(16.666% - 30px);
    min-width: 150px;
    transition: transform 0.3s ease;
}

.category-item:hover {
    transform: translateY(-8px);
}

.category-item img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--secondary);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
}

.category-item h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--dark);
    text-align: center;
    margin: 0;
}
.view-details-link {
  display: inline-block;
  padding: 5px 10px;
  background-color: #333;
  color: white;
  font-size: 0.9em;
  font-weight: normal;
  border-radius: 3px;
  text-decoration: none;
  text-align: center;
  margin-top: 2px; 
}

.view-details-link:hover {
  background-color: #333; 
  transform: none;
}

/* Menu Section */
.menu-section {
    padding: 40px 20px;
    background-color: #f9fafb;
    text-align: center;
}

.menu-title {
    font-size: 2.25rem;
    font-weight: bold;
    margin-bottom: 40px;
    color: #2d3748;
}

/* Menu List */
.menu-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 10px;
}

/* Menu Item */
.menu-item {
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.menu-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.menu-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

/* Delivery Time */
.delivery-time {
    padding: 10px;
    background-color: #f0fdf4;
    color: #38a169;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delivery-time i {
    margin-right: 5px;
}

/* Menu Details */
.menu-details {
    padding: 20px;
}

.menu-details h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 10px;
}

.menu-details p {
    font-size: 1rem;
    color: #4a5568;
    margin-bottom: 15px;
}

.rating {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #ecc94b;
}

.menu-price {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2f855a;
    margin-top: 10px;
    margin-bottom: 15px;
}

/* Quantity Input */
.quantity-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.quantity-container label {
    font-size: 1rem;
    color: #2d3748;
}

.quantity-input {
    width: 50px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #e2e8f0;
    text-align: center;
    font-size: 1rem;
}

/* Add to Cart Button */
.add-to-cart {
    width: 100%;
    padding: 12px;
    background-color: #48bb78;
    color: #ffffff;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.add-to-cart:hover {
    background-color: #38a169;
}

/* How It Works */
.how-it-works {
    margin-bottom: 60px;
    padding: 60px 20px;
    background-color: white;
}

.how-it-works h2 {
    text-align: center;
    margin-bottom: 50px;
    font-size: 32px;
    color: var(--dark);
    font-weight: 700;
}

.steps {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

.step {
    text-align: center;
    max-width: 300px;
    flex: 1;
    min-width: 250px;
}

.step-icon {
    width: 80px;
    height: 80px;
    background-color: var(--secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: var(--primary);
    font-size: 30px;
}

.step h3 {
    font-size: 22px;
    margin-bottom: 15px;
    color: var(--dark);
}

.step p {
    color: #666;
    font-size: 16px;
    line-height: 1.6;
}

/* Customer Reviews */
.customer-reviews {
    padding: 80px 20px;
    background-color: var(--review-bg);
    position: relative;
    overflow: hidden;
}

.customer-reviews h2 {
    text-align: center;
    margin-bottom: 50px;
    font-size: 32px;
    color: var(--dark);
    font-weight: 700;
    position: relative;
    z-index: 2;
}

.reviews-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
}

.reviews {
    display: flex;
    gap: 30px;
    padding: 20px 0;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
}

.review-item {
    flex: 0 0 350px;
    scroll-snap-align: start;
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    transition: transform 0.3s ease;
}

.review-item:hover {
    transform: translateY(-5px);
}

.review-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.reviewer-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.reviewer-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
}

.reviewer-details h3 {
    margin: 0;
    font-size: 18px;
    color: var(--dark);
}

.reviewer-details .rating {
    margin-top: 5px;
}

.review-item p {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
    font-style: italic;
    margin: 0;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

/* Decorative Elements */
.customer-reviews::before {
    content: "";
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    background: rgba(0, 204, 188, 0.1);
    border-radius: 50%;
    z-index: 1;
}

.customer-reviews::after {
    content: "";
    position: absolute;
    bottom: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 128, 0, 0.1);
    border-radius: 50%;
    z-index: 1;
}

/* Footer */
.footer {
    /* background: var(--dark); */
    background-color: #1b1a1a;
    color: rgb(55, 53, 53);
    padding: 60px 20px 0;
    margin-top: 60px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-section h3 {
    color: white;
    margin-bottom: 25px;
    font-size: 20px;
    font-weight: 600;
}

.footer-section p {
    color: #ccc;
    font-size: 15px;
    line-height: 1.6;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section ul li {
    margin-bottom: 12px;
}

.footer-section ul li a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.2s;
    font-size: 15px;
}

.footer-section ul li a:hover {
    color: var(--primary);
}

.social-icons {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.social-icons a {
    color: #ccc;
    font-size: 20px;
    transition: color 0.2s;
}

.social-icons a:hover {
    color: var(--primary);
}

.footer-bottom {
    text-align: center;
    padding: 25px 0;
    margin-top: 60px;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 14px;
    color: #1b1a1a;
}

/* Floating Cart Button */
.cart-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--primary);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 100;
    transition: all 0.3s;
    border: none;
}

.cart-button:hover {
    transform: scale(1.1);
    background: var(--primary-dark);
}

/* Flying Item Animation */
.flying-item {
    position: fixed;
    z-index: 1000;
    animation: flyToCart 1s ease-in-out forwards;
    font-weight: bold;
    font-size: 18px;
    color: var(--primary);
}

@keyframes flyToCart {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: translate(calc(100vw - 100px), -100px) scale(0.5); opacity: 0; }
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
    .category-item {
        flex: 0 0 calc(20% - 30px);
    }
}

@media (max-width: 992px) {
    .category-item {
        flex: 0 0 calc(25% - 30px);
    }
    
    .hero-content h1 {
        font-size: 40px;
    }
}

@media (max-width: 768px) {
    .category-item {
        flex: 0 0 calc(33.333% - 30px);
    }
    
    .category-item img {
        width: 120px;
        height: 120px;
    }
    
    .hero-section {
        height: 400px;
    }
    
    .hero-content h1 {
        font-size: 36px;
    }
    
    .hero-content p {
        font-size: 18px;
    }
    
    .menu-list {
        grid-template-columns: 1fr;
    }
    
    .steps {
        flex-direction: column;
        align-items: center;
    }
    
    .step {
        max-width: 100%;
        margin-bottom: 30px;
    }
    
    .review-item {
        flex: 0 0 280px;
    }
    
    .customer-reviews {
        padding: 60px 15px;
    }
}

@media (max-width: 576px) {
    .category-item {
        flex: 0 0 calc(50% - 30px);
    }
    
    .top-nav {
        flex-direction: column;
        gap: 15px;
        padding: 15px 0;
    }
    
    .nav-links {
        width: 100%;
        justify-content: space-between;
    }
    
    .food-categories h2,
    .menu-section h2,
    .how-it-works h2,
    .customer-reviews h2 {
        font-size: 28px;
        margin-bottom: 30px;
    }
    
    .hero-content h1 {
        font-size: 32px;
    }
    
    .hero-content p {
        font-size: 16px;
    }
    
    .cta-button {
        padding: 10px 20px;
        font-size: 16px;
    }
}

@media (max-width: 400px) {
    .category-item {
        flex: 0 0 100%;
        max-width: 200px;
        margin: 0 auto;
    }
    
    .category-item img {
        width: 140px;
        height: 140px;
    }
    
    .review-item {
        padding: 20px;
    }
}
</style>