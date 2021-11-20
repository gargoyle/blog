---
title: "Network Speed Testing"
created: 2018-02-10
publishedOn: 2018-02-21
lastMod: 2020-07-26

heroImageUrl: "https://files.paulcourt.co.uk/images/common/network-hero.jpg"

ogImageUrl: ""
ogSummary: ""

tags:
    - Benchmarking
    - Networking

draft: false

summary: As part of another project I am working on, I wanted to make sure I could reliably test the speed, latency and packet loss of a network setup. Not necessarily an internet connection - but the connection between any two devices on the network. So I thought it would be a good time to write up a post about the tools I am planning on using to gather the test data.
---
Tools like [speedtest.net](https://www.speedtest.net) are great for testing your general internet speed. 

However, if you get slower than expected results they are not usually very informative as to where the slow down is. It could be your local network or WiFi, your internet connection or even the server at the destination end could be overloaded. They are also virtually useless for testing other sections of network which will normally run at speeds much greater than your actual broadband connection.

As part of a future project, I wanted to gather some accurate performance data for my current local network and internet connection, so it seemed like a good time to write up some info on the tools and techniques used to gather the data.

I am interested in testing __Latency__, __Packet Loss__ and __Throughput__.

__Latency__ is the measure of how long it takes an individual packet of data to leave the source machine, traverse the network connection and arrive at the destination machine. Normally this is measured in milliseconds (ms) for the entire round trip from source machine to destination and back again.

__Packet Loss__ are the number of packets which leave the source machine, but never arrive at the destination (or the acknowledgement message doesn't make it back to the source), which will cause that packet to have to be re-sent.

As I enjoy playing online games quite a bit, I am interested in making sure my network connections are keeping latency and packet loss as low as possible.

__Throughput__ is how much data that you can transfer in any given time frame. Normally this is measured in Kilo, Mega or Giga __bits__ per second. Most broadband connections in the UK, are asymmetrical which means they operate at different speeds when receiving data (downloading) than sending (uploading). 

Faster is normally better. Higher throughput means you can do more with your network as the same time or download/upload large items more quickly.

## Measuring Latency and Packet Loss
The main tool I'm using to measure **latency** and **packet loss** is [ping](https://en.wikipedia.org/wiki/Ping_(networking_utility)). You simply give it the name/IP of the server you want to test against...
```bash
$ ping www.google.co.uk
```
...and it sends repeated ICMP packets and records the round trip time and the number of packets that go AWOL. On Linux, the command will run indefinitely until you press CTRL-C, then it will output a summary of the run.

Example:-
```bash
$ ping ga.rgoyle.com
PING ga.rgoyle.com (54.154.196.144) 56(84) bytes of data.
64 bytes from ec2-54-154-196-144.eu-west-1.compute.amazonaws.com (54.154.196.144): icmp_seq=1 ttl=237 time=27.8 ms
64 bytes from ec2-54-154-196-144.eu-west-1.compute.amazonaws.com (54.154.196.144): icmp_seq=2 ttl=237 time=30.2 ms
64 bytes from ec2-54-154-196-144.eu-west-1.compute.amazonaws.com (54.154.196.144): icmp_seq=3 ttl=237 time=41.6 ms
64 bytes from ec2-54-154-196-144.eu-west-1.compute.amazonaws.com (54.154.196.144): icmp_seq=4 ttl=237 time=29.9 ms
64 bytes from ec2-54-154-196-144.eu-west-1.compute.amazonaws.com (54.154.196.144): icmp_seq=5 ttl=237 time=28.5 ms
^C
--- ga.rgoyle.com ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4004ms
rtt min/avg/max/mdev = 27.834/31.644/41.657/5.086 ms
``` 
From these results, we can see that 5 "pings" were sent and the average the latency from my home to my webserver (hosted on AWS) is 30ms, and no packets were dropped.

The longer you leave [ping](https://en.wikipedia.org/wiki/Ping_(networking_utility)) running, the more data you collect for calculating the results. This can be useful for gathering information on the stability of a network link. 

### Comparing Ethernet vs WiFi
Lets use ping to gather some data on the differences between a wired Ethernet connection and a WiFi connection, I'm going to ping my NAS box 100 times from my PC which is on a wired gigabit network and then repeat the process from my laptop which is on WiFi.

First, the wired results:
```bash
$ ping 192.168.1.25
PING 192.168.1.25 (192.168.1.25) 56(84) bytes of data.
64 bytes from 192.168.1.25: icmp_seq=1 ttl=64 time=0.248 ms
...
64 bytes from 192.168.1.25: icmp_seq=104 ttl=64 time=0.254 ms
^C
--- 192.168.1.25 ping statistics ---
104 packets transmitted, 104 received, 0% packet loss, time 105448ms
rtt min/avg/max/mdev = 0.229/0.257/0.368/0.022 ms
```
As you can see from the summary, this link is stable - no packet loss and no major differences between min, max and average. Now for the WiFi:

```bash
$ ping 192.168.1.25
PING 192.168.1.25 (192.168.1.25): 56 data bytes
64 bytes from 192.168.1.25: icmp_seq=0 ttl=64 time=1.488 ms
...
64 bytes from 192.168.1.25: icmp_seq=104 ttl=64 time=4.659 ms
^C
--- 192.168.1.25 ping statistics ---
105 packets transmitted, 105 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 1.057/2.035/4.659/0.517 ms
```
Again this link is fairly stable - Not massive differences in min, max and average. I have direct line if sight to the WiFi router, so I was expecting this. However, look at what happens if I re-run the WiFi test from another room:-

```bash
ping 192.168.1.25
PING 192.168.1.25 (192.168.1.25): 56 data bytes
64 bytes from 192.168.1.25: icmp_seq=0 ttl=64 time=25.938 ms
64 bytes from 192.168.1.25: icmp_seq=1 ttl=64 time=18.372 ms
64 bytes from 192.168.1.25: icmp_seq=2 ttl=64 time=10.398 ms
Request timeout for icmp_seq 3
64 bytes from 192.168.1.25: icmp_seq=4 ttl=64 time=45.883 ms
Request timeout for icmp_seq 5
64 bytes from 192.168.1.25: icmp_seq=6 ttl=64 time=48.882 ms
64 bytes from 192.168.1.25: icmp_seq=7 ttl=64 time=75.051 ms
64 bytes from 192.168.1.25: icmp_seq=8 ttl=64 time=9.289 ms
64 bytes from 192.168.1.25: icmp_seq=9 ttl=64 time=28.852 ms
64 bytes from 192.168.1.25: icmp_seq=10 ttl=64 time=42.006 ms
64 bytes from 192.168.1.25: icmp_seq=11 ttl=64 time=18.104 ms
64 bytes from 192.168.1.25: icmp_seq=12 ttl=64 time=9.132 ms
64 bytes from 192.168.1.25: icmp_seq=13 ttl=64 time=7.767 ms
64 bytes from 192.168.1.25: icmp_seq=14 ttl=64 time=4.844 ms
64 bytes from 192.168.1.25: icmp_seq=15 ttl=64 time=47.115 ms
Request timeout for icmp_seq 16
64 bytes from 192.168.1.25: icmp_seq=17 ttl=64 time=12.904 ms
64 bytes from 192.168.1.25: icmp_seq=18 ttl=64 time=1.305 ms
...
64 bytes from 192.168.1.25: icmp_seq=84 ttl=64 time=1.700 ms
64 bytes from 192.168.1.25: icmp_seq=85 ttl=64 time=48.140 ms
64 bytes from 192.168.1.25: icmp_seq=86 ttl=64 time=72.957 ms
64 bytes from 192.168.1.25: icmp_seq=87 ttl=64 time=95.019 ms
64 bytes from 192.168.1.25: icmp_seq=88 ttl=64 time=2.340 ms
...
64 bytes from 192.168.1.25: icmp_seq=104 ttl=64 time=3.290 ms
^C
--- 192.168.1.25 ping statistics ---
105 packets transmitted, 102 packets received, 2.9% packet loss
round-trip min/avg/max/stddev = 1.155/8.313/95.019/16.525 ms
```
I've included quite a few more lines of the output so you can see what was happening. Although we still have reasonable figures for min and average, you can see that max jumps up to almost 100ms and we have 3% packet loss! This is actually pretty typical for an average WiFi link and could be caused by a number of factors, interference on the radio frequency, the laptop and base station deciding to switch channels, etc.

For browsing the web and tweeting rubbish, 3% packet loss is not an issue - even for accessing files on the local network, it's still not an issue as the error correction will normally kick in and resend the missing packets without you even noticing.

However, if you were playing an online game such as a first person shooter you now have a 3% chance that a crucial headshot you make at your end of the game won't actually reach the server  and your opponent won't die! :-(

It's also important to note that OSX was still reporting "4 bars" of signal strength. This wasn't even a weak signal. 

I wanted to try and capture data from a "weak" signal, but it seems OSX now likes to only show me 4 bars or disconnect completely from the network. So I had to go out into the garden and find the point at which the connection was re-established and test from there. Again, OSX was telling me this was a "full" signal:-

```bash
--- 192.168.1.25 ping statistics ---
83 packets transmitted, 47 packets received, 43.4% packet loss
round-trip min/avg/max/stddev = 4.819/2408.444/11302.063/3052.634 ms
```

You would definitely start to notice this even with just "casual browsing".




## Measuring Throughput
Now that we know how to test how stable a connection is, we can move on to measuring throughput - how much we can send or receive over the link. 

To measure this I am going to use a tool called [iperf](https://iperf.fr/). This useful little tool has two main modes of operation - client and server. You start a server on a machine on one side of the link you want to test and run the client from the other side.

Starting the server is done simply as follows:-
```bash
$ iperf -s
------------------------------------------------------------
Server listening on TCP port 5001
TCP window size: 85.3 KByte (default)
------------------------------------------------------------
```
The command will now sit and wait for incoming client connections on port 5001.

In another terminal I can then run in client mode to perform a speed test:-
```bash
$ iperf -c localhost
------------------------------------------------------------
Client connecting to localhost, TCP port 5001
TCP window size: 2.50 MByte (default)
------------------------------------------------------------
[  3] local 127.0.0.1 port 45558 connected with 127.0.0.1 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  67.8 GBytes  58.2 Gbits/sec
```
**58.2 Gbits/sec!!** Now that would be an awesome internet connection! 

As I have run the test on the same machine using *localhost*, there isn't actually a physical network link involved so what we have here is the maximum speed of part of the network stack within my desktop machine - no packets actually left and travelled anywhere.

Lets try something a bit more useful. 

This time, I am going to test the speed between my desktop machine and my NAS box which lives on the other side of the network. So I am testing the Ethernet link which runs from my computer to the switch and then from the switch to the NAS box. All devices *should* be supporting and using gigabit speed.

First, I ssh into the NAS box and start iperf in server mode as described above:-
```bash
root@NASBOX2:~# iperf -s
------------------------------------------------------------
Server listening on TCP port 5001
TCP window size: 85.3 KByte (default)
------------------------------------------------------------
```
And then run the client from my desktop:-
```bash
iperf -c 192.168.1.25
------------------------------------------------------------
Client connecting to 192.168.1.25, TCP port 5001
TCP window size: 85.0 KByte (default)
------------------------------------------------------------
[  3] local 192.168.1.127 port 58330 connected with 192.168.1.25 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  1.10 GBytes   943 Mbits/sec
```
We can see from the results that the test ran for 10 seconds (the default time), it transferred 1.10 GBytes of data and has a bandwidth of 943 Mbits/sec. This is just about perfect for a Gigabit network link and confirms that both devices are running at full speed with no bottlenecks in the network link.

It's also worth noting that the things we want to transfer: text, pictures; videos; music, etc. is all measured in **Bytes** and the bandwidth of a link is measured in **Bits**. There are 8 bits to a byte, so a rough estimate of what you should be able to transfer and how long it would take would be to multiply the size of the data you want to send by 8, and then divide it by your connection speed.

So to send a 10 GB (Gigabyte)  file to my NAS box, that would be:-

- 10GB * 8 = 80 Gb (Gigabits - note the lowercase "b")
- 80Gb / .920 Gbps = **86.95 seconds.** (Note, I converted 943Mbps into Gbps by dividing it by 1024)

### Useful Options
Two of the iperf options I find most useful are "-t" and "-i". 

"-t" lets you specify how long you want the test to run for (the default is 10 seconds), and "-i" lets you specify at what interval you want the stats to be reported. If you specify "-t 0" the test will run continuously until you press CTRL-C. 

Lets see what happens when I run the test this way from my laptop as I walk from the office to the kitchen to gather some throughput data on my WiFi network:-

```bash
$ iperf -i 2 -t 0 -c 192.168.1.25
------------------------------------------------------------
Client connecting to 192.168.1.25, TCP port 5001
TCP window size:  129 KByte (default)
------------------------------------------------------------
[  4] local 192.168.1.113 port 54604 connected with 192.168.1.25 port 5001
[ ID] Interval       Transfer     Bandwidth
[  4]  0.0- 2.0 sec  42.5 MBytes   178 Mbits/sec
[  4]  2.0- 4.0 sec  36.6 MBytes   154 Mbits/sec
[  4]  4.0- 6.0 sec  39.9 MBytes   167 Mbits/sec
[  4]  6.0- 8.0 sec  41.1 MBytes   172 Mbits/sec
[  4]  8.0-10.0 sec  44.2 MBytes   186 Mbits/sec
[  4] 10.0-12.0 sec  9.62 MBytes  40.4 Mbits/sec
[  4] 12.0-14.0 sec  13.6 MBytes  57.1 Mbits/sec
[  4] 14.0-16.0 sec  24.6 MBytes   103 Mbits/sec
[  4] 16.0-18.0 sec  19.0 MBytes  79.7 Mbits/sec
[  4] 18.0-20.0 sec  10.1 MBytes  42.5 Mbits/sec
[  4] 20.0-22.0 sec  2.00 MBytes  8.39 Mbits/sec
[  4] 22.0-24.0 sec  0.00 Bytes  0.00 bits/sec
[  4] 24.0-26.0 sec  0.00 Bytes  0.00 bits/sec
[  4] 26.0-28.0 sec  0.00 Bytes  0.00 bits/sec
[  4] 28.0-30.0 sec  12.6 MBytes  53.0 Mbits/sec
[  4] 30.0-32.0 sec  48.9 MBytes   205 Mbits/sec
[  4] 32.0-34.0 sec  50.6 MBytes   212 Mbits/sec
[  4] 34.0-36.0 sec  45.8 MBytes   192 Mbits/sec
[  4] 36.0-38.0 sec  49.2 MBytes   207 Mbits/sec
```
What we can see here is that as soon as I move away from my strongest signal spot, the speed varies by quite a large margin until I eventually get out of reach of the office base station and hand over to the kitchen one (the 6 seconds in the middle where no data was transferred).

## Summary
By running tests with [iperf](https://iperf.fr/) and [ping](https://en.wikipedia.org/wiki/Ping_(networking_utility)), it is easy to visualise characteristics of specific network links which can help with finding faults and congestion or just to see if you could stream 4K video to your TV over the WiFi.

Both tools have a multitude of options which could help tune the tests to specific requirements, so it is worth taking a little time to read the docs and figure out what would work best for you if you are going to perform your own tests. I have only covered the basics, as these will suffice for the tests I want to do.

I'll be making use of these tools for testing a long range WiFi link which I will hopefully be publishing the results of here very soon.

----
There are no comments available on this blog, but please do send me your thoughts and feedback via twitter by replying to [this tweet](https://twitter.com/GargoyleTwoZero/status/966435513879203842).