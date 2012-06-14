![CryptoTweets icon](https://github.com/enyojs/support/raw/master/apps/cryptotweets/icon_64x64.png)

This is a simple cryptogram game written in the enyojs project's Enyo + Onyx +
Layout client-side JavaScript libraries.

There's a demo site of it up at <http://combee.net/cryptotweets>.  To play, you
need to use the Fetch Tweets or Fetch News buttons to pull down a data source,
then you play it like any cryptogram.  Keyboard is required to guess letters,
but I plan on adding a soft keyboard to the popup.

There are a few interesting techniques used here.  There's some "not-yet-live"
code that I'm planning on using to filter out URLs or hashtags from the tweets
so they won't show up as encrypted.  I tested some of that code using an
embedded copy of Jasmine that's included in the app.

In order to get all of my "cells" to cooperate, I'm making pretty heavy use of
Enyo custom events.  Hovering the mouse over a cell causes it to tell its
parent to waterfallDown a hover event with the encrypted letter, then all the
cells use that event to decide if they should change their CSS class.  I also
use a "startGuess" event to let you trigger guesses either by tapping on a
cell or by hitting a key on the keyboard.

Let me know what you think!  

## LICENSE

This is released under the Apache-2.0 license, the same as the rest of the
Enyo project.

## TODOs for CryptoTweets

* Wrap cypher display at word boundaries
* Add toggle button to turn statistics display on/off
* add soft keyboard to popup to allow touch device play
* make toolbar responsive to allow use on narrow-screen devices
* make cryptogram area scrollable