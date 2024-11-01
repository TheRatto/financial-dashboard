import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { FileUploadZone } from '../components/FileUpload/FileUploadZone';
import { AccountNameInput } from '../components/FileUpload/AccountNameInput';
import { buttonStyles } from '../styles';

export const AccountUpload: React.FC = () => {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileDrop = async (file: File) => {
    setFile(file);
    setIsProcessing(true);

    if (file.type === 'application/pdf') {
      try {
        // Send first page of PDF to get account name
        const formData = new FormData();
        formData.append('file', file);
        formData.append('previewOnly', 'true');

        const response = await fetch('/api/preview-account', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.accountName) {
            setAccountName(data.accountName);
          }
        }
      } catch (error) {
        console.error('Error previewing file:', error);
      }
    }

    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !accountName.trim()) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountName', accountName);
    formData.append('bankId', bankId || '');

    try {
      setIsProcessing(true);
      const response = await fetch('/api/accounts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        navigate('/accounts');
      }
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Add New Account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AccountNameInput
          value={accountName}
          onChange={setAccountName}
          isProcessing={isProcessing}
        />

        <FileUploadZone
          onFileDrop={handleFileDrop}
          file={file}
          isProcessing={isProcessing}
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/accounts')}
            className={buttonStyles.secondary}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!file || !accountName.trim() || isProcessing}
            className={buttonStyles.primary}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}; 