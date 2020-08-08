export function urlget(url, params) {
    if (params) {
        let urlparams = '?'
        let x;
        for (x in params) {
            if (params.hasOwnProperty(x)) {
                urlparams += x + '=' + params[x] + '&';
            }
        }
        url = url + urlparams;
    }

    return fetch(url);
}


export function urlpost(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

