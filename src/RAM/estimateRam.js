import fs from "fs";
import path from "path";

 export function estimateRAM(projectPath) {
    const packageJsonPath = path.join(projectPath, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return "Unknown (no package.json found)";
    }

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const dependencies = Object.keys(pkg.dependencies || {});
    const devDependencies = Object.keys(pkg.devDependencies || {});

    // Baseline for a small Node.js project
    let baseRAM = 100; // MB

    // Simple heuristic: adjust RAM based on heavy libraries
    dependencies.forEach(dep => {
        if (["express", "koa", "fastify"].includes(dep)) baseRAM += 50;
        if (["puppeteer", "playwright"].includes(dep)) baseRAM += 300;
        if (["next", "nuxt"].includes(dep)) baseRAM += 200;
        if (["react", "vue", "angular"].includes(dep)) baseRAM += 150;
        if (["mongodb", "mongoose", "sequelize", "prisma"].includes(dep)) baseRAM += 100;
        if (["socket.io"].includes(dep)) baseRAM += 75;
    });

    devDependencies.forEach( dep=> {
           if (["webpack", "rollup", "parcel", "vite"].includes(dep)) baseRAM += 70;

    // Transpilers / compilers
    if (["babel", "@babel/core", "@babel/preset-env"].includes(dep)) baseRAM += 60;
    if (["typescript", "ts-node"].includes(dep)) baseRAM += 40;

    // Linters & formatters
    if (["eslint", "prettier", "stylelint"].includes(dep)) baseRAM += 30;

    // Testing frameworks
    if (["jest", "mocha", "chai", "ava"].includes(dep)) baseRAM += 50;
    if (["cypress", "playwright", "puppeteer"].includes(dep)) baseRAM += 120;

    // Dev servers / hot reload
    if (["nodemon", "concurrently"].includes(dep)) baseRAM += 20;
    if (["webpack-dev-server", "vite"].includes(dep)) baseRAM += 50;

    // Task runners
    if (["gulp", "grunt"].includes(dep)) baseRAM += 40;

    // Docs / Storybook
    if (["storybook"].includes(dep)) baseRAM += 100;

    // CI/CD helpers
    if (["husky", "lint-staged"].includes(dep)) baseRAM += 10;
    
    })

    return `${baseRAM} MB (estimated)`;
}

// Example usage
// console.log(estimateRAM("./my-node-project"));
