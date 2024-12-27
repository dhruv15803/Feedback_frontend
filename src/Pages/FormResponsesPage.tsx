import { Link, useParams } from 'react-router-dom';
import { useFormResponses } from '@/hooks/useFormResponses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from 'lucide-react';
import { FormResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { useForm } from '@/hooks/useForm';

const FormResponsesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { form, loading: isFormLoading, error: formError } = useForm(Number(id));
  const { responses, loading, error } = useFormResponses(Number(id));

  // Handle loading state
  if (isFormLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handle error state
  if (formError || error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formError || error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle no responses state
  if (!responses || responses.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No Responses</CardTitle>
            <CardDescription>There are no responses for this form yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{form?.form_title}</CardTitle>
          <CardDescription>{form?.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Response ID</TableHead>
                <TableHead>Respondent</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response: FormResponse) => (
                <TableRow key={response.id}>
                  <TableCell>{response.id}</TableCell>
                  <TableCell>{response.respondent?.username}</TableCell>
                  <TableCell>{response.respondent?.email}</TableCell>
                  <TableCell>{new Date(response.submitted_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link to={`/form-responses/${id}/${response.id}`}>
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
  );
};

export default FormResponsesPage;
