<template>
    <div class="menu-item-detail">
      <button class="back-button" @click="goBack">← Back to Menu</button>
  
      <h2 class="item-name">{{ menu.itemName }}</h2>
      <img :src="menu.images[0]" :alt="menu.itemName" class="item-image" />
      <p class="item-description">{{ menu.description }}</p>
      <p class="menu-price">₦ {{ menu.price.toLocaleString() }}</p>
  
      <div class="rating">
        <i class="fas fa-star"></i> <span>4.8 (120+)</span>
      </div>
  
      <div class="quantity-container">
        <label for="quantity">Quantity:</label>
        <input type="number" v-model.number="menu.quantity" min="1" class="quantity-input" />
      </div>
  
      <button class="add-to-cart" @click="addToCart(menu)">Add to Cart</button>
  
      <p v-if="cartMessage" class="cart-message">{{ cartMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['id'],
    data() {
      return {
        menu: {},
        cartMessage: "",
      };
    },
    created() {
      this.fetchMenuItemDetail();
    },
    methods: {
      fetchMenuItemDetail() {
        const menuItem = {
          _id: this.$route.params.id,
          itemName: "Spaghetti Bolognese",
          description: "A delicious pasta with a rich meat sauce.",
          price: 1500,
          images: ["/images/spaghetti.jpg"],
          quantity: 1,
        };
        this.menu = menuItem;
      },
      addToCart(menu) {
        console.log(`Added ${menu.quantity} ${menu.itemName}(s) to the cart`);
        this.cartMessage = `${menu.itemName} added to cart!`;
  
        // Clear message after 2.5 seconds
        setTimeout(() => {
          this.cartMessage = "";
        }, 2500);
      },
      goBack() {
        this.$router.push({ name: 'Menu' });
      },
    },
  };
  </script>
  
  <style scoped>
  .menu-item-detail {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .back-button {
    background: none;
    border: none;
    color: #007bff;
    font-size: 1em;
    margin-bottom: 22px;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .back-button:hover {
    color: #0056b3;
  }
  
  .item-name {
    font-size: 2em;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .item-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .item-description {
    font-size: 1.2em;
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  .menu-price {
    font-size: 1.5em;
    font-weight: bold;
    color: #e67e22;
    margin-bottom: 15px;
  }
  
  .rating {
    font-size: 1.2em;
    color: #f39c12;
    margin-bottom: 20px;
  }
  
  .quantity-container {
    margin-bottom: 20px;
  }
  
  .quantity-container label {
    font-size: 1.1em;
    margin-right: 10px;
  }
  
  .quantity-input {
    width: 80px;
    padding: 8px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .add-to-cart {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #32e622;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 2px;
  }
  
  .add-to-cart:hover {
    background-color: #27c41d;
  }
  
  .cart-message {
    margin-top: 15px;
    color: green;
    font-size: 1em;
    font-weight: 500;
    text-align: center;
  }
  
  @media (max-width: 600px) {
    .menu-item-detail {
      padding: 15px;
    }
  
    .item-name {
      font-size: 1.8em;
    }
  
    .item-description {
      font-size: 1.1em;
    }
  
    .menu-price {
      font-size: 1.3em;
    }
  
    .quantity-container label {
      font-size: 1em;
    }
  
    .quantity-input {
      width: 60px;
      padding: 6px;
    }
  
    .add-to-cart {
      font-size: 1.1em;
    }
  }
  </style>
  