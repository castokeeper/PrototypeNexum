// Custom hook para manejar carga de archivos

import { useState, useCallback } from 'react';
import { validarArchivo } from '../utils/validators';

export const useFileUpload = (maxSize, allowedTypes) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      setError(null);
      return;
    }

    // Validar archivo
    const validation = validarArchivo(selectedFile, maxSize, allowedTypes);

    if (!validation.valid) {
      setError(validation.error);
      setFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setIsLoading(true);

    // Crear preview
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError('Error al leer el archivo');
      setIsLoading(false);
    };

    reader.readAsDataURL(selectedFile);
  }, [maxSize, allowedTypes]);

  const clearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    file,
    preview,
    error,
    isLoading,
    handleFileChange,
    clearFile
  };
};

