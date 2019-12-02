export default class Ajax {
    static get(url: string) {
        return Ajax._fetch(url);
    }

    static _fetch(url: string, method: string = 'GET', body = null) {
        return fetch(url, {
            method: method,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: body
        })
        .then(result => {
            return result.json();
        });
    }
}
