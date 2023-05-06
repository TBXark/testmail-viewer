const url = new URL(document.location.href)
const token = url.searchParams.get('apikey') || localStorage.getItem('apikey')
const namespace = url.searchParams.get('namespace') || localStorage.getItem('namespace')

const container = document.getElementsByClassName('scrollarea')[0]
const icontainer = document.getElementById('mail-container')

const tokenContainer = document.getElementById('apikey')
const namespaceContainer = document.getElementById('namespace')

tokenContainer.value = token
namespaceContainer.value = namespace

const HTMLEncode = (text) => {
    const temp = document.createElement("div")
    temp.textContent = text
    return temp.innerHTML
}

document.getElementById("refresh-button").addEventListener('click', () => {
    const apikey = tokenContainer.value
    const namespace = namespaceContainer.value
    localStorage.setItem('apikey', apikey)
    localStorage.setItem('namespace', namespace)
    loadMail(apikey, namespace)
})

function loadMail(token, namespace) {
    if (!token || !namespace) {
        return
    }
    const req = fetch('/api/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apikey: token,
            namespace: namespace
        })
    })

    req.then(response => response.json())
        .then(data => {
            container.innerHTML = data.emails.map(d => renderMailInfo(d)).join('')
            data.emails.forEach(d => renderMailDetail(d))
            if (data.emails.length > 0) {
                document.getElementsByClassName('list-group-item')[0].dispatchEvent(new Event('click'))
            }
        })
}


function renderMailInfo(d) {
    d.from = HTMLEncode(d.from)
    d.subject = HTMLEncode(d.subject)
    d.text = HTMLEncode(d.text)
    return `
    <a href="#" class="list-group-item list-group-item-action  py-3 lh-tight" id="${d.oid}">
        <div class="d-flex w-100 align-items-center justify-content-between">
        <strong class="mb-1">${d.subject}</strong>
        </div>
        <div class="col-10 mb-1 small">
        <strong>From</strong> ${d.from} 
        </div>
        <div class="col-10 mb-1 small">
        <strong>To</strong> ${d.to} 
        </div>
    </a>
    `
}

function renderMailDetail(d) {
    let item = document.getElementById(d.oid)
    item.addEventListener('click', () => {
        if (item.classList.contains('active')) {
            return
        }
        Array.from(document.getElementsByClassName('list-group-item')).forEach(element => {
            element.classList.remove('active')
        });
        item.classList.add('active')
        icontainer.innerHTML = `
        <div style="width=100%;height:100%;">
            <h3>${d.subject}</h3>
            <hr />
            <h6>
            <strong>From : </strong> ${d.from} 
            </h6>
            <h6>
            <strong>To : </strong> ${d.to} 
            </h6>
            <h6>
            <strong>Date : </strong> ${new Date(d.date).toISOString()} 
            </h6>
            <hr />
            <div style="width:100%;height:100%" id="content-${d.oid}">
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Click <strong id="alert-${d.oid}"><u style="cursor:default;">here</u></strong> to show blocked content
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <p style="font-size:16px;white-space: pre-line; word-break: break-word;">${d.text}</p>
            </div>
        </div>
        `
        document.getElementById(`alert-${d.oid}`).addEventListener('click', () => {
            document.getElementById(`content-${d.oid}`).innerHTML = `
            <iframe src="data:text/html,${encodeURIComponent(d.html)}" style="width:100%;height:100%"></iframe>
        `
        })
    })
}

loadMail(token, namespace)
