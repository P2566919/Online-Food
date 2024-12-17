<template>
    <nav class="sidebar">
        <h2>Dashboard</h2>
        <ul>
            <li v-for="tab in filteredTabs" :key="tab.name" :class="{ active: activeTab === tab.name }"
                @click="$emit('tab-selected', tab.name)">
                {{ tab.label }}
            </li>
        </ul>
        <button class="logout-button" @click="$emit('logout')">Logout</button>
    </nav>
</template>

<script>
export default {
    name: "SideBar",
    props: {
        tabs: {
            type: Array,
            required: true,
        },
        activeTab: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            required: true,
        },
    },
    computed: {
        filteredTabs() {
            return this.tabs.filter(
                (tab) => !tab.roles || tab.roles.includes(this.userRole)
            );
        },
    },
};
</script>

<style scoped>
.sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: #ecf0f1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.sidebar h2 {
    text-align: center;
    margin-bottom: 1rem;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar ul li {
    padding: 0.75rem 1rem;
    cursor: pointer;
    border-radius: 4px;
}

.sidebar ul li:hover,
.sidebar ul li.active {
    background-color: #34495e;
    color: #1abc9c;
}

.logout-button {
    margin-top: auto;
    padding: 0.5rem 1rem;
    background-color: #e74c3c;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    text-align: center;
}

.logout-button:hover {
    background-color: #c0392b;
}
</style>
