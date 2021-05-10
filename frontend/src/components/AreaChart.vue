<template>
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
    name: "areachart",
    data: () => ({
        series: [
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
            }
        ],
        chartOptions: {
            chart: {
                type: "line",
                fontFamily: "Roboto, sans-serif",
                toolbar: {
                    show: false
                }
            },
            fill: {
                type: "solid",
                opacity: 0.6
            },
            colors: ["#2EBCF0", "#FFC74A", "#49636B"],
            // colors: ["#2EBCF0", "#1ED8D9", "#23F8BD"],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
                width: 2
            },
            xaxis: {
                type: "datetime",
                categories: []
            },
            grid: {
                show: false
            },
            legend: {
                position: "top",
                fontFamily: "Roboto, sans-serif",
                fontWeight: 300
            },
            tooltip: {
                x: {
                    format: "dd/MM/yy HH:mm"
                }
            }
        }
    }),
    created() {
        // Loading data
        if (this.$store.getters.getChartTimestamp.length !== 0) {
            if (this.chartOptions.xaxis.categories.length === 0) {
                this.chartOptions.xaxis.categories = this.$store.getters.getChartTimestamp;
                this.series[0].data = this.$store.getters.getChartTotal;
                this.series[1].data = this.$store.getters.getChartSolar;
                this.series[2].data = this.$store.getters.getChartGrid;
            }
        }
    },
    mounted() {
        var self = this;
        this.interval = setInterval(() => {
            self.plotData();
        }, 1000);
    },
    methods: {
        plotData() {
            // Garbage collector after 1800 elements = 1800sec = 30min
            if (this.chartOptions.xaxis.categories.length > 500) {
                this.chartOptions.xaxis.categories.shift();
                this.series[0].data.shift();
                this.series[1].data.shift();
                this.series[2].data.shift();
            }
            if (this.$store.getters.getActivePowerImport !== 0) {
                const date = new Date();
                this.chartOptions.xaxis.categories.push(date.toISOString());
                this.series[0].data.push(
                    parseFloat(
                        this.$store.getters.getActivePowerImport * 1000
                    ).toFixed(0)
                );
                this.series[1].data.push(
                    parseFloat(this.$store.getters.getSolarValueWatts).toFixed(
                        0
                    )
                );
                this.series[2].data.push(
                    parseFloat(this.$store.getters.getPowerDifference).toFixed(
                        0
                    )
                );

                window.dispatchEvent(new Event("resize"));

                // Saving data
                this.$store.commit(
                    "updateChartTimestamp",
                    this.chartOptions.xaxis.categories
                );
                this.$store.commit("updateChartTotal", this.series[0].data);
                this.$store.commit("updateChartSolar", this.series[1].data);
                this.$store.commit("updateChartGrid", this.series[2].data);

                // Reduce update interval
                if (this.chartOptions.xaxis.categories.length > 100) {
                    clearInterval(this.interval);
                    var self = this;
                    this.interval = setInterval(() => {
                        self.plotData();
                    }, 60000);
                }
            }
        }
    }
};
</script>

<style>
.apexcharts-pan-icon {
    fill-opacity: 0;
}
</style>
