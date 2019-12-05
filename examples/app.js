import Router, { Route } from '../dist/router';

function app() {

    Route.create('/', function() {
        console.log('home handler');
    });
    Route.create('/product/:id', function() {
        console.log('product handler');
    }, 'product');
    Route.group({ as: 'users.', path: '/users/:name' }, function() {
        Route.create('/message/:id', function(location) {
            const params = location.getParams();
            console.log(`user name: ${params.name}, meassage id: ${params.id}`);
        }, 'user');
    });
    Route.create('/feedback', function() {
        console.log('feedback handler');
    }, 'feedback');

    const router = new Router(Route.build());

    router.push({ path: '/product/1?param[]=1&param[]=2' });
    router.push({ name: 'users.user', params: { name: 'Vasya', id: 1 } });
    router.push({ name: 'feedback' });

}

export default app();
