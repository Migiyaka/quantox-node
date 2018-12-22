<template>
    <div class="tickets">
        <div class="container">
            <h1 class="title">Tickets</h1>
            <button class="button is-primary add-ticket" @click="openCreateModal">Add Ticket</button>
            <table class="table is-fullwidth is-bordered">
                <thead>
                    <tr>
                        <th class="has-text-centered">ID</th>
                        <th class="has-text-centered">Title</th>
                        <th class="has-text-centered">Content</th>
                        <th class="has-text-centered">Status</th>
                        <th class="has-text-centered">Created By</th>
                        <th class="has-text-centered">Assigned To</th>
                        <th class="has-text-centered">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ticket in ticketList">
                        <td class="has-text-centered">{{ ticket.id }}</td>
                        <td class="has-text-centered">{{ ticket.title }}</td>
                        <td class="has-text-centered">{{ ticket.content }}</td>
                        <td class="has-text-centered">
                            {{ ticket.status ? ticket.status.text : '[No Status]' }}
                        </td>
                        <td class="has-text-centered">
                            {{ ticket.creator ? ticket.creator.username : '[No Creator]' }}
                        </td>
                        <td class="has-text-centered">
                            {{ ticket.assignee ? ticket.assignee.username : '[No Assignee]' }}
                        </td>
                        <td class="actions has-text-centered">
                            <button class="button is-success" title="Edit" @click="openUpdateModal(ticket)"
                                    v-if="showUpdateButton(ticket)">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="button is-primary" title="Update Status"
                                    @click="openUpdateStatusModal(ticket)" v-if="showUpdateStatusButton(ticket)">
                                <i class="fas fa-file"></i>
                            </button>
                            <button class="button is-info" title="History" @click="openHistoryModal(ticket)">
                                <i class="fas fa-history"></i>
                            </button>
                            <button class="button is-danger" title="Delete" @click="openDeleteModal(ticket)"
                                    v-if="showDeleteButton(ticket)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="modals">
            <Modal :show="createModal.show" @close="closeCreateModal">
                <Ticket type="create" @close="closeCreateModal"></Ticket>
            </Modal>
            <Modal :show="updateModal.show" @close="closeUpdateModal">
                <Ticket type="update" @close="closeUpdateModal" :ticketId="updateModal.id"></Ticket>
            </Modal>
            <Modal :show="updateStatusModal.show" @close="closeUpdateStatusModal">
                <Ticket type="updateStatus" @close="closeUpdateStatusModal"
                        :ticketId="updateStatusModal.id"></Ticket>
            </Modal>
            <Modal :show="deleteModal.show" @close="closeDeleteModal">
                <h4 class="title is-4">Are you sure you want to delete this ticket?</h4>
                <div class="buttons">
                    <button class="button is-success" @click="deleteTicket(deleteModal.id)">Yes</button>
                    <button class="button is-danger" @click="closeDeleteModal">No</button>
                </div>
            </Modal>
            <Modal :show="historyModal.show" @close="closeHistoryModal">
                <TicketHistory :historyItems="historyModal.history"></TicketHistory>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Modal from '@/components/Modal.vue';
    import Ticket from '@/components/Ticket.vue';
    import TicketHistory from '@/components/TicketHistory.vue';

    export default {
        components: {
            Modal,
            Ticket,
            TicketHistory,
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
                updateStatusModal: {
                    show: false,
                    id: null,
                },
                deleteModal: {
                    show: false,
                    id: null,
                },
                historyModal: {
                    show: false,
                    history: [],
                },
            };
        },
        computed: {
            ticketList() {
                return this.$store.getters['ticket/getList'];
            },
            loggedUser() {
                return this.$store.getters['authorization/getData'];
            },
        },
        async created() {
            await this.$store.dispatch('ticket/loadList');
            await this.$store.dispatch('user/loadList');
            await this.$store.dispatch('status/loadList');
        },
        sockets: {
            async updateData() {
                await this.$store.dispatch('ticket/loadList');
                await this.$store.dispatch('user/loadList');
                await this.$store.dispatch('status/loadList');
            },
        },
        methods: {
            showUpdateButton(ticket) {
                return ticket.creatorId === this.loggedUser.id || this.loggedUser.role === 'admin';
            },
            showUpdateStatusButton(ticket){
                return ticket.assigneeId === this.loggedUser.id || this.loggedUser.role === 'admin';
            },
            showDeleteButton(ticket) {
                return ticket.creatorId === this.loggedUser.id || this.loggedUser.role === 'admin';
            },
            openCreateModal() {
                this.createModal.show = true;
            },
            closeCreateModal() {
                this.createModal.show = false;
            },
            openUpdateModal(ticket) {
                this.updateModal = {
                    show: true,
                    id: ticket.id,
                };
            },
            closeUpdateModal() {
                this.updateModal = {
                    show: false,
                    id: null,
                };
            },
            openUpdateStatusModal(ticket) {
                this.updateStatusModal = {
                    show: true,
                    id: ticket.id,
                };
            },
            closeUpdateStatusModal() {
                this.updateStatusModal = {
                    show: false,
                    id: null,
                };
            },
            openDeleteModal(ticket) {
                this.deleteModal = {
                    show: true,
                    id: ticket.id,
                };
            },
            closeDeleteModal() {
                this.deleteModal = {
                    show: false,
                    id: null,
                };
            },
            async deleteTicket(id) {
                await this.$store.dispatch('ticket/delete', { id });

                this.deleteModal = {
                    show: false,
                    id: null,
                };
            },
            async openHistoryModal(ticket) {
                this.historyModal.history = await this.$store.dispatch('ticket/getHistory', { id: ticket.id });
                this.historyModal.show = true;
            },
            closeHistoryModal() {
                this.historyModal = {
                    show: false,
                    history: [],
                };
            },
        },
    };
</script>
