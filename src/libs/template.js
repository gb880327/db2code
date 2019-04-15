const ejs = require('ejs');
const fs = require("fs");
const path = require('path');
const buffer = require("buffer").Buffer;
import {
    getDataForObject,
    dateFormat,
    saveToFile,
    mkdirs
} from "./util";
import config from "./config";
import DataBaseUtil from "./database";

class TemplateUtil {

    constructor() {
        this.dbUtil = null;
        this.props = null;
        this.count = 0;
        this.total = 0;
        ejs.fileLoader = (filePath) => {
            return buffer.from(fs.readFileSync(path.join(config.template, filePath))).toString();
        };
    }

    getAttrs(tableName) {
        return new Promise((resolve, reject) => {
            let attrs = {};
            attrs[config.attrs.packageName] = this.props.package;
            attrs[config.attrs.swagger] = this.props.swagger;
            attrs[config.attrs.fields] = [];
            attrs[config.attrs.imports] = [];
            attrs[config.attrs.date] = dateFormat(new Date(), "yyyy-MM-dd hh:mm");
            this.dbUtil.tableInfo(tableName).then(data => {
                attrs[config.attrs.entityName] = data.name;
                attrs[config.attrs.tableName] = data.table_name;
                attrs[config.attrs.remark] = data.table_comment;
                this.dbUtil.listFieldForTable(tableName).then(data => {
                    attrs[config.attrs.fields] = data;
                    if (attrs[config.attrs.fields].findIndex(it => it.type === "Date") >= 0) {
                        attrs[config.attrs.imports].push("java.util.Date");
                    }
                    resolve(attrs);
                });
            });
        });
    }

    genTemplate(props, tableList, callback) {
        const isOver = () => {
            this.count += 1;
            if (this.count == this.total) {
                callback("done");
            }
        }
        this.props = props;
        this.dbUtil = new DataBaseUtil(props.dataBase.props);
        let templateList = props.templateList;
        this.total = templateList.length * tableList.length;
        this.count = 0;
        templateList.forEach(item => {
            tableList.forEach(table => {
                this.getAttrs(table).then(attrs => {
                    attrs[config.attrs.packageName] = attrs[config.attrs.packageName] + '.' + item.package;
                    ejs.renderFile(item.template, attrs, (err, str) => {
                        if (err) {
                            callback(table + " 生成失败！");
                            isOver();
                        } else {
                            let filePath = path.join(item.output, attrs[config.attrs.packageName].replace(/\./g, '/') + '/');
                            filePath = path.join(filePath, attrs[config.attrs.entityName] + item.fileName);
                            if (!fs.existsSync(filePath)) {
                                mkdirs(filePath);
                            }
                            saveToFile(filePath, str, false).then(ret => {
                                if (ret) {
                                    callback(table + " : " + filePath + " 生成成功！");
                                } else {
                                    callback(table + " 生成失败！");
                                }
                                isOver();
                            });
                        }
                    });
                });
            });
        });
    }
}
export default TemplateUtil;