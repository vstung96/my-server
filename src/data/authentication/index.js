"use strict";

const utils = require("../utils");

const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("authentication");

    const login = async ({ username, password }) => {
        // get a connection to SQL Server
        const cnx = await getConnection();

        // create a new request
        const request = await cnx.request();

        // configure sql query parameters
        request.input("username", sql.VarChar(50), username);
        request.input("password", sql.VarChar(50), password);

        // return the executed query
        return request.query(sqlQueries.login);
    };

    return {
        login
    };
};

module.exports = { register };