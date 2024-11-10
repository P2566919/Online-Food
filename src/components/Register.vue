<template>
    <div class="register-container">
        <div class="register-card">
            <h2>Register</h2>
            <form @submit.prevent="registerUser">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" v-model="form.name" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" v-model="form.email" required />
                </div>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" v-model="form.username" required />
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select v-model="form.role" required>
                        <option value="customer">Customer</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" v-model="form.password" required />
                </div>
                <button type="submit" class="register-button">Register</button>
                <p class="login-link">
                    Already have an account? <router-link to="/login">Login here</router-link>
                </p>
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UserRegister',
    data() {
        return {
            form: {
                name: '',
                email: '',
                username: '',
                role: '',
                password: '',
            },
            errorMessage: '',
            successMessage: '',
        };
    },
    methods: {
        async registerUser() {
            this.errorMessage = '';
            this.successMessage = '';
            try {
                await axios.post('http://localhost:4000/api/register', this.form);
                this.successMessage = 'Registration successful! Please log in.';
                this.resetForm();
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            }
        },
        resetForm() {
            this.form.name = '';
            this.form.email = '';
            this.form.username = '';
            this.form.role = '';
            this.form.password = '';
        },
    },
};
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f3f4f6;
    font-family: Arial, sans-serif;
}

.register-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

.register-card h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
}

.form-group {
    margin-bottom: 1rem;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #3b82f6;
    outline: none;
}

.register-button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.register-button:hover {
    background-color: #2563eb;
}

.error-message {
    color: #ef4444;
    margin-top: 0.5rem;
}

.success-message {
    color: #10b981;
    margin-top: 0.5rem;
}
</style>
