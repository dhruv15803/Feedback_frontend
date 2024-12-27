import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { CreateFormRequest, CreateFieldRequest, FormField, Form } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CreateFormPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState<CreateFormRequest>({
    form_title: "",
    form_description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<
    (Omit<FormField, "id" | "form_id"> & { error?: string })[]
  >([]);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddField = () => {
    setFields([...fields, { field_title: "", required: false }]);
  };

  const handleFieldChange = (
    index: number,
    key: keyof FormField,
    value: any
  ) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value, error: undefined };
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setFormError(null);
    setFields(fields.map((field) => ({ ...field, error: undefined })));

    try {
      const response = await axios.post<Form>(`${API_URL}/form`, formData, {
        withCredentials: true,
      });
      const formId = response.data.id;

      const fieldRequests: CreateFieldRequest[] = fields.map((field) => ({
        field_title: field.field_title,
        required: field.required,
        form_id: formId,
      }));

      const formFieldsPromises = fieldRequests.map(async (fieldRequest, index) => {
        try {
          const response = await axios.post(`${API_URL}/form/fields`, fieldRequest, {
            withCredentials: true,
          });
          return response.data;
        } catch (error) {
          console.error(`Error creating field ${index + 1}:`, error);
          return { error: `Failed to create field "${fieldRequest.field_title}"`, index };
        }
      });

      const formFields = await Promise.all(formFieldsPromises);

      const failedFields = formFields.filter(
        (field): field is { error: string; index: number } => "error" in field
      );

      if (failedFields.length > 0) {
        const updatedFields = [...fields];
        failedFields.forEach(({ error, index }) => {
          updatedFields[index].error = error;
        });
        setFields(updatedFields);
        toast({
          title: "Some fields failed to create",
          description: "Please check the error messages and try again.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Form created successfully!" });
        navigate("/"); // Navigate to home page
      }
    } catch (error) {
      console.error("Error creating form:", error);
      setFormError("Failed to create form. Please try again.");
      toast({
        title: "Failed to create form",
        description: "An error occurred while creating the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="p-4">
          <h1 className="text-xl font-bold text-center">Create a Form</h1>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="form_title">Form Title</Label>
              <Input
                id="form_title"
                type="text"
                value={formData.form_title}
                onChange={(e) =>
                  setFormData({ ...formData, form_title: e.target.value })
                }
                placeholder="Enter form title"
              />
            </div>
            <div>
              <Label htmlFor="form_description">Form Description</Label>
              <Textarea
                id="form_description"
                value={formData.form_description}
                onChange={(e) =>
                  setFormData({ ...formData, form_description: e.target.value })
                }
                placeholder="Enter form description"
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-medium">Fields</h2>
            {fields.map((field, index) => (
              <div key={index} className="mt-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    placeholder="Field Title"
                    value={field.field_title}
                    onChange={(e) =>
                      handleFieldChange(index, "field_title", e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      id={`required_${index}`}
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        handleFieldChange(index, "required", e.target.checked)
                      }
                    />
                    <Label htmlFor={`required_${index}`}>Required</Label>
                  </div>
                </div>
                {field.error && (
                  <p className="text-sm text-red-500 mt-1">{field.error}</p>
                )}
              </div>
            ))}
            <Button className="mt-4" variant="outline" onClick={handleAddField}>
              Add Field
            </Button>
          </div>

          <Button
            className="mt-8 w-full"
            variant="default"
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Creating Form..." : "Create Form"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFormPage;
