export async function onRequestGet(request) {
  try {
    let url = new URL(request.url)
    let token = url.searchParams.get('apikey')
    let namespace = url.searchParams.get('namespace')
    return await fetch(
      `https://api.testmail.app/api/json?apikey=${token}&namespace=${namespace}&pretty=true`,
    )
  } catch (error) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 })
  }
}