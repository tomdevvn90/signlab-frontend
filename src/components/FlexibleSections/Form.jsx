'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  const handleFileChange = (fieldId, files) => {
    if (files && files.length > 0) {
      setFileUploads(prev => ({
        ...prev,
        [fieldId]: files[0]
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
        if (fileUploads[key]) {
          formDataToSubmit.append(`input_${key}`, fileUploads[key]);
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
    const { type, id, label, isRequired, placeholder, choices, layoutGridColumnSpan, maxLength, allowedExtensions } = field;
    
    // Determine column span class
    const colSpanClass = layoutGridColumnSpan ? `col-span-${layoutGridColumnSpan}` : 'col-span-12';
    
    switch (type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={id} className={`${colSpanClass} form-field-6`}>
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
          <div key={id} className="col-span-12">
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
          <div key={id} className={ `form-field-6`}>
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
        return (
          <div key={id} className={`form-field-6`}>
            <label htmlFor={`input_${id}`} className="block text-gray-700 mb-1 uppercase font-medium">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              id={`input_${id}`}
              name={`input_${id}`}
              onChange={(e) => handleFileChange(id, e.target.files)}
              required={isRequired}
              accept={allowedExtensions ? allowedExtensions.map(ext => `.${ext}`).join(',') : undefined}
              className="w-full h-12 px-2 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {allowedExtensions && (
              <p className="text-sm text-gray-500 mt-1">
                Allowed formats: {allowedExtensions.join(', ')}
              </p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className="py-40 bg-white">
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
      <section className="py-40 bg-white">
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
    <section className="bg-white flex justify-between">
      {/* Banner Image - Left */}
      {banner_image && isBannerLeft && (
        <div className="w-1/2">
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
      <div className="container lg:max-w-5xl py-24 lg:py-40">
        <div className={`flex flex-col gap-8 lg:gap-12`}>
          
          {/* Form Content */}
          <div className={`${bannerImageUrl ? 'px-10 lg:px-20' : ''}`}>
            {title && (
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center mb-12 lg:mb-20 text-primary">
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
                  className="btn-primary uppercase text-center max-sm:w-full justify-center"
                >
                  {isSubmitting ? 'Submitting...' : formData.button?.text || 'Submit'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
      {/* Banner Image - Right */}
      {banner_image && isBannerRight && (
        <div className="w-1/2">
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