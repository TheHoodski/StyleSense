# StyleSense AI Database Design

## Overview

StyleSense AI requires a robust database design to handle user data, analysis results, haircut recommendations, and usage analytics. This document outlines the proposed database schema, relationships, and considerations for scalability and security.

## Database Technology

Recommended technology stack:
- **Primary Database**: PostgreSQL (simple setup for MVP)
- **File Storage**: AWS S3 (for temporary user photo storage)
- **Analytics**: Simple event tracking with Mixpanel or Amplitude

Future expansion:
- **Caching Layer**: Redis (when needed for performance)
- **Analytics Store**: Consider BigQuery for data warehousing post-MVP

## Core Schema

### Anonymous Sessions

```sql
CREATE TABLE anonymous_sessions (
    session_id UUID PRIMARY KEY,
    device_fingerprint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);
```

### Users (For Premium Features - Future)

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### FaceAnalyses

```sql
CREATE TABLE face_analyses (
    analysis_id UUID PRIMARY KEY,
    session_id UUID REFERENCES anonymous_sessions(session_id),
    user_id UUID REFERENCES users(user_id) NULL,
    photo_key VARCHAR(255),
    face_shape VARCHAR(50),
    confidence_score DECIMAL(5,2),
    share_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
```

### HaircutStyles

```sql
CREATE TABLE haircut_styles (
    style_id UUID PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    suitable_face_shapes TEXT[],
    suitable_hair_types TEXT[],
    suitable_genders TEXT[],
    length_category VARCHAR(20),
    maintenance_level INTEGER,
    image_url VARCHAR(255),
    style_attributes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Recommendations

```sql
CREATE TABLE recommendations (
    recommendation_id UUID PRIMARY KEY,
    analysis_id UUID REFERENCES face_analyses(analysis_id),
    user_id UUID REFERENCES users(user_id),
    style_id UUID REFERENCES haircut_styles(style_id),
    relevance_score DECIMAL(5,2),
    position INTEGER,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SavedRecommendations

```sql
CREATE TABLE saved_recommendations (
    saved_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    recommendation_id UUID REFERENCES recommendations(recommendation_id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subscriptions

```sql
CREATE TABLE subscriptions (
    subscription_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    plan_id VARCHAR(50),
    status VARCHAR(20),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    renewal_date TIMESTAMP,
    payment_provider VARCHAR(50),
    payment_reference VARCHAR(255),
    amount DECIMAL(10,2),
    currency VARCHAR(3)
);
```

### UserActivity

```sql
CREATE TABLE user_activity (
    activity_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    activity_type VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);
```

## Indexes

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Session management
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Face analyses by user
CREATE INDEX idx_face_analyses_user_id ON face_analyses(user_id);

-- Finding suitable hairstyles
CREATE INDEX idx_haircut_styles_face_shapes ON haircut_styles USING GIN(suitable_face_shapes);
CREATE INDEX idx_haircut_styles_hair_types ON haircut_styles USING GIN(suitable_hair_types);
CREATE INDEX idx_haircut_styles_length ON haircut_styles(length_category);

-- Recommendations lookup
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_analysis_id ON recommendations(analysis_id);
CREATE INDEX idx_saved_recommendations_user_id ON saved_recommendations(user_id);

-- Activity tracking
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);
```

## Data Relationships Diagram

```
Users 1───┐
  ▲       │
  │       ├─┬─n FaceAnalyses
  │       │ │
  │       │ ├─┬─n Recommendations
  │       │ │ │
  │       │ │ ├─1 HaircutStyles
  │       │ │ │
1─┼───────┘ │ │
  │         │ │
  │         │ ├─n SavedRecommendations
  │         │
n─┼─────────┘
  │
  ├─n Sessions
  │
  ├─n Subscriptions
  │
  └─n UserActivity
```

## Security Considerations

1. **Data Encryption**: 
   - Encrypt PII (Personally Identifiable Information) at rest
   - Store password hashes only (using bcrypt or Argon2)
   - Use TLS for all data in transit

2. **Photo Storage**:
   - Store photos in a dedicated object storage service
   - Generate signed, time-limited URLs for access
   - Implement strict access controls

3. **Privacy**:
   - Implement automatic photo deletion after analysis (configurable)
   - Provide export and deletion tools for GDPR compliance
   - Clear data retention policies

## Scaling Considerations

1. **Read/Write Splitting**:
   - Primary database for writes
   - Read replicas for heavy read operations

2. **Sharding Strategy**:
   - Shard by user_id for user-related tables
   - Consider geolocation-based sharding for global scale

3. **Caching Layer**:
   - Cache frequent queries like hairstyle recommendations
   - Cache user session data
   - Implement proper cache invalidation strategies

## Migration Strategy

1. **Initial Schema**: Deploy core tables (Users, FaceAnalyses, HaircutStyles, Recommendations)
2. **Expansion Phase**: Add analytics and social features tables
3. **Optimization Phase**: Add additional indexes based on query patterns

## Data Seed Requirements

1. **HaircutStyles**:
   - Minimum 100 initial styles covering all face shapes
   - Each style needs:
     - High-quality reference image
     - Detailed description
     - Suitable face shape mappings
     - Length and maintenance metadata

2. **Test Users**:
   - Create test accounts with varying characteristics
   - Seed sample analyses for testing

## Backup and Recovery

1. **Backup Schedule**:
   - Full database backup daily
   - Point-in-time recovery with transaction logs
   - Retain backups for 30 days minimum

2. **Disaster Recovery**:
   - Multi-region replication for critical data
   - Regular recovery testing procedures

## Monitoring and Maintenance

1. **Performance Metrics**:
   - Track query performance
   - Monitor index usage
   - Set up alerts for slow queries

2. **Growth Planning**:
   - Project storage needs based on user acquisition
   - Plan for schema evolution with minimal downtime