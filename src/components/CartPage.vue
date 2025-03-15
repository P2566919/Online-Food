<template>
    <div class="cart-page">
        <h1>My Cart</h1>
        <div v-if="cartItems.length">
            <ul>
                <li v-for="(item, index) in cartItems" :key="index" class="cart-item">
                    <img :src="item.images[0]" alt="menu image" class="item-image" />
                    <div>
                        <h3>{{ item.name }}</h3>
                        <p>Price: ₦{{ item.price.toLocaleString() }}</p>
                        <p>Quantity: {{ item.quantity }}</p>
                    </div>
                </li>
            </ul>
            <div class="cart-summary">
                <h3>Total: ₦{{ cartTotal.toLocaleString() }}</h3>
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
        async proceedToPayment() {
            try {
                // Check for accessToken in localStorage
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    // Save the current page URL to redirect back after login
                    localStorage.setItem('redirectTo', window.location.pathname);
                    alert('You need to login to proceed to payment.');
                    window.location.href = '/login'; // Redirect to login page
                    return;
                }

                // Fetch cart items from localStorage
                const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

                // Check for unique restaurantId
                const restaurantIds = [...new Set(cartItems.map(item => item.restaurantId))];

                if (restaurantIds.length > 1) {
                    // Throw error if there are multiple restaurants
                    alert('Error: You can only order from one restaurant at a time.');
                    return;
                }

                // Extract single restaurantId
                const restaurantId = restaurantIds[0];

                // Prepare order payload
                const orderPayload = {
                    restaurantId: restaurantId,
                    orderedItems: cartItems.map(item => ({
                        menuItem: item._id, // Assuming 'id' is the unique menu item ID
                        quantity: item.quantity,
                    })),
                };

                console.log('Order Payload:', orderPayload); // Debugging

                // Send order to the API with accessToken
                const response = await fetch('http://localhost:4000/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`, // Attach accessToken
                    },
                    body: JSON.stringify(orderPayload),
                });

                // Handle response
                if (!response.ok) {
                    throw new Error('Failed to place the order. Please try again.');
                }

                const data = await response.json();
                console.log('Order Success:', data);

                alert('Order placed successfully!');
                // Clear cart after successful order
                localStorage.removeItem('cart');
                // window.location.href = '/success-page.html'; // Redirect to success page
            } catch (error) {
                console.error('Order Error:', error);
                alert(error.message || 'Something went wrong. Please try again.');
            }
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
