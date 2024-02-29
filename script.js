console.log('PROJECT STARTED!')

const METHODS = {
    GET: 'GET',
};

/**
* Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
* На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
* На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
*/
function queryStringify(data) {
// Можно делать трансформацию GET-параметров в отдельной функции
}

class HTTPTransport {
    get = (url, options = {}) => {
             
            return this.request(url, {...options, method: METHODS.GET}, options.timeout);
    };

    // PUT, POST, DELETE

    // options:
    // headers — obj
    // data — obj
    request = (url, options, timeout = 5000) => {
            
    };
}