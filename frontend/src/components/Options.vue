<template>
    <div>
        <v-dialog v-model="$store.state.optionsToggle" max-width="600">
            <v-card>
                <v-card-title class="title">Options</v-card-title>

                <v-list three-line subheader>
                    <!-- <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title
                                >Graph/Animation (Unstable
                                version)</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Change between graph or animation
                                view</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-switch
                                @change="unityToggle()"
                                :input-value="$store.state.showUnity"
                                color="amber"
                            ></v-switch>
                        </v-list-item-action>
                    </v-list-item>

                    <v-divider></v-divider> -->

                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title
                                >Charger Regulation</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Enable/Disable charger regulation based on
                                selected mode</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-switch
                                @change="startChargerRegulation()"
                                :input-value="$store.state.regulationModeState"
                                color="amber"
                            ></v-switch>
                        </v-list-item-action>
                    </v-list-item>

                    <v-list-item class="sim-minmax-container">
                        <v-list-item-content class="sim-minmax-text">
                            <v-list-item-title style="margin: 0px 0px 10px 0px"
                                >Regulation Modes</v-list-item-title
                            >
                            <v-list-item-subtitle
                                ><b>• Basic</b> mode makes sure that there is
                                enough current before assigning
                                DCC</v-list-item-subtitle
                            >
                            <v-list-item-subtitle
                                style="margin: 0px 0px 10px 0px"
                                >DCC=(total-consumption)+solar</v-list-item-subtitle
                            >
                            <v-list-item-subtitle
                                ><b>• Basic+LR</b> mode uses linear regression
                                model to predict solar power. β describes
                                if</v-list-item-subtitle
                            >
                            <v-list-item-subtitle
                                >slope is rising or falling, while R2
                                coefficient determines spreading in data
                                points</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <div class="sim-minmax-input">
                                <div class="vert-space"></div>
                                <v-select
                                    v-model="selectRegulationMode"
                                    :items="
                                        this.$store.getters
                                            .getRegulationModeList
                                    "
                                    label="Mode"
                                    outlined
                                ></v-select>
                                <div class="vert-space"></div>
                                <v-btn
                                    @click="changeChargerRegulationMode"
                                    plain
                                    class="sim-minmix-button"
                                    >Set</v-btn
                                >
                            </div>
                        </v-list-item-action>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-content class="lin-reg-text">
                            <v-list-item-title
                                >Regulation Interval</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Set interval for regulation. 1 sec =
                                1000</v-list-item-subtitle
                            >
                            <v-list-item-subtitle style="color: #c93030"
                                >WARNING: Setting this value to low may create
                                voltage oscillations on the
                                grid</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <div class="sim-minmax-input">
                                <v-text-field
                                    style="visibility: hidden;"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-text-field
                                    v-model="regulationModeInterval"
                                    label="Interval"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-btn
                                    @click="
                                        changeChargerRegulationInterval(),
                                            changeRegulationInterval()
                                    "
                                    plain
                                    class="sim-minmix-button"
                                    >Set</v-btn
                                >
                            </div>
                        </v-list-item-action>
                    </v-list-item>

                    <v-list-item
                        v-if="
                            $store.getters.getCurrentRegulationMode ===
                                'Basic+LR'
                        "
                    >
                        <v-list-item-content class="lin-reg-text">
                            <v-list-item-title
                                >R2 Coefficient Limit</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Adjust R2 coefficient limit between
                                0-1</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <div class="sim-minmax-input">
                                <v-text-field
                                    style="visibility: hidden;"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-text-field
                                    v-model="r2CoefficientLimit"
                                    label="R2 limit"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-btn
                                    @click="changeR2CoefficientLimit()"
                                    plain
                                    class="sim-minmix-button"
                                    >Set</v-btn
                                >
                            </div>
                        </v-list-item-action>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title
                                >Solar Simulator</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Enable/Disable solar simulator
                                (RNG)</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-switch
                                @change="simulationToggle()"
                                :input-value="$store.state.simulationMode"
                                color="amber"
                            ></v-switch>
                        </v-list-item-action>
                    </v-list-item>

                    <v-list-item class="sim-minmax-container">
                        <v-list-item-content class="sim-minmax-text">
                            <v-list-item-title
                                >Min/max Values</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Change simulator min/max values
                                (0-150)</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <div class="sim-minmax-input">
                                <v-text-field
                                    v-model="simulationMinValue"
                                    label="Min"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-text-field
                                    v-model="simulationMaxValue"
                                    label="Max"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-btn
                                    @click="updateSimValues()"
                                    plain
                                    class="sim-minmix-button"
                                    >Set</v-btn
                                >
                            </div>
                        </v-list-item-action>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                        <v-list-item-content class="lin-reg-text">
                            <v-list-item-title
                                >Linear Regression Sample
                                Rate</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Change number of samples for linear regression
                                model. ~1 sample/sec</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <div class="sim-minmax-input">
                                <v-text-field
                                    style="visibility: hidden;"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-text-field
                                    v-model="numOfSamples"
                                    label="Sample rate"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-btn
                                    @click="updateNumSamples()"
                                    plain
                                    class="sim-minmix-button"
                                    >Set</v-btn
                                >
                            </div>
                        </v-list-item-action>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                        <v-list-item-content class="lin-reg-text">
                            <v-list-item-title>Scale Factor</v-list-item-title>
                            <v-list-item-subtitle
                                >Change scale factor of incomming solar energy.
                                (Default: 100000)</v-list-item-subtitle
                            >
                        </v-list-item-content>
                        <v-list-item-action>
                            <div class="sim-minmax-input">
                                <v-text-field
                                    style="visibility: hidden;"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-text-field
                                    v-model="energyScaleFactor"
                                    label="Scale factor"
                                    outlined
                                ></v-text-field>
                                <div class="vert-space"></div>
                                <v-btn
                                    @click="updateEnergyScaleFactor()"
                                    plain
                                    class="sim-minmix-button"
                                    >Set</v-btn
                                >
                            </div>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="gray darken-1"
                        plain
                        @click="$store.commit('updateOptionsState')"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import leastSquareModel from "@/mixins/linearRegression.js";
import chargerController from "@/mixins/chargerController.js";
import rng from "@/mixins/rng.js";

export default {
    name: "options",
    mixins: [leastSquareModel, rng, chargerController],
    data: () => ({
        simMinValue: null,
        simMaxValue: null,
        samples: 0,
        scaleFactor: 0,
        regulationModes: ["Basic", "Basic+LR"],
        regMode: null,
        regInt: null,
        r2Coeff: null
    }),
    computed: {
        showUnity() {
            return this.$store.getters.getUnityState;
        },
        simulationMinValue: {
            get() {
                return this.$store.getters.getSimulationMinValue;
            },
            set(value) {
                this.simMinValue = value;
            }
        },
        simulationMaxValue: {
            get() {
                return this.$store.getters.getSimulationMaxValue;
            },
            set(value) {
                this.simMaxValue = value;
            }
        },
        numOfSamples: {
            get() {
                return this.$store.getters.getNumberOfSamples;
            },
            set(value) {
                this.samples = value;
            }
        },
        energyScaleFactor: {
            get() {
                return this.$store.getters.getScaleFactor;
            },
            set(value) {
                this.scaleFactor = value;
            }
        },
        selectRegulationMode: {
            get() {
                return this.$store.getters.getCurrentRegulationMode;
            },
            set(value) {
                this.regMode = value;
            }
        },
        regulationModeInterval: {
            get() {
                return this.$store.getters.getRegulationInterval;
            },
            set(value) {
                this.regInt = value;
            }
        },
        r2CoefficientLimit: {
            get() {
                return this.$store.getters.getR2CoefficientLimit;
            },
            set(value) {
                this.r2Coeff = value;
            }
        }
    },
    methods: {
        changeR2CoefficientLimit() {
            if (this.r2Coeff) {
                this.$store.commit("updateR2CoefficientLimit", this.r2Coeff);
            }
        },
        changeChargerRegulationMode() {
            if (this.regMode) {
                this.$store.commit("updateCurrentRegulationMode", this.regMode);
            }
        },
        changeChargerRegulationInterval() {
            if (this.regInt) {
                this.$store.commit("updateRegulationInterval", this.regInt);
            }
        },
        updateEnergyScaleFactor() {
            if (this.scaleFactor > 0) {
                this.$store.commit("updateScaleFactor", this.scaleFactor);
            }
        },
        updateNumSamples() {
            if (this.samples > 0) {
                this.$store.commit("updateNumberOfSamples", this.samples);
            }
        },
        updateSimValues() {
            if (this.simMinValue !== null) {
                this.$store.commit(
                    "updateSimulationMinValue",
                    this.simMinValue
                );
            }
            if (this.simMaxValue !== null) {
                this.$store.commit(
                    "updateSimulationMaxValue",
                    this.simMaxValue
                );
            }
        },
        unityToggle() {
            this.$store.commit("unityToggle");
        },
        simulationToggle() {
            this.$store.commit("updateSimulationModeStatus");
        }
    }
};
</script>

<style scoped>
.sim-minmax-container {
    max-height: none !important;
}
.title {
    display: flex;
    justify-content: center;
}
.sim-minmax-container {
    max-height: 90px;
}
.sim-minmax-text {
    min-width: 280px;
    max-width: 280px;
}
.sim-minmax-input {
    display: flex;
    width: 300px;
    height: 55px;
}
.sim-minmix-button {
    height: 100% !important;
}
.vert-space {
    width: 30px;
}
.lin-reg-text {
    min-width: 280px;
    max-width: 280px;
}
</style>
