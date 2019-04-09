import swal from "sweetalert2";

export const saveData = (key, value) => {
    localStorage.setItem(key, (value instanceof Object) ? JSON.stringify(value) : value);
};
export const getDataForObject = (key) => {
    let value = localStorage.getItem(key);
    return value && value != null ? JSON.parse(value) : "";
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