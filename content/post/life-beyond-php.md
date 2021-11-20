---
title: "Exploring life beyond PHP"
created: 2018-06-04
publishedOn: 2018-06-17
lastMod: 2020-07-30

heroImageUrl: ""

ogImageUrl: "https://files.paulcourt.co.uk/images/2018/vertx-logo-square.png"
ogSummary: "After 20 years, I'm defecting to the other side! PHP is Slow and Java is Fast!!"

tags:
    - Experiments
    - Frameworks
    - Java

draft: false

summary: After 20 years, I'm defecting to the other side! PHP is Slow and Java is Fast!! Here are some of my thoughts and ideas as I go about ditching PHP in favour of Java and exploring how the world of modern Java web apps shape up as I dive into the vert.x framework. I'm not intentionally going to be bashing PHP (although I suspect it might come across that way), but I'm going to try and explore what it is that keeps us tied to PHP even though there are (probably) better solutions out there.
---
PHP has come a long way - especially in the last few years. It has gained some excellent language features that make it great for both "quick and dirty" projects as well as larger "enterprise" ones - where more time and thought is normally given to testing and deployments.  

It's the ecosystems around the latter type of project that I am going to experiment with something a bit different - because once you get past the "just hit save and then refresh" method of development - a lot of the rationale for choosing PHP starts to lose its weight.

## What's an enterprise application?

So lets start off by fleshing out what my interpretation of an enterprise application is:-

* Its "mission critical" - The app covers large chunks of (if not the entire) business model. Downtime almost always means someone somewhere is losing money. Or perhaps worse, reputation.
* Its large - I'm talking tens or hundreds of thousands of lines of "business code" not including what comes with your framework of choice.
* Its QA'd and tested - Pull requests and code reviews. Unit tests, integration tests, manual tests. QA stages are probably as long as development stages - if not longer. 
* It's deployed to multiple servers for high availability (HA) or scaling. More than likely, there would be some kind of automation to this.

PHP can handle all these tasks. It has some great frameworks (and some not so great ones), testing libraries and tools, IDE support that goes as far as step-through-debugging thanks to projects like [Xdebug](https://xdebug.org/), and a vibrant and active community which makes it very easy to find tutorials and get help. 

But so do a lot of other languages without PHP's biggest drawback - *it's slow!* (but I'll come back to that a little bit later!)

## But why Java?

I can almost hear you screaming into your monitors from here. 

> But why Java? Isn't that at completely the other end of the spectrum with big monolithic application servers? Isn't it old and something they just use in schools to teach programming?

I find that Java still gets tarred with the brush from it's past in much the same way people think of PHP in it's version 4 and 5 days - "Isn't that just a HTML scripting language?". In reality, modern Java has progressed as much from my university days (Java 1.1) as PHP has in comparing PHP 4 or early 5 versions to the current PHP 7.2.

All that being said, there's a fair old chunk of just plain personal appreciation for the language,  it's just something I want to pick up again. As I mentioned, I programmed a bit of it back in uni and I enjoyed it. It also shares PHP's "C style" syntax of curly braces and semicolons so it's not going to be a total nightmare for me to pick it up again - sorry Python, I just can't cope with indentation alone ;-)

Specifically, thanks to a suggestion from a friend, I am looking into [vert.x](https://vertx.io/) and even more specifically than that [vertx-web](http://vertx.io/docs/vertx-web/java/). I'll cover a small code example towards the end of this post, but from what I have gathered so far, the "mile-high" description would be that that it is something similar to Slim or Silex in terms of how you would setup routes and controllers. 

## PHP is Slow, Java is Fast!

So let's come back to my earlier remark about PHP being slow, because you might be thinking I am using the wrong framework. That I need a micro framework like Slim or Silex instead of a "full" framework like Symfony or Laravel.

No. I mean that when you look at a [big list of web frameworks performing a simple but realistic test](https://www.techempower.com/benchmarks/#section=data-r16&hw=ph&test=fortune), PHP is slooooooow!

That list from TechEmpower takes the best performing framework and gives it 100%, everything else is then ranked against it. 

It's no surprise that the number 1 slot is occupied by something written in C. But two things *did* surprise me:- Firstly, how high up the list Java frameworks were; and secondly, how *low* PHP ones were. 

I knew PHP was never going to be anywhere near the fastest frameworks, but always thought it was much better than it is. I mean, *everyone* still uses it for major apps (Facebook, etc). However Laravel, which is really quite popular, ranks in at just 1.3% of the capacity of the top performer.

I'm not going to start writing web applications in pure C though, so let's look at [a filtered version of the results](https://www.techempower.com/benchmarks/#section=data-r16&hw=ph&test=fortune&l=hr9zlr&p=zik0zj-zik0zh-zijunz-cn3&c=5) so we can get a better look at how Vert.x - or more specifically Vertx-web stacks up against Slim. Both of which are considered micro frameworks and give us a good helping hand with requests, responses and routing, but leave all the other bells and whistles as optional extras you'll have to configure for yourself.

![Performance comparison of vert.x and php](https://files.paulcourt.co.uk/images/2018/vertx-vs-slim.png)

We can clearly see that we are not just talking about a "speed boost" or a few percent improvement. The vert.x results are showing a 7x (or 700%)  increase in performance over Slim. That is something worth thinking about. Especially if you are already running multiple servers to handle load.

## Code comparison

So what's the price to pay for this massive boost in speed? Are we talking about massively more complex code or application setup?

Let's have a comparison of a good old "Hello, Bob" program written in Slim and in vert.x web frameworks. 

Both frameworks required two files. Slim needed `index.php` (which is the code below) and `composer.json`. Vert.x needs `SlimKiller.java` (code below) and `pom.xml` (the equivalent of composer.json) for dependencies. I'm not going to count the size or complexity of the `composer.json` or `pom.xml` files here, because in both cases they were managed by the IDE (Netbeans).

First up, PHP + Slim:-

```php
namespace 
require 'vendor/autoload.php';

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

$app = new \Slim\App;

$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");

    return $response;
});

$app->run();
```

and now, Java + vert.x

```java
package org.mcfoundation.website;

import io.vertx.core.AbstractVerticle;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

public class SlimKiller extends AbstractVerticle
{
    @Override
    public void start() throws Exception {
        Router router = Router.router(vertx);
        router.route("/hello/:name").handler(this::hello);
        
        vertx.createHttpServer().requestHandler(router::accept).listen(8080);
    }
    
    private void hello(RoutingContext ctx) {
        final String name = ctx.request().getParam("name");
        ctx.response().end("Hello, " + name);
    }   
}
```

So, no. There is no big complexity in terms of code.

Since I had these two projects built, I deployed them both into the same virtual machine with 4GB RAM and 4 vCPU cores (Running in VirtualBox 5) and then hit them both with siege for a 60 second benchmark test...

![Graph showing number of requests for Slim (2778) vs Vertx (219,458)](https://files.paulcourt.co.uk/images/2018/slim-vertx-siege-graph.png)

By no means a scientific benchmark, but those numbers are somewhat staggering! The TechEmpower tests above are a much more organised benchmark, so I would use their figures, not mine. It was just a bit of fun really.

## Deploying the app?

Well you can forget about the complexities of Tomcat servers, etc from Java web-app days of old. As you might have noticed in the code above, the vert.x framework includes it's own HTTP server, and with the appropriate build configuration you create a single "fat" .jar file. Which for this example weighed in at a massive 4Mb!! 

Running `java -jar myApp.jar` then gets you your working HTTP server ready do accept requests.

For the PHP app on the other hand, you are going to need to configure nginx + php-fpm (or something similar) before you even think about copying the code onto the server.

## Conclusion

If you are a PHP dev working on traditional CRUD applications, don't suddenly feel that you have chosen the wrong tool for the job. 

I've been doing it for 20 years and PHP's performance has almost never been an issue. Normally, performance starts to show up during reporting projects where an app has been running for a while and the business then wants to start collecting various metrics.

However, if you are working on something which is already starting to stretch the CPU on your servers, It might be worth thinking how much a different language could effect that application.

I'm excited to see where this little trip takes me. Not because I am in desperate need to serve 200,000 "Hello, Bob" web pages in 60 seconds, but just as a different playground to the one I have spend all my time in so far...