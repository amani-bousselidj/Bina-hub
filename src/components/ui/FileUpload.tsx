// @ts-nocheck
'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string>
  acceptedTypes?: string[]
  maxSize?: number // in MB
  existingFile?: string
  placeholder?: string
  className?: string
  multiple?: boolean
}

interface UploadedFile {
  file: File
  url?: string
  status: 'uploading' | 'success' | 'error'
  error?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  maxSize = 5,
  existingFile,
  placeholder = 'Click to upload or drag and drop',
  className = '',
  multiple = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    const newFiles: UploadedFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        newFiles.push({
          file,
          status: 'error',
          error: `File size exceeds ${maxSize}MB limit`
        })
        continue
      }

      // Validate file type
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type)
      })

      if (!isValidType) {
        newFiles.push({
          file,
          status: 'error',
          error: 'File type not supported'
        })
        continue
      }

      newFiles.push({
        file,
        status: 'uploading'
      })
    }

    setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles)

    // Upload files
    for (const uploadedFile of newFiles) {
      if (uploadedFile.status === 'uploading') {
        try {
          const url = await onFileUpload(uploadedFile.file)
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === uploadedFile.file 
                ? { ...f, status: 'success', url }
                : f
            )
          )
        } catch (error) {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === uploadedFile.file 
                ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
                : f
            )
          )
        }
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />
    }
    return <DocumentIcon className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500 mt-1">
              {acceptedTypes.join(', ')} up to {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* Existing File */}
      {existingFile && uploadedFiles.length === 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DocumentIcon className="h-6 w-6 text-gray-500" />
            <span className="text-sm text-gray-700">Current file</span>
          </div>
          <a
            href={existingFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View
          </a>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uploadedFile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(uploadedFile.file)}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {uploadedFile.status === 'uploading' && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-xs text-gray-500">Uploading...</span>
                  </div>
                )}
                
                {uploadedFile.status === 'success' && (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Uploaded</span>
                  </div>
                )}
                
                {uploadedFile.status === 'error' && (
                  <div className="flex items-center gap-2">
                    <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-600" title={uploadedFile.error}>
                      Error
                    </span>
                  </div>
                )}

                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload




