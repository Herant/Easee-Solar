<template>
    <v-snackbar
        v-model="$store.state.snackbarActive"
        :timeout="2000"
        :bottom="'bottom'"
        >{{ $store.state.snackbarText }}
        <template>
            <v-btn color="white" text @click="hideSnackbar">Close</v-btn>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    name: "snackbar",
    data: () => ({}),
    methods: {
        hideSnackbar() {
            this.$store.state.snackbarActive = false;
        }
    }
};
</script>

<style>
v-snackbar {
    display: flex;
    justify-content: space-between;
}
.v-snack__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
