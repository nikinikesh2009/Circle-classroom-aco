-- Create default classroom for existing teachers
INSERT INTO classrooms (teacher_id, name, username, grade_level, academic_year)
SELECT 
  id,
  'My Classroom',
  'classroom' || SUBSTRING(id::TEXT FROM 1 FOR 8),
  'Grade 1',
  '2024-2025'
FROM profiles
WHERE role = 'teacher'
ON CONFLICT (username) DO NOTHING;

-- Update existing students to link to their teacher's classroom
UPDATE students s
SET classroom_id = (
  SELECT c.id 
  FROM classrooms c 
  WHERE c.teacher_id = s.teacher_id 
  LIMIT 1
)
WHERE classroom_id IS NULL;
