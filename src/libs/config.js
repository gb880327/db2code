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
    dataType: path.join(getBasePath(), 'dataType.json'),
    configFile: path.join(getBasePath(), 'config.json'),
    template: path.join(getBasePath(), 'template'),
    tmp: path.join(getBasePath(), "tmp"),
    dbType: ["mysql"],
    langType: ["general", "java"],
    attrs: {
        basePackage: "basePackage",
        packageName: "packageName",
        imports: "imports",
        entityName: "entityName",
        tableName: "tableName",
        remark: "remark",
        fields: "fields",
        date: "date",
        primaryKey: "primaryKey",
        priType: "priType"
    }
};

export default config;