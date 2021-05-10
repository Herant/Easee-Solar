export default {
    methods: {
        leastSquareRegression(y) {
            var n = this.$store.getters.getNumberOfSamples;
            var x = [];

            for (var i = 1; i < n + 1; i++) {
                x.push(i);
            }

            if (x.length === y.length) {
                var sum_x = x.reduce(function(a, b) {
                    return a + b;
                }, 0);

                var sum_y = y.reduce(function(a, b) {
                    return a + b;
                }, 0);

                var mean_x = sum_x / x.length;
                var mean_y = sum_y / y.length;

                var numer = 0;
                var denom = 0;

                for (var i in x) {
                    numer += (x[i] - mean_x) * (y[i] - mean_y);
                    denom += (x[i] - mean_x) ** 2;
                }

                var m = numer / denom;
                var c = mean_y - m * mean_x;

                var rmse = 0;
                var y_pred = 0;

                for (var i in x) {
                    y_pred = c + m * x[i];
                    rmse += (y[i] - y_pred) ** 2;
                }

                rmse = (rmse / n) ** 2;

                var ss_tot = 0;
                var ss_res = 0;

                for (var i in x) {
                    y_pred = c + m * x[i];
                    ss_tot += (y[i] - mean_y) ** 2;
                    ss_res += (y[i] - y_pred) ** 2;
                }

                var r2 = 0;

                if (ss_res > 0) {
                    r2 = 1 - ss_res / ss_tot;
                } else {
                    r2 = 0;
                }

                var r = Math.sqrt(r2);

                var output = {
                    m: m,
                    c: c,
                    rmse: rmse,
                    r2: r2,
                    r: r
                };

                this.$store.commit("updateLinearRegressionOutput", output);

                // console.log("Coefficients");
                // console.log("m: " + m + " c:" + c);
                // console.log("RMSE: " + rmse);
                // console.log("R2: " + r2);
                // console.log("r: " + Math.sqrt(r2));

                // console.log("B: " + (m * 100000).toFixed(3));
                // console.log((r2 * 100).toFixed(1) + " %");
            }
        }
    }
};
