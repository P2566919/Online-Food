<template>
    <div class="restaurant-details">
        <div v-if="restaurant">
            <h2>{{ restaurant.name }}</h2>
            <p><strong>Location:</strong> {{ restaurant.location }}</p>
            <p><strong>Phone:</strong> {{ restaurant.contactInfo.phone }}</p>
            <p><strong>Email:</strong> {{ restaurant.contactInfo.email }}</p>
            <p><strong>Owner Name:</strong> {{ restaurant.owner.name }}</p>
            <p><strong>Owner Email:</strong> {{ restaurant.owner.email }}</p>
        </div>

        <div v-else>
            <p>No restaurant found. Would you like to create one?</p>
            <form @submit.prevent="createRestaurant">
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="newRestaurant.name" required />
                </div>
                <div>
                    <label for="location">Location:</label>
                    <input type="text" id="location" v-model="newRestaurant.location" required />
                </div>
                <div>
                    <label for="email">Contact Email:</label>
                    <input type="email" id="email" v-model="newRestaurant.contactInfo.email" required />
                </div>
                <div>
                    <label for="phone">Contact Phone:</label>
                    <input type="text" id="phone" v-model="newRestaurant.contactInfo.phone" required />
                </div>
                <button type="submit">Create Restaurant</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "RestaurantView",
    data() {
        return {
            restaurant: null,
            newRestaurant: {
                name: "",
                location: "",
                contactInfo: {
                    email: "",
                    phone: "",
                },
            },
        };
    },
    methods: {
        async fetchRestaurant() {
            try {
                const response = await axios.get("http://localhost:4000/api/restaurant", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                this.restaurant = response.data.data;
            } catch (error) {
                console.error("Failed to fetch restaurant:", error);
                this.restaurant = null;
            }
        },
        async createRestaurant() {
            try {
                const response = await axios.post(
                    "http://localhost:4000/api/create-restaurant",
                    this.newRestaurant,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.restaurant = response.data.data;
                alert("Restaurant created successfully!");
            } catch (error) {
                console.error("Failed to create restaurant:", error);
                alert("An error occurred while creating the restaurant. Please try again.");
            }
        },
    },
    mounted() {
        this.fetchRestaurant();
    },
};
</script>

<style scoped>
.restaurant-details {
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    margin-bottom: 1rem;
}

p {
    margin: 0.5rem 0;
}

form {
    margin-top: 1rem;
}

form div {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
