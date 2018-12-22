<template>
    <div class="home">
        <Menu></Menu>
        <router-view></router-view>
    </div>
</template>

<script>
    import Menu from '@/components/Menu.vue';

    export default {
        components: {
            Menu,
        },
        computed: {
            username() {
                return this.$store.getters['user/getData'].username;
            },
        },
    };
</script>
