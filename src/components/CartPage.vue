<template>
    <div class="cart-page">
      <!-- Navigation -->
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <br />
  
      <!-- Main Content -->
      <h2>My Cart</h2>
      
      <!-- Cart with Items -->
      <div v-if="hasItems">
        <ul class="cart-list">
          <li 
            v-for="(item, index) in cartItems" 
            :key="`${item._id}-${index}`" 
            class="cart-item"
          >
            <img 
              :src="item.images[0] || defaultImage" 
              :alt="`${item.itemName} image`" 
              class="item-image"
            />
            <div class="item-details">
              <h3>{{ item.itemName }}</h3>
              <p class="price">₦{{ formatPrice(item.price) }}</p>
              <div class="quantity-controls">
                <button 
                  @click="updateQuantity(index, -1)" 
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button @click="updateQuantity(index, 1)">+</button>
              </div>
              <button 
                @click="removeItem(index)" 
                class="remove-button"
              >
                Remove
              </button>
            </div>
          </li>
        </ul>
  
        <!-- Cart Summary -->
        <div class="cart-summary">
          <h3>Total: ₦{{ formatPrice(cartTotal) }}</h3>
          <router-link to="/payment">
  <button class="payment-button">
    Proceed to Payment
  </button>
</router-link>
          <!-- <button 
            @click="proceedToPayment" 
            class="payment-button" 
            :disabled="isProcessing || !hasItems"
          >
            <span v-if="isProcessing">
              <i class="fas fa-spinner fa-spin"></i> Processing...
            </span>
            <span v-else>Proceed to Payment</span>
          </button> -->
        </div>
      </div>
  
      <!-- Empty Cart State -->
      <div v-else class="empty-cart">
        <div class="empty-cart-placeholder"></div>
        <p>Your cart is empty!</p>
        <router-link 
          to="/" 
          class="continue-shopping"
        >
          Continue Shopping
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CartPage",
    data() {
      return {
        cartItems: [],
        isProcessing: false,
        defaultImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXV0ZW5zaWxzIj48cGF0aCBkPSJNMyA5aDQuNWEyIDIgMCAwIDEgMS43NSAxLjBsLjkgMS4yYTIgMiAwIDAgMCAxLjc1IDFIMjEiLz48cGF0aCBkPSJNMyAzaDE4djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJaIi8+PHBhdGggZD0ibTMgMTYgNS0xIi8+PHBhdGggZD0ibTMgMTkgNS0xIi8+PC9zdmc+'
      };
    },
    computed: {
      cartTotal() {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      hasItems() {
        return this.cartItems.length > 0;
      },
      restaurantId() {
        if (!this.hasItems) return null;
        return this.cartItems[0].restaurantId;
      },
      isValidOrder() {
        return this.cartItems.every(item => item.restaurantId === this.restaurantId);
      }
    },
    created() {
      this.loadCart();
    },
    methods: {
      loadCart() {
        try {
          const cartData = localStorage.getItem('cart');
          this.cartItems = cartData ? JSON.parse(cartData) : [];
        } catch (error) {
          console.error("Error loading cart:", error);
          this.cartItems = [];
        }
      },
      saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
      },
      formatPrice(price) {
        return price.toLocaleString('en-NG');
      },
      updateQuantity(index, change) {
        const newQuantity = this.cartItems[index].quantity + change;
        if (newQuantity > 0) {
          this.cartItems[index].quantity = newQuantity;
          this.saveCart();
        }
      },
      removeItem(index) {
        this.cartItems.splice(index, 1);
        this.saveCart();
        alert("Item removed from cart");
      },
      proceedToPayment() {
    if (!this.hasItems) return;

    if (!this.isValidOrder) {
      alert("Please order from one restaurant at a time");
      return;
    }

    // Redirect to the payment page directly
    this.$router.push('/payment');
  },
      // async proceedToPayment() {
      //   if (!this.hasItems) return;
        
      //   if (!this.isValidOrder) {
      //     alert("Please order from one restaurant at a time");
      //     return;
      //   }
  
      //   this.isProcessing = true;
        
      //   try {
      //     const accessToken = localStorage.getItem('accessToken');
      //     if (!accessToken) {
      //       localStorage.setItem('redirectTo', '/cart');
      //       this.$router.push('/login');
      //       alert("Please login to continue");
      //       return;
      //     }
  
      //     const orderPayload = {
      //       restaurantId: this.restaurantId,
      //       orderedItems: this.cartItems.map(item => ({
      //         menuItem: item._id,
      //         quantity: item.quantity,
      //       })),
      //     };
  
      //     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         'Authorization': `Bearer ${accessToken}`,
      //       },
      //       body: JSON.stringify(orderPayload),
      //     });
  
      //     if (!response.ok) {
      //       const errorData = await response.json();
      //       throw new Error(errorData.message || 'Failed to place order');
      //     }
  
      //     alert("Order placed successfully!");
      //     this.clearCart();
      //     this.$router.push('/orders');
      //   } catch (error) {
      //     console.error("Payment error:", error);
      //     alert(error.message || "Payment failed. Please try again.");
      //   } finally {
      //     this.isProcessing = false;
      //   }
      // },
      clearCart() {
        this.cartItems = [];
        localStorage.removeItem('cart');
      },
      goBack() {
        this.$router.go(-1);
      }
    }
  };
  </script>
  
  <style scoped>
  .cart-page {
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Poppins', sans-serif;
  }
  
  .back-button {
    background: none;
    border: none;
    color: #2c3e50;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .back-button:hover {
    color: #42b983;
  }
  
  .cart-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
  }
  
  .cart-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .cart-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .item-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .item-details {
    flex: 1;
  }
  
  .item-details h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    color: #333;
  }
  
  .price {
    font-weight: 600;
    color: #2c3e50;
    margin: 0.5rem 0;
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
  }
  
  .quantity-controls button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .quantity-controls button:not(:disabled):hover {
    background: #f0f0f0;
  }
  
  .quantity-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .quantity-controls span {
    min-width: 20px;
    text-align: center;
  }
  
  .remove-button {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
  }
  
  .remove-button:hover {
    background: rgba(231, 76, 60, 0.1);
  }
  
  .cart-summary {
    margin-top: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    text-align: right;
  }
  
  .cart-summary h3 {
    margin: 0 0 1.5rem;
    font-size: 1.3rem;
  }
  
  .payment-button {
    padding: 0.75rem 2rem;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .payment-button:not(:disabled):hover {
    background: #3aa876;
  }
  
  .payment-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .empty-cart {
    text-align: center;
    margin-top: 3rem;
  }
  
  .empty-cart-placeholder {
    width: 200px;
    height: 200px;
    margin: 0 auto 1.5rem;
    background-color: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }
  
  .empty-cart p {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 1.5rem;
  }
  
  .continue-shopping {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 500;
    transition: background 0.2s;
  }
  
  .continue-shopping:hover {
    background: #3aa876;
  }
  
  @media (max-width: 768px) {
    .cart-page {
      padding: 1rem;
    }
    
    .cart-item {
      flex-direction: column;
      gap: 1rem;
    }
    
    .item-image {
      width: 100%;
      height: auto;
      max-height: 200px;
    }
    
    .cart-summary {
      text-align: center;
    }
    
    .payment-button,
    .continue-shopping {
      width: 100%;
    }
  }
  </style>