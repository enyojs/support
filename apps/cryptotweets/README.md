![CryptoTweets icon](https://github.com/enyojs/support/raw/master/apps/cryptotweets/icon_64x64.png)

This is a simple cryptogram game written in the enyojs project's Enyo + Onyx +
Layout client-side JavaScript libraries.

To play, go to <http://enyojs.com/samples/cryptotweets>.

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
* Add toggle button to turn statistics display on/off or 
  make statistics a slidable