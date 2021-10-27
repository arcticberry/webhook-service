var pm2Config = {
    "apps": [
        {
            "name": "auth-service",
            "script": "dist/main.js",
            "exec_mode": "cluster_mode",
            "instances": 1,
            watch: false,
            ignore_watch: ["node_modules", ".git","node_modules", "tmp", "./Dockerfile", "./yarn-error.log"],
        },
    ]
}

module.exports = pm2Config;