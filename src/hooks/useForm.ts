import { API_URL } from "@/App";
import { Form } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useForm = (formId: number) => {

    const [form, setForm] = useState<Form | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchForm = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<Form>(`${API_URL}/form/${formId}`,
            {
              withCredentials: true, // Include cookies if needed
            }
          );
          setForm(response.data);
        } catch (err: any) {
          setError(
            err.response?.data?.message || "Failed to fetch form. Please try again."
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchForm();
    }, [formId]);
  
    return { form, loading, error };
  };