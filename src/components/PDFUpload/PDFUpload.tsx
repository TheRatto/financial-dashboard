import React, { useCallback, useState, DragEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../../services/api';
import type { UploadResponse } from '../../types/transaction';

interface UploadProgress {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
}

interface PDFUploadProps {
  onUploadSuccess?: () => void;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  const uploadMutation = useMutation<UploadResponse, Error, File>({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      console.log('Upload successful:', data);
      setProgress({
        status: 'complete',
        progress: 100,
        message: data.message || 'Upload complete!'
      });
      setSelectedFile(null);
      onUploadSuccess?.();
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      setProgress({
        status: 'error',
        progress: 0,
        message: error.message || 'Upload failed. Please try again.'
      });
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProgress({
        status: 'idle',
        progress: 0,
        message: ''
      });
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
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setProgress({
        status: 'idle',
        progress: 0,
        message: ''
      });
    }
  }, []);

  const handleUpload = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (selectedFile) {
      setProgress({
        status: 'processing',
        progress: 0,
        message: 'Uploading...'
      });
      uploadMutation.mutate(selectedFile);
    }
  }, [selectedFile, uploadMutation]);

  return (
    <div className="px-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Upload Bank Statement
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          PDF files up to 10MB supported
        </p>
      </div>

      <div 
        className={`
          mx-auto max-w-sm rounded-lg border bg-white p-6
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
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
          {!selectedFile ? (
            <>
              <div className="mx-auto w-10 h-10 mb-3">
                <svg 
                  className="text-gray-400 w-full h-full" 
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
                <p className="text-sm text-gray-700">
                  Drag and drop your PDF here, or <span className="text-blue-500">choose file</span>
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-700 font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              
              {progress.status === 'processing' ? (
                <div className="space-y-2">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{progress.message}</p>
                </div>
              ) : (
                <button
                  onClick={handleUpload}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium
                           rounded-md text-white bg-blue-500 hover:bg-blue-600 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                           transition-colors duration-200"
                >
                  Upload Statement
                </button>
              )}
            </div>
          )}
        </label>
      </div>

      {(progress.status === 'error' || progress.status === 'complete') && (
        <p className={`mt-4 text-sm text-center ${
          progress.status === 'error' ? 'text-red-500' : 'text-gray-600'
        }`}>
          {progress.message}
        </p>
      )}
    </div>
  );
};