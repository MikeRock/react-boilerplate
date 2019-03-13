const support = function(feature) {
  if (typeof document === `undefined`) {
    return false
  }
  const fakeLink = document.createElement(`link`)
  try {
    if (fakeLink.relList && typeof fakeLink.relList.supports === `function`) {
      return fakeLink.relList.supports(feature)
    }
  } catch (err) {
    return false
  }
  return false
}

const linkPrefetchStrategy = function(url) {
  return new Promise((resolve, reject) => {
    if (typeof document === `undefined`) {
      reject(new Error(`Prefetch for ${url} returned eror: document is undefined`))
      return
    }

    const link = document.createElement(`link`)
    link.setAttribute(`rel`, `prefetch`)
    link.setAttribute(`href`, url)

    link.onload = resolve
    link.onerror = reject

    const parentElement = document.getElementsByTagName(`head`)[0] || document.getElementsByName(`script`)[0].parentNode
    parentElement.appendChild(link)
  })
}

const xhrPrefetchStrategy = function(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open(`GET`, url, true)
    req.withCredentials = true

    req.onload = () => {
      if (req.status === 200) {
        resolve()
      } else {
        reject(new Error(`Prefetch fallback for ${url} returned ${req.status}`))
      }
    }

    req.send(null)
  })
}

const supportedPrefetchStrategy = support(`prefetch`) ? linkPrefetchStrategy : xhrPrefetchStrategy

const preFetched = {}

const prefetch = function(url) {
  return new Promise(resolve => {
    if (preFetched[url]) {
      resolve()
      return
    }

    supportedPrefetchStrategy(url)
      .then(() => {
        resolve()
        preFetched[url] = true
      })
      .catch(() => {}) // 404s are logged to the console anyway
  })
}

export default prefetch