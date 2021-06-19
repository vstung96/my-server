"use strict";

const province = require("./province");
const authentication = require("./authentication");

module.exports.register = async server => {
    await province.register(server);
    await authentication.register(server);
};