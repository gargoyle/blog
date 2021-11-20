---
title: "Disable swap on Raspbian Buster"
created: 2019-11-07T10:28:03Z
publishedOn: 2019-11-13T11:28:03Z
lastMod: 2020-07-26T13:28:03Z

heroImageUrl: "https://files.paulcourt.co.uk/images/2019/raspberry-pi/circuit-board.jpg"
slug: "pi-swap"

ogImageUrl: "https://files.paulcourt.co.uk/images/common/pi-logo.svg"
ogSummary: "Just a quick note about disabling swap on Raspberry Pi's running Raspbian Buster."

tags: "debian, quick, raspberry pi, raspbian"

draft: false

summary: "While I was recently playing around with Kubernetes on a few Raspberry Pi's, I noticed that after disabling swap it would be re-enabled on the next boot. This was the solution I found to get it permanently disabled."
---

Most of the articles I found in searching for how to do this instructed running these commands at the solution to disabling swap on Raspbian Buster:-

```
$ dphys-swapfile swapoff
$ dphys-swapfile uninstall
$ update-rc.d dphys-swapfile remove
```

However, after a reboot, swap was re-activated.

After a bit more poking around, I got to permanently disable swap with the following:-

```
$ dphys-swapfile swapoff
$ dphys-swapfile uninstall
$ update-rc.d dphys-swapfile remove
$ rm -f /etc/init.d/dphys-swapfile

$ service dphys-swapfile stop
$ systemctl disable dphys-swapfile.service
```

I'm still confused about services that have entries both for systemd and init.d. So if you have some insights into this, please let me know. 

