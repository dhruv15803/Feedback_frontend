import { API_URL } from "@/App";
import { Form } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useMyForms = () => {
    const [forms, setForms] = useState<Form[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchForms = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<Form[]>(`${API_URL}/form/my-forms`, {
            withCredentials: true, // Ensure cookies are included in the request
          });
          setForms(response.data);
        } catch (err: any) {
          setError(
            err.response?.data?.message || "Failed to fetch forms. Please try again."
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchForms();
    }, []);
  
    return { forms, loading, error };
  };