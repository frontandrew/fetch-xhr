console.log('PROJECT STARTED!')

const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

function handleError(error) {
    console.log('Handle Error', error);
    throw new Error(`Request returned with error`);
};

class HTTPTransport {

    _queryStringify(data) {
        const res = new URLSearchParams(data).toString();

        console.log('GET query params:', res);
        return res;
    }

    _processURL(url) {
        let result;

        if (!url.startsWith('http')) {
            result = 'https://' + url
        }

        if (!url.endsWith('/')) {
            result = result + '/'
        }

        console.log('URL', result)
        return result;
    }

    get = (url, options = {}) => {
        const { headers, timeout, data } = options;
        console.log('GET Props:', { url, options, data })

        let resultURL = this._processURL(url);
        const querySTring = this._queryStringify(data);

        if (querySTring) {
            resultURL = resultURL + '?' + querySTring;
        }
        

        return this.request(resultURL, { headers, method: METHODS.GET }, timeout);
    };

    post = (url, options = {}) => {
        console.log('POST Props:', { url, options })
        return this.request(this._processURL(url), { ...options, method: METHODS.POST }, options.timeout);
    };

    put = (url, options = {}) => {
        console.log('PUT Props:', { url, options })
        return this.request(this._processURL(url), { ...options, method: METHODS.PUT }, options.timeout);
    };

    delete = (url, options = {}) => {
        console.log('DELETE Props:', { url, options })
        return this.request(this._processURL(url), { ...options, method: METHODS.DELETE }, options.timeout);
    };

    request = (url, options, timeout = 5000) => {
        const { method, data, headers } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }

            xhr.timeout = timeout;

            xhr.onload = function () {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            // xhr.

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else {
                xhr.send(data);
            }
        })
        .then(function (xhr) {
            console.info('RESP:', { xhr, type: typeof xhr, status: 200 >= xhr.status && xhr.status < 399 })
            if (200 >= xhr.status && xhr.status < 399 ) return JSON.parse(xhr.response);

            xhr.onerror({ message: "onerror!!" });
            return null;
        })
        .catch(function (error) {
            console.log('CATCH:', { error, type: typeof error})

            return handleError(error);
        })
        .finally(stat => console.info('FIN:', stat));
    };
}

const getStarships = await new HTTPTransport().get('swapi.dev/api/starships', {
    headers: { 'Content-Type': 'application/json' },
    data: { search: ['star'], page: 2 },
    timeout: 2000
});
console.log('GET Starships RES:', getStarships);
