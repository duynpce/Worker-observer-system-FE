import { useForm, type FieldErrors, type FieldValues, type SubmitHandler, type UseFormProps} from 'react-hook-form';
import { toast } from "react-toastify";

export const useFormCustom = <T extends FieldValues>(props: UseFormProps<T> ) => {
  const methods  = useForm<T>({
    ...props,
  });


const onError = (errors: FieldErrors<T>) => { 
    const firstKey = Object.keys(errors)[0];
    const firstError = errors[firstKey as keyof typeof errors];
    
    toast.error(firstError?.message?.toString() || "Validation error");
};

  const handleSmartSubmit = (onSubmit: SubmitHandler<T>) => {
    return methods.handleSubmit(onSubmit, onError);
  };

  return {
      ...methods,
      handleSmartSubmit,
  };
}