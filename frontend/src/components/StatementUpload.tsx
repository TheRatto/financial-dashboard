import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { buttonStyles } from '../styles';

interface StatementUploadProps {
  accountId: string;
  onUploadSuccess?: () => void;
}

export const StatementUpload: React.FC<StatementUploadProps> = ({ 
  accountId, 
  onUploadSuccess 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountId', accountId);

    try {
      setIsUploading(true);
      const response = await fetch('/api/statements/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload statement');
      }

      toast.success('Statement uploaded successfully!');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess?.();

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload statement');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm 
            text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 dark:file:bg-primary-900/50 
            file:text-primary-700 dark:file:text-primary-300
            hover:file:bg-primary-100 dark:hover:file:bg-primary-800/50
            disabled:opacity-50
            focus:outline-none"
        />
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`${buttonStyles.primary} whitespace-nowrap`}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : 'Upload'}
        </button>
      </div>
    </div>
  );
}; 