import { useState } from 'react';

export function useForm<T>(initialState: T) {
  const [formData, setFormData] = useState(initialState);

  const setFormField = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => setFormData(initialState);

  return { formData, setFormField, resetForm };
}
