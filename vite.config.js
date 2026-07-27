import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({

    base: "./",

    plugins: [

        legacy({
            targets: [
                "defaults",
                "not IE 11"
            ]
        })

    ],

    server: {

        host: "0.0.0.0",

        port: 5173,

        open: true

    },

    preview: {

        host: "0.0.0.0",

        port: 4173

    },

    build: {

        outDir: "dist",

        assetsDir: "assets",

        sourcemap: false,

        minify: "esbuild",

        cssMinify: true,

        chunkSizeWarningLimit: 1000,

        rollupOptions: {

            output: {

                manualChunks: {

                    firebase: [
                        "firebase/app",
                        "firebase/auth",
                        "firebase/firestore",
                        "firebase/storage"
                    ],

                    charts: [
                        "chart.js"
                    ],

                    export: [
                        "xlsx",
                        "jspdf",
                        "html2canvas"
                    ]

                }

            }

        }

    }

});
