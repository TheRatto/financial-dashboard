import React, { useRef } from 'react';
import { useToast } from '../../context/ToastContext';

export const UploadForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showUploadSuccess } = useToast();

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      console.log('Starting upload...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      console.log('Upload response:', responseData);

      if (response.ok) {
        console.log('Upload successful');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        showUploadSuccess(20); // Or get the actual count from responseData
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.csv"
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
      >
        Upload Statement
      </button>
    </form>
  );
};