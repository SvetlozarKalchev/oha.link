#TODO:

1. Secure MongoDB port 28017 - it shouldn't be public!
http://blog.mongodirector.com/10-tips-to-improve-your-mongodb-security/

2. Implement SSL.

3. Clean up app.js.

4. Implement analytics:
	Create a log.txt with info about every request.
	Create an analytics module that saves info about every request to oha.link and every link
	shortened.

5. Implement logging - log all important actions(links shortened, IPs, etc).

6. Serve favicon.ico and robots.txt.

7. Write a new front-end with an 'Copy to clipboard function'.

# Routes & Algorithms

- / -> Serve homepage static file

- /[shortURL] -> -Look in DB
								 	--If FOUND, return shortURL
									--If NOT FOUND, return 404

- /shorten?[url] -> -Look in DB for URL
											--If FOUND, return shortURL
											--If NOT FOUND, generateRandomString()
												---Look in DB if isDuplicate()
													----If FOUND, generateRandomString()
													----If NOT FOUND, save url+shortURL and return shortURL
