import { Router, Route } from '../dist/cjs/Router';

function app() {

    Route.create('/', function() {
        console.log('home handler');
    });
    Route.create('/product/:id', function() {
        console.log('product handler');
    }, 'product');

    Route.group({
        as: 'users.',
        path: '/users/:name',
        middleware: function(router, next) {
            console.log('user group middleware');
            next(router);
        }
    }, function() {

        Route.create('/message/:id', function(router) {
            const params = router.getLocation().getParams();
            console.log(`user name: ${params.name}, meassage id: ${params.id}`);
        }, 'message');

        Route.group({
            as: 'profile.',
            path: '/profile',
            middleware: function(router, next) {
                console.log('user profile group middleware');
                next(router);
            }
        }, function() {
            Route.create('/info', function(router) {
                const params = router.getLocation().getParams();
                console.log(`user name: ${params.name}`);
            }, 'info')
        });

    });

    Route.create('/feedback', function() {
        console.log('feedback handler');
    }, 'feedback');

    const router = new Router(Route.build());

    router.push({ path: '/product/1?param[]=1&param[]=2' });
    router.push({ name: 'users.message', params: { name: 'Vasya', id: 1 } });
    router.push({ name: 'feedback' });
    router.push({ name: 'users.profile.info', params: { name: 'Kolya' } });

}

export default app();
