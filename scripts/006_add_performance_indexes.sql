-- Add indexes for frequently queried columns to improve performance

-- Students table indexes
CREATE INDEX IF NOT EXISTS idx_students_classroom_id ON students(classroom_id);
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_login_id ON students(login_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);

-- Classrooms table indexes
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher_id ON classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_username ON classrooms(username);

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_classroom_id ON profiles(classroom_id);

-- Assignments table indexes
CREATE INDEX IF NOT EXISTS idx_assignments_classroom_id ON assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON assignments(created_at DESC);

-- Grades table indexes
CREATE INDEX IF NOT EXISTS idx_grades_classroom_id ON grades(classroom_id);
CREATE INDEX IF NOT EXISTS idx_grades_assignment_id ON grades(assignment_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_composite ON grades(classroom_id, assignment_id);

-- Attendance table indexes
CREATE INDEX IF NOT EXISTS idx_attendance_classroom_id ON attendance(classroom_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_composite ON attendance(classroom_id, date);

-- Notices table indexes
CREATE INDEX IF NOT EXISTS idx_notices_classroom_id ON notices(classroom_id);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);

-- Timetable table indexes
CREATE INDEX IF NOT EXISTS idx_timetable_classroom_id ON timetable(classroom_id);
CREATE INDEX IF NOT EXISTS idx_timetable_day_of_week ON timetable(day_of_week);
CREATE INDEX IF NOT EXISTS idx_timetable_composite ON timetable(classroom_id, day_of_week);

-- Super admin tables indexes
CREATE INDEX IF NOT EXISTS idx_super_admin_classrooms_teacher_id ON super_admin.classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_students_classroom_id ON super_admin.students(classroom_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_students_teacher_id ON super_admin.students(teacher_id);
