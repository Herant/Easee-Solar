<template>
    <div class="main">
        <div class="title">
            Linear regression
        </div>
        <div class="main-container">
            <div class="label-container">
                <h4 class="label">0.0</h4>
                <h4 class="label">0.2</h4>
                <h4 class="label">0.4</h4>
                <h4 class="label">0.6</h4>
                <h4 class="label">0.8</h4>
                <h4 class="label">1.0</h4>
            </div>
            <div class="scale-line-container">
                <div class="scale-line"></div>
                <div class="scale-line"></div>
                <div class="scale-line"></div>
                <div class="scale-line"></div>
                <div class="scale-line"></div>
                <div class="scale-line"></div>
            </div>
            <div
                class="bar-container"
                :title="'R2: ' + $store.getters.getLinearRegressionOutput.r2"
            >
                <div class="vertical-bar empty-bar"></div>
                <div
                    class="vertical-bar full-bar"
                    v-bind:style="{
                        width: linearRegressionR2Persentage + '%'
                    }"
                ></div>
            </div>
            <div
                class="output-container"
                :title="'B: ' + $store.getters.getLinearRegressionOutput.m"
            >
                <h3 class="output-label">β {{ linearRegressionBeta }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "scalegraph",
    data: () => ({}),
    computed: {
        linearRegressionBeta: function() {
            if (!this.$store.getters.getLinearRegressionOutput.m) {
                return 0;
            } else {
                return (
                    this.$store.getters.getLinearRegressionOutput.m *
                    this.$store.getters.getScaleFactor
                ).toFixed(3);
            }
        },
        linearRegressionR2Persentage: function() {
            if (!this.$store.getters.getLinearRegressionOutput.r2) {
                return 0;
            } else {
                return (
                    this.$store.getters.getLinearRegressionOutput.r2 * 100
                ).toFixed(0);
            }
        }
    }
};
</script>

<style scoped>
.main {
    text-align: center;
    max-width: 200px;
    min-width: 200px;
    align-self: center;
}
.title {
    font-size: 16px !important;
    font-weight: 500;
}
.main-container {
    width: 100%;
}
.scale-line-container {
    display: flex;
    justify-content: space-between;
}
.scale-line {
    width: 2px;
    height: 5px;
    background-color: #505050;
}
.label-container {
    display: flex;
    justify-content: space-between;
}
.label {
    font-size: 15px;
}
.bar-container {
    position: relative;
}
.vertical-bar {
    width: 100%;
    height: 15px;
    position: absolute;
}
.empty-bar {
    width: 100%;
    background-color: #f2f2f2;
    border: 1px solid #505050;
}
.full-bar {
    background-color: #505050;
}
.output-container {
    margin-top: 15px;
    text-align: center;
}
</style>
