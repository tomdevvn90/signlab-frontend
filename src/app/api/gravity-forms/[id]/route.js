import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;  

  try {
    // Replace with your WordPress site URL
    const wpBaseUrl = process.env.WORDPRESS_API_URL || 'https://job.beplusprojects.com/signlab/wp-json';
    
    // Fetch form data from WordPress REST API
    const response = await fetch(`${wpBaseUrl}/gf/v2/forms/${id}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.GRAVITY_FORMS_CONSUMER_KEY}:${process.env.GRAVITY_FORMS_CONSUMER_SECRET}`
        ).toString('base64')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch form data: ${response.status}`);
    }
    
    const formData = await response.json();
    
    return NextResponse.json(formData);
  } catch (error) {
    console.error('Error fetching form data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form data' },
      { status: 500 }
    );
  }
}