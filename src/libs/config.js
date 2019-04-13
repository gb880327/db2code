const os = require("os");
const path = require("path");
const basePath = path.join(os.homedir(), '.codegen');

let config = {
    dataPath: basePath,
    template: path.join(basePath, 'template'),
    project: path.join(basePath, 'project'),
    dbType: ["mysql"],

    attrs: {
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