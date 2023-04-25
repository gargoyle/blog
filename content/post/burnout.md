---
title: "Burnout: A tale from the trenches"
created: 2022-10-14T08:31:46+01:00
publishedOn: 2023-02-15T08:00:00+00:00
lastMod: 2023-02-15T08:00:00+00:00

heroImageUrl: "https://files.paulcourt.co.uk/images/2023/stress.jpg"
slug: "burnout"

ogImageUrl: "https://files.paulcourt.co.uk/images/2023/stress_square.jpg"
ogSummary: "A tale of the experience I had when working for a company that turned out to be a complete pressure-cooker."

tags: 
    - Life
    - Work

draft: false

summary: "I stare at the screen... I know what I need to write. It's not a difficult task, maybe two or three classes... a few dozen lines of code... but it won't come together into a coherent thought."
---

When I first though about writing this, I imagined maybe I could identify key points and maybe give some advice. However, even with the benefit of hindsight, it's not something I've been able to do. Instead this post has evolved into a "tale from the trenches" of the experience I had when working for a company that turned out to be a complete pressure-cooker. 

I think the process of writing this post, forcing myself to think back and in some way reflect on what was happening, has helped me. Maybe there's something someone can take away from this tale and it helps them. Ideally, before it gets as far as it did with me.

It's been really difficult to think about anything technical this past year and it's been easy to blame it on other things like the aftermath of COVID, family changes, financial worries, jobs around the house taking longer than expected. Anything really. Except... work.

Work was... well, work. 

If you asked me about work at the start of 2021, I would have told you I was enjoying it. It was challenging, something different, solving problems I hadn't faced before, stepping away from my comfort-zone and tackling different kinds of problems.

Looking back though, by the start of 2021 a pattern of fundamental issues and failures of the company I was working at were already established, it's just much more difficult to see them when you're on the inside.


## Into the pressure-cooker

It's early March 2020 and the job started like any other - for the first few months I was getting to know the systems and working on a few edge projects while I found my feet. Who was who and what was what, the usual stuff.

The companies offering was a web based SaaS solution for an operational management system. Or at least it was **supposed** to be a SaaS solution. It soon become clear that the company wasn't actually developing a SaaS product at all. 

Instead, as new clients came on board (or even when they were just at the demo phase), the entire system was copied and setup in its own environment and customised for that client. 100% of developer time was spent on developing these customisations for the latest client or fixing critical bugs or change requests on one of the other copies when required. Everything else was left to rot as indicated by the fact it was running on an obsolete version of Symfony, on-top of an obsolete version of PHP on-top of a version of Ubuntu that had reached end of life.

This was the kind of task I was bought in to address. The other four members of the "dev team" where good with PHP, but non of them had much operations knowledge or experience. My task was to update the platform and it was clear that this would be a two stage process. We could immediately bump the Ubuntu OS to the next LTS release without too much impact, which would give 12 months until that version also reached end-of-life. The second stage we would require upgrading the software quite significantly to support a newer version of PHP. The idea being that the 12 months should be more than enough time, and each of the copies being provided could be updated one by one.

However, within 6 months I was being pulled from my "main task" to chip in with PHP dev work whenever something was deemed important enough, and eventually the upgrade plans were sidelined in favour of bug-fixing existing systems and customising yet another copy of the system for the companies biggest client to-date, a large player in the utilities sector.

This, as I later found out, was the way the company worked. Each of the existing devs was the "go-to" person for one of the clients, being the one to fix the issues that rose for the client - even to the extent that some clients had a direct line of communication with the developer. We weren't so much a team, as we were individual developers working on separate applications which at one point in history shared a common codebase.

In December 2020 the fire-alarm went off for the first time. Well, truth be told, the fire-alarm was always going off. We had all become a bit numb to it as everything was "this is top priority". What actually happened in December was the shit well and truly hit the fan.


## Pressure level 1

Through a miss-communication somewhere in the planning stages the companies "standard" offering was going to need a LOT more customisation than what had been planned for, and it was going to need it in an unrealistically short time-frame as our system had been chosen to provide functionality that was mandated by industry regulators. There was a hard deadline of April 2021 (when the new regulations came into effect) that could not be moved or missed.

As we unravelled the miscommunication, it wasn't just a customisation that was needed. A fundamental part of the way the application had been written was completely wrong for the clients needs. To cap-it-off, this functionality had been written by a former employee, and non of the current roster of staff where really 100% sure of how or why it had been implemented. [An issue with reliance on large frameworks which I have previously written about back in 2018](https://paulcourt.co.uk/post/ditch-the-framework.html).

As I had now become the "go-to" person for this client, it was down to me to unravel this mystery of 450,000 lines of code across 22,000  files to figure out how I could modify this core feature without destroying the whole app.

I like to write clean code. But over the 3 months that followed I had to write some pretty horrible code on multiple occasions to make things work without rebuilding large chunks of the application. The kind of coding that wears a developer down.


## Pressure level 2

As it turns out, this project wasn't the only one suffering. The copy-and-paste process was starting to wear down other members of the dev team too. I think by this stage, the team of five devs (including me) that started out maintaining three copies of the product were now maintaining and/or actively developing six copies.

They were getting bored and frustrated of fixing and improving one version, then having to rinse and repeat on one or more of the other copies - usually by being told to park whatever they were currently working on and fix client X's problem. Constantly switching depending on which client was making the most noise at any given time (Squeaky Hinge/Wheel problem).

By the time the new year was rolling in, the acting CTO (a friend of mine) had decided it was time to move on. He was working his notice and would be gone by the end of January 2021. 

Towards the end of February, the word in the grapevine was that the senior member of staff that was supposed to be having one-to-ones with team members and making sure everyone was happy - wasn't. In-fact, it was even worse than that. He WOULD quite happily sit on a call with you and listen, suggest ideas and generally give the impression that any concerns or ideas would be fed back through to the rest of the senior management team. As it turns out that never happened - the conversations were apparently disregarded the moment they were over.

Two devs (from a team of five) were already looking elsewhere and the other two while were not actively looking for anything else, felt there wouldn't be much holding them back if another opportunity presented itself.

Shit!

I spoke to the devs one-by-one informally, gathered their main frustrations and what changes would improve the situation for them. Then I spoke to the MD. we agreed that I would implement some changes to how dev was being run and the MD would organise a staff party to boost moral.

Within 12 months I had gone from being a freelance DevOps to pretty much the companies only senior member of technical staff, and pretty much the damn CTO and all that entails - whilst still having my original workload.


## Pressure level 3

April 2021, and somewhere amongst the all the hacks, sticky tape and compromises, we managed to have something cobbled together that the large utilities client was willing to accept. For now.

We went live... Kind of!

As client users started using the system, it crumbled. Once again, the communication channels with client had failed and the number of expected concurrent users had been massively miss-understood. We were facing thousands of active users instead of a few hundred.

The first attempt was to throw more horsepower at the problem. We doubled, then tripled, then quadrupled resources for both application servers and databases to no no avail. The software was simply not written in a way that would scale.

After hours of frantically searching, we found some low value dashboard queries that were hogging resources that could be removed, and temporarily disabled reports that were very expensive in terms of CPU and Database resources - users were trying them out, but they wouldn't actually be needed properly until the end of the month.

Over the next few days we battled, patched and snipped way code. Mostly effecting overview reports and dashboards which middle management would be using - they didn't like it, but at least the bulk of regular users were able to enter the data they needed to into the system.

This led to months of "grunt work". Dissecting reports and dashboards, figuring out what we needed to make them work with the massively inappropriate data architecture that was at the core of the system. Occasionally there was a momentarily feeling of triumph when a report that used to take 2 mins and 4GB RAM to produce was reduced to a few hundred megabytes of memory usage and was spat out in under 30 seconds. Naturally, there was little recognition from the client for these achievements, as we were just making stuff we had already sold them work properly. So these moments were short lived as attention was quickly drawn to the next failing thing.

Meanwhile, the promised feature improvements where still trying to be pushed through (both for this client and others). Promise after promise from management that we would pause new development and concentrate on rebuilding the system were hollow. Nothing more than lip-service to pacify the frustrations of the developers.


## Pressure level 4

Throughout all of this, I was continuing to try and have meaningful conversations with the MD on the direction of the company. They **wanted** to be offering a single SaaS solution, but kept selling the core system as something that could be customised for each client. The company was in limbo!

My position was that the company could go in either direction but they needed to choose one and set some short, medium and long term goals. Urgently. It's much easier to justify even the most unrewarding of development work if you can somehow tie it back to the company objectives. But there were non. We were not making progress on the SaaS application and we were doing a poor job of requirements gathering from clients due to lack of any real processes for bespoke software development being in place.

It was an infuriating situation.

Promises of taking time to change the processes, rebuild core parts of the app and make steps back towards the idea of a SaaS application, would be made and broken time and time again. Completely unrealistic situations would come up and compromises would be made "to get things done". Rinse and repeat.

During one exchange that went on for a number of weeks, I was tasked with sorting out the technical aspects of putting the bespoke version of our software that we were building for another client into escrow. The problem was that the third-party supplier of the escrow service had a lengthy and manual process for uploading "the deposit" and seemed to not comprehend the structure of a web-application or the concept of a continuous delivery pipeline.

I was firewalled from direct communication with technical people on their side by an "account manager" who, with the best intentions in the world, just didn't understand the processes we had and could only follow their internal playbook of how this escrow service worked.

Patience was wearing thin.

Eventually, the compromise came as it always did, as a direct plea from the MD to "just do whatever".

I submitted to doing a live screenshare demo of our terraform and ansible scripts to prove that they did actually produce a working AWS environment, and submitted a single tarball of the application via the manual process. I made it clear that there were already changes in the pipeline that would make this "deposit" into the escrow system obsolete. No one cared though. Not my MD, not the escrow company and surprisingly not even the client. It was just a box ticking exercise. An infuriating waste of time and effort when there wasn't any of either to spare.

Unfortunately for the next problematic client, this box-ticking exercise had drained the last of my reserves. I hadn't realised it, but I had reached breaking point and someone was about to "get both barrels" as the saying goes.

## The lid blows off the pressure-cooker

Another series of calls with a problematic client followed by lengthy and frustrating email threads trying to clear up the confusion that was left after documents are sent which conflict with what was just discussed in the previous conversations.

It's worth mentioning here that there was some suspicion that there was an element of deliberate time-wasting and nit-picking going on with this client. There was a circulating rumour that one of the senior members of the clients management team was not happy with us being chosen as the preferred supplier, and was being deliberately awkward. Not that that is an excuse for what followed.

There are many ways you could deal with this when you are thinking straight. Or even when you are not thinking straight. However, you almost certainly do not email the client and say:-

> ## Ether you're deliberately wasting my time or you're a fucking idiot!

It's gross misconduct.

I should have been given my marching orders there and then. I was probably spared due to the fact that the previous year I had been single handedly responsible for stopping the company falling apart when I stepped in to solve the issues in the development team and that I was a "bus count of one" with regards to the big utility client who was almost certainly responsible for 90% of the companies current revenue stream.

If I remember correctly the MD asked me to write an email apology. In hindsight, I don't think he was surprised when I refused with another dose of vitriol about the client.

Thankfully, a long overdue dedicated CTO had recently started, and he took up the conversations with that client. I stepped back from engaging with clients and I focused on what I do best, coding. Well, that's what I tried to do.

I was broken.

I stare at the screen... I know what I need to write. It's not a difficult task, maybe two or three classes... a few dozen lines of code... but it won't come together into a coherent thought.

I hand in my notice not long after the "fucking idiot" situation. Unsurprisingly, it is accepted without question or comment.

I immediately start with the long overdue "knowledge transfer" of the parts of the system I had been the sole caretaker of for too long. My notice period runs me to the end of July 2022.

## shutdown -h now

Then I just stop.

For the first time in over 30 years, I have zero enthusiasm for the idea of jumping on the computer and tinkering with some software. In fact, for the duration of the school summer holidays, I hardly even look at the computer at all.

----

Photo by <a href="https://unsplash.com/pt-br/@tjump?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nik Shuliahin 💛💙</a> on <a href="https://unsplash.com/photos/BuNWp1bL0nc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>