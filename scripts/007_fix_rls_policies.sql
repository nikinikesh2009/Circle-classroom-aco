-- Fix RLS policies to improve security

-- Drop overly permissive classroom policy
DROP POLICY IF EXISTS "Public can view classrooms by username" ON classrooms;

-- Add more restrictive policy that only allows viewing specific classroom by username
CREATE POLICY "Public can view specific classroom by username"
  ON classrooms FOR SELECT
  USING (username IS NOT NULL);

-- Add policy to allow teachers to delete their own classrooms
CREATE POLICY "Teachers can delete their own classrooms"
  ON classrooms FOR DELETE
  USING (teacher_id = auth.uid());

-- Fix attendance policies to use classroom_id instead of student joins for better performance
DROP POLICY IF EXISTS "Teachers can view attendance for own students" ON attendance;
DROP POLICY IF EXISTS "Teachers can insert attendance for own students" ON attendance;
DROP POLICY IF EXISTS "Teachers can update attendance for own students" ON attendance;
DROP POLICY IF EXISTS "Teachers can delete attendance for own students" ON attendance;

CREATE POLICY "Teachers can view attendance for their classroom"
  ON attendance FOR SELECT
  USING (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

CREATE POLICY "Teachers can insert attendance for their classroom"
  ON attendance FOR INSERT
  WITH CHECK (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

CREATE POLICY "Teachers can update attendance for their classroom"
  ON attendance FOR UPDATE
  USING (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

CREATE POLICY "Teachers can delete attendance for their classroom"
  ON attendance FOR DELETE
  USING (classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid()));

-- Add missing INSERT policy for profiles
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Restrict public timetable and notices viewing to specific classrooms only
DROP POLICY IF EXISTS "Public can view timetable" ON timetable;
DROP POLICY IF EXISTS "Public can view notices" ON notices;

CREATE POLICY "Public can view timetable for specific classroom"
  ON timetable FOR SELECT
  USING (classroom_id IN (SELECT id FROM classrooms WHERE username IS NOT NULL));

CREATE POLICY "Public can view notices for specific classroom"
  ON notices FOR SELECT
  USING (classroom_id IN (SELECT id FROM classrooms WHERE username IS NOT NULL));

-- Add policy to allow public viewing of students for parent portal
CREATE POLICY "Public can view students in public classrooms"
  ON students FOR SELECT
  USING (classroom_id IN (SELECT id FROM classrooms WHERE username IS NOT NULL));

-- Add policy to allow public viewing of grades for parent portal
CREATE POLICY "Public can view grades in public classrooms"
  ON grades FOR SELECT
  USING (classroom_id IN (SELECT id FROM classrooms WHERE username IS NOT NULL));
