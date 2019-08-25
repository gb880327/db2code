const mysql = require("mysql");
import $this from "@/main.js";

/**
 * 数据库相关操作工具类
 */
class DataBaseUtil {
    javaDataType = {
        int: "Integer",
        bigint: "Long",
        smallint: "Integer",
        mediumint: "Integer",
        varchar: "String",
        char: "String",
        tinytext: "String",
        text: "String",
        mediumtext: "String",
        longtext: "String",
        datetime: "Date",
        date: "Date",
        time: "Date",
        timestamp: "Long",
        tinyint: "Boolean",
        decimal: "Double",
        float: "Double",
        double: "Double"
    };

    constructor(props = {}) {
        this.isUpper = false;
        this.props = props;
        this.conn = mysql.createConnection({
            host: props.host,
            port: props.port,
            database: props.dbName,
            user: props.userName,
            password: props.passWord,
            connectTimeout: 1000 * 5
        });
        this.conn.connect(err => {
            if (err) {
                console.log(err);
                $this.$error(err);
            }
        });
    }

    tableInfo(tableName) {
        return new Promise((resolve, reject) => {
            let sql = mysql.format(
                "select table_name as table_name, table_comment as table_comment  from information_schema.tables where table_name = ?",
                tableName
            );
            this.conn.query(sql, (error, result, fields) => {
                if (error) {
                    $this.$error(error);
                    reject("查询失败！");
                } else {
                    resolve(this.formatTableName(result)[0]);
                }
            });
        });
    }

    listTable() {
        return new Promise((resolve, reject) => {
            let sql = mysql.format(
                "select table_name as table_name, '视图' as table_comment from information_schema.views where table_schema = ?",
                this.props.dbName
            );
            this.conn.query(sql, (error, result, fields) => {
                if (error) {
                    console.log(error);
                    $this.$error(error);
                    reject("查询失败！");
                } else {
                    let tableList = this.formatTableName(result);
                    sql = mysql.format(
                        "select table_name as table_name, table_comment as table_comment from information_schema.tables where table_schema = ?",
                        this.props.dbName
                    );
                    this.conn.query(sql, (error, result, fields) => {
                        if (error) {
                            console.log(error);
                            $this.$error(error);
                            reject("查询失败！");
                        } else {
                            resolve(tableList.concat(this.formatTableName(result)));
                        }
                    });
                }
            });
        });
    }

    listFieldForTable(tableName) {
        return new Promise((resolve, reject) => {
            let sql = mysql.format(
                "select column_name as column_name, data_type as data_type,column_key as column_key , column_comment as column_comment from information_schema.columns where table_schema = ? and table_name = ?", [this.props.dbName, tableName]
            );
            this.conn.query(sql, (error, result, fields) => {
                if (error) {
                    $this.$error(error);
                    reject("查询失败！");
                } else {
                    let data = [];
                    result.forEach(item => {
                        data.push({
                            columnName: item.column_name,
                            fieldName: this.formatFieldName(item.column_name),
                            type: this.javaDataType[item.data_type],
                            comment: item.column_comment,
                            pri: item.column_key === "PRI"
                        });
                    });
                    resolve(data);
                }
            });
        });
    }

    /**
     * 处理表名 驼峰命名规则
     * @param result
     */
    formatTableName(result) {
        let data = [];
        result.forEach(item => {
            let str =
                this.props.prefix && this.props.prefix === "" ?
                item.table_name.replace(this.props.prefix + "_", "") :
                item.table_name;
            str = str.split("_");
            let dataItem = {
                name: "",
                table_name: item.table_name,
                table_comment: item.table_comment
            };
            str.forEach(it => {
                dataItem.name +=
                    it.substr(0, 1).toUpperCase() +
                    it.substr(1, it.length - 1).toLowerCase();
            });
            data.push(dataItem);
        });
        return data;
    }

    formatFieldName(fieldName) {
        fieldName = fieldName.replace("is_", "");
        let strList = fieldName.split("_");
        let new_field = "";
        if (strList.length > 1) {
            for (let i = 1, j = strList.length; i < j; i++) {
                strList[i] =
                    strList[i].substr(0, 1).toUpperCase() +
                    strList[i].substr(1, strList[i].length);
            }
        }
        new_field = strList.join("");
        return new_field;
    }
}

export default DataBaseUtil;