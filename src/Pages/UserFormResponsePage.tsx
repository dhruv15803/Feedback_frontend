import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { FormResponse } from '@/types'
import { API_URL } from '@/App'

const UserFormResponsesPage: React.FC = () => {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const { data } = await axios.get<FormResponse[]>(`${API_URL}/form-responses`, {
          withCredentials: true
        })
        setResponses(data)
      } catch (err) {
        setError('Failed to fetch form responses. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResponses()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No Form Responses</CardTitle>
            <CardDescription>You haven't submitted any form responses yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Form Responses</CardTitle>
          <CardDescription>View all the forms you've responded to</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Response ID</TableHead>
                <TableHead>Form Title</TableHead>
                <TableHead>Form Description</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>{response.id}</TableCell>
                  <TableCell>{response.form?.form_title || 'N/A'}</TableCell>
                  <TableCell>
                    {response.form?.form_description.length! > 50
                      ? `${response.form?.form_description.substring(0, 50)}...`
                      : response.form?.form_description || 'N/A'}
                  </TableCell>
                  <TableCell>{new Date(response.submitted_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link to={`/form-responses/${response.form_id}/${response.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserFormResponsesPage

