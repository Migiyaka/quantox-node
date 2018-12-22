<template>
    <div id="app">
        <Notifications></Notifications>
        <router-view />
    </div>
</template>

<script>
    import Notifications from '@/components/Notifications.vue';

    export default {
        components: {
            Notifications,
        },
    };
</script>

<style lang="scss">
    @import '@/assets/scss/main.scss';
</style>
