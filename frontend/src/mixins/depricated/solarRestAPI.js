export default {
    methods: {
        changeRegressionSampleRate: async function(payload) {
            let response = await fetch(
                this.$store.getters.getSolarAPIURL +
                    "/change_regression_sample_rate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: payload
                }
            );
            if (response.status == 200) {
                let result = await response.json();
                console.log(result);
            }
        },
        changeSimulationValues: async function(payload) {
            let response = await fetch(
                this.$store.getters.getSolarAPIURL +
                    "/change_simulation_values",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );
            if (response.status == 200) {
                let result = await response.json();
                console.log(result);
            }
        },
        toggleSimulationMode: async function() {
            let response = await fetch(
                this.$store.getters.getSolarAPIURL + "/toggle_simulation_mode"
            );
            if (response.status == 200) {
                let result = await response.json();
                console.log(result);
            }
        },
        resetDailyProduction: async function() {
            let response = await fetch(
                this.$store.getters.getSolarAPIURL + "/reset_daily_production"
            );
            if (response.status == 200) {
                let result = await response.json();
                console.log(result);
            }
        },
        getSampleData: async function() {
            let response = await fetch(
                this.$store.getters.getSolarAPIURL + "/get_sample_data"
            );
            if (response.status == 200) {
                let result = await response.json();
                console.log(result);
            }
        }
    }
};

{
    /* <div>
    <v-btn @click="changeRegressionSampleRate(10)"
        >changeRegressionSampleRate</v-btn
    >
    <v-btn @click="toggleSimulationMode()">toggleSimulationMode</v-btn>
    <v-btn @click="changeSimulationValues({ min: 100, max: 120 })"
        >changeSimulationValues</v-btn
    >
    <v-btn @click="resetDailyProduction()">resetDailyProduction</v-btn>
    <v-btn @click="getSampleData()">getSampleData</v-btn>
</div> */
}

// import solarRestAPI from "@/mixins/solarRestAPI.js";

// mixins: [solarRestAPI]
