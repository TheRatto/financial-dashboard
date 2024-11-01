import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploadZoneProps {
  onFileDrop: (file: File) => void;
  file: File | null;
  isProcessing: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileDrop,
  file,
  isProcessing
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileDrop(acceptedFiles[0]);
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        ${isDragActive ? 'border-violet-500 bg-violet-50' : 'border-gray-300'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-violet-500'}
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        {file ? (
          <div className="text-sm text-gray-600">
            Selected file: <span className="font-medium">{file.name}</span>
          </div>
        ) : (
          <>
            <p className="text-base text-gray-600">
              Drop your statement here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF statements or CSV files
            </p>
          </>
        )}
      </div>
    </div>
  );
}; 