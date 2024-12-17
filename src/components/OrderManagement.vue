<template>
    <div>
        <!-- Loading state -->
        <div v-if="loading">Loading...</div>

        <!-- When data is loaded -->
        <div v-else>
            <!-- If restaurant is available -->
            <div v-if="restaurant">
                <h2>Orders for {{ restaurant.name }}</h2>

                <!-- If there are orders -->
                <table v-if="orders.length > 0">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order._id">
                            <td>{{ order._id }}</td>
                            <td>{{ order.itemName }}</td>
                            <td>{{ order.price }}</td>
                            <td>{{ order.status }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- If no orders exist -->
                <p v-else>No orders found for this restaurant.</p>
            </div>

            <!-- If no restaurant is found -->
            <p v-else>
                No restaurant found. Please create one first.
            </p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            restaurant: null, // Holds restaurant details
            orders: [], // Holds order details
            loading: true, // Loading state flag
        };
    },
    methods: {
        // Fetch restaurant details
        async fetchRestaurant() {
            try {
                const response = await axios.get("http://localhost:4000/api/restaurant", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                this.restaurant = response.data.data; // Set restaurant details

                // If restaurant is found, fetch orders
                if (this.restaurant) {
                    await this.fetchOrders();
                }
            } catch (error) {
                console.error("Failed to fetch restaurant:", error);
                this.restaurant = null; // Handle errors gracefully
            }
        },

        // Fetch orders for the restaurant
        async fetchOrders() {
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/restaurants/${this.restaurant._id}/orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.orders = response.data.allOrders || []; // Set order data
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                this.orders = []; // Handle errors gracefully
            }
        },
    },
    async mounted() {
        // Start loading and fetch restaurant details
        this.loading = true;
        await this.fetchRestaurant();
        this.loading = false; // Set loading to false after fetching data
    },
};
</script>
