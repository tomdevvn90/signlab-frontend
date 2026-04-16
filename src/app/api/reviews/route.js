const PLACE_ID = process.env.GOOGLE_PLACES_PLACE_ID;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', PLACE_ID);
    url.searchParams.set('fields', 'reviews,rating,user_ratings_total,name');
    url.searchParams.set('key', API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`Google API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    const result = data.result;

    return Response.json(
      {
        name: result.name,
        rating: result.rating,
        user_ratings_total: result.user_ratings_total,
        reviews: (result.reviews || []).map((review) => ({
          author_name: review.author_name,
          rating: review.rating,
          text: review.text,
          relative_time_description: review.relative_time_description,
          profile_photo_url: review.profile_photo_url,
          time: review.time,
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching Google reviews:', error);

    return Response.json(
      { error: 'Failed to fetch reviews', message: error.message },
      { status: 500 }
    );
  }
}
