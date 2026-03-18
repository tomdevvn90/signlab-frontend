'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { getImageUrl, getImageAlt } from '../../lib/utils';

const Form = ({ data }) => {
  const [formData, setFormData] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [fileUploads, setFileUploads] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const fileInputRefs = useRef({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { title, gravity_form_id, banner_image, banner_position } = data || {};

  const fetchFormData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/gravity-forms/${gravity_form_id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      if (data) {
        setFormData(data);
        setFormFields(data.fields || []);
        
        // Initialize form values
        const initialValues = {};
        data.fields?.forEach(field => {
          initialValues[field.id] = '';
        });
        setFormValues(initialValues);
      } else {
        throw new Error('No form data received');
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
      setError(`Failed to load form: ${error.message}`);
      setSubmitStatus('error');
      setSubmitMessage(`Unable to load form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [gravity_form_id]);

  useEffect(() => {
    if (gravity_form_id) {
      fetchFormData();
    } else {
      setError('No form ID provided');
      setLoading(false);
    }
  }, [gravity_form_id, fetchFormData]);

  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileRemove = (fieldId, fileIndex = null) => {
    setFileUploads(prev => {
      const newUploads = { ...prev };
      const currentFiles = newUploads[fieldId];
      
      if (Array.isArray(currentFiles)) {
        // Remove specific file from array
        if (fileIndex !== null) {
          const updatedFiles = currentFiles.filter((_, index) => index !== fileIndex);
          if (updatedFiles.length > 0) {
            newUploads[fieldId] = updatedFiles;
          } else {
            delete newUploads[fieldId];
          }
        } else {
          // Remove all files
          delete newUploads[fieldId];
        }
      } else {
        // Remove single file
        delete newUploads[fieldId];
      }
      
      return newUploads;
    });
    
    // Clear any errors for this field
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
    
    // Reset the native input value
    if (fileInputRefs.current[fieldId]) {
      fileInputRefs.current[fieldId].value = '';
    }
  };

  const handleFileChange = (fieldId, files, field) => {
    // Clear any previous errors for this field
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });

    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      const maxSize = field.maxFileSize ? field.maxFileSize * 1024 * 1024 : null; // Convert MB to bytes
      const multipleFiles = field.multipleFiles;
      
      // Validate file sizes
      const invalidFiles = [];
      filesArray.forEach(file => {
        if (maxSize && file.size > maxSize) {
          invalidFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        }
      });
      
      if (invalidFiles.length > 0) {
        setFileErrors(prev => ({
          ...prev,
          [fieldId]: `File(s) exceed maximum size of ${field.maxFileSize} MB: ${invalidFiles.join(', ')}`
        }));
        return;
      }
      
      // Store files based on multipleFiles setting
      setFileUploads(prev => ({
        ...prev,
        [fieldId]: multipleFiles ? filesArray : filesArray[0]
      }));
    } else {
      // Remove file if no file selected
      setFileUploads(prev => {
        const newUploads = { ...prev };
        delete newUploads[fieldId];
        return newUploads;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus('');

    try {
      // Create FormData for file uploads
      const formDataToSubmit = new FormData();
      
      // Add regular form values
      Object.keys(formValues).forEach(key => {
        if (formValues[key] !== '') {
          formDataToSubmit.append(`input_${key}`, formValues[key]);
        }
      });
      
      // Add file uploads
      Object.keys(fileUploads).forEach(key => {
        const files = fileUploads[key];
        if (files) {
          // Handle both single file and array of files
          if (Array.isArray(files)) {
            files.forEach((file, index) => {
              formDataToSubmit.append(`input_${key}[]`, file);
            });
          } else {
            formDataToSubmit.append(`input_${key}`, files);
          }
        }
      });
      
      // Add form ID
      formDataToSubmit.append('form_id', gravity_form_id);

      const response = await fetch('/api/gravity-forms/submit', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.is_valid || result.status === 'success') {
        setSubmitStatus('success');
        setSubmitMessage(formData?.confirmations?.['51794abf1ee7a']?.message || 'Form submitted successfully!');
        
        // Reset form
        const initialValues = {};
        formFields.forEach(field => {
          initialValues[field.id] = '';
        });
        setFormValues(initialValues);
        setFileUploads({});
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'There was an error submitting the form. Please check your inputs and try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage(`There was an error submitting the form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const { type, id, label, isRequired, placeholder, choices, layoutGridColumnSpan, maxLength, allowedExtensions, multipleFiles, maxFileSize } = field;
    
    // Helper function to get field class based on layoutGridColumnSpan
    const getFieldClass = () => {
      if (layoutGridColumnSpan) {
        return `form-field-${layoutGridColumnSpan}`;
      }
      // Default to full width if not specified
      return 'form-field-12';
    };    
    
    switch (type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={id} className={getFieldClass()}>
            <label htmlFor={`input_${id}`} className="block text-gray-700 mb-1 uppercase font-medium">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type === 'phone' ? 'tel' : type}
              id={`input_${id}`}
              name={`input_${id}`}
              value={formValues[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={placeholder || ''}
              required={isRequired}
              maxLength={maxLength}
              className="w-full h-12 px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
        
      case 'textarea':
        return (
          <div key={id} className={getFieldClass()}>
            <label htmlFor={`input_${id}`} className="block text-gray-700 mb-1 uppercase font-medium">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={`input_${id}`}
              name={`input_${id}`}
              value={formValues[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={placeholder || ''}
              required={isRequired}
              maxLength={maxLength}
              rows={5}
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
        
      case 'select':
        return (
          <div key={id} className={getFieldClass()}>
            <label htmlFor={`input_${id}`} className="block text-gray-700 mb-1 uppercase font-medium">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              id={`input_${id}`}
              name={`input_${id}`}
              value={formValues[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={isRequired}
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              {choices?.map((choice, index) => (
                <option key={index} value={choice.value}>
                  {choice.text}
                </option>
              ))}
            </select>
          </div>
        );
        
      case 'fileupload':
        const fileCount = fileUploads[id] ? (Array.isArray(fileUploads[id]) ? fileUploads[id].length : 1) : 0;
        const fileCountText = fileCount === 0 ? 'Choose file(s)' : fileCount === 1 ? '1 file selected' : `${fileCount} files selected`;
        
        return (
          <div key={id} className={getFieldClass()}>
            <label htmlFor={`input_${id}`} className="block text-gray-700 mb-1 uppercase font-medium">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            
            {/* Hidden native file input */}
            <input
              type="file"
              id={`input_${id}`}
              name={`input_${id}`}
              ref={(el) => (fileInputRefs.current[id] = el)}
              onChange={(e) => handleFileChange(id, e.target.files, field)}
              required={isRequired && fileCount === 0}
              accept={allowedExtensions ? allowedExtensions.map(ext => `.${ext}`).join(',') : undefined}
              multiple={multipleFiles}
              className="hidden"
            />
            
            {/* Custom styled button */}
            <button
              type="button"
              onClick={() => fileInputRefs.current[id]?.click()}
              className="w-full h-12 px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {fileCountText}
            </button>
            
            {allowedExtensions && (
              <p className="text-sm text-gray-600 mt-1">
                Allowed formats: {allowedExtensions.join(', ')}
              </p>
            )}
            {maxFileSize && (
              <p className="text-sm text-gray-600 mt-1">
                Max file size: {maxFileSize} MB
              </p>
            )}
            {fileErrors[id] && (
              <p className="text-sm text-red-600 mt-1">
                {fileErrors[id]}
              </p>
            )}
            
            {/* Display uploaded files */}
            {fileUploads[id] && (
              <div className="mt-3 flex gap-3 flex-wrap">
                {Array.isArray(fileUploads[id]) ? (
                  // Multiple files
                  fileUploads[id].map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    >
                      <span className="text-sm text-gray-800 truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileRemove(id, index)}
                        className="ml-3 mr-[-2px] text-gray-700 hover:text-red-600 transition-colors flex-shrink-0"
                        title={`Remove ${file.name}`}
                        aria-label={`Remove ${file.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  // Single file
                  <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <span className="text-sm text-gray-800 truncate flex-1">{fileUploads[id].name}</span>
                    <button
                      type="button"
                      onClick={() => handleFileRemove(id)}
                      className="ml-3 mr-[-2px] text-gray-700 hover:text-red-600 transition-colors flex-shrink-0"
                      title={`Remove ${fileUploads[id].name}`}
                      aria-label={`Remove ${fileUploads[id].name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className="py-32 bg-white">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading form...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-32 bg-white">
        <div className="container">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button 
              onClick={fetchFormData}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Handle banner image data
  const bannerImageUrl = banner_image ? getImageUrl(banner_image, 'large') : null;
  const bannerImageAlt = banner_image ? getImageAlt(banner_image, 'Form banner') : 'Form banner';

  // Determine layout based on banner position
  const isBannerLeft = banner_position === 'left';
  const isBannerRight = banner_position === 'right';

  return (
    <section className="bg-white flex flex-wrap justify-between">
      {/* Banner Image - Left */}
      {bannerImageUrl && isBannerLeft && (
        <div className="w-full lg:w-1/2">
            <Image
            src={bannerImageUrl}
            alt={bannerImageAlt}
            width={2048}
            height={400}
            sizes="100vw"
            className="object-cover h-full w-full"
            priority
          />
        </div>
      )}
      <div className={`container lg:max-w-5xl py-20 lg:py-28 ${bannerImageUrl ? 'w-full lg:w-1/2' : 'w-full'}`}>
        <div className={`flex flex-col gap-8 lg:gap-12`}>
          
          {/* Form Content */}
          <div className={`${bannerImageUrl ? 'w-full mx-auto max-w-2xl px-0 sm:px-4 lg:px-8' : ''}`}>
            {title && (
              <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-12 lg:mb-20 text-primary">
                {title}
              </h2>
            )}
            
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-md text-center ${submitStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-fields flex flex-col md:grid grid-cols-12 gap-6">
                {formFields.map(field => renderField(field))}
              </div>
              
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary uppercase text-center max-sm:w-full min-w-64 justify-center"
                >
                  {isSubmitting ? 'Submitting...' : formData.button?.text || 'Submit'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
      {/* Banner Image - Right */}
      {bannerImageUrl && isBannerRight && (
        <div className="w-full lg:w-1/2">
            <Image
            src={bannerImageUrl}
            alt={bannerImageAlt}
            width={2048}
            height={400}
            sizes="100vw"
            className="object-cover h-full w-full"
            priority
          />
        </div>
      )}
    </section>
  );
};

export default Form;
