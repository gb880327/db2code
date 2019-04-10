import swal from "sweetalert2";
const fs = require("fs");
const buffer = require("buffer").Buffer;

export const saveToFile = (fileName, data) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(fileName)) {
            error("文件 " + fileName + " 不存在！");
            resolve(false);
            return;
        }
        console.log(fileName);
        fs.writeFile(fileName, (data instanceof Object ? JSON.stringify(data) : data), err => {
            if (err) {
                error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

export const readForFile = (fileName) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(fileName)) {
            error("文件 " + fileName + " 不存在！");
            resolve(false);
            return;
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

export const listFileForFolder = (folderPath) => {
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
}

export const saveData = (key, value) => {
    localStorage.setItem(key, (value instanceof Object) ? JSON.stringify(value) : value);
};
export const getDataForObject = (key) => {
    let value = localStorage.getItem(key);
    return value && value != null ? JSON.parse(value) : null;
};
export const getDataForStr = (key) => {
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
    alert(arg, 'success', callback);
};
//错误提示框
export const error = (arg, callback) => {
    alert(arg, "error", callback);
};
//警告提示框
export const warning = (arg, callback) => {
    alert(arg, 'warning', callback);
};
//信息提示框
export const info = (arg, callback) => {
    alert(arg, 'info', callback);
};
//确认提示框
export const confirm = (msg, ok, cancel) => {
    swal.fire({
        text: msg,
        type: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.value) {
            if (ok) ok();
        } else {
            if (cancel) cancel();
        }
    });
};