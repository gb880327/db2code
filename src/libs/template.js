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
        this.tempList = getDataForObject(config.templateList);
        ejs.fileLoader = (filePath) => {
            return buffer.from(fs.readFileSync(config.getTemplatePath() + "/" + filePath)).toString();
        };
    }

    getDataBaseInfo(id) {
        let dbList = getDataForObject(config.dbList);
        if (!dbList || dbList == null) {
            return null;
        }
        return dbList.find(item => item.id == id);
    }

    getTemplate(id) {
        return this.tempList.find(it => it.id == id);
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

    genTemplate(props, callback) {
        const isOver = () => {
            this.count += 1;
            if (this.count == this.total) {
                callback("done");
            }
        }
        this.props = props;
        this.dbUtil = new DataBaseUtil(this.getDataBaseInfo(props.dataBase).props);
        let templateList = props.templateList;
        this.total = templateList.length * props.tables.length;
        this.count = 0;
        templateList.forEach(item => {
            let template = this.getTemplate(item.template);
            props.tables.forEach(table => {
                this.getAttrs(table).then(attrs => {
                    ejs.renderFile(template.fileName, attrs, (err, str) => {
                        if (err) {
                            callback(table + " 生成失败！");
                            isOver();
                        } else {
                            let filePath = path.join(item.output, attrs[config.attrs.packageName].replace('.', '/') + '/');
                            filePath = path.join(filePath, attrs[config.attrs.entityName] + ".java");
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