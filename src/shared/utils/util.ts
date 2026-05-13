import React from 'react';
import type { UniqueDetailObj } from '../types/unique-detail.type';

export const handleChange = <T extends Record<string, unknown>>(
  setState: React.Dispatch<React.SetStateAction<T>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setState(prev => ({
        ...prev,
        [name]: value
      }));
};

export const handleChangeValueForUniqueDetails = <T extends Record<string, UniqueDetailObj>>(
  setUniqueDetails: React.Dispatch<React.SetStateAction<T>>,
  name: string,
  value: string,
) => {
  setUniqueDetails(prev => ({
    ...prev,
    [name]: {
      ...prev[name],
      value,
    }
  }));
};

export const handleChangeExistsForUniqueDetails = <T extends Record<string, UniqueDetailObj>>(
  setUniqueDetails: React.Dispatch<React.SetStateAction<T>>,
  name: string,
  exists: boolean | undefined,
) => {
  setUniqueDetails(prev => ({
    ...prev,
    [name]: {
      ...prev[name],
      exists,
    }
  }));
};

export const trimObjectValues = <T extends Record<string, unknown>>(obj : T): T => {
  const trimmed = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  ) as T;

  return trimmed;
};

export const getDataFromForm = <T>(formData: FormData): T => {
  const entries = Object.fromEntries(formData.entries()) as Record<string, FormDataEntryValue>;

  return entries as unknown as T;
};

export const getTrimmedDataFromForm = <T extends Record<string, unknown>>(formData: FormData): T => {
  const data = getDataFromForm<Record<string, unknown>>(formData);
  return trimObjectValues<T>(data as T);
};

export const getAlertConfig = (searchParams: URLSearchParams):string => {
    const params = Array.from(searchParams.entries()); 
    
    if (params.length > 0) {
        const [type, value] = params[0]; 
        return `${type}: ${value}`;
    }
    
    return "";
};  

