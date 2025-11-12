// Custom hook para manejar formularios

import { useState, useCallback } from 'react';

export const useForm = (initialState = {}, validationFunction = null) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en los campos
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando se edita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Manejar blur (cuando el usuario sale del campo)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  // Validar todo el formulario
  const validate = useCallback((archivo = null) => {
    if (validationFunction) {
      const validation = validationFunction(formData, archivo);
      setErrors(validation.errores || {});
      return validation.valido;
    }
    return true;
  }, [formData, validationFunction]);

  // Establecer un campo específico
  const setField = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Establecer múltiples campos
  const setFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields
    }));
  }, []);

  // Establecer error de un campo
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    resetForm,
    validate,
    setField,
    setFields,
    setFieldError,
    setIsSubmitting
  };
};

