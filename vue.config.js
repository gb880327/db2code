module.exports = {
    pluginOptions: {
        electronBuilder: {
            // List native deps here if they don't work
            externals: ['ejs'],
            // If you are using Yarn Workspaces, you may have multiple node_modules folders
            // List them all here so that VCP Electron Builder can find them
            nodeModulesPath: ['./node_modules'],
            builderOptions: {
                extraResources: [{
                    from: "build/template",
                    to: "template"
                }],
                mac: {
                    target: 'dmg',
                    icon: 'build/icons/logo.icns',
                    type: 'distribution'
                },
                win: {
                    target: 'zip',
                    icon: 'build/icons/logo.ico'
                }
            }
        }
    }
}