import db from "../components/firebaseInit";
import firebase from "firebase/app";

export default {
    created() {
        db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.$store.commit(
                        "loadEaseeAccessToken",
                        doc.data().easeeAccessToken
                    );
                    this.$store.commit("updateChargerSN", doc.data().chargerSN);
                    this.$store.commit(
                        "updateEqualizerSN",
                        doc.data().equalizerSN
                    );
                }
            })
            .catch(_ => {
                this.$store.commit(
                    "snackbarNotify",
                    "Failed to load access token from database."
                );
            });

        db.collection("app")
            .doc("settings")
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.$store.commit("loadSolarAPIURL", doc.data().ngrokURL);
                }
            })
            .catch(_ => {
                this.$store.commit(
                    "snackbarNotify",
                    "Failed to load access token from database."
                );
            });
    }
};
