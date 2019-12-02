import Router from '../dist/router';

function app() {
    const router = new Router();
    console.log(router.match('/some/path'));
}

export default app();
