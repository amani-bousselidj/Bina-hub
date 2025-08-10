// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner } from '@/components/ui';
import type { Database } from '@/core/shared/types/database';
import { File, Trash2, Upload, Download, Eye } from 'lucide-react';

import type { WarrantyDocument } from '@/core/shared/types/warranty';

interface WarrantyDocsProps {
  warrantyId: string;
}

export default function WarrantyDocs({ warrantyId }: WarrantyDocsProps) {
  const [documents, setDocuments] = useState<WarrantyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    loadDocuments();
  }, [warrantyId]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('warranty_documents')
        .select('*')
        .eq('warranty_id', warrantyId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading warranty documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${warrantyId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('warranty-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: insertError } = await supabase.from('warranty_documents').insert({
        warranty_id: warrantyId,
        name: file.name,
        file_path: filePath,
        file_type: file.type,
        size: file.size,
      });

      if (insertError) throw insertError;

      // Refresh documents list
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('warranty-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete record
      const { error: deleteError } = await supabase
        .from('warranty_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      // Update list
      setDocuments((docs) => docs.filter((d) => d.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete document');
    }
  };

  const downloadDocument = async (document: WarrantyDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('warranty-documents')
        .createSignedUrl(document.file_path, 60);

      if (error) throw error; // Create a link and click it to start the download
      const downloadLink = window.document.createElement('a');
      downloadLink.href = data.signedUrl;
      downloadLink.download = document.name;
      window.document.body.appendChild(downloadLink);
      downloadLink.click();
      window.document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document');
    }
  };

  const viewDocument = async (document: WarrantyDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('warranty-documents')
        .createSignedUrl(document.file_path, 60);

      if (error) throw error;

      // Open in new tab
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error viewing document:', error);
      setError('Failed to view document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Warranty Documents</h3>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            {uploading ? (
              <>
                <LoadingSpinner className="w-4 h-4 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">Upload warranty documents to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center flex-1 min-w-0">
                <File className="flex-shrink-0 h-5 w-5 text-gray-400" />
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(doc.size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() => viewDocument(doc)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="View"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => downloadDocument(doc)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.file_path)}
                  className="p-2 text-red-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}





