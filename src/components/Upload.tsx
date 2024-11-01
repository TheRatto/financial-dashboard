import React, { useState, useRef } from 'react';
import { buttonStyles } from '../styles';

export const Upload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Upload response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            // Handle successful upload
            setFile(null);
            if (formRef.current) {
                formRef.current.reset();
            }

        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <form ref={formRef} className="space-y-4">
            {/* Hidden file input */}
            <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
            />

            {/* Custom file input UI */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleBrowseClick}
                    className={`${buttonStyles.secondary} whitespace-nowrap`}
                >
                    Browse Files
                </button>
                <div className="flex-1 text-sm text-gray-600 dark:text-gray-300 truncate">
                    {file ? file.name : 'No file selected'}
                </div>
            </div>

            {/* Upload button */}
            <div className="flex items-center gap-4">
                <button 
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`${buttonStyles.primary} ${
                        (!file || loading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </span>
                    ) : 'Upload'}
                </button>
                {file && !loading && (
                    <button
                        type="button"
                        onClick={() => {
                            setFile(null);
                            if (formRef.current) formRef.current.reset();
                        }}
                        className="text-sm text-gray-500 dark:text-gray-400 
                            hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="text-sm text-error-600 dark:text-error-400 
                    bg-error-50 dark:bg-error-900/50 
                    p-3 rounded-md">
                    {error}
                </div>
            )}
        </form>
    );
}; 