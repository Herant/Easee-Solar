<template>
    <apexchart type="area" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import db from "@/components/firebaseInit";

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
                type: "area",
                fontFamily: "Roboto, sans-serif",
                toolbar: {
                    show: false
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            colors: ["#2E93fA", "#66DA26", "#F23827"],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
                width: 0
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
        },
        show: false
    }),
    created() {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();

        db.collection("powerData")
            .orderBy("timestamp", "desc")
            .limit(24)
            .onSnapshot(res => {
                const changes = res.docChanges();
                if (this.chartOptions.xaxis.categories.length === 0) {
                    changes.forEach(change => {
                        this.chartOptions.xaxis.categories.push(
                            change.doc.data().timestamp
                        );
                        this.series[0].data.push(change.doc.data().totalPower);
                        this.series[1].data.push(change.doc.data().solarPower);
                        this.series[2].data.push(change.doc.data().gridPower);
                    });
                } else {
                    var updateDate = [];
                    var updateTotal = [];
                    var updateSolar = [];
                    var updateGrid = [];
                    changes.forEach(change => {
                        updateDate.push(change.doc.data().timestamp);
                        updateTotal.push(change.doc.data().totalPower);
                        updateSolar.push(change.doc.data().solarPower);
                        updateGrid.push(change.doc.data().gridPower);
                    });
                    this.arrayDataUpdate(
                        this.chartOptions.xaxis.categories,
                        updateDate
                    );
                    this.arrayDataUpdate(this.series[0].data, updateTotal);
                    this.arrayDataUpdate(this.series[1].data, updateSolar);
                    this.arrayDataUpdate(this.series[2].data, updateGrid);
                }
                this.show = true;
                window.dispatchEvent(new Event("resize"));
            });
    },
    destroyed() {
        window.removeEventListener("resize", this.handleResize);
    },
    computed: {},
    methods: {
        arrayDataUpdate(array, data) {
            array.reverse();
            array.shift();
            array.push(data[data.length - 1]);
            array.reverse();
        },
        handleResize() {
            if (window.innerWidth < 800) {
                this.chartOptions.chart.toolbar.show = false;
            } else if (window.innerWidth > 800) {
                this.chartOptions.chart.toolbar.show = true;
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
