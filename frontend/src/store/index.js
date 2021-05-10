import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        showUnity: 0,
        snackbarActive: false,
        snackbarText: "",
        easeeAccessToken: "",
        maintenance: false,
        easeeAccessTokenMaintenance: false,
        equalizerSN: "",
        chargerSN: "",
        easeeWSSConnectionStatus: false,
        equalizerData: [],
        chargerData: [],
        solarAPIURL: "",
        solarAPIConnection: false,
        optionsToggle: false,

        simulationMode: false,
        simMinValue: 119,
        simMaxValue: 120,

        numberOfSamples: 30,
        linearRegressionOutput: {},

        regulationModeState: false,
        regulationModes: ["Basic", "Basic+LR"],
        regulationInterval: 60000,
        selectedRegulationMode: "Basic",
        regulationLoopCache: null,
        dynamicChargerCurrentBuffer: 0,
        r2CoefficientLimit: 0.7,

        // Data sendt from Rpi-server
        solarData: [],
        // Adjust value to scale up or down solar effect data
        scaleFactor: 100000,
        // Should be set to 0 when using data from solar panel.
        solarDummyValue: 0,
        // Adjust setpoint to change max value for solar production
        solarSP: 5625,
        // Actual effect in (W) produced by solar panel
        realEffectSolar: 0,

        chartData: [
            {
                name: "Total",
                data: []
            },
            {
                name: "Solar",
                data: []
            },
            {
                name: "Grid",
                data: []
            },
            {
                name: "timestamp",
                data: []
            }
        ]
    },
    getters: {
        getUnityState: state => {
            return state.showUnity;
        },
        getEaseeAccessToken: state => {
            return state.easeeAccessToken;
        },
        getSolarAPIURL: state => {
            return state.solarAPIURL;
        },
        getSolarData: state => {
            return state.solarData;
        },
        getSolarValueWattsPersentage: state => {
            // Let's user to adjust solar effect produced
            var solarScaledEffect =
                state.solarData.realPower * state.scaleFactor +
                state.solarDummyValue;

            if (Number.isNaN(solarScaledEffect)) {
                return 0;
            } else {
                // Checks that solar value not exceeds total value for donut chart
                if (solarScaledEffect > state.solarSP) {
                    solarScaledEffect = state.solarSP;
                }
                return (solarScaledEffect / state.solarSP) * 100;
            }
        },
        getSolarValueWatts: state => {
            if (!state.solarData.realPower) {
                return 0;
            } else {
                var scaledValue =
                    state.solarData.realPower * state.scaleFactor +
                    state.solarDummyValue;
                return scaledValue;
            }
        },
        getChargerSN: state => {
            return state.chargerSN;
        },
        getEqualizerSN: state => {
            return state.equalizerSN;
        },
        getEaseeWSSConnectionStatus: state => {
            return state.easeeWSSConnectionStatus;
        },
        getEqualizerData: state => {
            return state.equalizerData;
        },
        getChargerGridType: state => {
            var gridTypeIndex = state.chargerData.findIndex(x => x.id == 21);

            if (gridTypeIndex === -1) {
                return 0;
            } else {
                return state.chargerData[gridTypeIndex].value;
            }
        },
        getChargerGridTypeString: state => {
            var gridTypeIndex = state.chargerData.findIndex(x => x.id == 21);

            if (gridTypeIndex === -1) {
                return 0;
            } else {
                var gridType = state.chargerData[gridTypeIndex].value;
                if (gridType === "1") {
                    return "TN 3-Ph";
                } else if (gridType === "2") {
                    return "TN 2-Ph";
                } else if (gridType === "3") {
                    return "TN 1-Ph";
                } else if (gridType === "4") {
                    return "IT 3-Ph";
                } else if (gridType === "5") {
                    return "IT 1-Ph";
                } else {
                    return "Not Detected";
                }
            }
        },
        getChargerInCurrent: (state, getters) => {
            var gridType = getters.getChargerGridType;

            var InCurrentT2Index = state.chargerData.findIndex(
                x => x.id == 182
            );
            var InCurrentT3Index = state.chargerData.findIndex(
                x => x.id == 183
            );
            var InCurrentT4Index = state.chargerData.findIndex(
                x => x.id == 184
            );
            var InCurrentT5Index = state.chargerData.findIndex(
                x => x.id == 185
            );

            var current = {};

            if (
                InCurrentT2Index === -1 ||
                InCurrentT3Index === -1 ||
                InCurrentT4Index === -1 ||
                InCurrentT5Index === -1
            ) {
                return 0;
            } else {
                // TN
                if (gridType === "1" || gridType === "2" || gridType === "3") {
                    current = {
                        L1: state.chargerData[InCurrentT3Index].value,
                        L2: state.chargerData[InCurrentT4Index].value,
                        L3: state.chargerData[InCurrentT5Index].value
                    };
                    return current;
                }
                // IT
                else if (gridType === "4" || gridType === "5") {
                    current = {
                        L1: state.chargerData[InCurrentT2Index].value,
                        L2: state.chargerData[InCurrentT3Index].value,
                        L3: state.chargerData[InCurrentT4Index].value
                    };
                    return current;
                } else if (
                    gridType === "30" ||
                    gridType === "31" ||
                    gridType === "32" ||
                    gridType === "33" ||
                    gridType === "34" ||
                    gridType === "35"
                ) {
                    console.log("Warning, id: " + gridType);
                    return 0;
                } else {
                    console.log("Error, id: " + gridType);
                    return 0;
                }
            }
        },
        getChargerDynamicCurrent: state => {
            var dynamicCurrentIndex = state.chargerData.findIndex(
                x => x.id == 48
            );

            if (dynamicCurrentIndex === -1) {
                return 0;
            } else {
                return state.chargerData[dynamicCurrentIndex].value;
            }
        },
        getChargerMaxCurrent: state => {
            var maxCurrentIndex = state.chargerData.findIndex(x => x.id == 47);

            if (maxCurrentIndex === -1) {
                return 0;
            } else {
                return state.chargerData[maxCurrentIndex].value;
            }
        },
        getTotalAvailableEffect: state => {
            var gridTypeIndex = state.equalizerData.findIndex(x => x.id == 29);
            var numPhasesIndex = state.equalizerData.findIndex(x => x.id == 30);
            var ratedCurrentIndex = state.equalizerData.findIndex(
                x => x.id == 20
            );

            if (
                gridTypeIndex === -1 ||
                numPhasesIndex === -1 ||
                ratedCurrentIndex === -1
            ) {
                return 0;
            } else {
                var totalEffectAvailable = 0;
                var mainFuseCurrent = JSON.parse(
                    state.equalizerData[ratedCurrentIndex].value
                ).ratedCurrent;

                if (state.equalizerData[gridTypeIndex].value === "1") {
                    if (state.equalizerData[numPhasesIndex].value === "3") {
                        totalEffectAvailable = 3 * 230 * mainFuseCurrent;
                    } else if (
                        state.equalizerData[numPhasesIndex].value === "2"
                    ) {
                        totalEffectAvailable = 2 * 230 * mainFuseCurrent;
                    } else if (
                        state.equalizerData[numPhasesIndex].value === "1"
                    ) {
                        totalEffectAvailable = 230 * mainFuseCurrent;
                    }
                } else if (state.equalizerData[gridTypeIndex].value === "2") {
                    if (state.equalizerData[numPhasesIndex].value === "3") {
                        totalEffectAvailable =
                            230 * mainFuseCurrent * Math.sqrt(3);
                    } else if (
                        state.equalizerData[numPhasesIndex].value === "2"
                    ) {
                        totalEffectAvailable = 230 * mainFuseCurrent;
                    }
                }
                return totalEffectAvailable.toFixed(0);
            }
        },
        getActivePowerImport: state => {
            var idx = state.equalizerData.findIndex(x => x.id == 40);
            if (idx === -1) {
                return 0;
            } else {
                return state.equalizerData[idx].value;
            }
        },
        getChargerState: state => {
            var idx = state.chargerData.findIndex(x => x.id == 109);
            if (idx === -1) {
                return 0;
            } else {
                if (parseInt(state.chargerData[idx].value) === 1) {
                    return "Standby";
                } else if (parseInt(state.chargerData[idx].value) === 2) {
                    return "Car Connected";
                } else if (parseInt(state.chargerData[idx].value) === 3) {
                    return "Charging";
                } else if (parseInt(state.chargerData[idx].value) === 4) {
                    return "Charging Complete";
                } else if (parseInt(state.chargerData[idx].value) === 5) {
                    return "Error";
                } else if (parseInt(state.chargerData[idx].value) === 6) {
                    return "Ready to Charge";
                }
            }
        },
        getTotalAvailableEffectPersentage: (_, getters) => {
            var effectPersentage =
                ((getters.getActivePowerImport * 1000) /
                    getters.getTotalAvailableEffect) *
                100;
            if (Number.isNaN(effectPersentage)) {
                return 0;
            } else {
                return effectPersentage;
            }
        },
        getPowerDifference: (_, getters) => {
            var powerConsumed = getters.getActivePowerImport * 1000;
            var powerConsumedFromGrid =
                powerConsumed - getters.getSolarValueWatts;
            return powerConsumedFromGrid;
        },
        getPowerDifferencePersentage: (_, getters) => {
            var val =
                (getters.getPowerDifference /
                    (getters.getActivePowerImport * 1000)) *
                100;
            if (Number.isNaN(val)) {
                return 0;
            } else {
                return val;
            }
        },
        getChartTimestamp: state => {
            return state.chartData[3].data;
        },
        getChartTotal: state => {
            return state.chartData[0].data;
        },
        getChartSolar: state => {
            return state.chartData[1].data;
        },
        getChartGrid: state => {
            return state.chartData[2].data;
        },
        getSolarAPIConnection: state => {
            return state.getSolarAPIConnection;
        },
        getSimulationModeStatus: state => {
            return state.simulationMode;
        },
        getSimulationMinValue: state => {
            return state.simMinValue;
        },
        getSimulationMaxValue: state => {
            return state.simMaxValue;
        },
        getNumberOfSamples: state => {
            return state.numberOfSamples;
        },
        getScaleFactor: state => {
            return state.scaleFactor;
        },
        getLinearRegressionOutput: state => {
            return state.linearRegressionOutput;
        },
        getRegulationModeState: state => {
            return state.regulationModeState;
        },
        getRegulationModeList: state => {
            return state.regulationModes;
        },
        getCurrentRegulationMode: state => {
            return state.selectedRegulationMode;
        },
        getRegulationInterval: state => {
            return state.regulationInterval;
        },
        getRegulationLoopCache: state => {
            return state.regulationLoopCache;
        },
        getDynamicChargerCurrentBuffer: state => {
            return state.dynamicChargerCurrentBuffer;
        },
        getR2CoefficientLimit: state => {
            return state.r2CoefficientLimit;
        }
    },
    mutations: {
        unityToggle(state) {
            state.showUnity = !state.showUnity;
        },
        snackbarNotify(state, payload) {
            (state.snackbarActive = true), (state.snackbarText = payload);
        },
        loadEaseeAccessToken(state, payload) {
            state.easeeAccessToken = payload;
        },
        loadSolarAPIURL(state, payload) {
            state.solarAPIURL = payload;
        },
        updateSolarData(state, payload) {
            state.solarData = payload;
        },
        clearMaintenance(state) {
            state.maintenance = false;
            state.easeeAccessTokenMaintenance = false;
        },
        updateMaintenance(state, payload) {
            state.maintenance = payload;
        },
        updateEaseeAccessTokenMaintenance(state, payload) {
            state.easeeAccessTokenMaintenance = payload;
        },
        updateChargerSN(state, payload) {
            state.chargerSN = payload;
        },
        updateEqualizerSN(state, payload) {
            state.equalizerSN = payload;
        },
        updateEaseeWSSConnectionStatus(state, payload) {
            state.easeeWSSConnectionStatus = payload;
        },
        updateEqualizerData(state, payload) {
            var idx = state.equalizerData.findIndex(x => x.id == payload.id);
            if (idx === -1) {
                state.equalizerData.push(payload);
            } else {
                state.equalizerData[idx].value = payload.value;
            }
        },
        updateChargerData(state, payload) {
            var idx = state.chargerData.findIndex(x => x.id == payload.id);
            if (idx === -1) {
                state.chargerData.push(payload);
            } else {
                state.chargerData[idx].value = payload.value;
            }
        },
        updateChartTotal(state, payload) {
            state.chartData[0].data = payload;
        },
        updateChartSolar(state, payload) {
            state.chartData[1].data = payload;
        },
        updateChartGrid(state, payload) {
            state.chartData[2].data = payload;
        },
        updateChartTimestamp(state, payload) {
            state.chartData[3].data = payload;
        },
        updateSolarDummyValue(state, payload) {
            state.solarDummyValue = parseInt(payload);
        },
        updateSolarAPIConnection(state, payload) {
            state.getSolarAPIConnection = payload;
        },
        updateOptionsState(state, _) {
            state.optionsToggle = !state.optionsToggle;
        },
        updateSimulationModeStatus(state, _) {
            state.simulationMode = !state.simulationMode;
        },
        updateSimulationMinValue(state, payload) {
            state.simMinValue = parseInt(payload);
        },
        updateSimulationMaxValue(state, payload) {
            state.simMaxValue = parseInt(payload);
        },
        updateNumberOfSamples(state, payload) {
            state.numberOfSamples = parseInt(payload);
        },
        updateScaleFactor(state, payload) {
            state.scaleFactor = parseInt(payload);
        },
        updateLinearRegressionOutput(state, payload) {
            state.linearRegressionOutput = payload;
        },
        updateRegulationModeState(state, _) {
            state.regulationModeState = !state.regulationModeState;
        },
        updateCurrentRegulationMode(state, payload) {
            state.selectedRegulationMode = payload;
        },
        updateRegulationInterval(state, payload) {
            state.regulationInterval = parseInt(payload);
        },
        updateRegulationLoopCache(state, payload) {
            state.regulationLoopCache = payload;
        },
        updateDynamicChargerCurrentBuffer(state, payload) {
            state.dynamicChargerCurrentBuffer = parseInt(payload);
        },
        updateR2CoefficientLimit(state, payload) {
            state.r2CoefficientLimit = parseFloat(payload);
        }
    },
    actions: {},
    modules: {}
});
