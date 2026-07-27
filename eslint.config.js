export default [
    {
        files: ["**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            globals: {
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                localStorage: "readonly",
                sessionStorage: "readonly",
                console: "readonly",

                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",

                fetch: "readonly",

                Notification: "readonly",

                indexedDB: "readonly",

                caches: "readonly",

                self: "readonly"
            }
        },

        rules: {

            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],

            "no-console": "off",

            "no-debugger": "error",

            "no-var": "error",

            "prefer-const": "error",

            "eqeqeq": [
                "error",
                "always"
            ],

            "curly": [
                "error",
                "all"
            ],

            "semi": [
                "error",
                "always"
            ],

            "quotes": [
                "error",
                "double"
            ]

        }

    }
];
