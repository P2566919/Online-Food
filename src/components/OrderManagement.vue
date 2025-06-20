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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order._id">
                            <td>{{ order._id }}</td>
                            <td>{{ order.orderedItems[0].menuItem.itemName }}</td>
                            <td>{{ order.totalCost }}</td>
                            <td>{{ order.orderStatus }}</td>
                            <td>
                                <select v-model="order.orderStatus">
                                    <option value="pending">Pending</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="out for delivery">Sent Out</option>
                                    <option value="unavailable">Unavailable</option>


                                    <option value="delivered">Delivered</option>
                                </select>
                                <button @click="updateOrderStatus(order)">Update</button>
                                <!-- <button @click="deleteOrder(order._id)">Delete</button> -->
                            </td>
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
                const response = await axios.get("https://food-backend-rz86.onrender.com/api/restaurant", {
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
                    `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.orders = response.data.order || []; // Set order data
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                this.orders = []; // Handle errors gracefully
            }
        },
        
        // Update order status
        async updateOrderStatus(order) {
            try {
                await axios.put(
                    `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/orders/${order._id}`,
                    { status: order.orderStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                alert("Order status updated successfully!");
            } catch (error) {
                console.error("Failed to update order status:", error);
            }
        },
        
        // Delete an order
        async deleteOrder(orderId) {
            try {
                await axios.delete(`https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                this.orders = this.orders.filter(order => order._id !== orderId);
                alert("Order deleted successfully!");
            } catch (error) {
                console.error("Failed to delete order:", error);
            }
        }
    },
    async mounted() {
        // Start loading and fetch restaurant details
        this.loading = true;
        await this.fetchRestaurant();
        this.loading = false; // Set loading to false after fetching data
    },
};
</script>