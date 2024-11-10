<template>
    <div class="login-container">
        <div class="login-card">
            <h2>Login</h2>
            <form @submit.prevent="loginUser">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="text" v-model="form.email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" v-model="form.password" required />
                </div>
                <button type="submit" class="login-button">Login</button>
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UserLogin',
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            errorMessage: '',
        };
    },
    methods: {
        async loginUser() {
            this.errorMessage = '';
            try {
                const response = await axios.post('http://localhost:4000/api/login', this.form);
                // Redirect or save token if needed, based on response data
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirect to the dashboard
                this.$router.push('/dashboard');
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f3f4f6;
    font-family: Arial, sans-serif;
}

.login-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

.login-card h2 {
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

.form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus {
    border-color: #3b82f6;
    outline: none;
}

.login-button {
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

.login-button:hover {
    background-color: #2563eb;
}

.error-message {
    color: #ef4444;
    margin-top: 0.5rem;
}
</style>
