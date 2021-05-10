<template>
    <v-container>
        <div id="nav-container">
            <v-btn icon large @click.stop="menuDrawer = !menuDrawer">
                <v-icon>menu</v-icon>
                <v-img
                    v-if="$store.state.maintenance"
                    class="maintenance-icon"
                    src="@/assets/orange_circle.svg"
                    alt="maintenance.svg"
                    style="width: 10px; margin-top: -16px; margin-right: -20px"
                ></v-img
            ></v-btn>
            <v-img
                class="logo"
                src="@/assets/easee_solar_logo.svg"
                alt="easee-logo.svg"
            ></v-img>
            <v-btn
                v-if="this.getRoutePath === '/dashboard'"
                icon
                large
                @click="$store.commit('updateOptionsState')"
                ><v-icon>settings</v-icon></v-btn
            >
            <v-btn
                v-if="this.getRoutePath !== '/dashboard'"
                icon
                large
                disabled
            ></v-btn>
            <v-navigation-drawer
                v-model="menuDrawer"
                absolute
                left
                temporary
                dark
                :width="300"
            >
                <div class="drawer-user-container">
                    <v-icon id="user-icon">account_circle</v-icon>
                    <span id="user-mail">{{ user.email }}</span>
                </div>
                <v-list>
                    <v-list-item-group
                        v-model="menuGroup"
                        active-class="grey darken-4 text--accent-4"
                    >
                        <v-list-item @click="goToDashboard">
                            <v-list-item-title>Dashboard</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="goToConnect">
                            <v-list-item-title>Connect</v-list-item-title>
                            <v-img
                                v-if="$store.state.easeeAccessTokenMaintenance"
                                src="@/assets/maintenance.svg"
                                alt="maintenance.svg"
                                style="width: 25px"
                            ></v-img>
                        </v-list-item>

                        <v-list-item @click="goToEaseeDevices">
                            <v-list-item-title>Devices</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <div class="drawer-bottom-container">
                    <div id="app-version">Ver 0.0.1</div>
                    <v-btn
                        class="ma-1"
                        id="logout-button"
                        color="error"
                        plain
                        @click="logout"
                    >
                        Logout
                    </v-btn>
                </div>
            </v-navigation-drawer>
        </div>
        <options></options>
    </v-container>
</template>

<script>
import firebase from "firebase/app";
import options from "@/components/Options.vue";

export default {
    name: "Navbar",
    components: {
        options
    },
    data: () => ({
        menuDrawer: false,
        menuGroup: null,
        optionState: false,
        user: firebase.auth().currentUser,
        solarDummyValueDialog: false,
        solarDummyValue: ""
    }),
    computed: {
        getRoutePath() {
            return this.$route.path;
        }
    },
    watch: {
        menuGroup() {
            this.menuDrawer = false;
        }
    },
    methods: {
        logout() {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    this.$router.go();
                });
        },
        goToDashboard() {
            this.$router.push("/dashboard").catch(err => {});
        },
        goToConnect() {
            this.$router.push("/connect").catch(err => {});
        },
        goToEaseeDevices() {
            this.$router.push("/devices").catch(err => {});
        }
    }
};
</script>

<style scoped>
#nav-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.logo {
    max-width: 260px;
    transform: scale(0.7);
}
.maintenance-icon {
    position: absolute;
}
.v-btn--icon.v-size--large .v-icon,
.v-btn--fab.v-size--large .v-icon {
    height: 35px;
    font-size: 30px;
    width: 35px;
    color: #505050;
}
.v-application .grey.darken-4 {
    background-color: #000000 !important;
    border-color: #000000 !important;
}
.drawer-user-container {
    width: 100%;
    height: 80px;
    background-color: #285aa5;
    display: flex;
}
#user-icon {
    font-size: 60px;
    margin-right: 20px;
    margin-left: 10px;
}
#user-mail {
    align-self: center;
    font-weight: 300;
    color: white;
    max-width: 60%;
    overflow: hidden;
}
.v-list-item {
    font-weight: 300;
}
.drawer-bottom-container {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    color: white;
    font-weight: 300;
}
#app-version {
    float: left;
    margin-left: 10px;
    margin-top: 10px;
}
#logout-button {
    float: right;
    margin-right: 10px;
}
.drawer-settings-container {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
}
.drawer-settings-title {
    color: white;
    font-weight: 300;
    align-self: center;
}
/* Fix blurry text issue */
.v-navigation-drawer {
    will-change: initial;
}
.solar-dummy-card {
    padding: 10px;
}
@media screen and (max-width: 500px) {
    .logo {
        width: 100%;
        transform: scale(0.5);
    }
    .v-btn--icon.v-size--large .v-icon,
    .v-btn--fab.v-size--large .v-icon {
        height: 30px;
        font-size: 25px;
        width: 30px;
    }
}
</style>
