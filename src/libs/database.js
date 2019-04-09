const mysql = require('mysql');
import $this from "@/main.js";
import { async } from "q";

/** 
 * 数据库相关操作工具类
 */
class DataBaseUtil {

    constructor(props = {}) {
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
            this.conn.query("show tables;", (error, result, fields) => {
                if (error) {
                    $this.$error(error);
                    reject("查询失败！");
                } else {
                    let ret = { result: result, fields: fields };
                    resolve(ret);
                }
            })
        });
    }
}

export default DataBaseUtil;