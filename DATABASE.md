# Cấu trúc Database - Ứng dụng Fitness & Nutrition

## 1. Bảng Users
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  gender ENUM('male', 'female'),
  birth_date DATE,
  height FLOAT, -- cm
  weight FLOAT, -- kg
  goal_weight FLOAT, -- kg
  goal_type ENUM('lose_weight', 'gain_muscle', 'maintain', 'improve_health'),
  daily_calorie_goal INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

## 2. Bảng User_Profiles
```sql
CREATE TABLE user_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  profile_picture_url VARCHAR(255),
  bio TEXT,
  fitness_level ENUM('beginner', 'intermediate', 'advanced'),
  activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active'),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 3. Bảng Workouts
```sql
CREATE TABLE workouts (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INT, -- phút
  difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
  muscle_group ENUM('chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body'),
  image_url VARCHAR(255),
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 4. Bảng Exercises
```sql
CREATE TABLE exercises (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  muscle_group ENUM('chest', 'back', 'legs', 'shoulders', 'arms', 'core'),
  equipment_needed VARCHAR(100),
  image_url VARCHAR(255),
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 5. Bảng Workout_Exercises
```sql
CREATE TABLE workout_exercises (
  id VARCHAR(36) PRIMARY KEY,
  workout_id VARCHAR(36) NOT NULL,
  exercise_id VARCHAR(36) NOT NULL,
  sets INT NOT NULL,
  reps INT NOT NULL,
  rest_time INT, -- giây
  order_index INT NOT NULL,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);
```

## 6. Bảng User_Workouts
```sql
CREATE TABLE user_workouts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  workout_id VARCHAR(36) NOT NULL,
  completed_at TIMESTAMP,
  duration INT, -- phút
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);
```

## 7. Bảng Foods
```sql
CREATE TABLE foods (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  calories INT NOT NULL,
  protein FLOAT, -- gram
  carbs FLOAT, -- gram
  fat FLOAT, -- gram
  serving_size VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 8. Bảng User_Meals
```sql
CREATE TABLE user_meals (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack'),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 9. Bảng Meal_Foods
```sql
CREATE TABLE meal_foods (
  id VARCHAR(36) PRIMARY KEY,
  meal_id VARCHAR(36) NOT NULL,
  food_id VARCHAR(36) NOT NULL,
  quantity FLOAT NOT NULL,
  FOREIGN KEY (meal_id) REFERENCES user_meals(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);
```

## 10. Bảng Weight_Records
```sql
CREATE TABLE weight_records (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  weight FLOAT NOT NULL, -- kg
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 11. Bảng Password_Resets
```sql
CREATE TABLE password_resets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Mô tả các bảng chính:

1. **Users**: Lưu thông tin cơ bản của người dùng
   - Thông tin đăng nhập (email, password)
   - Thông tin cá nhân (tên, giới tính, ngày sinh)
   - Thông tin thể chất (chiều cao, cân nặng)
   - Mục tiêu (cân nặng mục tiêu, loại mục tiêu)
   - Thông tin hoạt động (lần đăng nhập cuối, trạng thái)

2. **User_Profiles**: Lưu thông tin bổ sung của người dùng
   - Ảnh đại diện
   - Mô tả bản thân
   - Trình độ tập luyện
   - Mức độ hoạt động

3. **Workouts**: Lưu thông tin các bài tập tổng hợp
   - Tên, mô tả
   - Thời lượng
   - Độ khó
   - Nhóm cơ
   - Hình ảnh, video

4. **Exercises**: Lưu thông tin các bài tập đơn lẻ
   - Tên, mô tả
   - Nhóm cơ
   - Dụng cụ cần thiết
   - Hình ảnh, video

5. **Workout_Exercises**: Liên kết bài tập với bài tập tổng hợp
   - Số hiệp
   - Số lần lặp
   - Thời gian nghỉ
   - Thứ tự thực hiện

6. **User_Workouts**: Lưu lịch sử tập luyện của người dùng
   - Thời gian hoàn thành
   - Thời lượng
   - Ghi chú

7. **Foods**: Lưu thông tin thực phẩm
   - Tên, mô tả
   - Thông tin dinh dưỡng (calo, protein, carbs, fat)
   - Khẩu phần
   - Hình ảnh

8. **User_Meals**: Lưu thông tin bữa ăn của người dùng
   - Loại bữa ăn
   - Ngày
   - Ghi chú

9. **Meal_Foods**: Liên kết thực phẩm với bữa ăn
   - Số lượng

10. **Weight_Records**: Lưu lịch sử cân nặng
    - Cân nặng
    - Ngày
    - Ghi chú

11. **Password_Resets**: Lưu thông tin đặt lại mật khẩu
    - Token
    - Thời hạn
    - Trạng thái sử dụng 