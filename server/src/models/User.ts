// File: server/src/models/User.ts
import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
    BeforeCreate,
    BeforeUpdate
  } from 'sequelize-typescript';
  import bcrypt from 'bcryptjs';
  import { FaceAnalysis } from './FaceAnalysis';
  import { Subscription } from './Subscription';
  import { UserActivity } from './UserActivity';
  import { SavedRecommendation } from './SavedRecommendation';
  import { Recommendation } from './Recommendation';
  
  @Table({
    tableName: 'users',
    timestamps: true,
    underscored: true
  })
  export class User extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
    })
    user_id!: string;
  
    @Column({
      type: DataType.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    })
    email!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    password_hash!: string;
  
    // We don't store the actual password in the DB
    // This is a virtual property used for validation
    @Column({
      type: DataType.VIRTUAL,
      allowNull: true,
      validate: {
        len: [8, 100]
      }
    })
    get password(): string | undefined {
      return undefined;
    }
  
    set password(value: string | undefined) {
      if (value) {
        this.setDataValue('password_hash', bcrypt.hashSync(value, 10));
      }
    }
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false
    })
    is_premium!: boolean;
  
    @Column({
      type: DataType.DATE,
      allowNull: true
    })
    subscription_expires_at?: Date;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      field: 'created_at'
    })
    created_at!: Date;
  
    @UpdatedAt
    @Column({
      type: DataType.DATE,
      field: 'updated_at'
    })
    updated_at!: Date;
  
    @Column({
      type: DataType.DATE,
      allowNull: true
    })
    last_login?: Date;
  
    // Methods
    public async comparePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password_hash);
    }
  
    // Relationships
    @HasMany(() => FaceAnalysis, {
      foreignKey: 'user_id'
    })
    face_analyses!: FaceAnalysis[];
  
    @HasMany(() => Subscription, {
      foreignKey: 'user_id'
    })
    subscriptions!: Subscription[];
  
    @HasMany(() => UserActivity, {
      foreignKey: 'user_id'
    })
    activities!: UserActivity[];
  
    @HasMany(() => SavedRecommendation, {
      foreignKey: 'user_id'
    })
    saved_recommendations!: SavedRecommendation[];
  
    @HasMany(() => Recommendation, {
      foreignKey: 'user_id'
    })
    recommendations!: Recommendation[];
  
    // Hooks
    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(instance: User) {
      // Only hash the password if it's been changed (or is new)
      if (instance.changed('password_hash')) {
        // password is already hashed by the setter
      }
    }
  }