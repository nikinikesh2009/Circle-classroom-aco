-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'teacher',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table with comprehensive fields
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  grade_level TEXT,
  photo_url TEXT,
  
  -- Emergency Contact Information
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_email TEXT,
  secondary_contact_name TEXT,
  secondary_contact_phone TEXT,
  
  -- Medical Information
  blood_type TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  medications TEXT,
  doctor_name TEXT,
  doctor_phone TEXT,
  
  -- Additional Information
  address TEXT,
  parent_guardian_name TEXT,
  parent_guardian_phone TEXT,
  parent_guardian_email TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  qr_data TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Teachers can view own students" ON students
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own students" ON students
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own students" ON students
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own students" ON students
  FOR DELETE USING (auth.uid() = teacher_id);

-- Attendance policies
CREATE POLICY "Teachers can view attendance for own students" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = attendance.student_id 
      AND students.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert attendance for own students" ON attendance
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = attendance.student_id 
      AND students.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update attendance for own students" ON attendance
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = attendance.student_id 
      AND students.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete attendance for own students" ON attendance
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = attendance.student_id 
      AND students.teacher_id = auth.uid()
    )
  );

-- QR Codes policies
CREATE POLICY "Teachers can view QR codes for own students" ON qr_codes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = qr_codes.student_id 
      AND students.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert QR codes for own students" ON qr_codes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = qr_codes.student_id 
      AND students.teacher_id = auth.uid()
    )
  );
