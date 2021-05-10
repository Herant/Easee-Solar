<template>
    <div class="login">
        <div class="main-container">
            <v-card flat>
                <v-card-title>
                    <v-img
                        class="logo"
                        src="@/assets/easee_solar_logo.svg"
                        alt="easee-logo.png"
                    ></v-img>
                </v-card-title>
                <v-card-text style="margin-top:20px;">
                    <v-form ref="form" v-model="valid">
                        <v-text-field
                            prepend-icon="person"
                            label="Email"
                            type="email"
                            v-model="email"
                            :rules="emailRules"
                            required
                        ></v-text-field>
                        <v-text-field
                            prepend-icon="lock"
                            label="Password"
                            type="password"
                            v-model="password"
                            :rules="passwordRules"
                            required
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-col cols="12">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-btn
                            x-large
                            text
                            color="black"
                            :disabled="!valid"
                            @click="login"
                            >Login</v-btn
                        >
                        <v-spacer></v-spacer>
                    </v-row>
                </v-col>
            </v-card>
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";

export default {
    name: "login",
    data: () => ({
        valid: false,
        email: "",
        password: "",
        emailRules: [
            v => !!v || "E-mail is required",
            v =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                "E-mail must be valid"
        ],
        passwordRules: [
            v => !!v || "Password is required",
            v => v.length >= 6 || "Password must be greater than 6 characters"
        ]
    }),
    methods: {
        login() {
            firebase
                .auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    this.$router.replace("/dashboard");
                })
                .catch(err => {
                    alert(
                        "The email address or password that you've entered doesn't match any account."
                    );
                });
        }
    }
};
</script>

<style scoped>
.main-container {
    width: 300px;
    height: 300px;
    margin: auto;
    margin-top: 200px;
}
.login {
    font-weight: 300;
}
</style>
