# The Weakest Geek

![Image of Banner]
(https://mapwolf.net/weakestgeek/banner.png)

As seen at Arcadecon, this is the complete source code for the game presented as is for all to share, copy and build upon. It brought me many weeks of joy and fustration to develop (including hours of last minute debugging in our hotel room at the con) but I think everyone enjoyed it. 

### How to use

I'm afraid it isn't exactly straightforward. You will need some experience with NodeJS to get it set up and working.

The hardware requirements are:

 * Laptop with Linux/MacOS/Windows
 * Projector or large screen (1024x768 or better resolution)
 * Wifi Access point
 * Android/iPad Tablet with modern Chrome/Safari browser.

![Image of Setup]
(https://mapwolf.net/weakestgeek/setup.png)


And on the software side you will need:

 * A modern browser like Chrome or Firefox.
 * Node JS installed
 * A copy of this repo.

To install and run:

```bash
nigel@badwolf:~/MySource$ git clone git@github.com:nigelhanlon/weakestgeek.git
nigel@badwolf:~/MySource$ cd weakestgeek
nigel@badwolf:~/MySource/weakestgeek$ npm install
...
..
.
nigel@badwolf:~/MySource/weakestgeek$ node app.js

Open laptop web browser and go to http://127.0.0.1:3000
Open tablet web browser and go to http://LAPTOP-IP:3000/controller
```

### Hardware setup

The game is based on the idea of a remote controlled website. The game screen runs in a web browser on a laptop which is connected to a projector. The browser is put in full screen mode by pressing F11. 

The remote control for the game screen is loaded on the tablet's web browser. The host uses the tablet to advance the game, mark questions correct, bank, eliminate players etc.

The tablet and the laptop need to be connected to the same network to communicate with one another. During the convention I brought my own wifi access point for the following reasons:

* I could not rely on hotel wifi being present at the stage area.
* Having an isolated network, the game could operate at full bandwidth.
* No one else could join the network and mess up/hack the game server/client.

### Configuration

The game assumes there will be 8 teams of one or more players. You can configure this in the db/players.json file. The names in the file will be displayed on the game screens.

The file db/quiz.json file contains the question and answer bank. You can generate it from a csv file using db/csv2json.py. TheWeakestGeek.csv is the original quiz bank as authored by the Arcadecon staff.


### Contribute

This repo is more of an archive than an on-going project, but I will accept pull-requests, issues and suggestions should you have them. You can also fork this repo and build upon it, but I do ask you to respect the license. 

### A big thank you

I would like to give a big thank you to the directory or Arcadecon, [Declan Doody](https://twitter.com/DeclanDdy) for giving me the chance to help out in such a unique way that didn't involve moving chairs :)

I'd also like to thank my wonderful wife Cassie for the images, styling and icons she made for the game as well as all the time we spent together debugging. 

Finally a big shout out to the staff at Arcadecon for supporting the project and making it all possible on the day.



