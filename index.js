import { Router } from 'itty-router'
import html from './static/html'
import css from './static/css'
import script from './static/script'

const router = Router()

router.get('/', () => new Response(html, {  status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8'}}))
router.get('/index.css', () => new Response(css, {  status: 200, headers: { 'Content-Type': 'text/css'}}))
router.get('/index.js', () => new Response(script, {  status: 200, headers: { 'Content-Type': 'application/javascript'}}))

router.get('/api/emails', async request => {
  let url = new URL(request.url)
  let token = url.searchParams.get('apikey')
  let namespace = url.searchParams.get('namespace')
  return await fetch(`https://api.testmail.app/api/json?apikey=${token}&namespace=${namespace}&pretty=true`)
})

router.all('*', () => new Response('Not Found.', { status: 404 }))

const errorHandler = error => new Response(error.message || 'Server Error', { status: error.status || 500 })

addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request).catch(errorHandler))
)
