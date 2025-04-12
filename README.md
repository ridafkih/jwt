# JWT Educational Demonstration

## Why?

JWTs are a hot-topic and beginner developers are often confused by their implementation, so I created this website to provide a quick rundown to familiarize those unfamiliar with the technology.

## What?

A simple demonstration website that showcases JSON Web Tokens (JWTs) for stateless authentication without databases.

Typically, users are authenticated using a stateful system in which session data is stored on the client and compared against the data on the server, usually in a database. With JWTs, we can implement a stateless system which allows us to authorize a user without storing data in a database on our backend. Since the system is stateless, the next call does not rely on the last. The state is as-is as defined in the JWT's payload. This means previous states—granted they're not expired—can be "reloaded" and cannot be invalidated on their own. If we have a service where verifying whether a user is authenticated is too expensive such-is often the case when we're working across multiple microservices, a JWT might be the right choice. Given that JWTs are a flexible technology, they can be used in many different ways and it's for this reason they are often "misused."

Each time you load this website, a JWT is generated on the server with a payload containing the number of times you've visited the website. It is then signed to make sure the data has not been tampered with, then sent to your browser as a cookie.

We processed your old cookie, and used the data to make a change on the server, created a new JWT on the server with updated data, and send it back in a Set-Cookie header alongside the body of the website.

If your client were to become compromised in an XSS attack, this JWT would remain safe since—for this demonstration—the signature is redacted from the client, and is stored in an HttpOnly cookie. The JavaScript has no way to access it. The first portion contains header data denoting the algorithm used, key ID, and the token type. The second portion contains a base64 encoded stringified JSON object as the payload, the final portion contains a signature that was generated using the private key on the server.

If you were to attempt to modify the payload, we can detect the signature mismatch and treat it as as invalid. With this, we can process data and ensure its integrity while removing the need to store data in our database. There is no need to keep some central store of each user, their session, and number of visits.

