// Database types for better type safety across the application

export interface Classroom {
  id: string
  name: string
  grade_level: string
  academic_year: string
  teacher_id: string
  username: string
  teacher_name: string
  teacher_email: string | null
  teacher_phone: string | null
  created_at: string
}

export interface Student {
  id: string
  student_id: string
  login_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string | null
  parent_guardian_name: string
  parent_guardian_email: string | null
  parent_guardian_phone: string
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_conditions: string | null
  address: string | null
  photo_url: string | null
  classroom_id: string
  teacher_id: string
  created_at: string
}

export interface Assignment {
  id: string
  title: string
  subject: string
  total_marks: number
  pass_marks: number
  exam_date: string
  classroom_id: string
  grading_scale: GradeScale[]
  created_at: string
}

export interface GradeScale {
  grade: string
  min_percentage: number
  max_percentage: number
}

export interface Grade {
  id: string
  classroom_id: string
  assignment_id: string
  student_id: string
  student_name: string
  marks_obtained: number
  percentage: number
  created_at: string
}

export interface Attendance {
  id: string
  classroom_id: string
  student_id: string
  date: string
  status: "present" | "absent"
  created_at: string
}

export interface Notice {
  id: string
  classroom_id: string
  title: string
  content: string
  date: string
  created_at: string
}

export interface TimetableEntry {
  id: string
  classroom_id: string
  day_of_week: string
  start_time: string
  end_time: string
  subject: string
  teacher_name: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  role: "teacher" | "admin" | "student"
  classroom_id: string | null
  school_id: string | null
  stripe_customer_id: string | null
  created_at: string
}

export interface School {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
}

// Form data types
export interface StudentFormData {
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  parent_name: string
  parent_email: string
  parent_phone: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string
  address: string
}

export interface AssignmentFormData {
  title: string
  subject: string
  total_marks: number
  pass_marks: number
  date: string
}

export interface ClassroomFormData {
  classroomName: string
  username: string
  gradeLevel: string
  academicYear: string
  teacherName: string
  teacherEmail: string
  teacherPhone: string
}
