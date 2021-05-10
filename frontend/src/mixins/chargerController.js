import axios from "axios";
import gridCalc from "@/mixins/gridCalculator.js";

export default {
    mixins: [gridCalc],
    data: () => ({}),
    methods: {
        startChargerRegulation() {
            var self = this;
            if (this.$store.getters.getRegulationModeState) {
                this.$store.commit("updateRegulationModeState");
                clearInterval(this.$store.getters.getRegulationLoopCache);
            } else {
                this.$store.commit("updateRegulationModeState");
                this.$store.commit(
                    "updateRegulationLoopCache",
                    setInterval(() => {
                        self.basicRegulationMode();
                    }, self.$store.getters.getRegulationInterval)
                );
            }
        },
        changeRegulationInterval() {
            clearInterval(this.$store.getters.getRegulationLoopCache);
            var self = this;
            if (this.$store.getters.getRegulationModeState) {
                this.$store.commit(
                    "updateRegulationLoopCache",
                    setInterval(() => {
                        self.basicRegulationMode();
                    }, self.$store.getters.getRegulationInterval)
                );
            }
        },
        basicRegulationMode() {
            var totalEnergyAvailable = parseInt(
                this.$store.getters.getTotalAvailableEffect
            );
            var consumedEnergy = parseInt(
                this.$store.getters.getActivePowerImport * 1000
            );
            var solarEnergyProdused = parseInt(
                this.$store.getters.getSolarValueWatts
            );
            var chargerMaxEffect = this.currentToEffectConverter(
                this.$store.getters.getChargerMaxCurrent
            );
            var chargerMaxCurrent = this.$store.getters.getChargerMaxCurrent;
            // var chargerDynamicCurrent = this.$store.getters
            //     .getChargerDynamicCurrent;

            var newDCC = 0;

            if (
                totalEnergyAvailable - consumedEnergy + solarEnergyProdused >
                chargerMaxEffect
            ) {
                newDCC = parseInt(chargerMaxCurrent);
            } else {
                newDCC = parseInt(
                    this.effectToCurrentConverter(
                        totalEnergyAvailable -
                            consumedEnergy +
                            solarEnergyProdused
                    )
                );
                if (
                    this.$store.getters.getCurrentRegulationMode === "Basic+LR"
                ) {
                    if (newDCC < 6) {
                        console.log("newDCC before Linear Reg: " + newDCC);
                        newDCC += this.linearRegressionCheck(newDCC);
                        console.log("newDCC after Linear Reg: " + newDCC);
                    }
                }
            }

            newDCC = parseInt(newDCC);

            if (this.$store.getters.getDynamicChargerCurrentBuffer !== newDCC) {
                this.setDynamicChargerCurrent(newDCC);
                this.$store.commit("updateDynamicChargerCurrentBuffer", newDCC);
            }
        },
        linearRegressionCheck(dcc) {
            var B = this.$store.getters.getLinearRegressionOutput.m;
            var R2 = this.$store.getters.getLinearRegressionOutput.r2;

            console.log("Checking LR");
            console.log("B: " + B);
            console.log("R2: " + R2);

            var diff = 6 - dcc;

            if (B > 0) {
                if (R2 > this.$store.getters.getR2CoefficientLimit) {
                    return diff;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        },
        setDynamicChargerCurrent(currentVal) {
            const data = JSON.stringify({
                dynamicChargerCurrent: parseInt(currentVal)
            });

            axios
                .post(
                    "https://api.easee.cloud/api/chargers/" +
                        this.$store.getters.getChargerSN +
                        "/settings",
                    data,
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
                    if (resp.status === 202) {
                        // Can't send same value twice
                        console.log("NEW DCC IS SET");
                    }
                })
                .catch(error => {
                    console.log("API FAILED" + error);
                });
        }
    }
};
