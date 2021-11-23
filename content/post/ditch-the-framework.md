---
title: "Is it time to ditch Frameworks?"
created: "2018-10-12"
publishedOn: "2018-10-29"
lastMod: "2020-07-27"

heroImageUrl: "https://files.paulcourt.co.uk/images/2018/packagist-stats.png"
slug: "ditch-the-framework"

ogImageUrl: "https://files.paulcourt.co.uk/images/2018/composer.png"
ogSummary: "OK. Sharpen your pitchforks! I'm going to dive into why I think you should ditch your favourite PHP framework for anything other than MVPs."

tags: 
    - Frameworks
    - Opinion
    - PHP

draft: false

summary: In the last two and a half decades that I have been a "web developer", things have come a very long way. Languages like JavaScript and PHP have grown from quick scripting tools into the cornerstone of the software which many enterprises are building their business critical systems with. As these languages have matured so have the ecosystems that surround them.
---
In the last two and a half decades that I have been a "web developer", things have come a very long way. Languages like JavaScript and PHP have grown from quick scripting tools into the cornerstone of the software which many enterprises are building their business critical systems with. As these languages have matured so have the ecosystems that surround them. 

(*I'm just using PHP and JavaScript as examples because those are the ones I have used the most in my years as a developer*)

We now have quick & easy access to an almost endless supply of libraries, package managers and frameworks. So many, in fact, that I believe we have well and truly hit a tipping point of negative returns!

## The rise of components.
Since it's launch in 2012, composer has been an amazing tool for the PHP community. It's driven home the concept of creating small reusable components and made it exceptionally easy for developers to pull useful code into their projects.

At the time of writing (October 2018), packagist (the main composer package repository) [shows some mind boggling statistics](https://packagist.org/statistics) with almost 200,000 packages and a combined total of 1.4 million versions of those packages. It's not showing any signs of slowing down either, with October looking like it's going to just tip past the 0.5 billion package installations mark.

![Graph showing monthly package installs rising from 200K in April 2012 to almost 500M in October 2018](https://files.paulcourt.co.uk/images/2018/packagist-stats.png)

At roughly the same time, another great project in the PHP community was gaining traction - [The PHP Framework Interop Group or PHP-FIG for short](https://github.com/php-fig). Started in 2009 and as it's name suggests, this was a collaboration between a number of framework developers to start to define standards (PSRs) which all frameworks could start to agree on.

The first three PSRs defined standards for autoloading and general coding style. As these PSRs were adopted by major frameworks, it became easier and easier to use parts of one framework with others. Indeed, the frameworks themselves transformed from a monolith of code towards just being the bits of glue that tied together multiple components which were now being spin out into stand alone packages.

For the PHP community this is awesome progress and shows massive improvements and maturity over the years.

However, there is a major drawback. And let's be clear - these are not limited to PHP - the same can be said for JavaScript (nodejs & npm) and probably any other language with the same type of tooling and frameworks.

## Lack of Understanding

With an edit of a `composer.json` and a `package.json`;  a flick of the wrist to bash in `npm install` and `composer update` and hey presto, I have a CSS framework for the front end stuff and a PHP one for the backend. 2 Frameworks, hundreds of components and 13,000+ files!!

Ok, Ok. The 13,000 figure is a bit of an attention grabber. Most of that count comes from the build tools for converting SCSS into the final standard CSS. But it does include two frameworks and their dependencies; [Foundation from Zurb](https://foundation.zurb.com/) (303 files) and [Slim PHP](https://www.slimframework.com/) (1200 files).

That's still a fair old chunk of code that I just got "for free", and these are both what would be considered micro-frameworks. Those numbers could easily be 2-3 time that if we talk about "full" frameworks like Symfony, Laravel, React and Angular. 

From a security point of view this is almost unmanageable. Who is verifying all this code? what's the audit process? Are there any hidden "gremlins" in all those files?

Earlier in the year [Troy Hunt did a great write up of a bunch of sites that seemingly fell into this security trap](https://www.troyhunt.com/the-javascript-supply-chain-paradox-sri-csp-and-trust-in-third-party-libraries/). Pulling in large number of these "Free" libraries and frameworks could be one of the most expensive things a company does.

The lack of understanding doesn't just rear it's head from a security point of view ether. 

Whenever I work on projects from an operations side of things and am not as close to the code as when I am part of a developer team, I often have to ask questions to figure out how we are going to achieve HA or scale a database: "why does X do Y?" or "how does x data get from A to B?". I am worried by the number of times the answer comes back as "not sure" or "don't know" and "the framework handles that".

Developers are literally cobbling together applications with sticky tape!

I'm not the only one that thinks this way.

> At 51 years of age, I simply can't abide the "don't waste time understanding, just use a framework" mindset of today's coders, and yet I no longer have the patience to try to explain the problem. Knock yourselves out kids, and get off my lawn!
> 
> — [Tony Miller (@miller_tony) 9th September, 2018](https://twitter.com/miller_tony/status/1038566824026288128)

I'm a few years behind Tony, but I don't see the trend changing much and could easily see myself making the same type of comment in another few years time...

If you don't understand how or why your framework of choice is doing something, how are you ever going to be able to make well informed decisions on how to structure the architecture of your project? Do you need a bigger database server or is your ORM just horribly inefficient for your use case? 

Frameworks are meant to speed up the process of developing applications, but in every large scale application I have come across that uses one, the framework becomes the bottleneck. Developers start to spend longer working round the nuances of the framework than solving the problem at hand. Seemingly "simple" feature requests turn into massive refactoring exercises.

I've recently been teaching myself CQRS and Event Sourcing. One of the learning resources I turned to was [Shawn McCool's Event Sourcery project](https://eventsourcery.com). This is an excellent resource for anyone wanting to get to grips with CQRS and Event Sourcing from a PHP perspective. 

One statement in over 3 hours of video tutorials really jumped out and has stuck with me since I first watched it:-

> "It's well worth your time to directly own and completely understand the most critical code in your infrastructure"
> 
> -- Shawn McCool (from [Event Sourcery](https://eventsourcery.com))

Read that quote again. Let it sink in. It's a damn good one!

## DRY! I hear you cry

I'm not suggesting ditching composer and abandoning packagist altogether, but I would point out that DRY stands for Don't Repeat **Yourself** and not Don't Repeat Someone-else.

There are some great libraries and tools out there on the likes of packagist. Use them. But make sure you also take the time to understand them. Are they well maintained? What's the security history like? what about their dependencies? and the next level of dependencies? 

If you don't have time time for this, you need to ask yourself why? What part of the development lifecycle on your current project is allowing you to use code you don't fully understand?

The only scenario I can think of is when you are prototyping an MVP. 

Beware of the "just one more feature" trap though. Make it very clear to whomever needs to know that it is prototype code and the whole thing will more than likely need a rewrite if the product is successful. Otherwise, before you know it, you'll be supporting this labyrinth of mystery as a piece of business critical software.

----
I had an itch I wanted to scratch with this post, I think I got there in the end, but I am aware my writing probably has much room for improvement. Constructive feedback and comments on my posts are always welcome - [give me a ping on twitter](https://twitter.com/GargoyleTwoZero/status/1057012223418253313).