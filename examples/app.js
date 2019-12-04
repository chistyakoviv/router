import Router from '../dist/router';

function app() {
    const router = new Router([
        {
            path: '/hello/:id',
            handler: function(location) {
                console.log('handler');
            }
        }
    ]);
    router.push({ path: '/hello/1?param[]=1&param[]=2' }).then(location => {
        console.log(location);

        router.push({ path: '/hello/2' }).then(location => {
            console.log(location);
        });
    });
}

export default app();
