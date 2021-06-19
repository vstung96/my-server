"use strict";
const Joi = require("@hapi/joi")
const Excel = require('exceljs');
const moment = require("moment");
const fs = require("fs");

module.exports.register = async server => {
    server.route({
        method: "GET",
        path: "/provinces",
        handler: async request => {
            try {
                const {
                    offset = 1,
                    limit = 10,
                    search = ''
                } = request.query
                const db = request.server.plugins.sql.client;

                // execute the query
                const res = await db.province.getProvinces({ offset, limit, search });

                // return the recordset object
                return res.recordset;
            } catch (err) {
                console.log(err);
            }
        },
        options: {
            validate: {
                query: Joi.object().keys({
                    offset: Joi.number()
                        .default(0),
                    limit: Joi.number()
                        .default(10),
                    search: Joi.string().allow(''),
                })
            }
        }
    });
    server.route({
        method: "POST",
        path: "/province",
        handler: async (request, h) => {
            try {
                const {
                    name = '', code = ''
                } = request.payload
                const db = request.server.plugins.sql.client;
                if ((await db.province.getByCode({ code })).rowsAffected[0] != 0) {

                    return h.response({
                        message: 'Mã Tỉnh/Thành phố đã tồn tại.',
                        code: 'DUPLICATE_PROVINCE_CODE',
                        status: 0
                    }).code(400)
                }
                const res = await db.province.insertProvince({ name, code });

                return h.response({
                    data: res.recordset[0],
                    code: 'CREATED',
                    status: 1
                }).code(200)
            } catch (err) {

                return h.response({ message: 'Internal Server Error', status: 0 }).code(500)
            }
        },
        options: {
            validate: {
                payload: Joi.object().keys({
                    name: Joi.string().required(),
                    code: Joi.string().required()
                })
            }
        }
    });
    server.route({
        method: "POST",
        path: "/province/{code}",
        handler: async (request, h) => {
            try {
                const {
                    lockdown = false
                } = request.payload
                const {
                    code = ''
                } = request.params
                const db = request.server.plugins.sql.client;
                if ((await db.province.getByCode({ code })).rowsAffected[0] === 0) {

                    return h.response({
                        message: 'Mã Tỉnh/Thành phố không tồn tại.',
                        code: 'PROVINCE_CODE_NOT_EXISTS',
                        status: 0
                    }).code(400)
                }

                await db.province.updateLockdown({ lockdown, code });

                return h.response({
                    code: 'UPDATED',
                    status: 1
                }).code(200)
            } catch (err) {

                return h.response({ message: 'Internal Server Error', status: 0 }).code(500)
            }
        },
        options: {
            validate: {
                payload: Joi.object().keys({
                    lockdown: Joi.boolean().default(false)
                }),

            }
        }
    });
    server.route({
        method: "GET",
        path: "/export",
        handler: async (request, h) => {
            try {
                const {
                    when
                } = request.query
                const today = moment().format('DD-MM-YYYY').toString();
                const excelFileName = `data-${new Date().getTime().toString()}.xlsx`;
                const excelFilePath = `${process.env.EXCEL_MOUNT_FOLDER}/${excelFileName}`

                const db = request.server.plugins.sql.client;
                const exportData = await db.province.exportData(when);
                const newWorkbook = new Excel.Workbook();

                const sheet = newWorkbook.addWorksheet(today);
                sheet.created = new Date();
                sheet.modified = new Date();
                sheet.mergeCells('A1', 'F2');
                sheet.getCell('C1').value = `Dữ liệu ngày: ${today}`;
                sheet.getRow(4).values = ['Phòng ban', 'Tổng số nhân viên', 'Tỉnh bị quản chế', 'Tỉnh không bị quản chế'];
                sheet.getCell('E4').value = 'Nhiệt độ';
                sheet.getCell('E5').value = '>=38';
                sheet.getCell('F5').value = '<38';
                sheet.mergeCells('A4', 'A5');
                sheet.mergeCells('B4', 'B5');
                sheet.mergeCells('C4', 'C5');
                sheet.mergeCells('D4', 'D5');
                sheet.mergeCells('E4', 'F4');

                sheet.columns = [
                    { key: 'departmentName', width: 30 },
                    { key: 'totalEmployee', width: 20 },
                    { key: 'numberLockDown', width: 20 },
                    { key: 'numberUnlockDown', width: 20 },
                    { key: 'greaterOrEqual38', width: 15 },
                    { key: 'lowerThan38', width: 15 },
                ]
                sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                    row.eachCell(function (cell, colNumber) {
                        cell.font = {
                            name: 'Arial',
                            family: 2,
                            bold: false,
                            size: 10,
                        };
                        if (rowNumber <= 5) {
                            row.height = 20;
                            cell.font = {
                                bold: true,
                            };
                            cell.alignment = {
                                vertical: 'middle', horizontal: 'center'
                            };
                        } else {
                            cell.alignment = {
                                vertical: 'middle', horizontal: 'left'
                            };
                        }
                    });
                });
                sheet.addRows(exportData)
                await newWorkbook.xlsx.writeFile(excelFilePath);

                const binData = fs.readFileSync(excelFilePath)

                return h
                    .response(binData)
                    .header('Content-Disposition', `attachment; filename=${excelFileName}`)
                    .header('Content-Length', binData.length)
            } catch (err) {

                return h.response({ message: 'Internal Server Error', status: 0 }).code(500)
            }
        },
        options: {
            validate: {
                query: Joi.object().keys({ when: Joi.string().required() })
            }
        }
    });
};