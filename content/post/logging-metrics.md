---
title: "Setting up logging & metrics in your app"
created: 2019-09-18T09:15:21Z
publishedOn: 2019-10-04T00:15:21Z
lastMod: 2020-07-27T00:15:21Z

heroImageUrl: "/img/hero-bg.jpg"
slug: "logging-metrics"

ogImageUrl: "https://files.paulcourt.co.uk/images/2019/logging.png"
ogSummary: "Some thoughts on setting up logging and metrics recording in your applications and throwing the rule-book out the window."

tags: "Logging, Metrics, PHP"

draft: false

summary: "Singletons, static references and global variables are generally considered evil by most top-rated answers to related questions on stack overflow! However, today I'm going to offer some thoughts on using static logging and metrics recording classes in your applications and why it's not all that bad."
---

Before we begin, I want to share my point of view on an area of development related to this post.

Singletons, static references and global variables all share a few things in common - they are misunderstood, miss-used and generally considered evil by most top-rated answers to related questions on stack overflow!

However, almost all of these answers that I have seen incorrectly link them to and assume that they are somehow always allowing modification of global state (which **is** bad). The main problem with this, being that if global state can be modified by any bit of code anywhere, you lose control of that state and have a very bad [code smell](https://en.wikipedia.org/wiki/Code_smell) indeed.

To be clear, I am in full agreement that if your PHP code is using `$_GLOBAL['something']`, referencing `SomeClass::someStaticProperty` or is scattered with `MySingleton::getInstance()` then you are probably on the path to future problems. 

This does not make these things universally evil though. They are valid valid constructs in writing object-oriented code and always avoiding them just because stack overflow said they are evil will not make you a better developer - knowing why they exist and how to use them properly is what will make you a better developer. IMO.

So, I'm putting the rule book to one side for a while, and hopefully showing you an example of how slapping static references to a class all over your code can actually help.
 
## Logging and Metrics
Logging is an important aspect of a software applications life-cycle and will often be involved in development (debug level) and in production to provide support information (info level) and resolve system problems (error level).

Although there are no official standards for various logging levels, or what types of information should be logged to any given level, [the log4php project](https://logging.apache.org/log4php/docs/introduction.html) has a pretty clear list which seems to align with common recommendations.

Like most things dev related, though, you are probably going to experiment a bit and find out what works for you. 

I think 6 levels is far too much choice and leads to developers not really knowing where messages belong. What one developer logs as a warning level another logs as info level. So I'm going to stick with just these levels:-

- DEBUG - Detailed information targeted for developers to use **during development**. The level of information contained in these logs would be a security and/or a GDPR nightmare so definitely not for use in production.
- INFO - Generic but informative information about the applications internal progress while running. Can be helpful to use in production, especially for newer applications / features which might not be fully stable. Care should be taken not to include any PII or security related information though. 
- ERROR - There should only be a very small number of places where this level is used in your application. It should signify that the application was unable to continue and is a last ditch attempt at providing some post-mortem evidence before the program exits. If the program is able to catch the error and continue, then use the INFO level to log the details.


## The traditional approach - Using the DI container.

If you have been a good little programmer and separating things into different layers, bounded contexts and injecting all your dependencies from your DI container(s), then almost all of your classes will have a `$logger` dependency of some kind. 

The two main approaches I have used in the past are:- as a **required** constructor argument, in which case a class can safely use:-
```php
private function someMethod()
{
    $this->logger->debug('Hello, World!');
}
```
... or, as an **optional** injected dependency via some sort of `setLogger();` method. In which case, any logging code needs to first check for its existence:-
```php
private function someMethod()
{
    if ($this->logger instanceof Logger) {
        $this->logger->debug('Hello, World!');
    }
}
``` 
... after 3 uses of that block you probably refactor it into a generic `log()` method and then [after you've done that for the third time](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)), you'll probably end up using a trait! *(ugh, I just threw up in my mouth a little bit)*

Not to mention that half of the code in your DI container is now there just so that the logger is getting passed through to all the places it needs to be!


## Something a bit different - A static class
OK. With the preamble out of the way, let's get into the nitty gritty of this post and create our static logging and metrics class.

Like any other class, careful consideration should be given to what we are going to expose via its public interface - perhaps even more so in this case. I have chosen to take a small subset of the logging levels from PSR-3 (I think there are too many in the PSR, but that's a discussion for another day) and methods to cover the functionality available via statsD for the metrics recording side of things.

```php
class LM
{
	// Logging
	public static function debug(string $message, array $context = []): void {}
	public static function info(string $message, array $context = []): void {}
	public static function error(string $message, array $context = []): void {}
	
	// Metrics
	public static function increment(string $name, $sampleRate = 1): void {}
	public static function decrement(string $name, $sampleRate = 1): void {}
	public static function set(string $name, $value): void {}
	public static function guage(string $name, $value): void {}
	public static function timer(string $name, $value): void {}
}
```
That's our main public interface. 

Make sure it is configured via your autoloader and we can treat is as if it was part of the PHP runtime. Just call the methods statically when you need them:-

```php
    public function someMethod(): void
    {
        LM::debug('Hello, World - I\'m in someMethod!');
    }
```

At the moment, we are not going to get anything logged anywhere, but this code "Works" in the sense that it will run without failing.  But lets make it a bit more useful, and actually configure a logger and a StatsD client to actually do something useful.

First, we'll add two private static properties:-

```php
class LM
{
	private static $logger;
	private static $statsd;

...
```

And static init methods so that we can configure them:-

```php
	public static function initLogger(LoggerInterface $logger)
	{
		if (self::$logger instanceof LoggerInterface) {
			throw new RuntimeException('Logger has already been initialised!');
		}
		self::$logger = $logger;
	}

	public static function initStatsD(StatsdClient $statsd)
	{
		if (self::$statsd instanceof StatsdClient) {
			throw new RuntimeException('StatsD service has already been initialised!');
		}
		self::$statsd = $statsd;
	}
```
We've got some protection against the idea that this is "global state" and could be changed from any bit of code because the logger and statsD client can only be configured once - any attempt to reconfigure them will fail.

Now we update the actual logging methods to use the logger (if it's available). For example:-

```php
	public static function debug(string $message, array $context = []): void
	{
		if (self::$logger instanceof LoggerInterface) {
			self::$logger->debug($message, $context);
		}
	}
```
Repeat this same principle for each of the other methods we defined as our main interface.

And finally, somewhere early on in the app setup (I put this pretty close to the top of index.php), we initialise the logger and statsD client:-

```php
/*
 * Logging & Metrics
 */
$logger = new \Monolog\Logger('Web');
$handler = new \Monolog\Handler\ErrorLogHandler();
$handler->setFormatter(new \Monolog\Formatter\LineFormatter('[%datetime%] ('.TRACE_ID.') %channel%.%level_name%: %message% %context% %extra%\n'));
$logger->pushHandler($handler);

LM::initLogger($logger);
$statsd = new \Domnikl\Statsd\Client(new \Domnikl\Statsd\Connection\UdpSocket());
LM::initStatsD($statsd);
```

Less than 10 lines of code for a no-op version that will allow your application to function if at some point in the future you find yourself with a codebase full of `LM::debug()`  type calls and around 100 lines for a fully working implementation.

And that's it. Happy logging!