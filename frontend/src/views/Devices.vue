<template>
    <div id="devices">
        <navbar id="navbar" />
        <div id="main-content-container">
            <div class="content-container">
                <div class="forms">
                    <div class="title-text">Charger</div>
                    <div class="img">
                        <v-img
                            src="@/assets/charger_white.png"
                            alt="charger_white.png"
                        ></v-img>
                        <v-icon
                            v-if="testDevice && chargerTest === 'OK'"
                            class="test-icon-charger"
                            style="color:rgb(34, 230, 34)"
                            >check</v-icon
                        >
                        <v-icon
                            v-if="testDevice && chargerTest === 'FAILED'"
                            class="test-icon-charger"
                            style="color:rgb(255, 30, 30)"
                            >close</v-icon
                        >
                    </div>
                    <div class="input">
                        <v-text-field
                            outlined
                            autocomplete="charger"
                            type="text"
                            v-model="chargerSNumValue"
                            label="Charger SN"
                        ></v-text-field>
                    </div>
                </div>

                <div class="forms">
                    <div class="title-text">Equalizer</div>
                    <div class="img">
                        <v-img
                            class="equalizer-img"
                            src="@/assets/equalizer.png"
                            alt="equalizer.png"
                        ></v-img>
                        <v-icon
                            v-if="testDevice && equalizerTest === 'OK'"
                            class="test-icon-equalizer"
                            style="color:rgb(34, 230, 34)"
                            >check</v-icon
                        >
                        <v-icon
                            v-if="testDevice && equalizerTest === 'FAILED'"
                            class="test-icon-equalizer"
                            style="color:rgb(255, 30, 30)"
                            >close</v-icon
                        >
                    </div>
                    <div class="input">
                        <v-text-field
                            outlined
                            autocomplete="equalizer"
                            type="text"
                            v-model="equalizerSNumValue"
                            label="Equalizer SN"
                        ></v-text-field>
                    </div>
                </div>
            </div>
            <div class="content-container-btn">
                <v-btn class="btn" outlined @click="saveDevices">Update</v-btn>
                <v-btn class="btn" outlined @click="testConnection"
                    >Test Connection</v-btn
                >
            </div>
        </div>
        <snackbar />
    </div>
</template>

<script>
import firebase from "firebase/app";
import axios from "axios";

import navbar from "@/components/Navbar.vue";
import snackbar from "@/components/Snackbar.vue";

import db from "@/components/firebaseInit";
import loadUserDataMixin from "@/mixins/loadUserData.js";

export default {
    name: "devices",
    mixins: [loadUserDataMixin],
    components: {
        navbar,
        snackbar
    },
    data: () => ({
        testDevice: false,
        equalizerTest: null,
        chargerTest: null,
        chargerSerialN: null,
        equalizerSerialN: null
    }),
    computed: {
        chargerSNumValue: {
            get() {
                return this.$store.getters.getChargerSN;
            },
            set(value) {
                this.chargerSerialN = value;
            }
        },
        equalizerSNumValue: {
            get() {
                return this.$store.getters.getEqualizerSN;
            },
            set(value) {
                this.equalizerSerialN = value;
            }
        }
    },
    methods: {
        saveDevices() {
            if (this.chargerSerialN !== null) {
                this.$store.commit("updateChargerSN", this.chargerSerialN);
            }
            if (this.equalizerSerialN !== null) {
                this.$store.commit("updateEqualizerSN", this.equalizerSerialN);
            }

            if (typeof this.$store.getters.getEqualizerSN != "undefined") {
                db.collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .update({
                        equalizerSN: this.$store.getters.getEqualizerSN
                    })
                    .then(() => {
                        this.$store.commit(
                            "snackbarNotify",
                            "Equalizer SN updated!"
                        );
                        this.$store.commit(
                            "updateEaseeWSSConnectionStatus",
                            false
                        );
                    })
                    .catch(error => {
                        if (error.code === "not-found") {
                            db.collection("users")
                                .doc(firebase.auth().currentUser.uid)
                                .set({
                                    equalizerSN: this.$store.getters
                                        .getEqualizerSN
                                })
                                .then(() => {
                                    this.$store.commit(
                                        "snackbarNotify",
                                        "Equalizer SN added!"
                                    );
                                })
                                .catch(_ => {
                                    this.$store.commit(
                                        "snackbarNotify",
                                        "Unable to add Equalizer SN. Try again"
                                    );
                                });
                        }
                        this.$store.commit(
                            "snackbarNotify",
                            "Unable to update Equalizer SN. Try again"
                        );
                    });
            }
            if (typeof this.$store.getters.getChargerSN != "undefined") {
                db.collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .update({
                        chargerSN: this.$store.getters.getChargerSN
                    })
                    .then(() => {
                        this.$store.commit(
                            "snackbarNotify",
                            "Charger SN updated!"
                        );
                        this.$store.commit(
                            "updateEaseeWSSConnectionStatus",
                            false
                        );
                    })
                    .catch(error => {
                        if (error.code === "not-found") {
                            db.collection("users")
                                .doc(firebase.auth().currentUser.uid)
                                .set({
                                    chargerSN: this.$store.getters.getChargerSN
                                })
                                .then(() => {
                                    this.$store.commit(
                                        "snackbarNotify",
                                        "Charger SN added!"
                                    );
                                })
                                .catch(_ => {
                                    this.$store.commit(
                                        "snackbarNotify",
                                        "Unable to add Charger SN. Try again"
                                    );
                                });
                        }
                        this.$store.commit(
                            "snackbarNotify",
                            "Unable to update Charger SN. Try again"
                        );
                    });
            }
        },
        testConnection() {
            this.testDevice = true;
            // Charger connection test
            axios
                .get(
                    "https://api.easee.cloud/api/chargers/" +
                        this.$store.getters.getChargerSN +
                        "/state",
                    {
                        headers: {
                            Authorization:
                                "Bearer " +
                                this.$store.getters.getEaseeAccessToken,
                            "Content-Type": "application/json"
                        }
                    }
                )
                .then(resp => {
                    if (resp.status === 200) {
                        if (resp.data.isOnline) {
                            this.chargerTest = "OK";
                        }
                    }
                })
                .catch(error => {
                    this.chargerTest = "FAILED";
                    this.$store.commit(
                        "snackbarNotify",
                        "Charger connection test error: " +
                            error.response.status
                    );
                });
            // Equalizer connection test
            axios
                .get(
                    "https://api.easee.cloud/api/equalizers/" +
                        this.$store.getters.getEqualizerSN +
                        "/state",
                    {
                        headers: {
                            Authorization:
                                "Bearer " +
                                this.$store.getters.getEaseeAccessToken,
                            "Content-Type": "application/json"
                        }
                    }
                )
                .then(resp => {
                    if (resp.status === 200) {
                        if (resp.data.isOnline) {
                            this.equalizerTest = "OK";
                        }
                    }
                })
                .catch(error => {
                    this.equalizerTest = "FAILED";
                    this.$store.commit(
                        "snackbarNotify",
                        "Equalizer connection test error: " +
                            error.response.status
                    );
                });
        }
    }
};
</script>

<style scoped>
.img {
    height: 200px;
}
.test-icon-charger {
    position: absolute;
    margin: -120px 0 0 -10px;
}
.test-icon-equalizer {
    position: absolute;
    margin: -60px 0 0 -10px;
}
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
    flex-direction: column;
}
.content-container {
    width: 100%;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
}
.content-container-btn {
    align-self: center;
    display: flex;
    flex-direction: column;
}
.forms {
    width: 250px;
    height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    text-align: -webkit-center;
    margin: 0 10px 0 10px;
}
.title-text {
    font-size: 30px;
    font-weight: 300;
    margin: 20px;
    color: #424750;
}
.equalizer-img {
    margin-top: 25px;
    width: 80px;
}
.input {
    padding: 0 50px 0 50px;
}
.btn {
    color: #275aa5;
    width: 160px;
    margin: 10px 20px 10px 20px;
}
@media screen and (max-width: 600px) {
    .content-container {
        flex-direction: column;
    }
    .btn {
        margin: 10px 0 10px 0;
    }
}
</style>
