'use strict';

let redirectList = {
        "/article/installing-starlink" : "/post/installing-starlink.html",
        "/article/javafx-on-raspberry-pi" : "/post/javafx-on-raspberry-pi.html",
        "/article/flxs-public-build" : "/post/javafx-on-raspberry-pi.html",
        "/article/new-blog-engine" : "/post/new-blog-engine.html",
        "/article/pi-server-setup" : "/post/pi-server-setup.html",
        "/article/pi-swap" : "/post/pi-swap.html",
        "/article/logging-metrics" : "/post/logging-metrics.html",
        "/article/front-end-optimisations" : "/post/front-end-optimisations.html",
        "/article/radeon-vii-ubuntu" : "/post/radeon-vii-ubuntu.html",
        "/article/removing-silex" : "/post/removing-silex.html",
        "/article/cross-server-locking-with-mysql-php" : "/post/cross-server-locking-with-mysql-php.html",
        "/article/ditch-the-framework" : "/post/ditch-the-framework.html",
        "/article/life-beyond-php" : "/post/life-beyond-php.html",
        "/article/lets-encrypt-wildcard-route53" : "/post/lets-encrypt-wildcard-route53.html",
        "/article/network-speed-testing" : "/post/network-speed-testing.html",
        "/article/relaunching-soon" : "/post/relaunching-soon.html"
    };

exports.handler = async (event, context, callback) => {

    let request = event.Records[0].cf.request;      
    if (redirectList[request.uri]) {
        // If the request url matches to one of the redirects, return a 301 to cloudfront
        const redirectResponse = {
            status: '301',
            statusDescription: 'Moved Permanently',
            headers: {
                'location': [{
                        key: 'Location',
                        value: redirectList[request.uri],
                    }],
                'cache-control': [{
                        key: 'Cache-Control',
                        value: "max-age=3600"
                    }],
            },
        };
        callback(null, redirectResponse);
    } else {
        // Otherwise, proceed to send the request to the origin.
        callback(null, request);
    }
};
