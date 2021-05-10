export default {
    methods: {
        // Based on grid type and num phases converts given current value I(A) to effect P(W)
        currentToEffectConverter(current) {
            var gridType = this.$store.getters.getChargerGridType;

            // TN_3_PH
            if (gridType === "1") {
                return 3 * 230 * current;
                // TN_2_PH
            } else if (gridType === "2") {
                return 2 * 230 * current;
                // TN_1_PH OR IT_1_PH
            } else if (gridType === "3" || gridType === "5") {
                return 230 * current;
                //  IT_3_PH
            } else if (gridType === "4") {
                return 230 * Math.sqrt(3) * current;
            } else {
                return 0;
            }
        },
        effectToCurrentConverter(effect) {
            var gridType = this.$store.getters.getChargerGridType;
            // TN_3_PH
            if (gridType === "1") {
                return effect / (3 * 230);
                // TN_2_PH
            } else if (gridType === "2") {
                return effect / (2 * 230);
                // TN_1_PH OR IT_1_PH
            } else if (gridType === "3" || gridType === "5") {
                return effect / 230;
                //  IT_3_PH
            } else if (gridType === "4") {
                return effect / (230 * Math.sqrt(3));
            } else {
                return 0;
            }
        }
    }
};
