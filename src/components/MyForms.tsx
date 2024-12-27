import { useMyForms } from '@/hooks/useMyForms'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'

const MyForms = () => {
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const { forms, loading, error } = useMyForms()

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Forms</h1>
        <Button asChild>
          <Link to="/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
          </Link>
        </Button>
      </div>
      {forms && forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{form.form_title}</CardTitle>
                <CardDescription>{form.form_description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Created: {new Date(form.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2 mt-auto">
                <Button asChild className="w-full">
                  <Link to={`/form/${form.id}`}>View Form</Link>
                </Button>
                {form.user_id==loggedInUser?.id && <Button asChild variant="outline" className="w-full">
                  <Link to={`/form-responses/${form.id}`}>View Responses</Link>
                </Button>}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-lg mb-4">You haven't created any forms yet.</p>
            <Button asChild>
              <Link to="/create-form">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Form
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MyForms
