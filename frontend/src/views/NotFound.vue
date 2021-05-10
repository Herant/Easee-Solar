<template>
    <div id="app">
        <div id="wrapper">
            <p id="txt">Looks like you're lost!</p>
            <v-img src="@/assets/notfound.png" alt="notfound.png"></v-img>
            <v-btn class="ma-1" id="btn" color="error" plain @click="notFound"
                >Back</v-btn
            >
        </div>
    </div>
</template>

<script>
import firebase from "firebase/app";

export default {
    name: "not-found",
    data: () => ({
        user: firebase.auth().currentUser
    }),
    methods: {
        notFound() {
            if (this.user) {
                this.$router.replace("/dashboard");
            } else {
                this.$router.replace("/");
            }
        }
    }
};
</script>

<style scoped>
#app {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    margin-top: 50px;
}
#wrapper {
    width: 300px;
    height: 300px;
    margin: auto;
    margin-top: 250px;
}
#txt {
    text-align: center;
    font-size: 20px;
}
#btn {
    margin-top: 40px !important;
    margin-left: 110px !important;
}
</style>
