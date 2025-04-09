-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE goal_type_enum AS ENUM ('lose_weight', 'gain_muscle', 'maintain', 'improve_health');
CREATE TYPE fitness_level_enum AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE activity_level_enum AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE difficulty_enum AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE muscle_group_enum AS ENUM ('chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body');
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- =========================
-- TABLES
-- =========================

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  gender gender_type,
  birth_date DATE,
  height FLOAT,
  weight FLOAT,
  goal_weight FLOAT,
  goal_type goal_type_enum,
  daily_calorie_goal INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_picture_url VARCHAR(255),
  bio TEXT,
  fitness_level fitness_level_enum,
  activity_level activity_level_enum,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workouts (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INT,
  difficulty_level difficulty_enum,
  muscle_group muscle_group_enum,
  image_url VARCHAR(255),
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  muscle_group muscle_group_enum,
  equipment_needed VARCHAR(100),
  image_url VARCHAR(255),
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY,
  workout_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  sets INT NOT NULL,
  reps INT NOT NULL,
  rest_time INT,
  order_index INT NOT NULL,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE user_workouts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  workout_id UUID NOT NULL,
  completed_at TIMESTAMP,
  duration INT,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

CREATE TABLE foods (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  calories INT NOT NULL,
  protein FLOAT,
  carbs FLOAT,
  fat FLOAT,
  serving_size VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_meals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_type meal_type_enum,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE meal_foods (
  id UUID PRIMARY KEY,
  meal_id UUID NOT NULL,
  food_id UUID NOT NULL,
  quantity FLOAT NOT NULL,
  FOREIGN KEY (meal_id) REFERENCES user_meals(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

CREATE TABLE weight_records (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  weight FLOAT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_resets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
