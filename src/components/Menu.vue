<template>
    <div class="menu-container">
        <div v-if="restaurant">
            <h2>Menu for {{ restaurant.name }}</h2>

            <!-- Menu Table -->
            <div v-if="menu.length > 0">
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Availability</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in menu" :key="item._id">
                            <td>{{ item.itemName }}</td>
                            <td>{{ item.description }}</td>
                            <td>{{ item.price }}</td>
                            <td>{{ item.availability ? "Available" : "Unavailable" }}</td>
                            <td>
                                <img v-for="image in item.images" :key="image" :src="image" alt="Menu Image"
                                    class="menu-image" />
                            </td>
                            <td>
                                <button @click="prepareEdit(item)">Edit</button>
                                <button @click="deleteMenuItem(item._id)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>No menu items found. Add a new menu item below.</p>
            </div>

            <!-- Add/Edit Menu Form -->
            <form @submit.prevent="isEditing ? updateMenuItem() : addMenuItem()">
                <h3>{{ isEditing ? "Edit" : "Add" }} Menu Item</h3>
                <div>
                    <label for="itemName">Item Name:</label>
                    <input type="text" id="itemName" v-model="newMenuItem.itemName" required />
                </div>
                <div>
                    <label for="description">Description:</label>
                    <textarea id="description" v-model="newMenuItem.description" required></textarea>
                </div>
                <div>
                    <label for="price">Price:</label>
                    <input type="number" id="price" v-model="newMenuItem.price" required />
                </div>
                <div>
                    <label for="availability">Availability:</label>
                    <select id="availability" v-model="newMenuItem.availability">
                        <option :value="true">Available</option>
                        <option :value="false">Unavailable</option>
                    </select>
                </div>
                <div>
                    <label for="images">Upload Images:</label>
                    <input type="file" id="images" multiple @change="handleFileUpload" />
                </div>
                <button type="submit">{{ isEditing ? "Update" : "Add" }} Menu Item</button>
            </form>
        </div>

        <div v-else>
            <p>No restaurant found. Please create a restaurant first.</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "MenuView",
    data() {
        return {
            restaurant: null,
            menu: [],
            newMenuItem: {
                itemName: "",
                description: "",
                price: "",
                availability: true,
                images: [],
            },
            isEditing: false,
            editingItemId: null,
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

                if (this.restaurant) {
                    this.fetchMenu();
                }
            } catch (error) {
                console.error("Failed to fetch restaurant:", error);
                this.restaurant = null;
            }
        },
        async fetchMenu() {
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/restaurants/${this.restaurant._id}/menu`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.menu = response.data.allMenus || [];
            } catch (error) {
                console.error("Failed to fetch menu:", error);
            }
        },
        async addMenuItem() {
            try {
                const response = await axios.post(
                    `http://localhost:4000/api/restaurants/${this.restaurant._id}/menu`,
                    this.newMenuItem,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.menu.push(response.data.data);
                this.resetForm();
                alert("Menu item added successfully!");
            } catch (error) {
                console.error("Failed to add menu item:", error);
                alert("An error occurred while adding the menu item. Please try again.");
            }
        },
        async updateMenuItem() {
            try {
                await axios.put(
                    `http://localhost:4000/api/restaurants/${this.restaurant._id}/menu/${this.editingItemId}`,
                    this.newMenuItem,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.menu = this.menu.map((item) =>
                    item._id === this.editingItemId ? { ...item, ...this.newMenuItem } : item
                );
                this.resetForm();
                alert("Menu item updated successfully!");
            } catch (error) {
                console.error("Failed to update menu item:", error);
                alert("An error occurred while updating the menu item. Please try again.");
            }
        },
        async deleteMenuItem(itemId) {
            try {
                await axios.delete(
                    `http://localhost:4000/api/restaurants/${this.restaurant._id}/menu/${itemId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.menu = this.menu.filter((item) => item._id !== itemId);
                alert("Menu item deleted successfully!");
            } catch (error) {
                console.error("Failed to delete menu item:", error);
                alert("An error occurred while deleting the menu item. Please try again.");
            }
        },
        handleFileUpload(event) {
            const files = event.target.files;
            this.newMenuItem.images = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.newMenuItem.images.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        },
        prepareEdit(item) {
            this.isEditing = true;
            this.editingItemId = item._id;
            this.newMenuItem = { ...item };
        },
        resetForm() {
            this.newMenuItem = {
                itemName: "",
                description: "",
                price: "",
                availability: true,
                images: [],
            };
            this.isEditing = false;
            this.editingItemId = null;
        },
    },
    mounted() {
        this.fetchRestaurant();
    },
};
</script>

<style scoped>
.menu-container {
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h2,
h3 {
    margin-bottom: 1rem;
}

p {
    margin: 0.5rem 0;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
}

table th,
table td {
    padding: 0.75rem;
    text-align: left;
    border: 1px solid #ddd;
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

input,
textarea,
select {
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

.menu-image {
    width: 50px;
    height: 50px;
    margin-right: 5px;
    border-radius: 4px;
    object-fit: cover;
}
</style>
