export async function onRequestGet(request) {
  let url = new URL(request.url)
  let token = url.searchParams.get('apikey')
  let namespace = url.searchParams.get('namespace')
  return await fetch(
    `https://api.testmail.app/api/json?apikey=${token}&namespace=${namespace}&pretty=true`,
  )
}