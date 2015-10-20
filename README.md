# App description

*[oha.link](http://oha.link)* is a simple link shortener written in Node.js using some ES6
functionality. It uses MongoDB and has a minimalistic web UI.

Dependencies: MongoDB, Mocha+Chai.

# Where stuff is:
###/lib -> Contains models and controllers

####../controllers

....RequestController.js -> HTTP requests get routed here and the
appropriate functionality called.

....ShortenerController.js -> Calls all the needed stuff to shorten & save links.

####../models

....Database.js -> Contains logic for interacting with the DB - connecting, saving, searching.

....RandomGenerator.js -> Contains logic for generating random strings for the short URLs.

....Router.js -> Lots of conditions have to be fulfilled to route requests, so logic for that goes here. Also has methods that call everything needed to serve the homepage and retrieve a shortened link from the DB.

....Shortener.js -> Contains logic for all things needed when generating a short URL - checking if the generated string is a duplicate, checking if a given URL is already shortened, saving a short URL to the DB, etc.

.....StaticPageServer.js -> Contains logic to retrieve and serve the homepage static file.

# Routes & Algorithms

###/

		Serve homepage

###/[4-character-string]
		1. Look for the given short URL in the DB.
			If FOUND, redirect to short URL.

			If NOT FOUND, return 404.

###/shorten?[url]
		1. Look in DB for URL
			If FOUND, return shortURL

			If NOT FOUND, generate random string for a new short URL.
				Look in DB if it is a duplicate of previously shortened link.
					If a duplicate is FOUND, generate a random string again.
					If a duplicate NOT FOUND, save the pair url:shortURL and return the short URL.

#####every other case
		Return 404.
