<template>
    <div id="settings">
        <navbar id="navbar" />
        <div id="main-content-container">
            <div id="content-container">
                <v-text-field
                    outlined
                    label="Easee Access Token"
                    v-model="$store.state.easeeAccessToken"
                ></v-text-field>
                <v-text-field
                    outlined
                    label="Easee Refresh Token"
                    v-model="$store.state.easeeRefreshToken"
                ></v-text-field>
                <div id="btn-container">
                    <v-btn class="btn" outlined @click="saveSettingToDB"
                        >Save</v-btn
                    >
                    <v-btn class="btn" outlined @click="loginTest">Test</v-btn>
                </div>
            </div>
        </div>
        <wss v-if="$store.state.easeeAccessToken !== ''" />
        <snackbar />
    </div>
</template>

<script>
import navbar from "@/components/Navbar.vue";
import snackbar from "@/components/Snackbar.vue";
import firebase from "firebase/app";
import db from "@/components/firebaseInit";
import wss from "@/components/WSSConnectionTest.vue";
import axios from "axios";

export default {
    name: "settings",
    components: {
        navbar,
        snackbar,
        wss
    },
    data: () => ({}),
    computed: {},
    created() {
        db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.$store.commit(
                        "loadEaseeAccessToken",
                        doc.data().easeeAccessToken
                    );
                    this.$store.commit(
                        "loadEaseeRefreshToken",
                        doc.data().easeeRefreshToken
                    );
                }
            })
            .catch(error => {
                console.log("Error getting document:", error);
            });
    },
    methods: {
        saveSettingToDB() {
            db.collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({
                    easeeAccessToken: this.$store.getters.getEaseeAccessToken,
                    easeeRefreshToken: this.$store.getters.getEaseeRefreshToken
                })
                .then(() => {
                    this.$store.commit("snackbarNotify", "Saved!");
                })
                .catch(error => {
                    this.$store.commit(
                        "snackbarNotify",
                        "Unable to save. Try again"
                    );
                });
        },
        refreshToken() {
            const jsonData = JSON.stringify({
                accessToken: this.$store.getters.getEaseeAccessToken,
                refreshToken: this.$store.getters.getEaseeRefreshToken
            });
            axios
                .post(
                    "https://api.easee.cloud/api/accounts/refresh_token",
                    jsonData,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
                .then(resp => {
                    console.log(resp);
                })
                .catch(error => {
                    console.log(error.message);
                });
        },
        loginTest() {
            const jsonData = JSON.stringify({
                userName: "",
                password: ""
            });
            axios
                .post("https://api.easee.cloud/api/accounts/token", jsonData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(resp => {
                    console.log(resp);
                    if (resp.status === 200) {
                        console.log("Success");
                    }
                })
                .catch(error => {
                    console.log(error.message);
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
    margin: 120px auto 0 auto;
    padding: 20px 20px 20px 20px;
    display: flex;
    justify-content: center;
}
#content-container {
    width: 50%;
}
#btn-container {
    width: 100%;
    display: flex;
    justify-content: center;
}
.btn {
    margin-right: 10px;
    margin-left: 10px;
}
</style>
