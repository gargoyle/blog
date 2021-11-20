---
title: "Cross-server lock with MySQL and PHP"
created: "2018-11-25"
publishedOn: "2019-01-13"
lastMod: "2020-07-27"

heroImageUrl: ""
slug: "cross-server-locking-with-mysql-php"

ogImageUrl: "https://files.paulcourt.co.uk/images/2019/logo-mysql-170x115.png"
ogSummary: "Quick Tip: Using MySQL as a lock source for running a single PHP process across multiple servers."

tags: "HA, MySQL, PHP, Scale"

draft: false

summary: This is a quick solution for a problem I've come across a few times recently when it comes to running "single tasks" such as scheduled cron scripts in High Availability or Scale Out deployment scenarios where you want to make sure you don't accidentally run the action multiple times.
---
This is a quick solution for a problem I've come across a few times recently when it comes to running "single tasks" in High Availability or Scale Out deployment scenarios.

You might already have a HA solution and you need to introduce a cron style task, or you might have an application that already makes use of cron scripts bit it runs on a single server and you want to introduce HA and/or scale out.

The first thought that springs to mind might be to have a concept of a "master" and one or more "replicas" - with the cron tasks only running on master. However, this makes it much more complicated to setup both in terms of deployment and in the fail-over configuration (It's beyond what I want to get into for this article, but you can Google for things like "split brain", "master elections" and "quorum").

## A simple scenario
Lets start with a simple HA scenario - we have a load balancer and a number of identical web servers. All the servers run exactly the same programs and services. This allows for very easy scaling of the platform - when you get more traffic, you can just add more web servers (For the purpose of this article, the database is not going to be a bottleneck).

![HA Network Diagram](https://files.paulcourt.co.uk/images/2018/simple_ha.svg)

What we want to do now is introduce a task which runs once per month - say an invoice generating task or something similar. Lets say we have the following cron task which will generate our invoices at 04:15 on the 1st of every month:-

```bash
15 4 1 * * php /path/to/app/generateInvoces.php
```

We want to keep our current setup with all web servers being identical and not introduce any single points of failure, so our cron task needs to implement some kind of [locking mechanism](https://en.wikipedia.org/wiki/Lock_(computer_science)) to make sure it is the only one running otherwise an invoice will be generated on each server leading to duplicates - and probably unhappy customers! 

### Implementing a Mutex Lock
Since our database is already a shared resource (and it's a pretty safe bet that it will have robust locking), we can use it very easily for our locking in PHP.

We can acquire a lock with the following code:-

```php
private function getLock(): bool
{
    // $dbConn is an instance of the mysqli class
    $stmt = $dbConn->prepareStatement("SELECT GET_LOCK(?, 1) AS locked");
    $stmt->bind_param("s", "EXAMPLE_LOCK");
    $result = $dbConn->fetchSingleRow($stmt)['locked'] ?? 0 == 1 ? true : false;
    return $result;
}
```

This uses [MySQL's `GET_LOCK()` function](https://dev.mysql.com/doc/refman/5.7/en/locking-functions.html#function_get-lock) to get a named lock. Only one client will be allowed to get a lock with the same name at a time. The two arguments are a name for the lock and a timeout.

Our method will wait for a maximum of 1 second to get a lock and return true if it was able to get the lock, and false otherwise.

Releasing the lock is just as simple:-

```php
private function releaseLock(): void
{
    // $dbConn is an instance of the mysqli class
    $stmt = $dbConn->prepareStatement("SELECT RELEASE_LOCK(?)");
    $stmt->bind_param("s", "EXAMPLE_LOCK");
    $result = $dbConn->executeNonReturn($stmt);
}
```

Combining these methods with another method to perform the invoice generation would give us something like this:-

```php
private function generateInvoices()
{
    if ($this->getLock()) {
        // Do stuff here to generate invoices
    } else {
        $this->log("Didn't get the lock, so not generating any invoices.");
    }
}
```

We can now deploy our application and our cron job to all the servers in our cluster, happy that although all two, three or more nodes will each execute the job at the same time, only one of them will acquire the lock successfully and actually generate the invoices.



## Summary

By using MySQL to do the locking, we have a few advantages. Firstly, it's technology you are already familiar with so there is no hurdle of new knowledge you need to first get over. Secondly, it's a very simple solution where a lot of the hard work is take care of for us. Even to the point of releasing the lock if our program crashes (More specifically, when the connection to MySQL is closed).

I've been using this as part of an application which sends out email notifications for a few months now without any issues. 

Instead of being triggered by cron, its a service that constantly runs in the background waking up every 5 mins and checking to see if there are any mails to send. The service runs on 3 nodes, but only one will ever do the sending in any given 5 min wake up interval.

let me know what you think of this little snippet. Have you done anything similar and had success or problems of your own?