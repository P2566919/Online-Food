<template>
    <div class="menu-container">
        <!-- Cart Icon -->
        <div class="cart-icon-container">
            <button class="cart-button" @click="goToCart">
                <i class="fas fa-shopping-cart"></i>
                <span v-if="cartItems.length" class="cart-count">{{ cartItems.length }}</span>
            </button>
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
                <button class="add-to-cart" @click="addToCart(menu)">
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menus: [], // Menu items fetched from API
            cartItems: [], // Cart items
        };
    },
    methods: {
        fetchMenus() {
            // Replace with actual API call
            fetch("http://localhost:4000/api/all-menus")
                .then((res) => res.json())
                .then((data) => {
                    this.menus = data.allMenus.map((menu) => ({
                        ...menu,
                        quantity: 1, // Initialize quantity field
                    }));
                });
        },
        addToCart(menu) {
            const existingItem = this.cartItems.find((item) => item._id === menu._id);
            if (existingItem) {
                existingItem.quantity += menu.quantity;
            } else {
                this.cartItems.push({ ...menu, quantity: menu.quantity });
            }
            this.$forceUpdate(); // Ensure reactivity when modifying arrays
        },
        goToCart() {
            // Redirect to cart page or open cart modal
            this.$router.push({ name: 'CartPage' });
        },
    },
    mounted() {
        this.fetchMenus();
    },
};
</script>

<style>
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
