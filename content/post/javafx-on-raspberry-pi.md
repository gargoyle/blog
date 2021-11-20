---
title: "JavaFX on the Raspberry Pi 4"
created: 2020-10-31T13:40:22Z
publishedOn: 2020-11-05T13:40:22Z
lastMod: 2020-11-05T13:40:22Z

heroImageUrl: "https://files.paulcourt.co.uk/images/2020/javafx-on-pi/stand.jpg"
slug: "javafx-on-raspberry-pi"

ogImageUrl: "https://files.paulcourt.co.uk/images/common/pi-logo.svg"
ogSummary: "Running JavaFX applications on the Raspberry Pi 4 + 7\" LCD touch using direct framebuffer rendering without installing a full desktop environment."

tags: "Java, JavaFX, RaspberryPi"

draft: false

summary: "Running JavaFX applications on the Raspberry Pi 4 + 7\" LCD touch using direct framebuffer rendering without installing a full desktop environment."
---

I've picked up some wifi enabled Shelly smart switches which I am starting to experiment with. I like these "switches" as they can be integrated to function as an enhancement to a physical switch not a replacement for one.

But I also want some of them operating where there are no existing physical switches, so I decided to embark on a project to create a room controller from a Raspberry Pi combined with a 7" touchscreen and a custom controller app written using JavaFx...

{{< tweet user="iAmGargoyle" id="1321206162457583619" >}}


In this article, I'm focusing on the initial setup of the Raspberry Pi and tesing out running JavaFX apps without running a full desktop environment on the Pi - Since this unit will be dedicated to running my room controller, there's no need for one. 

## Pi setup

Picking up from where my [standard Pi setup](https://www.paulcourt.co.uk/article/pi-server-setup) article finishes with a clean installation of Raspberry Pi OS Lite (aka Raspbian Buster), these are the steps to getting a JavaFX up and running on the Pi. 

SSH into your Pi and start by updating the system:-

```
$ sudo apt update
$ sudo apt upgrade
```

Now install Java. The default from the Pi distro is 11.0.9 which is fine for this project. We are also going to need a bunch of libraries and drivers. Fortunately, we can get them all as dependencies of the `openjfx` package. So install both of those:-

```
$ sudo apt install default-jdk-headless openjfx
```

Next, grab the [armv6hf JavaFX package from Gluon](https://gluonhq.com/products/javafx/) and copy it over to the pi, and then unpack it into a location of your choice. I'm putting it into `/opt/java` so that I end up with `/opt/java/jfx/lib`.

## The test app

To test things out, we can create a very simple Hello World JavaFX application. The following single file called `HelloWorld.java` defines our test application.

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.application.Platform;

public class HelloFX extends Application {

    @Override
    public void start(Stage stage) {
        String javaVersion = System.getProperty("java.version");
        String javafxVersion = System.getProperty("javafx.version");
        Label l = new Label("Hello, JavaFX " + javafxVersion + ", running on Java " + javaVersion + ".");
        Button btn = new Button("Exit");
        btn.setOnAction(actionEvent -> Platform.exit());
        Scene scene = new Scene(new VBox(l, btn), 800, 480);
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }

}
```
An important part of this code is `Scene scene = new Scene(new VBox(l, btn), 800, 480);`. This exactly matches the resolution of the 7" screen I am using. If you try to create a scene larger than the framebuffer being used, you'll get a `java.nio.BufferOverflowException` exception and the app will hang.

Compile the java source file with the following command:-

```
$ javac --module-path /opt/java/jfx/lib --add-modules javafx.controls HelloFX.java
```

The standard `java --module-path /opt/java/jfx/lib --add-modules javafx.controls HelloFX` invocation of our app results in an exception caused by: ` java.lang.UnsupportedOperationException: Unable to open DISPLAY at javafx.graphics/com.sun.glass.ui.gtk.GtkApplication.lambda$new$6(GtkApplication.java:173)`. 

"Glass" is part of the [JavaFX architecture](https://docs.oracle.com/javafx/2/architecture/jfxpub-architecture.htm) which provides a windowing toolkit. In this case it seems like it's trying to launch a desktop GTK application. Which is going to be difficult, given that we dont have a desktop environment.

Fortunately, OpenJFX has a glass implementation for embedded devices called [Monocle](https://wiki.openjdk.java.net/display/OpenJFX/Monocle), we just have to tell java to use it:-

```
$ java --module-path /opt/java/jfx/lib --add-modules javafx.controls -Dglass.platform=Monocle HelloFX
```

Hey presto! The app launches and is displayed on the 7" screen. However, attempting to tap on the exit button does nothing. If we check back at the SSH shell we can see the following output:-

```
Udev: Failed to write to /sys/class/input/mice/uevent
      Check that you have permission to access input devices
Udev: Failed to write to /sys/class/input/mouse0/uevent
      Check that you have permission to access input devices
Udev: Failed to write to /sys/class/input/input0/uevent
      Check that you have permission to access input devices
Udev: Failed to write to /sys/class/input/event0/uevent
      Check that you have permission to access input devices
Cannot open display
Cannot create resource
```

This looks like a permissions error, and the quickest way to check that is to run as root by prefixing the run command with `sudo`.

```
$ sudo java --module-path /opt/java/jfx/lib --add-modules javafx.controls -Dglass.platform=Monocle HelloFX
```

We still see console output errors for `Cannot open display` and `Connot create resource`, but the app is now working and tapping on the exit button does now quit the application. Success!

I'm sure there will be some (probably good reasons) for not running your home grown java applications as root, but for this project I'm happy to accept those risks.

## Starting the app automatically

Since the goal of this project will be to have the device acting as a dedicated room controller, the final step is to launch the app when the device boots up. So creating a simple systemd service unit will achive that goal and as a bonus we can have systemd automatically restart the app if it crashes.

Drop this snippet:-

```
[Unit]
Description=Room Controller

[Service]
User=root
Type=simple
ExecStart=java --module-path /opt/java/jfx/lib --add-modules javafx.controls -Dglass.platform=Monocle -cp /home/pi HelloFX
Restart=always

[Install]
WantedBy=multi-user.target
```

into `/etc/systemd/system/room_controller.service`. Note that I had to add `-cp /home/pi` to update the ClassPath so that our class can be found.

Enable the service with:-

```
sudo systemctl enable room_controller.service
```

And reboot the Pi.

Just before the login prompt appears our app is launched. Great. But not quite perfect...

![Launching app on boot](https://files.paulcourt.co.uk/images/2020/javafx-on-pi/first-boot.jpg)

This is just because the boot process has continued in the background and "drawn" extra things to the framebuffer, but the app is still running. If I hit the place where the exit button should be, the application exits and as specified in the unit file with  `Restart=always` , the app is promptly restarted by systemd with a perfectly rendered screen.

This is not something I am worried about at the moment as there are plenty of ways to work around this, and my final app will probably be redrawing the screen more frequently anyway. For example, [here's a cold boot video](https://youtu.be/LP911gEwhG4) of the completed process running the very simple [ParticlePainter app](https://www.flxs.co.uk/software/particle-painter) I wrote a while back (Which constantly redraws the entire canvas).

Next tasks, wire up some of the Shellys and start writing the controller app. 