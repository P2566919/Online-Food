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
                            <td>₦{{ item.price.toLocaleString() }}</td>
                            <td>
                                <span :class="item.availability ? 'available' : 'unavailable'">
                                    {{ item.availability ? "Available" : "Unavailable" }}
                                </span>
                            </td>
                            <td>
                                <div class="image-preview-container">
                                    <img
                                        v-for="image in item.images"
                                        :key="image"
                                        :src="image"
                                        alt="Menu Image"
                                        class="menu-image"
                                        @mouseover="showPreview(image)"
                                        @mouseleave="hidePreview"
                                    />
                                </div>
                                <div v-if="hoveredImage" class="image-preview">
                                    <img :src="hoveredImage" alt="Preview" />
                                </div>
                            </td>
                            <td>
                                <button class="edit-btn" @click="prepareEdit(item)">Edit</button>
                                <button class="delete-btn" @click="deleteMenuItem(item._id)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p class="no-items">No menu items found. Add a new menu item below.</p>
            </div>

            <!-- Add/Edit Menu Form -->
            <form @submit.prevent="isEditing ? updateMenuItem() : addMenuItem()">
                <h3>{{ isEditing ? "Edit" : "Add" }} Menu Item</h3>
                <div class="form-group">
                    <label for="itemName">Item Name:</label>
                    <input type="text" id="itemName" v-model="newMenuItem.itemName" required />
                </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" v-model="newMenuItem.description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="price">Price:</label>
                    <input type="number" id="price" v-model="newMenuItem.price" required />
                </div>
                <div class="form-group">
                    <label for="availability">Availability:</label>
                    <select id="availability" v-model="newMenuItem.availability">
                        <option :value="true">Available</option>
                        <option :value="false">Unavailable</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="images">Upload Images:</label>
                    <input type="file" id="images" multiple @change="handleFileUpload" />
                </div>
                <button type="submit" class="submit-btn">{{ isEditing ? "Update" : "Add" }} Menu Item</button>
            </form>
        </div>

        <div v-else>
            <p class="no-restaurant">No restaurant found. Please create a restaurant first.</p>
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
            hoveredImage: null,
        };
    },
    methods: {
        async fetchRestaurant() {
            try {
                const response = await axios.get("https://food-backend-rz86.onrender.com/api/restaurant", {
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
                    `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu`,
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
                    `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu`,
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
                    `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu/${this.editingItemId}`,
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
                    `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu/${itemId}`,
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
        showPreview(image) {
            this.hoveredImage = image;
        },
        hidePreview() {
            this.hoveredImage = null;
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
    color: #333;
}

p {
    margin: 0.5rem 0;
    color: #666;
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

table th {
    background-color: #007bff;
    color: white;
}

.available {
    color: green;
    font-weight: bold;
}

.unavailable {
    color: red;
    font-weight: bold;
}

.image-preview-container {
    display: flex;
    gap: 5px;
}

.menu-image {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: cover;
    cursor: pointer;
}

.image-preview {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.image-preview img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
}

form {
    margin-top: 1rem;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
}

input,
textarea,
select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.edit-btn {
    background-color: #ffc107;
    color: white;
    margin-right: 5px;
}

.delete-btn {
    background-color: #dc3545;
    color: white;
}

.submit-btn {
    background-color: #007bff;
    color: white;
}

button:hover {
    opacity: 0.9;
}

.no-items,
.no-restaurant {
    text-align: center;
    color: #666;
    font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
    table {
        display: block;
        overflow-x: auto;
    }

    .menu-image {
        width: 40px;
        height: 40px;
    }

    .image-preview img {
        width: 100px;
        height: 100px;
    }
}
</style>