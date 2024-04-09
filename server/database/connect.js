const mongoose = require('mongoose');
const url = process.env.DB_URL;
mongoose.set("returnOriginal", false); //By default, Mongoose returns the original document when updating using findOneAndUpdate(). However, setting returnOriginal to false instructs Mongoose to return the modified document instead. like in findOneAndUpdate()

class Ntdatabase {
    constructor() {
        this.apiStartTime = new Date().getTime();
        this.db_con, this.timer;
        setImmediate(async () => {
            this.db_con = await this._createConnection();
        });
    }

    check_connection = () => {
        if (this.db_con != undefined) {
            clearInterval(this.timer);
            return true;
        }
        return false;
    };

    _createConnection = () => {
        return mongoose.connect(url)
            .then(() => {
                console.log('Connected to the database successfully');
            })
            .catch((err) => {
                console.error(`Error while connecting to the database: ${err}`);
            });
    };

    insertIntoCollection = (model_name, session) => {
        return new Promise((resolve, reject) => {
            if (typeof model_name == "object") {
                if (session == null) {
                    model_name.save((e, result) => {
                        if (!e) {
                            resolve(result);
                        } else {
                            reject(e);
                        }
                    });
                } else {
                    model_name.save(
                        {
                            session: session,
                        },
                        (e, result) => {
                            if (!e) {
                                resolve(result);
                            } else {
                                reject(e);
                            }
                        }
                    );
                }
            } else {
                reject({
                    status: 104,
                    message: "Invalid insert",
                });
            }
        });
    };

    updateCollection = (
        model_name,
        update_condition_obj,
        new_values,
        session
    ) => {
        return new Promise((resolve, reject) => {
            if (
                typeof update_condition_obj != "string" &&
                typeof new_values != "string"
            ) {
                if (session == undefined) {
                    model_name.findOneAndUpdate(
                        update_condition_obj,
                        new_values,
                        {
                            runValidators: true,
                        },
                        (e, result) => {
                            if (!e) {
                                resolve(result);
                            } else {
                                reject(e);
                            }
                        }
                    );
                } else {
                    model_name.findOneAndUpdate(
                        update_condition_obj,
                        new_values,
                        {
                            runValidators: true,
                            session: session,
                        },
                        (e, result) => {
                            if (!e) {
                                resolve(result);
                            } else {
                                reject(e);
                            }
                        }
                    );
                }
            } else {
                reject({
                    status: 104,
                    message: "Invalid parameters for update",
                });
            }
        });
    };

    updateMultiple = (model_name, update_condition_obj, new_values, session) => {
        return new Promise((resolve, reject) => {
            if (
                typeof update_condition_obj != "string" &&
                typeof new_values != "string"
            ) {
                if (session == undefined) {
                    model_name.updateMany(
                        update_condition_obj,
                        new_values,
                        {
                            runValidators: true,
                        },
                        (e, result) => {
                            if (!e) {
                                resolve(result);
                            } else {
                                let err_obj = {};
                                for (var i in e.errors) {
                                    if (e.errors[i].properties.message) {
                                        err_obj[i] = e.errors[i].properties.message;
                                    } else {
                                        err_obj[i] = e.errors[i].stringValue;
                                    }
                                    // err_obj[i] = e.errors[i].properties.message;
                                }
                                reject(err_obj);
                            }
                        }
                    );
                } else {
                    model_name.updateMany(
                        update_condition_obj,
                        new_values,
                        {
                            runValidators: true,
                            session: session,
                        },
                        (e, result) => {
                            if (!e) {
                                resolve(result);
                            } else {
                                let err_obj = {};
                                for (var i in e.errors) {
                                    if (e.errors[i].properties.message) {
                                        err_obj[i] = e.errors[i].properties.message;
                                    } else {
                                        err_obj[i] = e.errors[i].stringValue;
                                    }
                                    // err_obj[i] = e.errors[i].properties.message;
                                }
                                reject(err_obj);
                            }
                        }
                    );
                }
            } else {
                reject({
                    status: 104,
                    message: "Invalid parameters for update",
                });
            }
        });
    };

    findFromCollection = (model_name, query_obj = {}) => {
        return new Promise((resolve, reject) => {
            if (model_name != undefined && model_name != "") {
                model_name.find(query_obj, function (e, result) {
                    if (!e) {
                        resolve(result);
                    } else {
                        reject(e);
                    }
                });
            } else {
                reject({
                    status: 104,
                    message: "Invalid search",
                });
            }
        });
    };

    deleteFromCollection = (model_name, query_obj, session) => {
        return new Promise((resolve, reject) => {
            if (model_name != undefined && model_name != "") {
                if (session == undefined) {
                    model_name.deleteOne(query_obj, function (e, result) {
                        if (!e) {
                            resolve(result);
                        } else {
                            reject(e);
                        }
                    });
                } else {
                    model_name.deleteOne(
                        query_obj,
                        {
                            session: session,
                        },
                        function (e, result) {
                            if (!e) {
                                resolve(result);
                            } else {
                                reject(e);
                            }
                        }
                    );
                }
            } else {
                reject({
                    status: 104,
                    message: "Invalid search",
                });
            }
        });
    };

    bulkwriteupdateone = (filter_query, update_obj) => {
        return {
            updateOne: {
                filter: filter_query,
                update: update_obj,
            },
        };
    };

    bulkwriteupdatemany = (filter_query, update_obj) => {
        return {
            updateMany: {
                filter: filter_query,
                update: update_obj,
            },
        };
    };
}

let database = new Ntdatabase();
module.exports = database;