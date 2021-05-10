<template>
    <div>
        <!-- <v-btn @click="apiTest1">API Test 1</v-btn> -->
        <!-- <v-btn @click="apiTest2">API Test 2</v-btn> -->
        <!-- <v-btn @click="wssTest">WSS Test</v-btn> -->
        <!-- <v-btn @click="signalrTest">Signal R Test</v-btn> -->
    </div>
</template>

<script>
// import axios from "axios";
import io from "socket.io-client";
import * as signalR from "@microsoft/signalr";

export default {
    name: "wss-client",
    data: () => ({
        baseURL: "http://localhost:5000",
        solarPanelAPI: "https://b177f5f9cd20.ngrok.io",
        easee_url: "https://api.easee.cloud/hubs/chargers",
        testData: { status: "Sendt" },
        socket: "",
        solarPanelWSS: "",
        signarConnection: ""
    }),
    methods: {
        // RestAPI Test
        apiTest1: async function() {
            const gResponse = await fetch(this.baseURL + "hello");
            const gObject = await gResponse.json();
            console.log(gObject.hello);
        },
        apiTest2: async function() {
            let response = await fetch(this.baseURL + "test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.testData)
            });
            if (response.status == 200) {
                let result = await response.json();
                console.log(result);
            }
        },
        // Websocket Test
        wssTest() {
            this.socket.emit("test", "Hello from Vue Socket.IO");
        },
        signalrTest() {
            // this.signarConnection.invoke(
            //     "SubscribeWithCurrentState",
            //     "EH013052",
            //     true
            // );
            // this.signarConnection
            //     .invoke("Subscribe", "EH002600")
            this.signarConnection
                .invoke("SubscribeWithCurrentState", "EQ000036", true)
                // this.signarConnection
                //     .invoke("Subscribe", "EQ000051")
                .then(l => {
                    console.log("Subscribing");
                })
                .catch(error => {
                    console.log(error);
                });
        }
        // toggleSimulationMode() {
        //     this.solarPanelWSS.emit("toggle_simulation_mode");
        // },
        // resetDailyProduction() {
        //     this.solarPanelWSS.emit("reset_daily_production");
        // },
        // changeRegressionSampleRate() {
        //     this.solarPanelWSS.emit("change_regression_sample_rate", 61);
        // },
        // changeSimulationValues() {
        //     var data = {
        //         min: 120,
        //         max: 140
        //     };
        //     this.solarPanelWSS.emit("change_simulation_values", data);
        // }
        // RESTAPI
        // toggleSimulationMode: async function() {
        //     const gResponse = await fetch(
        //         this.$store.getters.getSolarAPIURL +
        //             "/change_regression_sample_rate"
        //     );
        //     const gObject = await gResponse.json();
        //     console.log(gObject.hello);
        // }
    },
    created() {
        // SocketIO start connection
        // this.socket = io.connect(this.baseURL);
        // solarPanel start connection
        this.solarPanelWSS = io.connect(this.solarPanelAPI);

        //SignalR start connection
        this.signarConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.easee_url, {
                accessTokenFactory: () => this.$store.state.easeeAccessToken
            })
            .build();

        this.signarConnection.start().catch(error => {
            console.log("Update access token");
        });
    },
    mounted() {
        //Subscribing on SocketIO - socket
        this.solarPanelWSS.on("solarDataStream", data => {
            // console.log(data);
            this.$store.commit("updateSolarValue", data);
        });

        this.solarPanelWSS.on("connect", data => {
            console.log("Connected to solar panel API");
        });

        //Subscribing on SignalR - socket
        this.signarConnection.on("ProductUpdate", update => {
            console.log(update);
        });

        // this.solarPanelWSS.on("simulation_status_resp", data => {
        //     console.log("SIMULATION_MODE: " + data);
        // });

        // this.solarPanelWSS.on("reset_daily_production_resp", data => {
        //     console.log("Daily Production: " + data);
        // });

        // this.solarPanelWSS.on("change_regression_sample_rate", data => {
        //     console.log("Changing sample rate status: " + data);
        // });

        // this.solarPanelWSS.on("change_simulation_values_resp", data => {
        //     console.log("Changing simulation values status: " + data);
        // });
    }
    // created: async function() {
    //     const gResponse = await fetch("http://172.28.0.215:5000/hello");
    //     const gObject = await gResponse.json();
    //     console.log(gObject.hello);
    // }
};
</script>

<style></style>
