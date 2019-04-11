const ejs = require('ejs');
const fs = require("fs");
const buffer = require("buffer").Buffer;
import {
    getDataForObject,
    dateFormat,
    saveToFile
} from "./util";
import config from "./config";
import DataBaseUtil from "./database";

class TemplateUtil {

    constructor() {
        this.dbUtil = null;
        this.props = null;
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
        let attrs = {};
        attrs[config.attrs.package] = this.props.package;
        attrs[config.attrs.swagger] = this.props.swagger;
        attrs[config.attrs.fields] = [];
        attrs[config.attrs.imports] = [];
        attrs[config.attrs.date] = dateFormat(new Date(), "yyyy-MM-dd hh:mm");
        this.dbUtil.tableInfo(tableName).then(data => {
            attrs[config.attrs.entityName] = data.name;
            attrs[config.attrs.tableName] = data.table_name;
            attrs[config.attrs.remark] = data.table_comment;
        });
        this.dbUtil.listFieldForTable(tableName).then(data => {
            attrs[config.attrs.fields] = data;
            if (attrs[config.attrs.fields].findIndex(it => it.type === "Date") >= 0) {
                attrs[config.attrs.imports].push("java.util.Date");
            }
        });
        return attrs;
    }

    genTemplate(props, callback) {
        this.props = props;
        this.dbUtil = new DataBaseUtil(this.getDataBaseInfo(props.dataBase).props);
        let templateList = props.templateList;
        let total = templateList.length * props.tables.length;
        let count = 0;
        templateList.forEach(item => {
            let template = this.getTemplate(item.template);
            props.tables.forEach(table => {
                let attrs = this.getAttrs(table);
                ejs.renderFile(template.fileName, attrs, (err, str) => {
                    if (err) {
                        console.log(err);
                        callback(table + " 生成失败！");
                    } else {
                        let fileName = item.output + "/" + attrs[config.attrs.entityName] + ".java";
                        saveToFile(fileName, str).then(ret => {
                            if (ret) {
                                callback(table + " : " + fileName + " 生成成功！");
                            } else {
                                callback(table + " 生成失败！");
                            }
                        });
                    }
                    count += 1;
                    if (count == total) {
                        callback("执行完成！");
                    }
                });
            });
        });
    }
}
export default TemplateUtil;