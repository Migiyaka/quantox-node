<template>
    <div class="users">
        <div class="container">
            <h1 class="title">Users</h1>
            <table class="table is-fullwidth is-bordered">
                <thead>
                    <tr>
                        <th class="has-text-centered">ID</th>
                        <th class="has-text-centered">First Name</th>
                        <th class="has-text-centered">Last Name</th>
                        <th class="has-text-centered">Email</th>
                        <th class="has-text-centered">Username</th>
                        <th class="has-text-centered">Active</th>
                        <th class="has-text-centered">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in userList">
                        <td class="has-text-centered">{{ user.id }}</td>
                        <td class="has-text-centered">{{ user.firstName }}</td>
                        <td class="has-text-centered">{{ user.lastName }}</td>
                        <td class="has-text-centered">{{ user.email }}</td>
                        <td class="has-text-centered">{{ user.username }}</td>
                        <td class="has-text-centered"><i class="fas" :class="userActiveIcon(user)"></i></td>
                        <td class="actions has-text-centered">
                            <button class="button is-primary" title="Activate" @click="activate(user)"
                                    v-if="showActivateButton(user)">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="button is-danger" title="Delete" @click="openDeleteModal(user)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="modals">
            <Modal :show="deleteModal.show" @close="closeDeleteModal">
                <h4 class="title is-4">Are you sure you want to delete this user?</h4>
                <div class="buttons">
                    <button class="button is-success" @click="deleteUser(deleteModal.id)">Yes</button>
                    <button class="button is-danger" @click="closeDeleteModal">No</button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Modal from '@/components/Modal.vue';

    export default {
        components: {
            Modal,
        },
        data() {
            return {
                deleteModal: {
                    show: false,
                    id: null,
                },
            };
        },
        computed: {
            userList() {
                return this.$store.getters['user/getList'];
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
            await this.$store.dispatch('user/loadList');
        },
        sockets: {
            async updateData() {
                await this.$store.dispatch('user/loadList');
            },
        },
        methods: {
            showActivateButton(user) {
                return !user.active;
            },
            userActiveIcon(user) {
                return user.active ? 'fa-check' : 'fa-times';
            },
            async activate(user) {
                await this.$store.dispatch('authorization/activate', { id: user.id });
            },
            openDeleteModal(user) {
                this.deleteModal = {
                    show: true,
                    id: user.id,
                };
            },
            closeDeleteModal() {
                this.deleteModal = {
                    show: false,
                    id: null,
                };
            },
            async deleteUser(id) {
                try {
                    await this.$store.dispatch('user/delete', { id });
                } catch (err) {}

                this.deleteModal = {
                    show: false,
                    id: null,
                };
            },
        },
    };
</script>
