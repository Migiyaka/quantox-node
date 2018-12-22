<template>
    <nav class="navbar is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/">
                <h1 class="title">Quantox Node Test App</h1>
            </router-link>
            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                    data-target="navbar" :class="{ 'is-active': showMenu }" @click.prevent="toggleMenu">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="navbar" class="navbar-menu" :class="{ 'is-active': showMenu }">
            <div class="navbar-end">
                <span class="navbar-item is-hidden-touch">Welcome, {{ loggedUser.username }}</span>
                <span class="navbar-item is-hidden-touch">|</span>
                <router-link class="navbar-item" to="/" v-if="loggedUser.role === 'admin'">
                    Tickets
                </router-link>
                <router-link class="navbar-item" to="/users" v-if="loggedUser.role === 'admin'">
                    Users
                </router-link>
                <router-link class="navbar-item" to="/statuses" v-if="loggedUser.role === 'admin'">
                    Statuses
                </router-link>
                <div class="navbar-item">
                    <a class="button is-primary" @click.prevent="logout">Logout</a>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        data() {
            return {
                showMenu: false,
            }
        },
        computed: {
            loggedUser() {
                return this.$store.getters['authorization/getData'];
            },
        },
        methods: {
            toggleMenu() {
                this.showMenu = !this.showMenu;
            },
            logout() {
                this.$store.dispatch('authorization/logout');
                this.$router.push('/login');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navbar {
        margin-bottom: 30px;
    }
</style>
