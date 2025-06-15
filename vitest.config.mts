import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
    plugins: [angular()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["src/test-setup.ts"],
        include: ["**/*.spec.ts"],
        server: {
            deps: {
                inline: [/^(?!.*\\.{css,less,scss}$).*$/],
            },
        },
        coverage: {
            reporter: ["text", "json-summary", "json"],
            reportOnFailure: true,
            thresholds: {
                lines: 60,
                branches: 60,
                functions: 60,
                statements: 60,
            },
        },
    },
    resolve: {
        conditions: ["development"],
    },
});
