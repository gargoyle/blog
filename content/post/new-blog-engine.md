---
title: "New Blog Engine"
created: 2020-07-27T11:17:58Z
publishedOn: 2020-07-27T11:17:58Z
lastMod: 2020-07-27T11:17:58Z

heroImageUrl: "/img/hero-bg.jpg"
slug: "new-blog-engine"

ogImageUrl: "https://files.paulcourt.co.uk/images/common/rss-square-orange.png"
ogSummary: "I've rebuilt the blog software, updated the visuals and had a moment to reflect on things so far."

tags: "Java, Helidon, Reflections"

draft: false

summary: "It's been nearly 1,000 days since I published my \"relaunching soon\" post and I've got my Java rewrite to a point where it's actually usable again. So here's some details on the changes and some reflections on the overall progress of this blog."

---

I spend almost as much time fettling and tweaking with the actual software used to drive this blog as I do writing articles, so it seems fitting to start with the technical changes.

The previous incarnation of this blog was written using PHP and followed an event-sourcing and CQRS approach. I was happy with the results and it was a great way to experiment with those technologies. There was something satisfying about being able to drop the database and have it recreated by reprocessing the event stream - even if it was complete and utter overkill for a blog.

Around two years ago, [I started to explore the Java ecosystem](/article/life-beyond-php). Initially this led me to Vert.x - or more specifically "vert.x web". However, I was also [unhappy with large web frameworks](/article/ditch-the-framework) and felt like trying to re-learn Java while this framework was magically doing alot of stuff in the background was leaving me scratching my head a lot.

Eventually, I stumbled upon [Helidon](https://helidon.io) - a new project from Oracle which is billed more as a collection of libraries than a full framework - and something about it just clicked with me. It was allowing me to explore Java without getting in the way and was a very effective tool for scratching that itch.

Fast forward another 12 months and Helidon 2.0 has just been released and I already had a few experimental API / Microservice programs completed with version 1 and decided (as I always do sooner or later) that it was time for a "real world" application and that real-world application is almost always this blog! :-) 

Thus was born the current incarnation of this site. 

It's running on the "SE" flavour of Helidon 2.0, makes use of the [reactive DbClient](https://helidon.io/docs/latest/#/se/dbclient/01_introduction) for the main CRUD aspects. For templating out HTML markup I discovered [Freemarker](https://freemarker.apache.org/) which reminded me a lot of PHP Twig, so it was fairly easy to make the switch. 

Finally, for the front-end visuals I am using Bootstrap. Although this is in the opposite direction of my previous post on [optimising the front-end](/article/front-end-optimisations) of the old system - I have decided that a few hundred KB on the download is worth it for having some improved visuals. Un-cached page loads are still well under 500KB and 500ms which is plenty small enough.

## Content review
When I relaunched this blog, I set myself some ground rules:-
1. No rants.
2. Stick with what I know.
3. Take my time.

I think for the most part, I am good with 1 and 2. I've avoided getting drawn into throwing out "in my opinion" style posts around the non-technical areas of the industry - and there has been more than a few WTF moments! For the most part I'm keeping it to more of a "this is what works for me, and maybe it's useful for you too" and less "this is how you should do it".

Number 3 though... 

With just 12 published posts and onther 8 currently in various states of incompleteness, I am deffinately taking my time over writing them - but falling somewhat short of my initial target of one good post per month.

I think I am being too self critical of my own writing. I'll sometimes have sections that I don't feel read well, but I'll really struggle to re-word them into something better - so they get left for another day to "come back to and finish off". I think I need to push myself to hit the publish button a bit more and if something is really bad, I can always go back and edit it.

I'm also making two other changes to this version of the blog. 

First, I'm removing my self imposed 24 hours quarantine on new posts. I think for the most part I'm beyond "having a rant" and well into just letting things out of my control slide and getting on with the things I can control.

Second, I'm implementing a delete function for unpublished posts. Until now I have been keeping initial ideas and skeleton posts lying around. This seemed like a good idea at first, to let posts develop over time. However, I have probably wasted far too many hours trying to "polish a turd" of an idea for a post when I probably should have just deleted it at version 1 and moved onto another post.


Lets see how this goes. Hopefully it won't be another 6 months before the next post! :-D