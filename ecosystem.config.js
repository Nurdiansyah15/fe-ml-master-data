module.exports = {
    apps: [
        {
            name: "mpl-master-data", // ubah sesuai nama aplikasi yang dibuat
            script: "npx",
            // sesuaikan port yang telah diubah
            args: "serve -s -l 5173 build",
            interpreter: "none",
            watch: true,
            merge_logs: true,
            env: {
                "NODE_ENV": "production",        
            }
        }
    ]
}