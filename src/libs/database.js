const mysql = require('mysql');
import $this from "@/main.js";


/** 
 * 数据库相关操作工具类
 */
class DataBaseUtil {

    constructor(props = {}) {
        this.props = props;
        this.conn = mysql.createConnection({
            host: props.host,
            port: props.port,
            database: props.dbName,
            user: props.userName,
            password: props.passWord
        });
        this.conn.connect((err) => {
            if (err) {
                $this.$error(e);
            }
        });
    }

    listTable() {
        return new Promise((resolve, reject) => {
            let sql = mysql.format("select table_name, table_comment from information_schema.tables where table_schema = ?", this.props.dbName);
            this.conn.query(sql, (error, result, fields) => {
                if (error) {
                    $this.$error(error);
                    reject("查询失败！");
                } else {
                    resolve(this.formatTableName(result));
                }
            })
        });
    }

    listFieldForTable(tableName) {
        return new Promise((resolve, reject) => {
            let sql = mysql.format("select column_name, data_type, column_comment from information_schema.columns where table_schema = ? and table_name = ?", [this.props.dbName, tableName]);
            console.log(sql);
            this.conn.query(sql, (error, result, fields) => {
                if (error) {
                    $this.$error(error);
                    reject("查询失败！");
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * JAVA对应数据类型
     */
    javaDataType() {
        return {
            'int': 'Integer',
            'bigint': 'Integer',
            'smallint': 'Integer',
            'mediumint': 'Integer',
            'varchar': 'String',
            'char': 'String',
            'tinytext': 'String',
            'text': 'String',
            'mediumtext': 'String',
            'longtext': 'String',
            'datetime': 'Date',
            'date': 'Date',
            'time': 'Date',
            'timestamp': 'Long',
            'tinyint': 'Boolean',
            'decimal': 'Double',
            'float': 'Double',
            'double': 'Double'
        };
    }

    /**
     * 处理表名 驼峰命名规则
     * @param {} result 
     */
    formatTableName(result) {
        let data = [];
        result.forEach(item => {
            let str = this.props.prefix && this.props.prefix === "" ? item.table_name.replace(this.props.prefix + '_', '') : item.table_name;
            str = str.split('_');
            let dataItem = {
                name: '',
                table_name: item.table_name,
                table_comment: item.table_comment
            };
            str.forEach(it => {
                dataItem.name += it.substr(0, 1).toUpperCase() + it.substr(1, it.length - 1).toLowerCase();
            });
            data.push(dataItem);
        });
        console.log(data);
        return data;
    }
}

export default DataBaseUtil;