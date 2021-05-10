<template> </template>

<script>
import * as signalR from "@microsoft/signalr";

export default {
    name: "easeewss",
    data: () => ({
        easeeURL: "https://api.easee.cloud/hubs/products",
        connection: ""
    }),
    created() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.easeeURL, {
                accessTokenFactory: () => this.$store.state.easeeAccessToken
            })
            .build();

        this.connection
            .start()
            .then(
                // Added delay between connection.start() and .invoke()
                setTimeout(() => this.subToDevices(), 1000),
                //Disable maintenance icons when connected
                this.$store.commit("clearMaintenance")
            )
            .catch(_ => {
                this.$store.commit("updateEaseeWSSConnectionStatus", false);
                //Enable maintenance icons when not connected
                this.$store.commit("updateMaintenance", true);
                this.$store.commit("updateEaseeAccessTokenMaintenance", true);
                // Notify user
                this.$store.commit(
                    "snackbarNotify",
                    "Update your Easee access token."
                );
            });
    },
    mounted() {
        this.connection.on("ProductUpdate", update => {
            if (update.mid === this.$store.getters.getEqualizerSN) {
                this.$store.commit("updateEqualizerData", update);
            } else if (update.mid === this.$store.getters.getChargerSN) {
                this.$store.commit("updateChargerData", update);
            }
        });
    },
    methods: {
        subToDevices() {
            if (!this.$store.getters.getEaseeWSSConnectionStatus) {
                var devices = [
                    this.$store.getters.getEqualizerSN,
                    this.$store.getters.getChargerSN
                ];
                var count = 0;
                for (var device in devices) {
                    this.connection
                        .invoke(
                            "SubscribeWithCurrentState",
                            devices[device],
                            true
                        )
                        .then(_ => {
                            // Updating connection status to prevent from subscribe if already subscribed.
                            console.log("Subscribing to: " + devices[count]);
                            this.$store.commit(
                                "updateEaseeWSSConnectionStatus",
                                true
                            );
                            this.$store.commit("clearMaintenance");
                            count++;
                        })
                        .catch(_ => {
                            if (this.connection.state === "Connected") {
                                this.$store.commit(
                                    "snackbarNotify",
                                    "Failed to subscribe to Equalizer. Check connection"
                                );
                                this.$store.commit("updateMaintenance", true);
                            }
                        });
                }
            }
        }
    }
};
</script>

<style></style>
