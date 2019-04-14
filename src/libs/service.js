const path = require("path");
const fs = require("fs");
import config from './config';
import {
    listFileForFolder,
    readForFile,
    saveToFile,
    error,
    confirm
} from "./util";


class Service {

    constructor() {
        this.projectList = [];
        this.templateList = [];
    }

    listProject() {
        return new Promise((resolve, reject) => {
            listFileForFolder(config.project).then(data => {
                if (data) {
                    data = data.filter(it => it.endsWith('.json'));
                    data.forEach(item => {
                        this.projectList.push({
                            name: item.replace('.json', ''),
                            fileName: item
                        });
                    });
                }
                resolve(this.projectList);
            });
        });
    }

    listTemplate() {
        return new Promise((resolve, reject) => {
            listFileForFolder(config.template).then(data => {
                if (data) {
                    data = data.filter(it => it.endsWith(".ejs"));
                    data.forEach(item => {
                        this.templateList.push({
                            name: item.replace(".ejs", ""),
                            fileName: item
                        });
                    });
                }
                resolve(this.templateList);
            });
        });
    }

    getInfo(path, is_json = true) {
        return new Promise((resolve, reject) => {
            readForFile(path).then(data => {
                if (data) {
                    resolve(is_json ? JSON.parse(data) : data);
                } else {
                    resolve(undefined)
                }
            });
        });
    }

    /** 保存文件 type 0-项目 1-模板 */
    saveProject(name, project, type = 0) {
        return new Promise((resolve, reject) => {
            let filePath = type == 0 ? path.join(config.project, project.name + '.json') :
                path.join(config.template, project.name + '.ejs');
            if (name != project.name && (type == 0 ? this.projectList : this.templateList).findIndex(it => it.name == project.name) >= 0) {
                confirm(type == 0 ? "项目 " : "模板 " + project.name + " 已经存在，是否覆盖？", () => {
                    saveToFile(filePath, type == 0 ? project : project.data, false).then(data => {
                        resolve(data);
                    });
                });
            } else {
                saveToFile(filePath, type == 0 ? project : project.data, false).then(data => {
                    resolve(data);
                });
            }
        });
    }

    delProject(name, path, type = 0) {
        return new Promise((resolve, reject) => {
            confirm("确认是否删除" + (type == 0 ? "项目 " : "模板 ") + name + "?", () => {
                if (fs.existsSync(path)) {
                    fs.unlink(path, err => {
                        if (err) {
                            error(err);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }
}

export default Service;