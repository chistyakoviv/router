import Router from '../dist/router';

function app() {
    const router = new Router([
        {
            path: '/',
            handler: function() {
                console.log('home handler');
            }
        },
        {
            path: '/hello/:id',
            name: 'hello',
            handler: function(location) {
                console.log('hello handler');
            }
        }
    ]);
    router.push({ path: '/hello/1?param[]=1&param[]=2' }).then(location => {
        console.log(location);

        router.push({ name: 'hello', params: { id: 2 } }).then(location => {
            console.log(location);
        });
    });
}

export default app();
