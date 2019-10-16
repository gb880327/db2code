"use strict";
import { app, protocol, BrowserWindow, Menu } from "electron";
import {
    createProtocol,
    installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], {
    secure: true
});

const template = [{
        label: "编辑",
        submenu: [{
                label: "撤销",
                role: "undo"
            },
            {
                label: "恢复",
                role: "redo"
            },
            {
                type: "separator"
            },
            {
                label: "剪切",
                role: "cut"
            },
            {
                label: "复制",
                role: "copy"
            },
            {
                label: "粘贴",
                role: "paste"
            },
            {
                label: "删除",
                role: "delete"
            },
            {
                label: "全选",
                role: "selectall"
            }
        ]
    },
    {
        label: "查看",
        submenu: [{
                label: "刷新",
                role: "reload"
            },
            {
                label: "强制刷新",
                role: "forcereload"
            }
        ]
    },
    {
        label: "窗口",
        role: "window",
        submenu: [{
                label: "最小化",
                role: "minimize"
            },
            {
                label: "退出",
                role: "close"
            }
        ]
    },
    {
        label: '帮助',
        role: "Help",
        submenu: [{
                label: "关于",
                click() {
                    win.webContents.send('about');
                }
            },
            {
                label: "GitHub",
                click() {
                    require("electron").shell.openExternal(
                        "https://github.rookietao.site"
                    );
                }
            }
        ]
    }
];

if (process.platform === "darwin") {
    template.unshift({
        label: app.getName(),
        submenu: [{
                type: "separator"
            },
            {
                type: "separator"
            },
            {
                label: '隐藏',
                role: "hide"
            },
            {
                label: '隐藏其他',
                role: "hideothers"
            },
            {
                label: '全部显示',
                role: "unhide"
            },
            {
                type: "separator"
            },
            {
                label: '退出',
                role: "quit"
            }
        ]
    });

    // Window menu
    template[3].submenu = [{
            label: '关闭',
            role: "close"
        },
        {
            label: '最小化',
            role: "minimize"
        },
        {
            type: "separator"
        }
    ];
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function createWindow() {
    const electronScreen = require("electron").screen;
    const size = electronScreen.getPrimaryDisplay().size;

    // Create the browser window.
    win = new BrowserWindow({
        width: size.width,
        height: size.height
    });
    // win.webContents.openDevTools();
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }

    win.on("closed", () => {
        win = null;
    });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async() => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installVueDevtools();
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", data => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}