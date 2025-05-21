const target = 'https://api.observablehq.com';
const origin = 'https://observablehq.com';
const time = Date.now();
let served = 0;

require('http-proxy').createServer({
    changeOrigin: true, // updates host header
    target,
    headers: { origin },
})
    .on('proxyRes', (proxyRes, req, res) => {
        if(req.headers.origin) {
            proxyRes.headers['access-control-allow-origin'] = req.headers.origin;
            proxyRes.headers['access-control-expose-headers'] = 'x-glitch-instance-requests, x-glitch-instance-age';
        }
        // Add some metrics about the running server instance.
        proxyRes.headers['x-glitch-instance-requests'] = ++served;
        proxyRes.headers['x-glitch-instance-age'] = (Date.now() - time) / 1000 | 0;

    })
    .listen(process.env.PORT);
