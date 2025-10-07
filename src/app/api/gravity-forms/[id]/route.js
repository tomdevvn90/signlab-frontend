import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;  

  // Validate the ID parameter
  if (!id || isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid form ID provided' },
      { status: 400 }
    );
  }

  try {
    // Check if required environment variables are set
    if (!process.env.GRAVITY_FORMS_CONSUMER_KEY || !process.env.GRAVITY_FORMS_CONSUMER_SECRET) {
      console.error('Missing Gravity Forms API credentials');
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    // Replace with your WordPress site URL
    const wpBaseUrl = process.env.GRAVITY_FORMS_API_URL || 'https://job.beplusprojects.com/signlab/wp-json';
    
    console.log(`Fetching Gravity Form with ID: ${id}`);
    
    // Fetch form data from WordPress REST API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${wpBaseUrl}/gf/v2/forms/${id}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.GRAVITY_FORMS_CONSUMER_KEY}:${process.env.GRAVITY_FORMS_CONSUMER_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SignLab-Frontend/1.0',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch form data: ${response.status}`);
    }
    
    const formData = await response.json();
    
    // Validate the response data
    if (!formData || typeof formData !== 'object') {
      console.error('Invalid form data received from API');
      return NextResponse.json(
        { error: 'Invalid form data received' },
        { status: 500 }
      );
    }
    
    console.log(`Successfully fetched form: ${formData.title || 'Untitled'}`);
    
    return NextResponse.json(formData, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
      },
    });
    
  } catch (error) {
    console.error('Error fetching form data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form data' },
      { status: 500 }
    );
  }
}