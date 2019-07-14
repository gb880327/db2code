const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const buffer = require("buffer").Buffer;
import config from './config';
import DataBaseUtil from "./database";
import {
    getDataForObject,
    readForFile,
    saveToFile,
    error,
    dateFormat,
    mkdirs
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
    delTemplate(path) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path)) {
                fs.unlink(path, err => {
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
            attrs[config.attrs.imports] = [];
            attrs[config.attrs.date] = dateFormat(new Date(), "yyyy-MM-dd hh:mm");
            this.dbUtil.tableInfo(tableName).then(data => {
                attrs[config.attrs.entityName] = data.name;
                attrs[config.attrs.tableName] = data.table_name;
                attrs[config.attrs.remark] = data.table_comment;
                this.dbUtil.listFieldForTable(tableName).then(data => {
                    attrs[config.attrs.fields] = data;
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
        if (data.type === "java") {
            this.genJavaFile(data.props, data.tableList, data.output);
        }
    }

    genJavaFile(props, tables, output) {
        let templates = props.template;
        this.total = templates.length * tables.length;
        this.count = 0;
        templates = templates.filter(it => it.checked);
        if (this.total == 0) {
            return;
        }
        templates.forEach(item => {
            tables.forEach(table => {
                this.getAttrs(table).then(attrs => {
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
                });
            });
        });
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
                        this.callback(table + " : " + filePath + " 生成成功！", this.count == this.total);
                    } else {
                        this.callback(table + " 生成失败！", this.count == this.total);
                    }
                });
            }
        });
    }
}

export default Service;