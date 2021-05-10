export default {
    methods: {
        randomNumberGenerator() {
            var min = this.$store.getters.getSimulationMinValue();
            var max = this.$store.getters.getSimulationMaxValue();
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
};
