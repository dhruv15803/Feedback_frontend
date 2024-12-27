import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // Import useNavigate
import { useForm as useFormHook } from '@/hooks/useForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { useToast } from "../hooks/use-toast"
import axios from 'axios'
import { API_URL } from '@/App'

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate() // Initialize useNavigate
  const { form, error, loading } = useFormHook(Number(id))
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object(
    form?.form_fields?.reduce((acc, field) => {
      acc[field.field_title] = field.required
        ? z.string().min(1, { message: `${field.field_title} is required` })
        : z.string().optional()
      return acc
    }, {} as Record<string, z.ZodType>) || {}
  )

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: form?.form_fields?.reduce((acc, field) => {
      acc[field.field_title] = ''
      return acc
    }, {} as Record<string, string>) || {},
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    // Prepare the payload for the API request
    const payload = {
      form_id: form?.id,
      response_fields: form?.form_fields?.map((field) => ({
        field_value: values[field.field_title] || '',
        form_field_id: field.id,
      })),
    }

    try {
      const { data } = await axios.post(`${API_URL}/form-responses`, payload, {
        withCredentials: true,
      })

      console.log('Form response created:', data)

      toast({
        title: 'Form Submitted',
        description: 'Your response has been recorded successfully.',
      })

      formMethods.reset() // Reset the form
      navigate('/') // Navigate to the desired page (e.g., homepage)
    } catch (error: any) {
      console.error(error)

      toast({
        title: 'Submission Failed',
        description: error.response?.data?.message || error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Failed to load form"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{form.form_title}</CardTitle>
          <CardDescription>{form.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
              {form.form_fields?.map((field) => (
                <FormField
                  key={field.id}
                  control={formMethods.control}
                  name={field.field_title}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.field_title}</FormLabel>
                      <FormControl>
                        {field.field_title.toLowerCase() === 'description' ? (
                          <Textarea 
                            placeholder={`Enter ${field.field_title.toLowerCase()}`}
                            {...formField}
                          />
                        ) : (
                          <Input
                            type={field.field_title.toLowerCase() === 'age' ? 'number' : 'text'}
                            placeholder={`Enter ${field.field_title.toLowerCase()}`}
                            {...formField}
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        {field.required ? 'This field is required' : 'This field is optional'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormPage
