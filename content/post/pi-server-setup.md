---
title: "My Standard Pi Server Setup"
created: 2019-11-13T23:22:45Z
publishedOn: 2019-11-17T23:22:45Z
lastMod: 2020-07-26T23:22:45Z

heroImageUrl: "https://files.paulcourt.co.uk/images/2019/raspberry-pi/picluster.jpg"
slug: "pi-server-setup"

ogImageUrl: "https://files.paulcourt.co.uk/images/common/pi-logo.svg"
ogSummary: "The steps I take to get a Raspberry Pi server up and running out of the box (Or from a new blank SD card, etc)."

tags: 
    - Quick
    - RaspberryPi
    - Raspbian

draft: false

summary: "I mostly use my Raspberry Pi's as mini servers without a desktop environment, and I almost never hook them up to a display or a keyboard & mouse. So these are the steps I take to flash the SD cards in order to have them already configured to connect via SSH on a known IP address from their very first boot."
---

## Get the image
Raspberry Pi Foundation provide "light" versions of the SD card images without a desktop environment for use in server type scenarios directly on their [raspbian downloads page](https://www.raspberrypi.org/downloads/raspbian/).

At the time of the last update to this article the latest version is Raspian Buster Lite.

Download and verify the sha-256 hash and then unzip the archive which should leave you with an image file called something along the lines of `2019-09-26-raspbian-buster-lite.img`.



## Flash the SD Card

Using DD:

**BIG WARNING AND DISCLAIMER**

Double and triple check your device names. Running DD with the wrong params can easily destroy entire hard disks worth of data!

```plaintext
dd bs=4M if=2019-09-26-raspbian-buster-lite.img of=/dev/sdd conv=fsync
```

Using Etcher:

[Etcher](https://www.balena.io/etcher/) is a graphical tool that can make flashing SD cards a bit easier and is available for Windows, Mac and Linux,

Once the flash is complete, my system then recognizes the **boot** and **root** partitions and mounts them for me. On my Ubuntu desktop these are mounted at `/media/paul/boot` and `/media/paul/root`. Your systems will vary, and for the rest of these instructions I just use `<root mount point>` and `<boot mount point>` which you should replace for whatever is appropriate for you.

## Enable SSH

Create an empty file at `<boot mount point>/ssh`. The file does not need to contain anything, it just needs to exist:-

```plaintext
$ touch /media/paul/boot/ssh
```

## Set a static IP address

While the card is still mounted on the machine doing the flash, I edit `<root mount point>/etc/dhcpcd.conf` to give it a static IP address. This file is very well commented and the section you want is near the end if the file. You pretty much just have to uncomment the appropriate lines and update the IP, Router and DNS addresses to match your network. 

Mine looked like this:-
```plaintext
# Example static IP configuration:
interface eth0
static ip_address=192.168.1.41/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.20
```


## First Boot
Insert the SD card into the Pi and power it up. 

During the first boot, Raspbian will automatically detect that the root filesystem is bigger (assuming you have an SD card >2GB) and resize the file system and reboot itself. So give it a few mins before you try to connect.

I like to run `ping 192.168.1.41` and wait for it to start responding to the pings.

Once you are happy it's booted up and ready, you can connect via SSH with:-

```plaintext
$ ssh pi@192.168.1.41
```
The default password is "raspbian" - you should change it!


## Configure the hostname
Connect to the Pi via SSH and then run  `raspi-config` as root:-

```plaintext
$ sudo raspi-config
```
From the menu's, choose the networking configuration and then the option to set the hostname. Once done, choose finish and confirm. 

The Pi will reboot and when it comes back online it will have it's new hostname.


## Copy your public SSH key
If you have already generated a SSH keypair on your machine, you can copy the public part over to the Pi so you don't need to enter the password each time you login.

`ssh-copy-id` is the easiest way to do this, and you would run something like the following.

```plaintext
ssh-copy-id -i ~/.ssh/id_rsa pi@192.168.1.41
```