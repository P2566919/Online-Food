<template>
    <div class="payment-page">
        <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h2>Payment</h2>
  
      <!-- Order Summary -->
      <div class="order-summary">
        <h3>Order Summary</h3>
        <ul>
          <li v-for="item in orderItems" :key="item._id">
            {{ item.itemName }} x{{ item.quantity }} — ₦{{ formatPrice(item.price * item.quantity) }}
          </li>
        </ul>
        <p><strong>Total:</strong> ₦{{ formatPrice(orderTotal) }}</p>
      </div>
  
     
      <div class="payment-method">
        <h3>Select Payment Method</h3>
        <label>
          <input type="radio" value="card" v-model="selectedMethod" />
          Card Payment
        </label>
        <label>
          <input type="radio" value="wallet" v-model="selectedMethod" />
          Wallet
        </label>
        <label>
          <input type="radio" value="cod" v-model="selectedMethod" />
          Cash on Delivery
        </label>
      </div>
  
      
      <div v-if="selectedMethod === 'card'" class="card-details">
        <h3>Card Details</h3>
        <input type="text" v-model="cardNumber" placeholder="Card Number" />
        <input type="text" v-model="expiryDate" placeholder="Expiry Date (MM/YY)" />
        <input type="text" v-model="cvv" placeholder="CVV" />
      </div>
  

      <div class="payment-actions">
        <button @click="confirmPayment" :disabled="isProcessing">
          <span v-if="isProcessing">
            <i class="fas fa-spinner fa-spin"></i> Processing...
          </span>
          <span v-else>Confirm & Pay</span>
        </button>
        <button @click="cancelPayment">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PaymentPage",
    data() {
      return {
        orderItems: [], 
        selectedMethod: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        isProcessing: false,
      };
    },
    computed: {
      orderTotal() {
        return this.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    },
    created() {
      this.loadOrder();
    },
    methods: {
      loadOrder() {
        const cartData = localStorage.getItem('cart');
        this.orderItems = cartData ? JSON.parse(cartData) : [];
      },
      formatPrice(price) {
        return Number(price).toLocaleString('en-NG');
      },
      async confirmPayment() {
        this.isProcessing = true;
        try {
         
          await new Promise(resolve => setTimeout(resolve, 2000)); 
          alert("Payment successful!");
          localStorage.removeItem('cart');
          this.$router.push('/orders');
        } catch (error) {
          alert("Payment failed. Please try again.");
        } finally {
          this.isProcessing = false;
        }
      },
      cancelPayment() {
        this.$router.push('/cart');
      },
    },
  };
  </script>
  
  <style scoped>
  .payment-page {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    background-color: #f8f8f8;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .payment-page h2 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .order-summary, .payment-method, .card-details {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .order-summary h3, .payment-method h3, .card-details h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .order-summary ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .order-summary li {
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  .payment-method label {
    display: block;
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .payment-method input[type="radio"] {
    margin-right: 10px;
  }
  
  .card-details input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .payment-actions button {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;
  }
  
  .payment-actions button:hover {
    background-color: #0056b3;
  }
  
  .payment-actions button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .payment-actions button i {
    margin-right: 10px;
  }
  
  .payment-actions button:last-child {
    background-color: #f44336;
    color: white;
  }
  
  .payment-actions button:last-child:hover {
    background-color: #d32f2f;
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
  </style>
  
  