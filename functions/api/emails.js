export async function onRequest(context) {
  try {
    const raw = await context.request.text()
    const { apikey, namespace, offset, limit } = JSON.parse(atob(raw))
    return await fetch(
      `https://api.testmail.app/api/json?apikey=${apikey}&namespace=${namespace}&pretty=true&offset=${offset || 0 }&limit=${limit || 10}`,
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