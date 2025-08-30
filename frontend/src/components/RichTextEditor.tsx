/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, Quote, Code, Heading1, Heading2, Heading3, Type, AlignLeft, AlignCenter, AlignRight, Upload } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...', height = '400px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isClient]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertImage = () => {
    setShowImageModal(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        execCommand('insertImage', data.url);
        setShowImageModal(false);
        setImageUrl('');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      execCommand('insertImage', imageUrl);
      setShowImageModal(false);
      setImageUrl('');
    }
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      title: 'Heading 1',
      action: () => formatBlock('h1')
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      action: () => formatBlock('h2')
    },
    {
      icon: Heading3,
      title: 'Heading 3',
      action: () => formatBlock('h3')
    },
    {
      icon: Type,
      title: 'Paragraph',
      action: () => formatBlock('p')
    },
    { type: 'separator' },
    {
      icon: Bold,
      title: 'Bold',
      action: () => execCommand('bold')
    },
    {
      icon: Italic,
      title: 'Italic',
      action: () => execCommand('italic')
    },
    {
      icon: Underline,
      title: 'Underline',
      action: () => execCommand('underline')
    },
    { type: 'separator' },
    {
      icon: AlignLeft,
      title: 'Align Left',
      action: () => execCommand('justifyLeft')
    },
    {
      icon: AlignCenter,
      title: 'Align Center',
      action: () => execCommand('justifyCenter')
    },
    {
      icon: AlignRight,
      title: 'Align Right',
      action: () => execCommand('justifyRight')
    },
    { type: 'separator' },
    {
      icon: List,
      title: 'Bullet List',
      action: () => execCommand('insertUnorderedList')
    },
    {
      icon: ListOrdered,
      title: 'Numbered List',
      action: () => execCommand('insertOrderedList')
    },
    { type: 'separator' },
    {
      icon: Quote,
      title: 'Quote',
      action: () => formatBlock('blockquote')
    },
    {
      icon: Code,
      title: 'Code',
      action: () => execCommand('formatBlock', 'pre')
    },
    { type: 'separator' },
    {
      icon: Link,
      title: 'Insert Link',
      action: insertLink
    },
    {
      icon: Image,
      title: 'Insert Image',
      action: insertImage
    }
  ];

  if (!isClient) {
    return (
      <div className="border border-gray-300 rounded-md">
        <div className="border-b border-gray-300 p-2 bg-gray-50">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-4" style={{ height }}>
          <div className="h-full bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.type === 'separator') {
            return <div key={index} className="w-px h-6 bg-gray-300 mx-1"></div>;
          }

          const Icon = button.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800"
              title={button.title}
            >
              {Icon && <Icon className="h-4 w-4" />}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 focus:outline-none text-gray-900 bg-white"
        style={{
          height,
          minHeight: height,
          maxHeight: '600px',
          overflowY: 'auto'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable] {
          color: #111827 !important;
          background-color: #ffffff !important;
        }

        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }

        [contenteditable] h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 1rem 0;
          line-height: 1.2;
          color: #111827 !important;
        }

        [contenteditable] h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin: 1rem 0;
          line-height: 1.3;
          color: #111827 !important;
        }

        [contenteditable] h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
          line-height: 1.4;
          color: #111827 !important;
        }

        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: #111827 !important;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        [contenteditable] blockquote {
          margin: 1rem 0;
          padding: 1rem;
          border-left: 4px solid #3b82f6;
          background-color: #f8fafc;
          font-style: italic;
        }
        
        [contenteditable] pre {
          margin: 1rem 0;
          padding: 1rem;
          background-color: #1e293b;
          color: #e2e8f0;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.375rem;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8;
        }
        
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Insert Image</h3>

            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="text-center text-gray-500">or</div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  disabled={uploading}
                />
              </div>

              {uploading && (
                <div className="text-center">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImageUrlSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={!imageUrl || uploading}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
