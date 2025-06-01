<template>
  <div class="menu-container">
    <div v-if="restaurant">
      <h2 class="restaurant-title">Menu for {{ restaurant.name }}</h2>

      <!-- Menu Table -->
      <div v-if="menu && menu.length" class="menu-table-container">
        <table class="menu-table">
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
            <tr v-for="item in menu" :key="item._id || item.id || item.name">
              <td>{{ item.itemName }}</td>
              <td class="description-cell">{{ item.description }}</td>
              <td class="price-cell">₦{{ item.price?.toLocaleString() }}</td>
              <td>
                <span :class="['status-badge', item.availability ? 'available' : 'unavailable']">
                  {{ item.availability ? 'Available' : 'Unavailable' }}
                </span>
              </td>
              <td>
                <div class="image-preview-container">
                  <img
                    v-for="(image, idx) in item.images || []"
                    :key="idx"
                    :src="image"
                    alt="Menu Image"
                    class="menu-image-thumbnail"
                    @mouseover="showPreview(image)"
                    @mouseleave="hidePreview"
                  />
                </div>
              </td>
              <td class="actions-cell">
                <button class="action-btn edit-btn" @click="prepareEdit(item)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" @click="deleteMenuItem(item._id)">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <p class="no-items">No menu items found.</p>
        <button class="add-first-item" @click="showAddForm = true">
          <i class="fas fa-plus"></i> Add Your First Menu Item
        </button>
      </div>

      <!-- Add/Edit Form -->
      <div class="form-container" :class="{ 'form-visible': showAddForm || isEditing }">
        <form @submit.prevent="isEditing ? updateMenuItem() : addMenuItem()">
          <div class="form-header">
            <h3>{{ isEditing ? 'Edit Menu Item' : 'Add New Menu Item' }}</h3>
            <button type="button" class="close-form" @click="closeForm">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="itemName">Item Name</label>
              <input type="text" id="itemName" v-model="newMenuItem.itemName" required />
            </div>

            <div class="form-group">
              <label for="price">Price (₦)</label>
              <input type="number" id="price" v-model="newMenuItem.price" required />
            </div>

            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea id="description" v-model="newMenuItem.description" required></textarea>
            </div>

            <div class="form-group">
              <label for="availability">Availability</label>
              <select id="availability" v-model="newMenuItem.availability">
                <option :value="true">Available</option>
                <option :value="false">Unavailable</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="images">Upload Images</label>
              <div class="file-upload-area" @click="triggerFileInput">
                <div v-if="!newMenuItem.images?.length" class="upload-prompt">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload images or drag and drop</p>
                </div>
                <div v-else class="upload-preview">
                  <div v-for="(image, index) in newMenuItem.images" :key="index" class="uploaded-image">
                    <img :src="image" alt="Uploaded preview" />
                    <button class="remove-image" @click.stop="removeImage(index)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  multiple
                  accept="image/*"
                  @change="handleFileUpload"
                  style="display: none"
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeForm">Cancel</button>
            <button type="submit" class="submit-btn">
              {{ isEditing ? 'Update Item' : 'Add Item' }}
            </button>
          </div>
        </form>
      </div>

      <button v-if="!showAddForm && !isEditing" class="add-new-btn" @click="showAddForm = true">
        <i class="fas fa-plus"></i> Add New Menu Item
      </button>
    </div>

    <div v-else class="no-restaurant-container">
      <p class="no-restaurant">No restaurant found.</p>
      <router-link to="/create-restaurant" class="create-restaurant-btn">
        Create Your Restaurant First
      </router-link>
    </div>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  name: 'MenuView',
  data() {
    return {
      restaurant: null,
      menu: [],
      newMenuItem: {
        itemName: '',
        description: '',
        price: '',
        availability: true,
        images: [],
      },
      isEditing: false,
      editingItemId: null,
      hoveredImage: null,
      showAddForm: false,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    removeImage(index) {
      this.newMenuItem.images.splice(index, 1);
    },
    closeForm() {
      this.resetForm();
      this.showAddForm = false;
    },
    async fetchRestaurant() {
      try {
        const res = await axios.get('https://food-backend-rz86.onrender.com/api/restaurant', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        this.restaurant = res.data.data;
        if (this.restaurant) this.fetchMenu();
      } catch (err) {
        console.error('Failed to fetch restaurant:', err);
        this.restaurant = null;
      }
    },
    async fetchMenu() {
      try {
        const res = await axios.get(
          `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        this.menu = res.data.allMenus || [];
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      }
    },
    async addMenuItem() {
      try {
        const res = await axios.post(
          `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu`,
          this.newMenuItem,
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        this.menu.push(res.data.data);
        this.resetForm();
        alert('Menu item added successfully!');
      } catch (err) {
        console.error('Failed to add menu item:', err);
        alert('Error adding menu item. Please try again.');
      }
    },
    async updateMenuItem() {
      try {
        await axios.put(
          `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu/${this.editingItemId}`,
          this.newMenuItem,
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        this.menu = this.menu.map(item =>
          item._id === this.editingItemId ? { ...item, ...this.newMenuItem } : item
        );
        this.resetForm();
        alert('Menu item updated successfully!');
      } catch (err) {
        console.error('Failed to update menu item:', err);
        alert('Error updating menu item. Please try again.');
      }
    },
    async deleteMenuItem(id) {
      console.log('Deleting item with ID:', id)
      try {
        await axios.delete(
          `https://food-backend-rz86.onrender.com/api/restaurants/${this.restaurant._id}/menu/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        this.menu = this.menu.filter(item => item._id !== id);
        alert('Menu item deleted successfully!');
      } catch (err) {
        console.error('Failed to delete menu item:', err);
        alert('Error deleting menu item. Please try again.');
      }
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.newMenuItem.images = [];
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = e => this.newMenuItem.images.push(e.target.result);
        reader.readAsDataURL(file);
      }
    },
    prepareEdit(item) {
      this.newMenuItem = { ...item };
      this.editingItemId = item._id;
      this.isEditing = true;
      this.showAddForm = true;
    },
    showPreview(image) {
      this.hoveredImage = image;
    },
    hidePreview() {
      this.hoveredImage = null;
    },
    resetForm() {
      this.newMenuItem = {
        itemName: '',
        description: '',
        price: '',
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
/* Base Styles */
.menu-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.restaurant-title {
    color: #2d3436;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
}

/* Table Styles */
.menu-table-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    margin-bottom: 2rem;
}

.menu-table {
    width: 100%;
    border-collapse: collapse;
}

.menu-table th {
    background-color: #00a396;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 500;
}

.menu-table td {
    padding: 1rem;
    border-bottom: 1px solid #f1f1f1;
    vertical-align: middle;
}

.menu-table tr:last-child td {
    border-bottom: none;
}

.menu-table tr:hover {
    background-color: #f8f9fa;
}

/* Table Cell Styles */
.description-cell {
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.price-cell {
    font-weight: 600;
    color: #00a396;
}

.status-badge {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.available {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.unavailable {
    background-color: #ffebee;
    color: #c62828;
}

/* Image Preview */
.image-preview-container {
    display: flex;
    gap: 0.5rem;
}

.menu-image-thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.2s;
}

.menu-image-thumbnail:hover {
    transform: scale(1.1);
}

.image-preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.preview-content {
    position: relative;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
}

.preview-image {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 5px;
}

.close-preview {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ff6b6b;
    color: white;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.no-items {
    font-size: 1.2rem;
    color: #636e72;
    margin-bottom: 1.5rem;
}

.add-first-item {
    background-color: #00a396;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.add-first-item:hover {
    background-color: #00897b;
}

/* Form Styles */
.form-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out, padding 0.3s ease-out, margin 0.3s ease-out;
}

.form-visible {
    max-height: 1000px;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.form-header h3 {
    color: #2d3436;
    font-size: 1.3rem;
    margin: 0;
}

.close-form {
    background: none;
    border: none;
    color: #636e72;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.2rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.full-width {
    grid-column: span 2;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2d3436;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #00a396;
    outline: none;
}

.form-group textarea {
    min-height: 100px;
    resize: vertical;
}

.file-upload-area {
    border: 2px dashed #ddd;
    border-radius: 5px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
}

.file-upload-area:hover {
    border-color: #00a396;
}

.upload-prompt {
    color: #636e72;
}

.upload-prompt i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #00a396;
}

.upload-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.uploaded-image {
    position: relative;
    width: 80px;
    height: 80px;
}

.uploaded-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

.remove-image {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ff6b6b;
    color: white;
    border: none;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
}

.cancel-btn {
    background: #f5f5f5;
    color: #636e72;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-btn:hover {
    background: #e0e0e0;
}

.submit-btn {
    background-color: #00a396;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.submit-btn:hover {
    background-color: #00897b;
}

/* Add New Button */
.add-new-btn {
    background-color: #00a396;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
}

.add-new-btn:hover {
    background-color: #00897b;
}

/* No Restaurant State */
.no-restaurant-container {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.no-restaurant {
    font-size: 1.2rem;
    color: #636e72;
    margin-bottom: 1.5rem;
}

.create-restaurant-btn {
    background-color: #00a396;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    text-decoration: none;
    display: inline-block;
}

.create-restaurant-btn:hover {
    background-color: #00897b;
}

/* Action Buttons */
.action-btn {
    border: none;
    padding: 0.5rem 0.8rem;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-right: 0.5rem;
}

.edit-btn {
    background-color: #ffc107;
    color: #2d3436;
}

.edit-btn:hover {
    background-color: #ffab00;
}

.delete-btn {
    background-color: #f44336;
    color: white;
}

.delete-btn:hover {
    background-color: #e53935;
}

/* Responsive Design */
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .full-width {
        grid-column: span 1;
    }
    
    .menu-table {
        display: block;
        overflow-x: auto;
    }
    
    .actions-cell {
        white-space: nowrap;
    }
}

@media (max-width: 576px) {
    .restaurant-title {
        font-size: 1.5rem;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .cancel-btn,
    .submit-btn,
    .add-new-btn,
    .create-restaurant-btn,
    .add-first-item {
        width: 100%;
        justify-content: center;
    }
}
</style>