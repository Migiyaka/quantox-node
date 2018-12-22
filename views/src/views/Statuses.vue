<template>
    <div class="statuses">
        <div class="container">
            <h1 class="title">Statuses</h1>
            <button class="button is-primary add-status" @click="openCreateModal">Add Status</button>
            <table class="table is-fullwidth is-bordered">
                <thead>
                    <tr>
                        <th class="has-text-centered">ID</th>
                        <th class="has-text-centered">Name</th>
                        <th class="has-text-centered">Text</th>
                        <th class="has-text-centered">Creator</th>
                        <th class="has-text-centered">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="status in statusList">
                        <td class="has-text-centered">{{ status.id }}</td>
                        <td class="has-text-centered">{{ status.name }}</td>
                        <td class="has-text-centered">{{ status.text }}</td>
                        <td class="has-text-centered">
                            {{ status.creator ? status.creator.username : '[No Creator]' }}
                        </td>
                        <td class="actions has-text-centered">
                            <button class="button is-success" title="Edit" @click="openUpdateModal(status)"
                                    v-if="showActionButton(status)">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="button is-danger" title="Delete" @click="openDeleteModal(status)"
                                    v-if="showActionButton(status)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="modals">
            <Modal :show="createModal.show" @close="closeCreateModal">
                <Status type="create" @close="closeCreateModal"></Status>
            </Modal>
            <Modal :show="updateModal.show" @close="closeUpdateModal">
                <Status type="update" @close="closeUpdateModal" :statusId="updateModal.id"></Status>
            </Modal>
            <Modal :show="deleteModal.show" @close="closeDeleteModal">
                <h4 class="title is-4">Are you sure you want to delete this status?</h4>
                <div class="buttons">
                    <button class="button is-success" @click="deleteStatus(deleteModal.id)">Yes</button>
                    <button class="button is-danger" @click="closeDeleteModal">No</button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Modal from '@/components/Modal.vue';
    import Status from '@/components/Status.vue';

    export default {
        components: {
            Modal,
            Status,
        },
        data() {
            return {
                createModal: {
                    show: false,
                },
                updateModal: {
                    show: false,
                    id: null,
                },
                deleteModal: {
                    show: false,
                    id: null,
                },
            };
        },
        computed: {
            statusList() {
                return this.$store.getters['status/getList'];
            },
            loggedUser() {
                return this.$store.getters['authorization/getData'];
            },
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (vm.loggedUser.role !== 'admin') {
                    next(from.path);
                } else {
                    next();
                }
            });
        },
        beforeRouteUpdate(to, from, next) {
            if (this.loggedUser.role !== 'admin') {
                next(from.path);
            } else {
                next();
            }
        },
        async created() {
            await this.$store.dispatch('status/loadList');
        },
        sockets: {
            async updateData() {
                await this.$store.dispatch('status/loadList');
            },
        },
        methods: {
            openCreateModal() {
                this.createModal.show = true;
            },
            closeCreateModal() {
                this.createModal.show = false;
            },
            openUpdateModal(status) {
                this.updateModal = {
                    show: true,
                    id: status.id,
                };
            },
            closeUpdateModal() {
                this.updateModal = {
                    show: false,
                    id: null,
                };
            },
            openDeleteModal(status) {
                this.deleteModal = {
                    show: true,
                    id: status.id,
                };
            },
            closeDeleteModal() {
                this.deleteModal = {
                    show: false,
                    id: null,
                };
            },
            async deleteStatus(id) {
                try {
                    await this.$store.dispatch('status/delete', { id });
                } catch (err) {}

                this.deleteModal = {
                    show: false,
                    id: null,
                };
            },
            showActionButton(status) {
                return status.editable;
            },
        },
    };
</script>
