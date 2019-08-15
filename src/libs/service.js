const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const buffer = require("buffer").Buffer;
const adm_zip = require('adm-zip');
import config from './config';
import DataBaseUtil from "./database";
import {
    readForFile,
    saveToFile,
    error,
    dateFormat,
    mkdirs,
    getDataForObject,
    saveData,
    listFileForFolder
} from "./util";


class Service {

    constructor() {
        this.dbUtil = null;
        this.count = 0;
        this.total = 0;
        this.callback = {};
        ejs.fileLoader = (filePath) => {
            return buffer.from(fs.readFileSync(path.join(config.template, filePath + ".ejs"))).toString();
        };
    }

    readTemplate(name) {
        return new Promise((resolve, reject) => {
            let filePath = path.join(config.template, name + '.ejs');
            readForFile(filePath).then(data => {
                resolve(data);
            });
        });
    }

    /**
     * 保存模板
     * @param {*} name 
     * @param {*} context 
     */
    saveTemplate(name, context) {
        return new Promise((resolve, reject) => {
            let filePath = path.join(config.template, name + '.ejs');
            saveToFile(filePath, context, false).then(data => {
                resolve(data);
            });
        })
    }

    /**
     * 删除模板
     * @param {*} path 
     */
    delTemplate(fileName) {
        return new Promise((resolve, reject) => {
            let filePath = path.join(config.template, fileName + ".ejs");
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, err => {
                    if (err) {
                        error(err);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    }

    getAttrs(tableName) {
        return new Promise((resolve, reject) => {
            let attrs = {};
            attrs[config.attrs.fields] = [];
            attrs[config.attrs.date] = dateFormat(new Date(), "yyyy-MM-dd hh:mm");
            this.dbUtil.tableInfo(tableName).then(data => {
                attrs[config.attrs.entityName] = data.name;
                attrs[config.attrs.tableName] = data.table_name;
                attrs[config.attrs.remark] = data.table_comment;
                this.dbUtil.listFieldForTable(tableName).then(data => {
                    attrs[config.attrs.fields] = data;
                    let primaryKey = data.find(it => it.pri);
                    if (primaryKey) {
                        attrs[config.attrs.primaryKey] = primaryKey.fieldName;
                        attrs[config.attrs.priType] = primaryKey.type;
                    }
                    resolve(attrs);
                });
            });
        });
    }

    /**
     * 生成模板
     * @param {*} data 
     */
    genTemplate(data, callback) {
        this.callback = callback;
        this.dbUtil = new DataBaseUtil(data.db);

        let templates = data.props.template;
        this.count = 0;
        templates = templates.filter(it => it.checked);
        this.total = templates.length * data.tableList.length;
        if (this.total == 0) {
            return;
        }
        templates.forEach(item => {
            data.tableList.forEach(table => {
                this.getAttrs(table).then(attrs => {
                    if (data.type === 'general') {
                        this.genGeneralFile(item, table, attrs, data.output);
                    } else if (data.type === "java") {
                        this.genJavaFile(data.props, item, table, attrs, data.output);
                    }
                });
            });
        });
    }
    genGeneralFile(item, table, attrs, output) {
        let filePath = path.join(output, ejs.render(item.fileDir, attrs));
        this.renderFile(table, item.templateId, filePath, item.fileName, attrs);
    }
    genJavaFile(props, item, table, attrs, output) {
        attrs[config.attrs.imports] = [];
        attrs[config.attrs.packageName] = props.package;
        if (item.package != "") {
            attrs[config.attrs.packageName] = attrs[config.attrs.packageName] + '.' + item.package;
        }
        attrs[config.attrs.basePackage] = props.package;
        attrs[config.attrs.swagger] = props.swagger;
        if (attrs[config.attrs.fields].findIndex(it => it.type === "Date") >= 0) {
            attrs[config.attrs.imports].push("java.util.Date");
        }
        let filePath = path.join(output, attrs[config.attrs.packageName].replace(/\./g, '/') + '/');
        this.renderFile(table, item.templateId, filePath, item.fileName, attrs);
    }
    renderFile(table, template, filePath, fileName, attrs) {
        ejs.renderFile(template, attrs, (err, str) => {
            if (err) {
                this.count += 1;
                this.callback(table + " 生成失败: " + err, this.count == this.total);
            } else {
                filePath = path.join(filePath, ejs.render(fileName, attrs));
                if (!fs.existsSync(filePath)) {
                    mkdirs(filePath);
                }
                saveToFile(filePath, str, false).then(ret => {
                    this.count += 1;
                    if (ret) {
                        this.callback(filePath + " 生成成功！", this.count == this.total);
                    } else {
                        this.callback(table + " 生成失败！", this.count == this.total);
                    }
                });
            }
        });
    }

    /**
     * 移动文件
     * @param {*} source 
     * @param {*} target 
     * @param {*} mode 0-复制 1-移动
     */
    copyFile(source, target, mode = 0) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(target)) {
                mkdirs(path.join(target, "tmp"));
            }
            listFileForFolder(source).then(res => {
                res.forEach(it => {
                    if (!mode || mode == 0) {
                        fs.copyFileSync(
                            path.join(source, it),
                            path.join(target, it),
                            err => {}
                        );
                    } else {
                        fs.renameSync(
                            path.join(source, it),
                            path.join(target, it),
                            err => {}
                        );
                    }
                });
                resolve(true);
            });
        });
    }

    deleteFiles(target) {
        listFileForFolder(target).then(res => {
            res.forEach(it => {
                fs.unlinkSync(path.join(target, it));
            });
            fs.rmdirSync(target);
        });
    }

    exportProfile(filePath) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(config.tmp)) {
                fs.mkdirSync(config.tmp);
            }
            let tmpPath = path.join(config.tmp, "template");
            let fileName = "config.json";
            let template = config.storePath.template;
            let datasource = config.storePath.datasource;
            let project = config.storePath.project;
            let data = {
                template: getDataForObject(template),
                datasource: getDataForObject(datasource),
                project: getDataForObject(project)
            };
            this.copyFile(config.template, tmpPath, 0).then(ret => {
                if (ret) {
                    saveToFile(path.join(config.tmp, fileName), JSON.stringify(data), false).then(res => {
                        if (res) {
                            let zip = new adm_zip();
                            zip.addLocalFolder(config.tmp);
                            zip.writeZip(path.join(filePath, "db2code.zip"), (err) => {
                                if (!err) {
                                    this.deleteFiles(tmpPath);
                                    fs.unlinkSync(path.join(config.tmp, fileName));
                                    resolve(true);
                                }
                            });
                        } else {
                            resolve(false);
                        }
                    });
                }
            });
        });
    }

    importProfile(target) {
        return new Promise((resolve, reject) => {
            if (!target.endsWith(".zip")) {
                error("文件格式不正确！");
                resolve(false);
            }
            if (!fs.existsSync(config.tmp)) {
                fs.mkdirSync(config.tmp);
            }
            let tmpPath = path.join(config.tmp, "template");
            let fileName = "config.json";
            let template = config.storePath.template;
            let datasource = config.storePath.datasource;
            let project = config.storePath.project;
            if (fs.existsSync(tmpPath)) {
                this.deleteFiles(tmpPath);
            }
            let unzip = new adm_zip(target);
            unzip.extractAllToAsync(config.tmp, true, (err) => {
                if (!err) {
                    readForFile(path.join(config.tmp, fileName), false).then(data => {
                        if (data) {
                            let configTmp = JSON.parse(data);
                            saveData(template, configTmp[template]);
                            saveData(datasource, configTmp[datasource]);
                            saveData(project, configTmp[project]);
                            this.copyFile(tmpPath, config.template, 1).then(ret => {
                                if (ret) {
                                    fs.rmdirSync(tmpPath);
                                    fs.unlinkSync(path.join(config.tmp, fileName));
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            });
                        } else {
                            error(data);
                            resolve(false);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });

    }
}

export default Service;