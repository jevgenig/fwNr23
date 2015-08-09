require.config({
    paths: {
        underscore: "/bower_components/underscore/underscore-min"
    },
    packages: [
        {
            name: "core",
            location: "/build/es6/core"
        }
    ],
    baseUrl: "/build/apps/demo/es6"
});
require(["App"], (App)=> {
    new App({
        name: "demoApp"
    }).renderTo(document.body);
});