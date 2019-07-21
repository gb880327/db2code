const fs = require("fs");
const os = require("os");
const path = require("path");
const basePath = path.join(os.homedir(), '.codegen');

const getBasePath = () => {
    let base = localStorage.getItem("basePath");
    return !base || base == "" || !fs.existsSync(base) ? basePath : base;
};

let config = {
    storePath: {
        template: "template",
        datasource: "datasource",
        project: "project"
    },
    dataPath: getBasePath(),
    template: path.join(getBasePath(), 'template'),
    tmp: path.join(getBasePath(), "tmp"),
    dbType: ["mysql"],
    langType: ["java"],
    attrs: {
        basePackage: "basePackage",
        packageName: "packageName",
        imports: "imports",
        swagger: "swagger",
        entityName: "entityName",
        tableName: "tableName",
        remark: "remark",
        fields: "fields",
        date: "date"
    }
};

export default config;