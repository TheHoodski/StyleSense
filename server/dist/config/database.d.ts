import { Sequelize } from 'sequelize-typescript';
declare const sequelize: Sequelize;
export declare const initDatabase: () => Promise<void>;
export default sequelize;
