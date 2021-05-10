<template>
    <div>
        <unity
            src="../../Build/Ver.28.01.21.json"
            unityLoader="../../Build/UnityLoader.js"
            :hideFooter="true"
            ref="myInstance"
        ></unity>
        <!-- <v-btn @click="solarPath">Toggle Sola Path</v-btn>
        <v-btn @click="gridPath">Toggle Grid Path</v-btn> -->
    </div>
</template>

<script>
import Unity from "vue-unity-webgl";

export default {
    name: "unitybuild",
    components: {
        Unity
    },
    data: () => ({}),
    methods: {
        solarPath() {
            this.$refs.myInstance.message(
                "SolarPath",
                "ToggleSolarSequence",
                0.01
            );
        },
        gridPath() {
            this.$refs.myInstance.message(
                "GridPath",
                "ToggleGridSequence",
                0.01
            );
        }
    }
};
</script>

<style scoped></style>
