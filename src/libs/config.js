import { getDataForStr } from "@/libs/util";

let config = {
    dataPath: "DataPath",
    template: "template",
    project: "project",

    dbList: "DBList",
    templateList: "TemplateList",
    projectList: "ProjectList",
    dbType: ["mysql"],
    getTemplatePath: () => {
        return getDataForStr(config.dataPath) + "/" + config.template;
    },
    getProjectPath: () => {
        return getDataForStr(config.dataPath) + "/" + config.project;
    }
};

export default config;