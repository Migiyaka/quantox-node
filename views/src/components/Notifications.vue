<template>
    <div class="notifications-wrapper" :class="position">
        <transition-group name="slide-fade" tag="div" class="notifications-inner">
            <div v-for="(notification, index) in notifications" :key="`notification-${index}`"
                    class="notification" :class="notificationClass(notification.type)">
                {{ notification.text | capitalize }}
            </div>
        </transition-group>
    </div>
</template>

<script>
    export default {
        props: {
            position: {
                type: String,
                default: 'top-left'
            }
        },
        computed: {
            notifications() {
                return this.$store.getters['notification/getList'];
            },
        },
        watch: {
            position() {
                this.$store.dispatch('notification/calculateOrder', this.position);
            },
        },
        created() {
            this.$store.dispatch('notification/calculateOrder', this.position);
        },
        methods: {
            notificationClass(type) {
                return (type === 'error') ? 'is-danger' : 'is-success';
            },
        },
    };
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss" scoped>
    .notifications-wrapper {
        position: fixed;
        z-index: 10000;

        .notifications-inner {
            width: 300px;
            position: absolute;

            .notification {
                position: relative;
                width: 100%;
                margin-top: 15px;

                &.slide-fade-enter-active, &.slide-fade-leave-active, &.slide-fade-move {
                    transition: all 0.3s ease;
                }

                &.slide-fade-enter, &.slide-fade-leave-to {
                    opacity: 0;
                }

                &.slide-fade-leave-active {
                    position: absolute;
                }
            }
        }

        &.top-left {
            top: 30px;
            left: 30px;

            .notifications-inner {
                top: 0px;
                left: 0px;

                .notification {
                    &.slide-fade-enter, &.slide-fade-leave-to {
                        transform: translateY(-10px);
                    }
                }
            }
        }

        &.top-right {
            top: 30px;
            right: 30px;

            .notifications-inner {
                top: 0px;
                right: 0px;

                .notification {
                    &.slide-fade-enter, &.slide-fade-leave-to {
                        transform: translateY(-10px);
                    }
                }
            }
        }

        &.bottom-left {
            bottom: 30px;
            left: 30px;

            .notifications-inner {
                bottom: 0px;
                left: 0px;

                .notification {
                    &.slide-fade-enter, &.slide-fade-leave-to {
                        transform: translateY(10px);
                    }
                }
            }
        }

        &.bottom-right {
            bottom: 30px;
            right: 30px;

            .notifications-inner {
                bottom: 0px;
                right: 0px;

                .notification {

                    &.slide-fade-enter, &.slide-fade-leave-to {
                        transform: translateY(10px);
                    }
                }
            }
        }
    }
</style>
