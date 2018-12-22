<template>
    <div class="login">
        <section class="hero is-fullheight">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title has-text-centered">Quantox Node Test App</h1>
                    <div class="box">
                        <div class="tabs is-toggle is-fullwidth">
                            <ul>
                                <li :class="{ 'is-active': tabActive('login') }">
                                    <a @click.prevent="setActiveTab('login')">
                                        <span>Login</span>
                                    </a>
                                </li>
                                <li :class="{ 'is-active': tabActive('register') }">
                                    <a @click.prevent="setActiveTab('register')">
                                        <span>Register</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content">
                            <div class="tab" v-show="tabActive('login')">
                                <Login></Login>
                            </div>
                            <div class="tab" v-show="tabActive('register')">
                                <Register></Register>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Login from '@/components/Login.vue';
    import Register from '@/components/Register.vue';

    export default {
        components: {
            Login,
            Register,
        },
        data() {
            return {
                tab: 'login',
            };
        },
        methods: {
            setActiveTab(tab) {
                this.tab = tab;
            },
            tabActive(tab) {
                return this.tab === tab;
            },
        }
    }
</script>