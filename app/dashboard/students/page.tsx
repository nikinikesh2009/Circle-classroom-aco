import { StudentsRoster } from "@/components/students-roster"

// Mock student data
const mockStudents = [
  {
    id: "1",
    first_name: "Emma",
    last_name: "Johnson",
    date_of_birth: "2015-03-15",
    parent_name: "Sarah Johnson",
    parent_email: "sarah.j@email.com",
    parent_phone: "(555) 123-4567",
    photo_url: null,
    classroom_id: "mock-classroom",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    first_name: "Liam",
    last_name: "Smith",
    date_of_birth: "2015-07-22",
    parent_name: "Michael Smith",
    parent_email: "m.smith@email.com",
    parent_phone: "(555) 234-5678",
    photo_url: null,
    classroom_id: "mock-classroom",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    first_name: "Olivia",
    last_name: "Williams",
    date_of_birth: "2015-11-08",
    parent_name: "Jennifer Williams",
    parent_email: "jen.w@email.com",
    parent_phone: "(555) 345-6789",
    photo_url: null,
    classroom_id: "mock-classroom",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    first_name: "Noah",
    last_name: "Brown",
    date_of_birth: "2015-05-30",
    parent_name: "David Brown",
    parent_email: "d.brown@email.com",
    parent_phone: "(555) 456-7890",
    photo_url: null,
    classroom_id: "mock-classroom",
    created_at: new Date().toISOString(),
  },
]

export default async function StudentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <StudentsRoster students={mockStudents} classroomId="mock-classroom" />
    </div>
  )
}
