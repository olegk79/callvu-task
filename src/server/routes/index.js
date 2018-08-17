/*require routes*/

const routesList = [
    "login",
    "status",
    //"test",
    "start_stop",
    "logout"
];

const routesArr = [];

routesList.forEach(route => {
    routesArr.push(require(`./${route}`));
});


module.exports = routesArr;