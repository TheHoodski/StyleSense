// File: server/src/seeders/index.ts
import { initDatabase } from '../config/database';
import { seedHaircutStyles } from './haircutStylesSeeder';

const runSeeders = async (): Promise<void> => {
  try {
    console.log('Initializing database...');
    await initDatabase();
    
    console.log('Running seeders...');
    await seedHaircutStyles();
    
    console.log('All seeders completed successfully!');
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
};

// Run if called directly
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

export default runSeeders;