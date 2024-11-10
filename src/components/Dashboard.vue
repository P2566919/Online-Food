<template>
    <div class="dashboard-container">
        <h1>Welcome to the Dashboard</h1>
        <div class="user-info">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Username:</strong> {{ user.username }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
            <p><strong>Status:</strong> {{ user.isActive ? 'Active' : 'Inactive' }}</p>
            <p><strong>Account Created At:</strong> {{ new Date(user.createdAt).toLocaleString() }}</p>
            <p><strong>Last Updated:</strong> {{ new Date(user.updatedAt).toLocaleString() }}</p>
        </div>

        <div v-if="user.role === 'admin'" class="admin-section">
            <h2>Admin Panel</h2>
            <p>Manage users, settings, and other administrative tasks.</p>
        </div>

        <div v-if="user.role === 'restaurant'" class="restaurant-section">
            <h2>Restaurant Dashboard</h2>
            <p>Manage your menu, view orders, and update restaurant settings.</p>
        </div>

        <div v-if="user.role === 'customer'" class="customer-section">
            <h2>Customer Dashboard</h2>
            <p>View your order history, manage your profile, and browse restaurants.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserDashboard',
    data() {
        return {
            user: JSON.parse(localStorage.getItem('user')) || {},
        };
    },
};
</script>

<style scoped>
.dashboard-container {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
}

.user-info {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.user-info p {
    margin: 0.5rem 0;
}

.admin-section,
.restaurant-section,
.customer-section {
    margin-top: 2rem;
    padding: 1rem;
    background-color: #e0f7fa;
    border-radius: 4px;
}
</style>
