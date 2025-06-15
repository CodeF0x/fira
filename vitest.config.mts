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
                lines: 80,
                branches: 80,
                functions: 80,
                statements: 80,
            },
        },
    },
    resolve: {
        conditions: ["development"],
    },
});
