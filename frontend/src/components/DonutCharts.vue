<template>
    <div id="donuts">
        <vc-donut
            class="donut"
            foreground="#f2f2f2"
            :size="donutSize"
            unit="px"
            :thickness="25"
            :sections="totalPower"
            :total="100"
            :start-angle="0"
            :auto-adjust-text-size="true"
        >
            <h1 v-bind:style="{ fontSize: dataFontSize + 'px' }">
                {{ totalConsumptionUpdate }}%
            </h1>
            <h4 v-bind:style="{ fontSize: legendFontSize + 'px' }">
                {{ totalPower[0].label }}
            </h4>
        </vc-donut>
        <vc-donut
            class="donut"
            foreground="#f2f2f2"
            :size="donutSize"
            unit="px"
            :thickness="25"
            :sections="solarPower"
            :total="100"
            :start-angle="0"
            :auto-adjust-text-size="true"
        >
            <h1 v-bind:style="{ fontSize: dataFontSize + 'px' }">
                {{ solarDataUpdated }}%
            </h1>
            <h4 v-bind:style="{ fontSize: legendFontSize + 'px' }">
                {{ solarPower[0].label }}
            </h4>
        </vc-donut>
        <vc-donut
            class="donut"
            foreground="#f2f2f2"
            :size="donutSize"
            unit="px"
            :thickness="25"
            :sections="gridPower"
            :total="100"
            :start-angle="0"
            :auto-adjust-text-size="true"
        >
            <h1 v-bind:style="{ fontSize: dataFontSize + 'px' }">
                {{ powerConsumedDifferenceUpdate }}%
            </h1>
            <h4 v-bind:style="{ fontSize: legendFontSize + 'px' }">
                {{ gridPower[0].label }}
            </h4>
        </vc-donut>
        <scalegraph class="scale-graph" />
    </div>
</template>

<script>
import scalegraph from "@/components/ScaleGraph.vue";

export default {
    name: "DonutCharts",
    components: {
        scalegraph
    },
    data: () => ({
        totalPower: [{ value: 0.0, label: "Total", color: "#505050" }],
        solarPower: [{ value: 0.0, label: "Solar", color: "#505050" }],
        gridPower: [{ value: 0.0, label: "Grid", color: "#505050" }],
        donutSize: 140,
        legendFontSize: null,
        dataFontSize: null
    }),
    computed: {
        solarDataUpdated: function() {
            return (this.solarPower[0].value = this.$store.getters.getSolarValueWattsPersentage).toFixed(
                1
            );
        },
        totalConsumptionUpdate: function() {
            return (this.totalPower[0].value = this.$store.getters.getTotalAvailableEffectPersentage).toFixed(
                1
            );
        },
        powerConsumedDifferenceUpdate: function() {
            if (this.$store.getters.getPowerDifferencePersentage <= 0) {
                return (this.gridPower[0].value = 0.0).toFixed(1);
            } else {
                return (this.gridPower[0].value = this.$store.getters.getPowerDifferencePersentage).toFixed(
                    1
                );
            }
        }
        //Donut changes color when power is exported
        // powerConsumedDifferenceUpdate: function() {
        //     if (this.$store.getters.getPowerDifferencePersentage < 0) {
        //         this.gridPower[0].color = "#1fe514";
        //         return (this.gridPower[0].value =
        //             -1 *
        //             this.$store.getters.getPowerDifferencePersentage).toFixed(
        //             1
        //         );
        //     } else {
        //         this.gridPower[0].color = "#505050";
        //         return (this.gridPower[0].value = this.$store.getters.getPowerDifferencePersentage).toFixed(
        //             1
        //         );
        //     }
        // }
    },
    created() {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
        this.spinUpAnimation();
    },
    destroyed() {
        window.removeEventListener("resize", this.handleResize);
    },
    methods: {
        handleResize() {
            if (window.innerWidth < 1400 && window.innerWidth > 700) {
                this.donutSize = 100;
                this.dataFontSize = 16;
                this.legendFontSize = 12;
            } else if (window.innerWidth < 700 && window.innerWidth > 500) {
                this.donutSize = 70;
                this.dataFontSize = 13;
                this.legendFontSize = 10;
            } else if (window.innerWidth < 500) {
                this.donutSize = 60;
                this.dataFontSize = 11;
                this.legendFontSize = 10;
            } else if (window.innerWidth > 1100) {
                this.donutSize = 120;
                this.dataFontSize = 20;
                this.legendFontSize = 12;
            }
        },
        spinUpAnimation(start = 0, end = 100, duration = 500) {
            let startTimestamp = null;
            const step = timestamp => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min(
                    (timestamp - startTimestamp) / duration,
                    1
                );
                this.totalPower[0].value = Math.floor(
                    progress * (end - start) + start
                );
                this.solarPower[0].value = Math.floor(
                    progress * (end - start) + start
                );
                this.gridPower[0].value = Math.floor(
                    progress * (end - start) + start
                );
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
                if (progress === 1) {
                    this.rollBackAnimation();
                }
            };
            window.requestAnimationFrame(step);
        },
        rollBackAnimation(start = 100, end = 0, duration = 500) {
            let startTimestamp = null;
            const step = timestamp => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min(
                    (timestamp - startTimestamp) / duration,
                    1
                );
                this.totalPower[0].value = Math.floor(
                    progress *
                        (this.$store.getters.getTotalAvailableEffectPersentage -
                            start) +
                        start
                );
                this.solarPower[0].value = Math.floor(
                    progress *
                        (this.$store.getters.getSolarValueWattsPersentage -
                            start) +
                        start
                );
                if (this.$store.getters.getPowerDifferencePersentage <= 0) {
                    this.gridPower[0].value = Math.floor(
                        progress * (0 - start) + start
                    );
                } else {
                    this.gridPower[0].value = Math.floor(
                        progress *
                            (this.$store.getters.getPowerDifferencePersentage -
                                start) +
                            start
                    );
                }
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }
};
</script>

<style scoped>
#donuts {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.donut {
    margin: 30px 0 30px 0;
}
.scale-graph {
    margin: 30px 0 20px 0;
}
@media screen and (max-width: 1260px) {
    #donuts {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        margin: none;
    }
    .scale-graph {
        display: none;
    }
}
</style>
