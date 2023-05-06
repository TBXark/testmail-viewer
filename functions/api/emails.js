export async function onRequest(context) {
  try {
    const { apikey, namespace } = await context.request.json()
    return await fetch(
      `https://api.testmail.app/api/json?apikey=${apikey}&namespace=${namespace}&pretty=true`,
    )
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}