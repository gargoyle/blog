---
title: "Experiments with Google Cloud Run"
created: 2023-05-23T08:54:39+01:00
publishedOn: 2023-05-23T08:54:39+01:00
lastMod: 2023-05-23T08:54:39+01:00

heroImageUrl: "https://storage.googleapis.com/gweb-cloudblog-publish/original_images/BlogHeader_Set2_D.png"
slug: "google-cloud-experiments"

ogImageUrl: "data:image/png;base64,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"
ogSummary: "Taking the FLXS website serverless using GCP Cloud Run."

tags: 
    - Cloud
    - Serverless
    - Infrastructure
    - DevOps
    - FinOps

draft: false

summary: "Here's what I learned when experimenting with using Cloud Run (a serverless platform for running stateless containers) to host a Java based website build using the Helidon framework."
---

Having spent quite some time over the last few years using Amazon Web Services (AWS), I've decided I should get to know some of the other cloud platforms. So I set out on an experiment to get something up and running on Google Cloud Platform (GCP).

The only thing I have done with GCP in the past is to manually launch a VM instance. However, this doesn't really give a lot of experience of the real advantages of "the cloud" - which is to have someone else do as much of the management for you as possible.

With that in mind, I listed out the following objectives:-

- Should be "serverless", or as close to as it can possibly be. I don't really want to get bogged down with managing operating systems, patching, upgrading, etc.
- Should be on-demand and cost-effective. I'm not getting a lot of traffic at the moment, so I don't want to be wasting resources by having something sitting idle for 90% of the time.
- Should rerequire minimal changes to my existing code (I'll go into more detail obout the app below).
- Should be available on my own domain.
- Should be automated as much as possible. Ideally using terraform and/or ansible.


## Setting up GCP
Setting up GCP was as easy as you might expect. Simply head over to [The signup page]() and complete the various forms and wizard steps.

The only downside I experienced was that unlike AWS which starts with a blank canvas, GCP's setup wizard took me down a road attempting to setup all kinds of organisational structures, roles and permissions most of which seemed overkill for a small project (It's possible I clicked on something or chose an option to trigger this more complex setup route).

With that being said, within half-an-hour I had the various registration and billing setup complete, and had downloaded and authenticated the `gcloud` CLI app for interacting with the various APIs provided by GCP.


## The application
The application is a [Helidon SE](https://helidon.io/docs/v3/#/se/guides/quickstart) application which uses Freemarker to render some pages on the fly to produce the main FLXS website (https://flxs.co.uk).

This is a simple application at the moment, but will eventually hook into other services in the future. 

The application is self contained and doesn't require any other tooling. The frameworks webserver component is currently built upon [Netty](https://netty.io), and it can directly handle HTTP requests efficiently without the need for another "front end" webserver such as nginx.

By making use of the Java jlink functionality, the application can be built with a custom JVM which only includes the parts of the JVM required by the app and optimised for the target platform. 

Combining this with a minimal debian image yields a nice compact docker container of around just 76MB. This means we can have a few images held in [GCP Artifact Registry](https://cloud.google.com/artifact-registry/pricing) while still being well under the Free usage tier - bonus!

The only custom requirement from CGP Cloud Run was that the application would accept a `PORT` environment variable to determine the port it should listen to for incoming requests. This ws a single line change.

Using the CGP web console, I manually created a docker variant of an [Artifact Registry](). I'll come back to this later to highlight why, but I configured it to be in `europe-west4` (Netherlands).

I could then use `gcloud` to authenticate docker:-

```
$ gcloud auth
```

And build and push my application container to the registry.

```
$ docker build --tag xxxx .
$ docker push xxx
```

## Cloud Run
I'd heard of GKE (Google Kubernetes Engine)
- What is it.

## Custom domain
- DNS, name transfer

### Not all locations are equal
- Complex global loadbalancer setup (reference googles own post)
- Custom domains allowed in europe-west4 and not london. (blame it on Brexit)
- Much simpler terraform.

