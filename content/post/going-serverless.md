---
title: "Going Serverless"
created: 2021-11-19
publishedOn: 2021-11-22
lastMod: 20221-11-22

heroImageUrl: ""

ogImageUrl: ""
ogSummary: ""

tags: 
    - Serverless
    - Infrastructure

draft: true

summary: As I get my feet wet with some new technology - this blog takes the hit and becomes my plaground once again. Here's my writeup of transitioning this blog to static HTML and serverless hosting using Hugo and AWS.
---

Over the years this blog has been many things:- a Wordpress site; a Drupal one; Zend Framework, Symfony, Slim & Silex from the PHP world; and even recently Java. I'd use it as a playground to experiment & learn about new technology and just dump it on AWS instances along with other projects I had on the go at the same time. So it was backed by a MySQL database, there was a "back-end" admin section where I could edit the articles (mostly in markdown via a single large textarea) and a bit of templating to render the "dynamic content".

Normally, this is fine and the costs and management just blend in with larger projects. However, over the last two years I've dialed a lot of other things back and ended up running an EC2 instance and RDS Serverless database **JUST** for this blog. That's pretty expensive - about £3 per day!

I starting thinking about converting the blog to static HTML. I knew tools existed that could be used to provide templating and convert markdown into HTML, I'd just never really investigated that space much. So that's exactly what I went off to do.

After a few days, I had come up with the following choice of technology and tools:-

* **[HUGO](https://gohugo.io)** for the static site generating. It's very fast and is a single binary written in go which made it very easy to get "installed" and start experimenting.
* **[S3](https://aws.amazon.com/s3/)** for the storage. If you want to serve files on the internet, they have to live somewhere! :-)
* **[Cloudfront](https://aws.amazon.com/cloudfront/)** provides two important things. First, it lets me point my own domain name to the S3 bucket whilst using https and provides [Lambda@Edge](https://aws.amazon.com/lambda/edge/) which I can leverage to do some URL rewriting so the site doesn't suffer a bunch of link-rot after the switchover.
* **[Route53](https://aws.amazon.com/route53/)** for DNS. It's where I have my handful of domains registered anyway and alows an equivalent of an apex CNAME so https://paulcourt.co.uk works as well as https://www.paulcourt.co.uk.
* And finally, **[CertManager](https://aws.amazon.com/certificate-manager/)** for the SSL certs. 

I'll cover each one of these in more detail as I go through this write-up.

*Yes, this is heavily invested in AWS, but that's where the majority of my experience has been and is currently what I'm using for my current day job - so the more experience I have with the various components, the better.*
{.small}

## Making the dynamic, static

In my short search for static site generators, I dismissed a whole lot that were actually React or Vue.JS frameworks, which is a whole lot of complexity I don't need, and it came down to Jekyll and HUGO.

Jekyll is a ruby gem and has setup instructions and a few warnings about some things maybe not working of you're on a specific version of Ruby. Whereas the HUGO installation instructions were "download the binary and run it from anywhere" - My kind of installation! :-)

![HUGO Logo](https://files.rgoyle.com/images/2021/hugo-logo-wide.svg)
{.ml-5 .mr-5 .pl-5 .pr-5}

As it turns out, there's only actually 1 single bit of actual dynamic content displayed for each post on this blog. That bit on the top of the right hand column which says:-

**This article is: ### days old**
{.text-center}

It's the only one of the stats that actually needs to change dynamically. Even though I was using the templating engine to calculate all the other stats "on-the-fly", they only every actually change when I edit an article.




## Links

- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example-function-redirect-url.html
- https://medium.com/@Consegna/use-lambda-edge-to-handle-complex-redirect-rules-with-cloudfront-40e93254d4c1