console.log('PROJECT STARTED!')

const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

function handleError(error) {
    console.log('Handle Error', error);
    throw new Error(`Request returned with error!!!`);
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

            if (headers) {
                for (const [key, value] of Object.entries(headers)) {
                    xhr.setRequestHeader(key, value);
                }
            }

            xhr.timeout = timeout;

            xhr.onload = function () {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(data));
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

/** TESTS */

// const getStarships = await new HTTPTransport().get('swapi.dev/api/starships', {
//     headers: { 'Content-Type': 'application/json' },
//     data: { search: ['star'], page: 2 },
//     timeout: 2000
// });
// console.log('GET Starships RES:', getStarships);

// const deletePosts = await new HTTPTransport().delete('jsonplaceholder.typicode.com/posts/100', {
//     timeout: 2000
// });
// console.log('DELETE Posts RES:', deletePosts);

// const addPost = await new HTTPTransport().post('jsonplaceholder.typicode.com/posts', {
//     headers: { 'Content-type': 'application/json; charset=UTF-8' },
//     data: {
//         userId: 2,
//         body: 'Some post create!',
//         title: 'Post from UserID: 2'
//     },
//     timeout: 2000
// });
// console.log('POST Posts RES:', addPost);

// const getPosts = await new HTTPTransport().get('jsonplaceholder.typicode.com/posts/100', {
//     timeout: 2000
// });
// console.log('GET Posts RES:', getPosts);

const updatePosts = await new HTTPTransport().put('jsonplaceholder.typicode.com/posts/1', {
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    data: {
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1,
    },
    timeout: 2000
});
console.log('PUT Posts RES:', updatePosts);
