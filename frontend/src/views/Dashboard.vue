<template>
    <div id="dashboard">
        <navbar id="navbar" />
        <div id="main-content-container">
            <div id="left-side-content">
                <unitybuild v-if="showUnity" id="unitybuild" />
                <areachart v-if="!showUnity" id="unitybuild areaChart" />
            </div>
            <div id="midt-line"></div>
            <div id="right-side-content">
                <div id="donuts-container">
                    <donuts />
                </div>
                <div
                    id="data-field"
                    v-bind:style="{ 'background-color': backgroundColor }"
                >
                    <datatab />
                </div>
            </div>
        </div>
        <snackbar />
        <solarwss v-if="$store.state.solarAPIURL !== ''" />
        <easeewss v-if="$store.state.easeeAccessToken !== ''" />
    </div>
</template>

<script>
import navbar from "@/components/Navbar.vue";
import unitybuild from "@/components/UnityBuild.vue";
import donuts from "@/components/DonutCharts.vue";
import datatab from "@/components/Datatab.vue";
import areachart from "@/components/AreaChart.vue";
import snackbar from "@/components/Snackbar.vue";
import solarwss from "@/components/SolarWSS.vue";
import easeewss from "@/components/EaseeWSS.vue";

import loadUserDataMixin from "@/mixins/loadUserData.js";

export default {
    name: "dashboard",
    mixins: [loadUserDataMixin],
    components: {
        navbar,
        unitybuild,
        donuts,
        datatab,
        areachart,
        solarwss,
        easeewss,
        snackbar
    },
    data: () => ({}),
    computed: {
        showUnity() {
            return this.$store.getters.getUnityState;
        },
        backgroundColor() {
            if (this.$store.getters.getSimulationModeStatus) {
                return "#F75943";
            } else {
                return "#265aa5";
            }
        }
    }
};
</script>

<style scoped>
#navbar {
    padding: 10;
    max-width: 100%;
}
#main-content-container {
    max-width: 1920px;
    max-height: 800px;
    margin: 60px auto 0 auto;
    padding: 20px 20px 20px 20px;
    display: flex;
}
#left-side-content {
    width: 50%;
    padding-top: 80px;
}
#right-side-content {
    height: 100% auto;
    width: 50%;
    display: flex;
}
#midt-line {
    width: 1px;
    background-color: #747474;
}
#donuts-container {
    width: 30%;
    margin-left: 50px;
}
#data-field {
    background-color: #265aa5;
    width: 280px;
    margin-left: 50px;
}
#areaChart {
    margin-top: -60px !important;
    display: flex;
    justify-content: center;
}
@media screen and (max-width: 1260px) {
    #main-content-container {
        flex-direction: column;
        max-height: none;
        max-width: 1000px;
        padding: 0;
    }
    #left-side-content {
        width: auto;
        padding-top: 0px;
    }
    #right-side-content {
        width: auto;
        padding: 20px 0px 0px 0px;
        flex-direction: column;
    }
    #donuts-container {
        height: 30%;
        width: 100%;
        margin: 0 0 20px 0;
    }
    #data-field {
        height: 300px;
        width: 100%;
        display: none;
    }
    #areaChart {
        margin-top: 0px !important;
        display: flex;
        justify-content: center;
    }
}
</style>
