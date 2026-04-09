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

    // Use environment variables or fallback
    const wpBaseUrl = process.env.NEXT_PUBLIC_GRAVITY_FORMS_API_URL || 'https://dashboard.signlab.com.au/wp-json';
    const consumerKey = process.env.NEXT_PUBLIC_GRAVITY_FORMS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_GRAVITY_FORMS_CONSUMER_SECRET;

    // Prepare data for submission
    const submissionData = new FormData();
    for (const [key, value] of formData.entries()) {
      submissionData.append(key, value);
    }

    // Submit to WordPress with manual redirect handling to avoid CORS issues on client
    const response = await fetch(`${wpBaseUrl}/gf/v2/forms/${formId}/submissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
      },
      body: submissionData,
      redirect: 'manual', // Don't follow the redirect on the server
    });

    // Check if it's a redirect (Gravity Forms "Redirect" confirmation type)
    if (response.status === 302 || response.status === 301) {
      const redirectUrl = response.headers.get('location');
      return NextResponse.json({
        is_valid: true,
        redirect_url: redirectUrl,
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to submit form: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    return NextResponse.json({
      is_valid: result.is_valid,
      confirmation_message: result.confirmation_message,
      redirect_url: result.confirmation_redirect,
      message: result.message, // Include any error message from GF
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