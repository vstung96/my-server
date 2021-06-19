"use strict";
const Joi = require("@hapi/joi")

module.exports.register = async server => {
    server.route({
        method: "POST",
        path: "/login",
        handler: async (request, h) => {
            try {
                const payload = request.payload;

                const db = request.server.plugins.sql.client;
                const res = await db.authentication.login({ ...payload });

                if (res.rowsAffected[0] <= 0) {

                    return h
                        .response({
                            code: 'LOGIN_FAIL',
                            status: 0
                        })
                        .code(400)
                }

                return h.response({
                    data: res.recordset[0],
                    status: 1,
                    code: 'LOGIN_SUCCESSFUL',
                }).code(200)
            } catch (e) {
                return h.response({ message: 'Internal Server Error', status: 0 }).code(500)
            }
        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(1).max(20),
                    password: Joi.string().min(5)
                })
            }
        }
    });
};