export default createStore({
  state: {
    cart: [], // Array to store cart items
  },
  mutations: {
    addToCart(state, product) {
      const existingProduct = state.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter((item) => item.id !== productId);
    },
  },
  getters: {
    cartItemCount(state) {
      return state.cart.reduce((total, item) => total + item.quantity, 0);
    },
  },
});
