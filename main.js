
function getItemFromFragmentIdentifier(url, key) {
    if (url && url.hash) {
        const hash = url.hash.substr(1)
        const params = new URLSearchParams(hash)
        return params.get(key)
    }
    return null
}

function getItemFromURL(url, key) {
    return url.searchParams.get(key) || getItemFromFragmentIdentifier(key) || localStorage.getItem(key)
}

function HTMLEncode(text) {
    const temp = document.createElement("div")
    temp.textContent = text
    return temp.innerHTML
}


function loadMail(token, namespace, callback) {
    if (!token || !namespace) {
        return
    }
    const container = document.getElementsByClassName('scrollarea')[0]

    const req = fetch('/api/emails', {
        method: 'POST',
        body: btoa(JSON.stringify({
            apikey: token,
            namespace: namespace
        }))
    })

    req.then(response => response.json())
        .then(data => {
            if (callback) {
                callback(data)
            }
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
    const icontainer = document.getElementById('mail-container')
    let item = document.getElementById(d.oid)
    item.addEventListener('click', () => {
        if (item.classList.contains('active')) {
            return
        }
        Array.from(document.getElementsByClassName('list-group-item')).forEach(element => {
            element.classList.remove('active')
        });
        item.classList.add('active')
        const alertBar = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Click <strong id="alert-${d.oid}"><u style="cursor:default;">here</u></strong> to show blocked content
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
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
                ${d.html ? alertBar : ''}
                <p style="font-size:16px;white-space: pre-line; word-break: break-word;">${d.text}</p>
            </div>
        </div>
        `
        if (d.html) {
            const script = `
            <script>
                const links = document.querySelectorAll('a');
                links.forEach(link => {
                    link.setAttribute('target', '_blank');
                });
            </script>
            `
            const index = d.html.indexOf('</html>')
            d.html = d.html.slice(0, index) + script + d.html.slice(index)
            document.getElementById(`alert-${d.oid}`).addEventListener('click', () => {
                document.getElementById(`content-${d.oid}`).innerHTML = `
                <iframe src="data:text/html,${encodeURIComponent(d.html)}" style="width:100%;height:100%"></iframe>
            `
            })
        }

    })
}

function main() {
    const url = new URL(document.location.href)
    const token = getItemFromURL(url, 'apikey')
    const namespace = getItemFromURL(url, 'namespace')

    const tokenContainer = document.getElementById('apikey')
    const namespaceContainer = document.getElementById('namespace')

    tokenContainer.value = token
    namespaceContainer.value = namespace

    document.getElementById("refresh-button").addEventListener('click', () => {
        const apikey = tokenContainer.value
        const namespace = namespaceContainer.value
        localStorage.setItem('apikey', apikey)
        localStorage.setItem('namespace', namespace)
        loadMail(apikey, namespace)
    })

    document.getElementById("title-label").addEventListener('click', () => {
        if ("Notification" in window) {
            // 请求浏览器授权显示通知
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Mailbox", {
                        body: "You can receive notifications when you receive new emails."
                    })
                }
            });
        }
    })

    Array.of(tokenContainer).forEach(input => {
        input.onfocus = () => {
            input.type = 'text'
        }
        input.onblur = () => {
            input.type = 'password'
        }
    })

    let lastOid = null
    const newMessageNotification = (data) => {
        if (data.emails.length > 0) {
            const oid = data.emails[0].oid
            if (lastOid !== oid) {
                lastOid = oid
                if ("Notification" in window) {
                    if (Notification.permission === "granted") {
                        new Notification("Mailbox", {
                            body: "You have new emails."
                        })
                    }
                }

            }
        }
    }

    loadMail(token, namespace, newMessageNotification)

    setInterval(() => {
        loadMail(token, namespace, newMessageNotification)
    }, 1000 * 30)

    if (typeof document.hidden !== "undefined") {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                loadMail(token, namespace, null)
            }
        });
    }

}

main()
