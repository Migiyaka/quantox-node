<template>
    <div class="modal" :class="{ 'is-active': show }">
        <div class="modal-background" @click.prevent="closeModal"></div>
        <div class="modal-content">
            <div class="box">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['show'],
        methods: {
            closeModal() {
                this.$emit('close');
            },
        },
    };
</script>
