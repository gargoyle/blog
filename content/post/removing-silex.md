---
title: "Removing Silex"
created: 2019-01-14T08:07:05Z
publishedOn: 2019-01-17T08:07:05Z
lastMod: 2020-07-27T08:07:05Z

heroImageUrl: ""
slug: "removing-silex"

ogImageUrl: "https://files.rgoyle.com/images/2019/replacing-silex/card-icon.png"
ogSummary: "Walking through replacing the Silex framework behind this blog with.... nothing."

tags: "Frameworks, Optimisation, PHP"

draft: false

summary: "I developed this iteration of my blog platform as an exercise in Event Sourcing and CQRS. As such, I did not want to spend too long learning the ins and outs of a new framework, so I fell-back to one of my old favourites to fill the gap of HTTP request routing and configuring controllers - Silex."
---
I developed this iteration of my blog platform as an exercise in Event Sourcing and CQRS. As such, I did not want to spend too long learning the ins and outs of a new framework, so I fell-back to one of my old favourites to fill the gap of HTTP request routing and configuring controllers - Silex.

However, not long after I deployed the first version, Silex's creators had decided that Symfony had become so modular that in its smallest version it was essentially the same size and as easy to use as Silex - and announced that the [Silex project would be closing down with an end of life date of June 2018](https://symfony.com/blog/the-end-of-silex).

Given that it's now 2019 - I figured it was about time I got round to replacing Silex. 

What should I replace it with though? Slim... Symfony 4 / Flex... Something Laravel-ish (Uggh. Excuse me, I just vomited a little bit in my mouth)?

No. If you've read my [previous article about frameworks](https://ga.rgoyle.com/article/ditch-the-framework), you'll realise I am becoming increasingly in favour of NOT using them at all. I'm not going to replace the framework with another newer framework, instead I am going to just pull out the individual components I actually need - which is pretty much a router and the [Twig templating engine](https://twig.symfony.com/).

## The current situation
So what do I hope to achieve from this exercise? Well, for a start, I will be removing a now obsolete framework and hopefully in addition getting some kind of speed boost.

I'm writing this article "live" in the sense that I have my development VM up and running my current code and I'll be adding my findings here as I make changes. So it will probably be helpful to try and set the scene a little bit.

At some point, I'll get this codebase in a state that I am happy to share publicly in its entirety - but for now a few snippets should paint enough of a picture.

My `index.php` looks like this:-

```php
<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Pmc\Blog\AppContainer;

define('START_TIME', microtime(true));
define('APP_ROOT', dirname(__DIR__));

session_start();

$app = new AppContainer();
$app->getHttpHandler()->run();
```
Nothing too exciting here. Fairly standard include of the autoloader that is generate by composer, creating my main Application DI container, fetching the HttpHandler (Which is the Silex part) and running the app.

Lets dig into the  `AppContainer` a little bit.

```php
    public function __construct()
    {
        $configFilename = APP_ROOT . '/' . getenv('CONFIG_FILE');
        $fromIniFile = [];
        if (file_exists($configFilename)) {
            $fromIniFile = parse_ini_file($configFilename, true, INI_SCANNER_TYPED);
        }
        $this->config = $fromIniFile;

        $this->logger = new Logger('APP_LOG', [new StreamHandler('/tmp/blog.log')]);
        $this->messageBus = new MessageBus($this->logger);
        $this->commandBus = new CommandBus();
        $this->eventNameClassMap = new EventNameClassMap();
        $this->factory = new GigaFactory($this->logger);

        $this->userModule = new UserModule($this->getDatabase(), $this->getEventStore(), $this->getMessageBus(), $this->getFactory());
        $this->articles = new ArticleModule(
                $this->getDatabase(), 
                $this->getEventStore(), 
                $this->getMessageBus(),
                $this->getCommandBus(),
                $this->getFactory());

        $this->sessionManager = new SessionManager($this->getSession(), $this->userModule->getQueryFactory(), $this->logger);
        $this->messageBus->addListener($this->sessionManager);
    }
```

This is creating and setting up a lot of the components of my Event Sourcing and CQRS setup. Crucially to this experiment though, Silex has not been bootstrapped yet. That happens in `getHttpHandler()` which looks like this:-

```php
    public function getHttpHandler(): Application
    {
        if ($this->httpHandler == null) {
            $this->httpHandler = new HttpApp(
                    APP_ROOT . '/views',
                    $this->getSession()->profile(),
                    $this->getFactory(),
                    $this->getMessageBus(),
                    $this->getCommandBus(),
                    $this->userModule,
                    $this->articles,
                    $this->logger,
                    $this->config['httpHandler'] ?: []);
        }
        return $this->httpHandler;
    }
```

By adding an almost empty `index.html` file, a `phpinfo.php` and running my app with and without the last line of `index.php` enabled, this will enable me to get some basic speed metrics from the Chrome developer tools. 

For each one, I made sure "disable cache" was ticked and CTRL-F5'd a few times and took the slowest speed.

First, nginx spitting out a static html file:-
![Static HTML page load](https://files.rgoyle.com/images/2019/replacing-silex/static-html.png)

Ignoring all the other requests and just focusing on the main document fetch, we can see nginx is capable of spitting out a small HTML file in 5ms (There's no network lag because this is a VM running on my dev machine).

Next, a basic PHP page which is literally `<?php phpinfo();` and that's all:-
![A very simple PHP page](https://files.rgoyle.com/images/2019/replacing-silex/simple-php.png)

So now we have nginx handing off to php-fpm and returning the result back through nginx in 13ms.

Now for a load of the app with the last line of `index.php` commented out - so no Silex or Twig and no database queries being run. Just my own DI container and app setup logic:-
![Restricted app](https://files.rgoyle.com/images/2019/replacing-silex/restricted-app.png)

By requesting a page which doesn't exist, we will get the Silex app to startup and render an error page, but none of my controller code will run and no database queries will be executed:-
![Full app](https://files.rgoyle.com/images/2019/replacing-silex/not-found.png)

And finally for a full page load of the blog app, Silex, Twig, database queries (empty resultset) everything.
![Full app](https://files.rgoyle.com/images/2019/replacing-silex/full-app.png)

From these basic tests, we get the following approximate timings:-

* 5ms - browser to nginx comms.
* 10ms - Handoff to php-fpm.
* 40ms - Setting up my part of the application code.
* 80ms - Setting up Silex and Twig.
* 85ms - Running the query and rendering the result.

Around 220-230ms total.

This is not meant to be scientific - something like blackfire.io or NewRelic APM would go into much more detail. It gives me enough for this experiment though. 

80ms for the setup of Silex is not a lot. But given that I am actually only using the framework's routing, Twig hooks and controller setup I could potentially save upto 1/3 off page load times.

## The Results
OK. So I have removed Silex and reworked my `index.php` so that I have manually setup Symfony's `HttpKernel`, `HttpFoundation\Request`, `Response` and `Routing` components. 

In my AppContainer I also manually configured [Twig](https://twig.symfony.com) as the `TwigServiceProvider` was part of Silex.

I've reworked my controllers a little to get them working with the new routing setup and am back to the point where I can render the same pages as earlier. So what do the numbers come out as?

* 5ms - browser to nginx comms.
* 10ms - Handoff to php-fpm.
* 85ms - Setting up my part of the application code.
* N/A - ~~Setting up Silex and Twig~~
* 20ms - Running the query and rendering the result.

Around 110-120ms total.

So by using the components separately I increased "my" code setup by a factor of 2 to 80ms, but completely eliminated the Silex setup - a net gain of 30-40ms. So where did the other 60-70ms gain come from?

### The answer is: Knowledge!

By not relying on a quick one liner from Silex to configure Twig (using `TwigServiceProvider`) it forced me to refresh myself with the Twig documentation which resulted in me finding the caching option! I've also learned a lot more about the other components being used for the routing, request and response cycle. 

Yes. I could have enabled the Twig caching option from within the Silex setup and got the same speed increase. The point I'm trying to make though, is that by not relying on the framework **I gained a better understanding of the code**. 

Even if no performance increase was made, this has still been a very valuable exercise. I can't express enough the importance of increasing your knowledge of the tools you use and how it can benefit you as a programmer and the applications you produce.

Frameworks can be great, but there is always going to be some kind of trade-off.