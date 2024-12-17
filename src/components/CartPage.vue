<template>
    <div class="cart-page">
        <h1>My Cart</h1>
        <div v-if="cartItems.length">
            <ul>
                <li v-for="(item, index) in cartItems" :key="index" class="cart-item">
                    <img :src="item.image" alt="menu image" class="item-image" />
                    <div>
                        <h3>{{ item.name }}</h3>
                        <p>Price: ${{ item.price.toLocaleString() }}</p>
                        <p>Quantity: {{ item.quantity }}</p>
                    </div>
                </li>
            </ul>
            <div class="cart-summary">
                <h3>Total: ${{ cartTotal.toLocaleString() }}</h3>
                <button @click="proceedToPayment" class="payment-button">
                    Proceed to Payment
                </button>
            </div>
        </div>
        <p v-else>Your cart is empty!</p>
    </div>
</template>

<script>
export default {
    name: "CartPage",
    data() {
        return {
            cartItems: JSON.parse(localStorage.getItem('cart')) || [], // Load from localStorage or Vuex
        };
    },
    computed: {
        cartTotal() {
            return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
    },
    methods: {
        proceedToPayment() {
            // Redirect to payment gateway or handle payment logic
            alert('Proceeding to payment...');
        },
    },
};
</script>

<style>
.cart-page {
    padding: 20px;
}

.cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.item-image {
    width: 100px;
    height: 100px;
    margin-right: 20px;
}

.cart-summary {
    margin-top: 20px;
}

.payment-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>
