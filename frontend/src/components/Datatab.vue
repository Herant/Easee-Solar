<template>
    <div class="datatab">
        <div class="datatab-container">
            <div class="title" style="display: flex;">
                Site
                <div style="fontSize: 14px; marginLeft: 5px; paddingTop: 2px;">
                    ({{ $store.getters.getEqualizerSN }})
                </div>
            </div>
            <div class="line"></div>
            <div class="sub-section">
                <div class="sub-section-key">Total Capacity</div>
                <div class="sub-section-value">
                    {{ totalAvailableEffect }} kW
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Power Consumption</div>
                <div class="sub-section-value">{{ activePowerImport }} kW</div>
            </div>
        </div>

        <div class="datatab-container">
            <div class="title" style="display: flex;">Solar</div>
            <div class="line"></div>
            <div class="sub-section">
                <div class="sub-section-key">Scaled By</div>
                <div class="sub-section-value">
                    {{ $store.state.scaleFactor }}
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Total Capacity</div>
                <div class="sub-section-value">{{ solarSP }} kW</div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Scaled Power</div>
                <div class="sub-section-value">{{ solarScaledPower }} kW</div>
            </div>
            <div style="height: 20px;"></div>
            <div class="sub-section">
                <div class="sub-section-key">Real Power</div>
                <div class="sub-section-value">{{ solarRealPower }} W</div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Today's Production</div>
                <div class="sub-section-value">{{ todaysProduction }} Wh</div>
            </div>
        </div>

        <div class="datatab-container">
            <div class="title">Grid</div>
            <div class="line"></div>
            <div class="sub-section">
                <div class="sub-section-key">Import</div>
                <div class="sub-section-value">{{ consumedGridPower }} kW</div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Export</div>
                <div class="sub-section-value">{{ exportPower }} kW</div>
            </div>
        </div>

        <div class="datatab-container">
            <div class="title" style="display: flex;">
                Charger
                <div style="fontSize: 14px; marginLeft: 5px; paddingTop: 2px;">
                    ({{ $store.getters.getChargerSN }})
                </div>
            </div>
            <div class="line"></div>
            <div class="sub-section">
                <div class="sub-section-key">Charger Status</div>
                <div class="sub-section-value">
                    {{ $store.getters.getChargerState }}
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Grid Type</div>
                <div class="sub-section-value">
                    {{ $store.getters.getChargerGridTypeString }}
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Max Charger Current</div>
                <div class="sub-section-value">
                    <div>
                        {{ $store.getters.getChargerMaxCurrent }} A /
                        {{
                            (
                                currentToEffectConverter(
                                    $store.getters.getChargerMaxCurrent
                                ) / 1000
                            ).toFixed(1)
                        }}
                        kW
                    </div>
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Dynamic Charger Current</div>
                <div class="sub-section-value">
                    <div>
                        {{ $store.getters.getChargerDynamicCurrent }} A /
                        {{
                            (
                                currentToEffectConverter(
                                    $store.getters.getChargerDynamicCurrent
                                ) / 1000
                            ).toFixed(1)
                        }}
                        kW
                    </div>
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Charging Current L1</div>
                <div class="sub-section-value">
                    <div>
                        {{ chargerInCurrent.L1 }} A /
                        {{
                            (
                                currentToEffectConverter(chargerInCurrent.L1) /
                                1000
                            ).toFixed(1)
                        }}
                        kW
                    </div>
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Charging Current L2</div>
                <div class="sub-section-value">
                    <div>
                        {{ chargerInCurrent.L2 }} A /
                        {{
                            (
                                currentToEffectConverter(chargerInCurrent.L2) /
                                1000
                            ).toFixed(1)
                        }}
                        kW
                    </div>
                </div>
            </div>
            <div class="sub-section">
                <div class="sub-section-key">Charging Current L3</div>
                <div class="sub-section-value">
                    <div>
                        {{ chargerInCurrent.L3 }} A /
                        {{
                            (
                                currentToEffectConverter(chargerInCurrent.L3) /
                                1000
                            ).toFixed(1)
                        }}
                        kW
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gridCalculator from "@/mixins/gridCalculator.js";

export default {
    name: "datatab",
    mixins: [gridCalculator],
    components: {},
    data: () => ({
        exportPower: 0
    }),
    methods: {},
    computed: {
        activePowerImport: function() {
            return parseFloat(this.$store.getters.getActivePowerImport).toFixed(
                1
            );
        },
        solarScaledPower: function() {
            var solarPowerToKW = this.$store.getters.getSolarValueWatts / 1000;
            return solarPowerToKW.toFixed(1);
        },
        solarRealPower: function() {
            if (!this.$store.getters.getSolarData.realPower) {
                return 0.0;
            } else {
                if (this.$store.getters.getSolarData.realPower <= 0.00009) {
                    return 0;
                } else {
                    return parseFloat(
                        this.$store.getters.getSolarData.realPower
                    ).toFixed(4);
                }
            }
        },
        consumedGridPower: function() {
            this.exportPower = 0;
            if (this.$store.getters.getPowerDifference <= 0) {
                this.exportPower = (
                    (-1 * this.$store.getters.getPowerDifference) /
                    1000
                ).toFixed(1);
                return 0;
            } else {
                return parseFloat(
                    this.$store.getters.getPowerDifference / 1000
                ).toFixed(1);
            }
        },
        totalAvailableEffect: function() {
            var totalEffectInKW =
                this.$store.getters.getTotalAvailableEffect / 1000;
            return totalEffectInKW.toFixed(1);
        },
        todaysProduction: function() {
            if (!this.$store.getters.getSolarData.dailyProd) {
                return 0.0;
            } else {
                var dailyProdToKW =
                    this.$store.getters.getSolarData.dailyProd / 100000;
                var scaledValue = dailyProdToKW * this.$store.state.scaleFactor;
                return scaledValue.toFixed(1);
            }
        },
        solarSP: function() {
            return (this.$store.state.solarSP / 1000).toFixed(1);
        },
        chargerInCurrent: function() {
            var L1, L2, L3;
            if (this.$store.getters.getChargerInCurrent.L1) {
                L1 = parseFloat(
                    this.$store.getters.getChargerInCurrent.L1
                ).toFixed(0);
            } else {
                return (L1 = 0);
            }
            if (this.$store.getters.getChargerInCurrent.L2) {
                L2 = parseFloat(
                    this.$store.getters.getChargerInCurrent.L2
                ).toFixed(0);
            } else {
                return (L2 = 0);
            }
            if (this.$store.getters.getChargerInCurrent.L3) {
                L3 = parseFloat(
                    this.$store.getters.getChargerInCurrent.L3
                ).toFixed(0);
            } else {
                return (L3 = 0);
            }
            var output = {
                L1: L1,
                L2: L2,
                L3: L3
            };
            return output;
        }
    }
};
</script>

<style scoped>
.datatab {
    padding: 10px;
}
.datatab-container {
    margin-bottom: 20px;
}
.title {
    color: white;
    font-weight: 300;
}
.line {
    height: 1px;
    width: 100%;
    background-color: white;
    margin: 5px 0 5px 0;
}
.sub-section {
    color: white;
    font-weight: 300;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
}
</style>
