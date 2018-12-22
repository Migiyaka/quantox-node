<template>
    <div class="login">
        <form @submit.prevent="login">
            <div class="field">
                <label class="label">Username or email *</label>
                <div class="control">
                    <input class="input" type="text" v-validate="'required'" name="username" v-model="username">
                </div>
                <p class="help is-danger">{{ errors.first('username') }}</p>
            </div>
            <div class="field">
                <label class="label">Password *</label>
                <div class="control">
                    <input class="input" type="password" v-validate="'required'" name="password" v-model="password">
                </div>
                <p class="help is-danger">{{ errors.first('password') }}</p>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link" type="submit">Login</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: '',
            };
        },
        methods: {
            async login() {
                const validateResult = await this.$validator.validateAll();

                if (validateResult) {
                    try {
                        await this.$store.dispatch('authorization/login', {
                            username: this.username,
                            password: this.password,
                        });

                        this.$router.push('/');
                    } catch (err) {
                        await this.$store.dispatch('authorization/logout');
                        this.$router.push('/login');
                    }
                }
            },
        }
    }
</script>
