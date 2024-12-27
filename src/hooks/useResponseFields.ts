import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/App';
import { ResponseField } from '@/types';

// Define types for the data structure

export const useResponseFields = (formResponseId: number) => {
  const [responseFields, setResponseFields] = useState<ResponseField[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponseFields = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await axios.get<ResponseField[]>(`${API_URL}/form-responses/response-fields/${formResponseId}`,{
            withCredentials:true
        });

        setResponseFields(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch response fields.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponseFields();
  }, [formResponseId]);

  return { responseFields, loading, error };
};
