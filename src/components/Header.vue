<template>
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 class="text-lg font-bold">Order Booking Dashboard</h1>
        <div class="flex items-center space-x-4">
            <div class="relative cursor-pointer" @click="goToCart">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 9m13.4-9l2.2 9M9 21h6" />
                </svg>
                <span v-if="cartCount > 0"
                    class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                    {{ cartCount }}
                </span>
            </div>
        </div>
    </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'HeaderView',
    computed: {
        ...mapGetters(['cartItemCount']),
    },
    methods: {
        goToCart() {
            this.$router.push('/cart'); // Navigate to cart page
        },
    },
};
</script>

<style scoped>
/* Adjust spacing for cart indicator */
.relative {
    position: relative;
}

.absolute {
    position: absolute;
}
</style>
