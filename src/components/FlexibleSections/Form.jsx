'use client';

import React, { useState, useEffect } from 'react';

const Form = ({ data }) => {
  const [formData, setFormData] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [fileUploads, setFileUploads] = useState({});

  const { title, gravity_form_id } = data || {};

  useEffect(() => {
    if (gravity_form_id) {
      fetchFormData();
    }
  }, [gravity_form_id]);

  const fetchFormData = async () => {
    try {
      // Replace with your WordPress REST API endpoint
      const response = await fetch(`/api/gravity-forms/${gravity_form_id}`);
      const data = await response.json();
      
      if (data) {
        setFormData(data);
        setFormFields(data.fields || []);
        
        // Initialize form values
        const initialValues = {};
        data.fields?.forEach(field => {
          initialValues[field.id] = '';
        });
        setFormValues(initialValues);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileChange = (fieldId, files) => {
    setFileUploads(prev => ({
      ...prev,
      [fieldId]: files[0]
    }));
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
        formDataToSubmit.append(`input_${key}`, formValues[key]);
      });
      
      // Add file uploads
      Object.keys(fileUploads).forEach(key => {
        formDataToSubmit.append(`input_${key}`, fileUploads[key]);
      });
      
      // Add form ID
      formDataToSubmit.append('form_id', gravity_form_id);

      // Replace with your WordPress REST API endpoint for form submission
      const response = await fetch('/api/gravity-forms/submit', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const result = await response.json();
      
      if (result.is_valid) {
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
        setSubmitMessage('There was an error submitting the form. Please check your inputs and try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('There was an error submitting the form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const { type, id, label, isRequired, placeholder, choices, layoutGridColumnSpan } = field;
    
    // Determine column span class
    const colSpanClass = layoutGridColumnSpan ? `col-span-${layoutGridColumnSpan}` : 'col-span-12';
    
    switch (type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={id} className={colSpanClass}>
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
              rows={5}
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
        
      case 'select':
        return (
          <div key={id} className={colSpanClass}>
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
          <div key={id} className={colSpanClass}>
            <label htmlFor={`input_${id}`} className="block text-gray-700 mb-1 uppercase font-medium">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              id={`input_${id}`}
              name={`input_${id}`}
              onChange={(e) => handleFileChange(id, e.target.files)}
              required={isRequired}
              className="w-full h-12 px-2 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!formData) {
    return (
      <section className="py-40 bg-white">
        <div className="container">
          <div className="text-center">Loading form...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-40 bg-white">
      <div className="container !max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center mb-20 text-primary">
            {title}
          </h2>
        )}
        
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-md text-center ${submitStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="grid grid-cols-12 gap-6">
            {formFields.map(field => renderField(field))}
          </div>
          
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary uppercase"
            >
              {isSubmitting ? 'Submitting...' : formData.button?.text || 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Form;