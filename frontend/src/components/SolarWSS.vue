<template> </template>

<script>
import io from "socket.io-client";
import linearRegression from "@/mixins/linearRegression.js";

export default {
    name: "solarwss",
    mixins: [linearRegression],
    data: () => ({
        solarPanelWSS: "",
        energyData: []
    }),
    created() {
        this.solarPanelWSS = io.connect(this.$store.getters.getSolarAPIURL);
    },
    destroyed() {
        this.solarPanelWSS.off("solarDataStream");
        this.solarPanelWSS.off("connect");
        this.$store.commit("updateSolarAPIConnection", false);
        console.log("Disconnected from solar API");
    },
    mounted() {
        this.solarPanelWSS.on("solarDataStream", data => {
            var jsonData = JSON.parse(data);
            // console.log(jsonData);
            if (this.$store.getters.getSimulationModeStatus) {
                var rnd = this.randomNumberGenerator();
                var simData = {
                    adc: rnd,
                    realPower: this.adcToWattConverter(rnd),
                    dailyProd: 0
                };
                this.$store.commit("updateSolarData", simData);
                this.regressionCalculation(simData.realPower);
            } else {
                this.$store.commit("updateSolarData", jsonData);
                this.regressionCalculation(jsonData.realPower);
            }
        });

        this.solarPanelWSS.on("connect", _ => {
            console.log("Connected to solar API");
            this.$store.commit("updateSolarAPIConnection", true);
        });
    },
    methods: {
        randomNumberGenerator() {
            var min = this.$store.getters.getSimulationMinValue;
            var max = this.$store.getters.getSimulationMaxValue;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        adcToWattConverter(adc) {
            var voltage = (adc * 5.12) / 1024;
            var current = voltage / 10;
            return voltage * current;
        },
        regressionCalculation(energy) {
            if (
                this.energyData.length !==
                this.$store.getters.getNumberOfSamples
            ) {
                this.energyData.push(energy);
                if (
                    this.energyData.length >
                    this.$store.getters.getNumberOfSamples
                ) {
                    this.energyData = [];
                }
            } else {
                this.leastSquareRegression(this.energyData);
                this.energyData = [];
            }
        }
    }
};
</script>
