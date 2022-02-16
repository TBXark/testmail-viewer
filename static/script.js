export default `
let url = new URL(document.location.href)
let token = url.searchParams.get('apikey')
let namespace = url.searchParams.get('namespace')

let container = document.getElementsByClassName('scrollarea')[0]
let icontainer = document.getElementById('mail-container')

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
        <div>
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
            <p>
            \${d.text}
            </p>
        </div>\`
        })
    }
    
    let first = document.getElementsByClassName('list-group-item')[0]
    if (first) {
        first.dispatchEvent(new Event('click'))
    }  
})
`