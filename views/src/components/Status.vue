<template>
    <div class="status">
        <h4 class="title is-4">{{ this.type === 'create' ? 'Create' : 'Update' }} Status</h4>
        <form @submit.prevent="statusAction">
            <div class="field">
                <label class="label">Name *</label>
                <div class="control">
                    <input class="input" type="text" v-validate="'required|alpha_dash'" name="name"
                            v-model="name" data-vv-as="name">
                </div>
                <p class="help is-danger">{{ errors.first('name') }}</p>
            </div>
            <div class="field">
                <label class="label">Text *</label>
                <div class="control">
                    <input class="input" type="text" v-validate="'required'" name="text"
                            v-model="text" data-vv-as="text">
                </div>
                <p class="help is-danger">{{ errors.first('text') }}</p>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link" type="submit">
                        {{ this.type === 'create' ? 'Create' : 'Update'}} Status
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
            statusId: {
                type: Number,
            },
        },
        data() {
            return {
                name: '',
                text: '',
            };
        },
        watch: {
            async statusId() {
                if (this.statusId) {
                    await this.initValuesForUpdate();
                }
            }
        },
        async created() {
            if (this.statusId) {
                await this.initValuesForUpdate();
            }
        },
        methods: {
            async statusAction() {
                const validateResult = await this.$validator.validateAll();

                if (validateResult) {
                    try {
                        await this.$store.dispatch(`status/${this.type}`, {
                            id: this.statusId,
                            name: this.name,
                            text: this.text,
                        });
                    } catch (err) {}

                    this.name = '';
                    this.text = '';

                    this.$emit('close');
                }
            },
            async initValuesForUpdate() {
                const status = await this.$store.dispatch('status/load', { id: this.statusId });

                this.name = status.name;
                this.text = status.text;
            },
        },
    };
</script>
