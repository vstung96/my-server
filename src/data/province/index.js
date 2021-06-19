"use strict";
const utils = require("../utils");


const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("province");

    const getProvinces = async ({ offset, limit, search }) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        const searchString = `%${search}%`;

        request.input("searchString", sql.VarChar(50), searchString);

        return request.query(sqlQueries.getProvinces);
    };

    const insertProvince = async ({ name, code }) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("name", sql.VarChar(50), name);
        request.input("nameAscii", sql.VarChar(50), name);
        request.input("code", sql.VarChar(50), code);
        request.input('createdAt', sql.DateTime, new Date());
        request.input('updatedAt', sql.DateTime, new Date());

        return request.query(sqlQueries.insertProvince);
    };

    const getByCode = async ({ name, code }) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("code", sql.VarChar(50), code);

        return request.query(sqlQueries.getByCode);
    };

    const updateLockdown = async ({ code, lockdown }) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("code", sql.VarChar(50), code);
        request.input("lockDown", sql.BIT, lockdown ? 1 : 0);
        request.input("updatedAt", sql.DateTime, new Date());

        return request.query(sqlQueries.updateLockDown);
    };

    const exportData = async (datetime) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("updatedAt", sql.VarChar(50), datetime);
        const exportData = (await request.query(sqlQueries.getExportData)).recordset;

        return exportData;
    };

    return {
        getProvinces,
        insertProvince,
        getByCode,
        updateLockdown,
        exportData
    };
};

module.exports = { register };