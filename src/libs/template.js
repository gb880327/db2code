const ejs = require('ejs');
import DataBaseUtil from "@/libs/database";

class TemplateUtil {

    constructor(props) {

        this.dbUtil = new DataBaseUtil();
    }

}
export default TemplateUtil;