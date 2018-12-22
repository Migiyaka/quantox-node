<template>
    <div class="register">
        <form @submit.prevent="register">
            <div class="field">
                <label class="label">First Name *</label>
                <div class="control">
                    <input class="input" type="text" v-validate="'required'" name="firstName" v-model="firstName" data-vv-as="first name">
                </div>
                <p class="help is-danger">{{ errors.first('firstName') }}</p>
            </div>
            <div class="field">
                <label class="label">Last Name *</label>
                <div class="control">
                    <input class="input" type="text" v-validate="'required'" name="lastName" v-model="lastName" data-vv-as="last name">
                </div>
                <p class="help is-danger">{{ errors.first('lastName') }}</p>
            </div>
            <div class="field">
                <label class="label">Email *</label>
                <div class="control">
                    <input class="input" type="email" v-validate="'required|email'" name="email" v-model="email">
                </div>
                <p class="help is-danger">{{ errors.first('email') }}</p>
            </div>
            <div class="field">
                <label class="label">Username *</label>
                <div class="control">
                    <input class="input" type="text" v-validate="'required'" name="username" v-model="username">
                </div>
                <p class="help is-danger">{{ errors.first('username') }}</p>
            </div>
            <div class="field">
                <label class="label">Password *</label>
                <div class="control">
                    <input class="input" type="password" v-validate="'required|min:8'" name="password" v-model="password" ref="password">
                </div>
                <p class="help is-danger">{{ errors.first('password') }}</p>
            </div>
            <div class="field">
                <label class="label">Repeat Password *</label>
                <div class="control">
                    <input class="input" type="password" v-validate="'confirmed:password'" name="repeatPassword" v-model="repeatPassword" data-vv-as="password">
                </div>
                <p class="help is-danger">{{ errors.first('repeatPassword') }}</p>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link" type="submit">Register</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                username: '',
                password: '',
                repeatPassword: '',
            };
        },
        methods: {
            async register() {
                const validateResult = await this.$validator.validateAll();

                if (validateResult) {
                    await this.$store.dispatch('authorization/register', {
                        firstName: this.firstName,
                        lastName: this.lastName,
                        email: this.email,
                        username: this.username,
                        password: this.password,
                    });
                }
            },
        }
    }
</script>
