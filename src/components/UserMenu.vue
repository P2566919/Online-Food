<template>
    <div class="menu-container">
        <!-- Auth & Cart Icons -->
        <div class="top-right-container">
            <div v-if="!isAuthenticated" class="auth-buttons">
                <button @click="goToLogin">Login</button>
                <button @click="goToSignup">Sign Up</button>
            </div>
            <div v-else class="profile-container">
                
                <button class="profile-button" @click="toggleDropdown">
                    <i class="fas fa-user-circle"></i>
                    <!-- <p>Hello </p> -->

                </button>
                <div v-if="showDropdown" class="dropdown-menu">
                    <button @click="logout">Logout</button>
                </div>
            </div>
            <div class="cart-icon-container">
                <button class="cart-button" @click="goToCart">
                    <i class="fas fa-shopping-cart"></i>
                    <span v-if="cartItems.length" class="cart-count">{{ cartItems.length }}</span>
                </button>
            </div>
        </div>
        
        <!-- Menu Items -->
        <h1>Explore Menus</h1>
        <div class="menu-list">
            <div v-for="menu in menus" :key="menu._id" class="menu-item">
                <h3>{{ menu.itemName }}</h3>
                <img :src="menu.images[0]" alt="menu image" class="menu-image" />
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
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
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
        }
    },
    mounted() {
        this.fetchMenus();
        this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        this.isAuthenticated = !!localStorage.getItem('accessToken');
    }
};
</script>

<style>
.top-right-container {
    position: fixed;
    top: 10px;
    right: 60px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.auth-buttons button, .profile-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.profile-button {
    font-size: 24px;
}

.dropdown-menu {
    position: absolute;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
}

/* .cart-icon-container {
    position: relative;
} */
.menu-container {
    padding: 20px;
    position: relative;
}

.cart-icon-container {
    position: fixed;
    top: 10px;
    right: 20px;
    z-index: 1000;
}

.cart-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
}

.cart-button i {
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

.menu-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 60px;
}

.menu-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    width: 200px;
    text-align: center;
}

.menu-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
}

.menu-price {
    font-weight: bold;
    margin: 8px 0;
}

.quantity-container {
    margin-bottom: 8px;
}

.quantity-input {
    width: 50px;
    text-align: center;
}

.add-to-cart {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
}

.add-to-cart:hover {
    background-color: #0056b3;
}
</style>