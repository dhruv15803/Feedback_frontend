import React from 'react'
import { useParams } from 'react-router-dom';
import { useResponseFields } from '@/hooks/useResponseFields';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from 'lucide-react'

const FormResponseDetailPage: React.FC = () => {
  const { responseId } = useParams<{ formId: string, responseId: string }>();
  const { responseFields, loading, error } = useResponseFields(Number(responseId));

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

  if (!responseFields || responseFields.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No Response Data</CardTitle>
            <CardDescription>There is no data available for this response.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Form Response Details</CardTitle>
          <CardDescription>Viewing response ID: {responseId}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responseFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.form_field.field_title}</TableCell>
                  <TableCell>{field.field_value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormResponseDetailPage

