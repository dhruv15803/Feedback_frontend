import { API_URL } from "@/App";
import { Form } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useForms = () => {
    const [forms, setForms] = useState<Form[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchForms = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const response = await axios.get<Form[]>(`${API_URL}/form`, {
            withCredentials: true, // Include cookies if needed
          });
          setForms(response.data); // Save the forms data
        } catch (err: any) {
          setError(
            err.response?.data?.message || 'Failed to fetch forms. Please try again.'
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchForms();
    }, []);
  
    return { forms, loading, error };
  };