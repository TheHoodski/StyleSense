"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const haircutStylesSeeder_1 = require("./haircutStylesSeeder");
const runSeeders = async () => {
    try {
        console.log('Initializing database...');
        await (0, database_1.initDatabase)();
        console.log('Running seeders...');
        await (0, haircutStylesSeeder_1.seedHaircutStyles)();
        console.log('All seeders completed successfully!');
    }
    catch (error) {
        console.error('Error running seeders:', error);
        process.exit(1);
    }
};
if (require.main === module) {
    runSeeders()
        .then(() => {
        console.log('Database initialization and seeding complete!');
        process.exit(0);
    })
        .catch(error => {
        console.error('Failed to initialize and seed database:', error);
        process.exit(1);
    });
}
exports.default = runSeeders;
//# sourceMappingURL=index.js.map