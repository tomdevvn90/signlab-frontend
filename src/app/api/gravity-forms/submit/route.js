import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const formId = formData.get('form_id');
    
    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }
    
    // Replace with your WordPress site URL
    const wpBaseUrl = process.env.GRAVITY_FORMS_API_URL || 'https://job.beplusprojects.com/signlab/wp-json';
    
    // Prepare data for submission to WordPress REST API
    const submissionData = new FormData();
    
    // Copy all form fields to the submission data
    for (const [key, value] of formData.entries()) {
      submissionData.append(key, value);
    }
    
    // Submit form data to WordPress REST API
    const response = await fetch(`${wpBaseUrl}/gf/v2/forms/${formId}/submissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.GRAVITY_FORMS_CONSUMER_KEY}:${process.env.GRAVITY_FORMS_CONSUMER_SECRET}`
        ).toString('base64')}`,
      },
      body: submissionData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to submit form: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    return NextResponse.json({
      is_valid: true,
      confirmation_message: result.confirmation_message,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { 
        is_valid: false,
        error: 'Failed to submit form' 
      },
      { status: 500 }
    );
  }
}