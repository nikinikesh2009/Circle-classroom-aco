"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Download } from "lucide-react"
import QRCodeStyling from "qr-code-styling"

interface Student {
  id: string
  first_name: string
  last_name: string
  student_id: string
}

export function QRCodesTab({ students, userId }: { students: Student[]; userId: string }) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const generateQRCode = (student: Student) => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: JSON.stringify({
        student_id: student.student_id,
        name: `${student.first_name} ${student.last_name}`,
        id: student.id,
      }),
      dotsOptions: {
        color: "#7c3aed",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,
      },
    })

    setSelectedStudent(student)

    setTimeout(() => {
      const container = document.getElementById("qr-code-container")
      if (container) {
        container.innerHTML = ""
        qrCode.append(container)
      }
    }, 100)
  }

  const downloadQRCode = () => {
    if (!selectedStudent) return

    const qrCode = new QRCodeStyling({
      width: 600,
      height: 600,
      data: JSON.stringify({
        student_id: selectedStudent.student_id,
        name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
        id: selectedStudent.id,
      }),
      dotsOptions: {
        color: "#7c3aed",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    })

    qrCode.download({
      name: `${selectedStudent.student_id}_qr_code`,
      extension: "png",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">QR Code Generator</h3>
        <p className="text-sm text-muted-foreground">Generate QR codes for student IDs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Student</CardTitle>
            <CardDescription>Choose a student to generate their QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {students.map((student) => (
                <Button
                  key={student.id}
                  variant={selectedStudent?.id === student.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => generateQRCode(student)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {student.first_name} {student.last_name} - {student.student_id}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated QR Code</CardTitle>
            <CardDescription>
              {selectedStudent
                ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
                : "Select a student to generate QR code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStudent ? (
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-lg border">
                  <div id="qr-code-container"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Student ID:</span> {selectedStudent.student_id}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Name:</span> {selectedStudent.first_name} {selectedStudent.last_name}
                  </div>
                </div>
                <Button onClick={downloadQRCode} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <QrCode className="w-16 h-16 mb-4" />
                <p>No student selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
