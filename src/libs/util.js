import swal from "sweetalert2";
const fs = require("fs");
const path = require("path");
const buffer = require("buffer").Buffer;

export const mkdirs = (dir, cb) => {
    let filePath = path.dirname(dir);
    if (!fs.existsSync(filePath)) {
        mkdirs(filePath, () => {
            fs.mkdirSync(filePath);
        });
    }
    cb && cb();
};

export const exists = (filePath) => {
    return fs.existsSync(filePath);
};

export const saveToFile = (fileName, data, checkExists = true) => {
    return new Promise((resolve, reject) => {
        if (checkExists && !fs.existsSync(fileName)) {
            error("文件 " + fileName + " 不存在！");
            resolve(false);
            return;
        }
        fs.writeFile(
            fileName,
            data instanceof Object ? JSON.stringify(data) : data,
            err => {
                if (err) {
                    error(err);
                    resolve(false);
                } else {
                    resolve(fileName);
                }
            }
        );
    });
};

export const readForFile = (fileName, checkExists = true) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(fileName)) {
            if (checkExists) {
                error("文件 " + fileName + " 不存在！");
                resolve(false);
                return;
            } else {
                resolve("");
                return;
            }
        }
        fs.readFile(fileName, (err, data) => {
            if (err) {
                error(err);
                resolve(false);
            } else {
                resolve(buffer.from(data).toString());
            }
        });
    });
};

export const loadConfig = (path) => {
    if (!fs.existsSync(path)) {
        return [];
    } else {
        let json = buffer.from(fs.readFileSync(path));
        return JSON.parse(json);
    }
}

export const listFileForFolder = folderPath => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(folderPath)) {
            error(folderPath + " 不存在！");
            resolve(false);
            return;
        }
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                error(err);
                resolve(false);
            } else {
                resolve(files);
            }
        });
    });
};

export const saveData = (key, value) => {
    localStorage.setItem(
        key,
        value instanceof Object ? JSON.stringify(value) : value
    );
};
export const getDataForObject = key => {
    let value = localStorage.getItem(key);
    return value && value != null ? JSON.parse(value) : null;
};
export const getDataForStr = key => {
    let value = localStorage.getItem(key);
    return value && value != null ? value : "";
};

let alert = (arg, type, callback = () => {}) => {
    swal.fire({
        text: arg,
        type: type,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: 3000,
        onAfterClose: callback
    });
};
//成功提示框
export const success = (arg, callback) => {
    alert(arg, "success", callback);
};
//错误提示框
export const error = (arg, callback) => {
    alert(arg, "error", callback);
};
//警告提示框
export const warning = (arg, callback) => {
    alert(arg, "warning", callback);
};
//信息提示框
export const info = (arg, callback) => {
    alert(arg, "info", callback);
};
//确认提示框
export const confirm = (msg, ok, cancel) => {
    customConfirm(msg, '确定', "取消", ok, cancel);
};
export const customConfirm = (msg, okTxt, cancelTxt, ok, cancel) => {
    swal
        .fire({
            text: msg,
            type: "warning",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: okTxt,
            cancelButtonText: cancelTxt
        })
        .then(result => {
            if (result.value) {
                if (ok) ok();
            } else {
                if (cancel) cancel();
            }
        });
};

export const dateFormat = (date, format) => {
    if (!date || date == null || date === "") {
        return "";
    }
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format))
        format = format.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return format;
};

export const genId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};