import React, { useCallback, useState, DragEvent, useRef } from 'react';
import { toast } from 'react-toastify';
import type { UploadResponse } from '../../types/transaction';

interface UploadProgress {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
}

interface PDFUploadProps {
  accountId: string;
  onUploadSuccess: () => void;
  maxFileSize?: number; // in bytes, default 10MB
  maxFiles?: number; // default 5
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ 
  onUploadSuccess, 
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  accountId
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<Record<string, UploadProgress>>({});
  const xhrRefs = useRef<Record<string, XMLHttpRequest>>({});

  // File validation
  const validateFile = (file: File): string | null => {
    if (!file.type.includes('pdf')) {
      return 'Only PDF files are allowed';
    }
    if (file.size > maxFileSize) {
      return `File size must be less than ${maxFileSize / (1024 * 1024)}MB`;
    }
    return null;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else if (selectedFiles.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
      } else {
        validFiles.push(file);
        setProgress(prev => ({
          ...prev,
          [file.name]: {
            status: 'idle',
            progress: 0,
            message: ''
          }
        }));
      }
    });

    if (errors.length > 0) {
      toast.error(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  }, [selectedFiles.length, maxFiles]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountId', accountId);

    console.log('Uploading file:', {
      fileName: file.name,
      fileSize: file.size,
      accountId: accountId
    });

    try {
      setProgress(prev => ({
        ...prev,
        [file.name]: { status: 'processing', progress: 0, message: 'Starting upload...' }
      }));

      const response = await fetch('/api/statements/upload', {
        method: 'POST',
        body: formData
      });

      console.log('Upload response:', {
        status: response.status,
        statusText: response.statusText
      });

      const data = await response.json();
      console.log('Upload response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(prev => ({
        ...prev,
        [file.name]: { status: 'complete', progress: 100, message: 'Upload complete' }
      }));

      toast.success(`Successfully uploaded ${file.name}`);
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      setProgress(prev => ({
        ...prev,
        [file.name]: { 
          status: 'error', 
          progress: 0, 
          message: error instanceof Error ? error.message : 'Upload failed'
        }
      }));
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
    }
  };

  const handleUpload = useCallback(async () => {
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        try {
          await uploadFile(file);
        } catch (error) {
          setProgress(prev => ({
            ...prev,
            [file.name]: {
              status: 'error',
              progress: 0,
              message: error instanceof Error ? error.message : 'Upload failed'
            }
          }));
          throw error;
        }
      });

      await Promise.all(uploadPromises);
      onUploadSuccess();
      toast.success('All files uploaded successfully');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Some files failed to upload');
    }
  }, [selectedFiles, uploadFile, onUploadSuccess, accountId]);

  const cancelUpload = useCallback((fileName: string) => {
    const xhr = xhrRefs.current[fileName];
    if (xhr) {
      xhr.abort();
      delete xhrRefs.current[fileName];
      setProgress(prev => ({
        ...prev,
        [fileName]: {
          status: 'error',
          progress: 0,
          message: 'Upload cancelled'
        }
      }));
      setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    }
  }, []);

  const removeFile = useCallback((fileName: string) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles([files[0]]);
    }
  };

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles([files[0]]);
    }
  }, [handleFiles]);

  return (
    <div className="px-4 dark:bg-dark-800">
      {!accountId && (
        <div className="text-sm text-amber-600 dark:text-amber-400 mb-4">
          Please select an account to upload statements
        </div>
      )}
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Upload Bank Statements
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          PDF files up to {maxFileSize / (1024 * 1024)}MB supported (max {maxFiles} files)
        </p>
      </div>

      {/* File Drop Zone */}
      <div 
        className={`
          mx-auto max-w-sm rounded-lg border bg-white dark:bg-dark-700 p-6
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-dark-600'}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer block text-center"
        >
          <div className="mx-auto w-10 h-10 mb-3">
            <svg 
              className="text-gray-400 dark:text-gray-500 w-full h-full" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Drag and drop your PDF here, or <span className="text-blue-500 dark:text-blue-400">choose file</span>
            </p>
          </div>
        </label>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map(file => (
            <div key={file.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                {progress[file.name] && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress[file.name].progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {progress[file.name].message}
                    </p>
                  </div>
                )}
              </div>
              <div className="ml-4 flex space-x-2">
                {progress[file.name]?.status === 'processing' ? (
                  <button
                    onClick={() => cancelUpload(file.name)}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={selectedFiles.some(file => progress[file.name]?.status === 'processing')}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent 
                     shadow-sm text-sm font-medium rounded-md text-white 
                     bg-blue-600 dark:bg-blue-500 
                     hover:bg-blue-700 dark:hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     dark:focus:ring-offset-dark-800
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 
                     disabled:cursor-not-allowed"
          >
            {selectedFiles.length > 1 ? 'Upload All Files' : 'Upload File'}
          </button>
        </div>
      )}
    </div>
  );
};