<template>
    <div id="connect">
        <navbar id="navbar" />
        <div id="main-content-container">
            <div id="content-container">
                <div class="forms">
                    <div
                        v-if="$store.state.easeeAccessTokenMaintenance"
                        class="description-text maintenance-text"
                    >
                        Update your access token
                    </div>
                    <div class="title-text">Easee WSS</div>
                    <div class="description-text">
                        Get access token with easee credentials
                    </div>
                    <v-text-field
                        class="input"
                        outlined
                        autocomplete="username"
                        type="text"
                        v-model="username"
                        label="Username"
                    ></v-text-field>
                    <v-text-field
                        :append-icon="pwShow ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="pwShow ? 'text' : 'password'"
                        @click:append="pwShow = !pwShow"
                        autocomplete="new-password"
                        class="input"
                        outlined
                        v-model="password"
                        label="Password"
                    ></v-text-field>
                    <v-btn class="btn" outlined @click="loginWithCredentials"
                        >Authorize</v-btn
                    >
                </div>

                <div class="title-text">OR</div>

                <div class="forms">
                    <div class="description-text">Paste your token here</div>
                    <v-text-field
                        class="input"
                        outlined
                        v-model="accessTokenValue"
                        label="Access Token"
                    ></v-text-field>
                    <v-btn class="btn" outlined @click="updateToken"
                        >Update Token</v-btn
                    >
                    <v-btn
                        style="margin: 10px 0 0 0"
                        class="btn"
                        color="error"
                        outlined
                        @click="deleteToken"
                        >Delete Token</v-btn
                    >
                </div>
            </div>
        </div>
        <snackbar />
        <easeewss v-if="$store.state.easeeAccessToken !== ''" />
    </div>
</template>

<script>
import axios from "axios";
import firebase from "firebase/app";

import navbar from "@/components/Navbar.vue";
import snackbar from "@/components/Snackbar.vue";
import solarwss from "@/components/SolarWSS.vue";
import easeewss from "@/components/EaseeWSS.vue";

import db from "@/components/firebaseInit";
import loadUserDataMixin from "@/mixins/loadUserData.js";

export default {
    name: "connect",
    mixins: [loadUserDataMixin],
    components: {
        navbar,
        snackbar,
        easeewss,
        solarwss
    },
    data: () => ({
        username: "",
        password: "",
        pwShow: false,
        token: null
    }),
    computed: {
        accessTokenValue: {
            get() {
                return this.$store.getters.getEaseeAccessToken;
            },
            set(value) {
                this.token = value;
            }
        }
    },
    methods: {
        deleteToken() {
            db.collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                    easeeAccessToken: firebase.firestore.FieldValue.delete()
                })
                .then(() => {
                    this.$store.commit("loadEaseeAccessToken", null);
                    this.accessTokenValue = null;
                    this.$store.commit("updateMaintenance", true);
                    this.$store.commit(
                        "updateEaseeAccessTokenMaintenance",
                        true
                    );
                });
        },
        saveToken() {
            db.collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                    easeeAccessToken: this.accessTokenValue
                })
                .then(() => {
                    this.$store.commit("snackbarNotify", "Token updated!");
                })
                .catch(error => {
                    if (error.code === "not-found") {
                        db.collection("users")
                            .doc(firebase.auth().currentUser.uid)
                            .set({
                                easeeAccessToken: this.$store.getters
                                    .getEaseeAccessToken
                            })
                            .then(() => {
                                this.$store.commit(
                                    "snackbarNotify",
                                    "Token added!"
                                );
                            })
                            .catch(_ => {
                                this.$store.commit(
                                    "snackbarNotify",
                                    "Unable to set token. Try again"
                                );
                            });
                    }
                    this.$store.commit(
                        "snackbarNotify",
                        "Unable to update token. Try again"
                    );
                });
        },
        updateToken() {
            if (this.token !== null) {
                this.$store.commit("loadEaseeAccessToken", this.token);

                axios
                    .get("https://api.easee.cloud/api/accounts/easeekeys/", {
                        headers: {
                            Authorization:
                                "Bearer " +
                                this.$store.getters.getEaseeAccessToken,
                            "Content-Type": "application/json"
                        }
                    })
                    .then(resp => {
                        if (resp.status === 200) {
                            this.$store.commit("updateMaintenance", false);
                            this.$store.commit(
                                "updateEaseeAccessTokenMaintenance",
                                false
                            );
                            this.saveToken();
                        }
                    })
                    .catch(_ => {
                        this.$store.commit("snackbarNotify", "Invalid token.");
                    });
            }
        },
        loginWithCredentials() {
            const jsonData = JSON.stringify({
                userName: this.username,
                password: this.password
            });
            axios
                .post("https://api.easee.cloud/api/accounts/token", jsonData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(resp => {
                    if (resp.status === 200) {
                        this.username = "";
                        this.password = "";
                        this.$store.commit(
                            "loadEaseeAccessToken",
                            resp.data.accessToken
                        );
                        this.$store.commit("updateMaintenance", false);
                        this.$store.commit(
                            "updateEaseeAccessTokenMaintenance",
                            false
                        );
                        this.saveToken();
                    }
                })
                .catch(error => {
                    this.username = "";
                    this.password = "";
                    this.$store.commit(
                        "snackbarNotify",
                        "Unable to login. Error: " + error.response.status
                    );
                });
        }
    }
};
</script>

<style scoped>
#navbar {
    padding: 10;
    max-width: 100%;
}
#main-content-container {
    max-width: 1920px;
    max-height: 800px;
    margin: 20px auto 0 auto;
    padding: 20px 20px 20px 20px;
    display: flex;
    justify-content: center;
}
#content-container {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.forms {
    width: 300px;
    text-align: center;
}
.title-text {
    font-size: 30px;
    font-weight: 300;
    margin: 20px;
    color: #424750;
}
.description-text {
    font-size: 16px;
    font-weight: 300;
    margin-bottom: 10px;
    color: #424750;
}
.maintenance-text {
    color: rgb(255, 30, 30);
}
.btn {
    margin: 0 10px 0 10px;
    color: #275aa5;
}
.vertical-line {
    min-width: 300px;
    min-height: 1px;
    background-color: #747474;
    margin: 50px 0px 20px 0px;
}
</style>
