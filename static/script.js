export default `
const url = new URL(document.location.href)
const token = url.searchParams.get('apikey')
const namespace = url.searchParams.get('namespace')

const container = document.getElementsByClassName('scrollarea')[0]
const icontainer = document.getElementById('mail-container')

const HTMLEncode = (html) => {
    return encodeURIComponent(html)
}
    

const tips = 'Tips:  https://testmail-viewer.tbxark.workers.dev/?apikey=#YOUR_API_KEY&namespace=#YOUR_NAME_SPACE'

if (!token) {
    icontainer.innerHTML = '<strong>Missing apikey</strong><br>' + tips
} else if (!namespace) {
    icontainer.innerHTML = '<strong>Missing namespace</strong><br>' + tips
} else {
    fetch(\`/api/emails?apikey=\${token}&namespace=\${namespace}\`)
    .then(response => response.json())
    .then( data => {
        let items = ''
        for (const d of data.emails) {
            d.from = d.from.replace('<', '[').replace('>', ']')
            let item = \`
                <a href="#" class="list-group-item list-group-item-action  py-3 lh-tight" id="\${d.oid}">
                    <div class="d-flex w-100 align-items-center justify-content-between">
                    <strong class="mb-1">\${d.subject}</strong>
                    </div>
                    <div class="col-10 mb-1 small">
                    <strong>From</strong> \${d.from} 
                    </div>
                    <div class="col-10 mb-1 small">
                    <strong>To</strong> \${d.to} 
                    </div>
                </a>
            \`
            items += item
        }
        container.innerHTML = items
        
        for (const d of data.emails) {
            let item = document.getElementById(d.oid)
            item.addEventListener('click', () => {
                //document.title = d.subject
                Array.from(document.getElementsByClassName('list-group-item')).forEach(element => {
                    element.classList.remove('active')
                });
                item.classList.add('active')
                icontainer.innerHTML = \`
                <div style="width=100%;height:100%;margin:20px">
                    <h3>\${d.subject}</h3>
                    <hr />
                    <h6>
                    <strong>From : </strong> \${d.from} 
                    </h6>
                    <h6>
                    <strong>To : </strong> \${d.to} 
                    </h6>
                    <h6>
                    <strong>Date : </strong> \${new Date(d.date).toISOString()} 
                    </h6>
                    <hr />
                    <iframe src="data:text/html,\${encodeURIComponent(d.html)}" style="width:100%;height:100%"></iframe>
                </div>\`
            })
        }
        
        let first = document.getElementsByClassName('list-group-item')[0]
        if (first) {
            first.dispatchEvent(new Event('click'))
        }    
  })
}
`


