-- Add tables for advanced features

-- Classrooms table with unique username for public access
CREATE TABLE IF NOT EXISTS classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL, -- unique username for public portal
  grade_level TEXT,
  academic_year TEXT,
  grading_system JSONB DEFAULT '{"A": 90, "B": 80, "C": 70, "D": 60, "F": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update students table to add login credentials
ALTER TABLE students ADD COLUMN IF NOT EXISTS login_id TEXT UNIQUE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE;

-- Assignments/Exams table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  total_marks INTEGER NOT NULL,
  pass_marks INTEGER NOT NULL,
  exam_date DATE,
  grading_scale JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  marks_obtained INTEGER,
  grade TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, assignment_id)
);

-- Timetable table
CREATE TABLE IF NOT EXISTS timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT,
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  published_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classrooms
CREATE POLICY "Teachers can view their own classrooms"
  ON classrooms FOR SELECT
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can insert their own classrooms"
  ON classrooms FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their own classrooms"
  ON classrooms FOR UPDATE
  USING (teacher_id = auth.uid());

CREATE POLICY "Public can view classrooms by username"
  ON classrooms FOR SELECT
  USING (true);

-- RLS Policies for assignments
CREATE POLICY "Teachers can manage assignments in their classroom"
  ON assignments FOR ALL
  USING (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

-- RLS Policies for grades
CREATE POLICY "Teachers can manage grades in their classroom"
  ON grades FOR ALL
  USING (assignment_id IN (
    SELECT a.id FROM assignments a
    JOIN classrooms c ON a.classroom_id = c.id
    WHERE c.teacher_id = auth.uid()
  ));

-- RLS Policies for timetable
CREATE POLICY "Teachers can manage their timetable"
  ON timetable FOR ALL
  USING (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

CREATE POLICY "Public can view timetable"
  ON timetable FOR SELECT
  USING (true);

-- RLS Policies for notices
CREATE POLICY "Teachers can manage their notices"
  ON notices FOR ALL
  USING (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

CREATE POLICY "Public can view notices"
  ON notices FOR SELECT
  USING (true);

-- Update students RLS to include classroom access
DROP POLICY IF EXISTS "Teachers can view their students" ON students;
CREATE POLICY "Teachers can view their students"
  ON students FOR SELECT
  USING (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

-- Function to generate unique login ID
CREATE OR REPLACE FUNCTION generate_login_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'STU' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM students WHERE login_id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate login_id for new students
CREATE OR REPLACE FUNCTION set_student_login_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.login_id IS NULL THEN
    NEW.login_id := generate_login_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER student_login_id_trigger
  BEFORE INSERT ON students
  FOR EACH ROW
  EXECUTE FUNCTION set_student_login_id();
