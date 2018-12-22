<template>
    <div class="ticket">
        <h4 class="title is-4">{{ this.type === 'create' ? 'Create' : 'Update' }} Ticket</h4>
        <form @submit.prevent="ticketAction">
            <div class="field" v-if="type !== 'updateStatus'">
                <label class="label">Title *</label>
                <div class="control">
                    <input class="input" type="text" v-validate="'required'" name="title"
                            v-model="title" data-vv-as="title">
                </div>
                <p class="help is-danger">{{ errors.first('title') }}</p>
            </div>
            <div class="field" v-if="type !== 'updateStatus'">
                <label class="label">Content *</label>
                <div class="control">
                    <textarea class="textarea" type="text" v-validate="'required'" name="content"
                            v-model="content" data-vv-as="content"></textarea>
                </div>
                <p class="help is-danger">{{ errors.first('content') }}</p>
            </div>
            <div class="field" v-if="type !== 'updateStatus'">
                <label class="label">Assigned To *</label>
                <div class="control">
                    <div class="select">
                        <select v-validate="'required'" name="assignedTo" v-model="assigneeId" data-vv-as="assigned to">
                            <option v-for="user in userList" :value="user.id">{{ user.username }}</option>
                        </select>
                    </div>
                </div>
                <p class="help is-danger">{{ errors.first('assignedTo') }}</p>
            </div>
            <div class="field" v-if="type === 'updateStatus'">
                <label class="label">Status *</label>
                <div class="control">
                    <div class="select">
                        <select v-validate="'required'" name="status" v-model="statusId" data-vv-as="status">
                            <option v-for="status in statusList" :value="status.id">
                                {{ status.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <p class="help is-danger">{{ errors.first('status') }}</p>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link" type="submit">
                        {{ this.type === 'create' ? 'Create' : 'Update'}} Ticket
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'create',
            },
            ticketId: {
                type: Number,
            },
        },
        data() {
            return {
                title: '',
                content: '',
                statusId: null,
                assigneeId: null,
            };
        },
        computed: {
            userList() {
                return this.$store.getters['user/getList'];
            },
            statusList() {
                return this.$store.getters['status/getList'];
            },
        },
        watch: {
            async ticketId() {
                if (this.ticketId) {
                    await this.initValuesForUpdate();
                }
            }
        },
        async created() {
            if (this.ticketId) {
                await this.initValuesForUpdate();
            }
        },
        methods: {
            async ticketAction() {
                const validateResult = await this.$validator.validateAll();

                if (validateResult) {
                    await this.$store.dispatch(`ticket/${this.type}`, {
                        id: this.ticketId,
                        title: this.title,
                        content: this.content,
                        assigneeId: this.assigneeId,
                        statusId: this.statusId,
                    });

                    this.title = '';
                    this.content = '';
                    this.assigneeId = null;

                    this.$emit('close');
                }
            },
            async initValuesForUpdate() {
                const ticket = await this.$store.dispatch('ticket/load', { id: this.ticketId });

                this.title = ticket.title;
                this.content = ticket.content;
                this.assigneeId = ticket.assigneeId;
                this.statusId = ticket.statusId;
            },
        },
    };
</script>
