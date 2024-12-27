import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/App';
import { FormResponse } from '@/types';

export const useFormResponses = (formId: number) => {
  const [responses, setResponses] = useState<FormResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId) return;

    const fetchResponses = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<FormResponse[]>(`${API_URL}/form-responses/${formId}`, {
          withCredentials: true,
        });
        setResponses(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  return { responses, loading, error };
};
