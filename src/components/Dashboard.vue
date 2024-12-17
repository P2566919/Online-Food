<template>
    <div class="dashboard-layout">
        <!-- Sidebar -->
        <Sidebar :tabs="tabs" :active-tab="activeTab" :user-role="user.role" @tab-selected="activeTab = $event"
            @logout="logout" />

        <!-- Main Content -->
        <div class="main-content">
            <header class="dashboard-header">
                <h1>{{ getCurrentTabLabel() }}</h1>
            </header>

            <div class="content">
                <component :is="getActiveTabComponent()" />
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from "./sidebar.vue";
import Menu from "./Menu.vue";
import Restaurant from "./Resturant.vue"; 
import Orders from "./OrderManagement.vue"; 
import UserMenu from "./UserMenu.vue";


export default {
    name: "DashboardUser",
    components: { Sidebar,Orders, Menu,UserMenu, Restaurant },
    data() {
        return {
            user: JSON.parse(localStorage.getItem("user")) || {},
            activeTab: "usermenu",
            tabs: [
                { name: "orders", label: "Orders", roles: ["restaurant"] },
                { name: "menu", label: "Menu", roles: ["restaurant"] },
                { name: "usermenu", label: "UserMenu", roles: ["admin"] },
                { name: "restaurant", label: "Restaurant", roles: ["restaurant"] },
                { name: "profile", label: "Profile Settings" },

            ],
        };
    },
    methods: {
        getCurrentTabLabel() {
            const currentTab = this.tabs.find((tab) => tab.name === this.activeTab);
            return currentTab ? currentTab.label : "";
        },
        getActiveTabComponent() {
            switch (this.activeTab) {
                case "menu":
                    return "Menu";
                case "restaurant":
                    return "Restaurant";
                case "orders":
                    return "Orders"; // Placeholder for Orders component
                case "profile":
                    return "Profile"; // Placeholder for Profile component
                default:
                    return null;
            }
        },
        logout() {
            localStorage.removeItem("user");
            this.$router.push("/login");
        },
    },
};
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    height: 100vh;
    width: 100%;
    font-family: Arial, sans-serif;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #ecf0f1;
    overflow-y: auto;
}

.dashboard-header {
    background-color: #34495e;
    color: white;
    padding: 1rem;
    text-align: center;
}

.content {
    padding: 1.5rem;
}
</style>
