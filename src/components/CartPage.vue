<template>
    <div class="cart-page">
        <!-- Back Button -->
        <button class="back-button" @click="goBack">
            <i class="fas fa-arrow-left"></i> Back
        </button>

        <h1>My Cart</h1>
        <div v-if="cartItems.length">
            <ul class="cart-list">
                <li v-for="(item, index) in cartItems" :key="index" class="cart-item">
                    <img :src="item.images[0]" alt="menu image" class="item-image" />
                    <div class="item-details">
                        <h3>{{ item.itemName }}</h3>
                        <p>Price: ₦{{ item.price.toLocaleString() }}</p>
                        <div class="quantity-controls">
                            <button @click="decreaseQuantity(index)" :disabled="item.quantity <= 1">-</button>
                            <span>{{ item.quantity }}</span>
                            <button @click="increaseQuantity(index)">+</button>
                        </div>
                        <button @click="removeItem(index)" class="remove-button">Remove</button>
                    </div>
                </li>
            </ul>
            <div class="cart-summary">
                <h3>Total: ₦{{ cartTotal.toLocaleString() }}</h3>
                <button @click="proceedToPayment" class="payment-button" :disabled="isProcessing">
                    {{ isProcessing ? "Processing..." : "Proceed to Payment" }}
                </button>
            </div>
        </div>
        <div v-else class="empty-cart">
            <img src="https://via.placeholder.com/200x200?text=Empty+Cart" alt="Empty Cart" class="empty-cart-image" />
            <p>Your cart is empty!</p>
            <router-link to="/menu" class="continue-shopping">Continue Shopping</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "CartPage",
    data() {
        return {
            cartItems: JSON.parse(localStorage.getItem('cart')) || [],
            isProcessing: false, // Loading state for payment button
        };
    },
    computed: {
        cartTotal() {
            return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
    },
    methods: {
        increaseQuantity(index) {
            this.cartItems[index].quantity += 1;
            this.updateCart();
        },
        decreaseQuantity(index) {
            if (this.cartItems[index].quantity > 1) {
                this.cartItems[index].quantity -= 1;
                this.updateCart();
            }
        },
        removeItem(index) {
            this.cartItems.splice(index, 1);
            this.updateCart();
        },
        updateCart() {
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
        },
        async proceedToPayment() {
            this.isProcessing = true; // Show loading state
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
                const response = await fetch('https://food-backend-rz86.onrender.com/api/order', {
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
                this.cartItems = []; // Clear cart in the UI
                // window.location.href = '/success-page.html'; // Redirect to success page
            } catch (error) {
                console.error('Order Error:', error);
                alert(error.message || 'Something went wrong. Please try again.');
            } finally {
                this.isProcessing = false; // Reset loading state
            }
        },
        goBack() {
            this.$router.go(-1); // Go back to the previous page
        },
    },
};
</script>

<style scoped>
.cart-page {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

/* Back Button */
.back-button {
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.back-button:hover {
    background-color: #0056b3;
}

.cart-list {
    list-style: none;
    padding: 0;
}

.cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
    margin-right: 20px;
}

.item-details {
    flex: 1;
}

.item-details h3 {
    margin: 0 0 10px;
    font-size: 18px;
    color: #333;
}

.item-details p {
    margin: 0 0 10px;
    color: #666;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.quantity-controls button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.quantity-controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.quantity-controls span {
    font-size: 16px;
    font-weight: bold;
}

.remove-button {
    padding: 5px 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cart-summary {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: right;
}

.cart-summary h3 {
    margin: 0 0 20px;
    font-size: 20px;
    color: #333;
}

.payment-button {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.payment-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.empty-cart {
    text-align: center;
    margin-top: 50px;
}

.empty-cart-image {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
}

.empty-cart p {
    font-size: 18px;
    color: #666;
}

.continue-shopping {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-size: 16px;
}

/* Responsive Design */
@media (max-width: 600px) {
    .cart-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .item-image {
        width: 100%;
        height: auto;
        margin-right: 0;
        margin-bottom: 10px;
    }

    .quantity-controls {
        justify-content: flex-start;
    }
}
</style>