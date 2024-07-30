import { cookies, headers } from "next/headers";
import Paragraph from "../components/Paragraph";
import CodeBlock from "../components/CodeBlock";

const maskString = (content: string, unmaskedCount: number = 3) =>
  content.length <= unmaskedCount
    ? content
    : content.slice(0, unmaskedCount) +
      "█".repeat(content.length - unmaskedCount);

const SEGMENT_COLORS = ["#ffc9dc", "#fff1c9", "#cfffc9"];

export default function Home() {
  const oldJwt = cookies().get("session")?.value;
  const newJwt = headers().get("set-cookie")?.split(";")?.[0]?.split("=")?.[1];

  if (!oldJwt && !newJwt) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-4 py-16 px-12 max-w-xl mx-auto text-center">
        <h1 className="text-xl font-playfair tracking-tight">
          JWTs (JSON Web Token)
        </h1>
        <Paragraph>
          Something either went wrong with your old JWT, or your new one. Sorry!
        </Paragraph>
      </main>
    );
  }

  const PAYLOAD = JSON.stringify(
    JSON.parse(
      Buffer.from((newJwt ?? oldJwt!).split(".")[1], "base64").toString()
    ),
    null,
    2
  );

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 py-16 px-12 max-w-xl mx-auto text-center">
      <h1 className="text-xl font-playfair tracking-tight">
        JWTs (JSON Web Token)
      </h1>
      <Paragraph>
        This website uses no databases yet utilizes server-issued data with
        integrity. This is because this website leverages a JWT.
      </Paragraph>
      <Paragraph>
        Typically, users are authenticated using a stateful system in which
        session data is stored on the client and compared against the data on
        the server, usually in a database. With JWTs, we can implement a
        stateless system which allows us to authorize a user without storing
        data in a database on our backend. Since the system is stateless, the
        next call does not rely on the last. The state is as-is as defined in
        the JWT&apos;s payload. This means previous states—granted they&apos;re
        not expired—can be &quot;reloaded&quot; and are impossible to
        invalidate. If we have a service where verifying whether a user is
        authenticated is too expensive such-is the case when we&apos;re working
        across multiple microservices, a JWT might be the right choice. Given
        that JWTs are a flexible technology, they can be used in many different
        ways and it&apos;s for this reason they are often &quot;misused.&quot;
      </Paragraph>
      <Paragraph>
        Each time you load this website, a JWT is generated on the server with a
        payload containing the number of times you&apos;ve visited the website
        and sent to your browser as a cookie.
      </Paragraph>
      {oldJwt ? (
        <>
          <Paragraph>
            We processed your old cookie, and used the data to make a change on
            the server, created a new JWT on the server with updated data, and
            send it back in a Set-Cookie header alongside the body of the
            website.
          </Paragraph>
          <Paragraph>Here it is:</Paragraph>
          <CodeBlock className="text-left">
            {newJwt!.split(".").map((segment, index) => (
              <span
                key={segment}
                style={{ color: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                className="first:before:[content:''] before:[content:'.'] before:text-white before:inline"
              >
                {index === 2 ? maskString(segment, 2) : segment}
              </span>
            ))}
          </CodeBlock>
        </>
      ) : (
        <>
          <Paragraph>
            Since this is your first time on this website with this session, we
            had to generate a new JWT on the server and send it back.
          </Paragraph>
          <Paragraph>Here it is:</Paragraph>
          <CodeBlock className="text-left">
            {newJwt!.split(".").map((segment, index) => (
              <span
                key={segment}
                style={{ color: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                className="first:before:[content:''] before:[content:'.'] before:text-white before:inline"
              >
                {index === 2 ? maskString(segment, 2) : segment}
              </span>
            ))}
          </CodeBlock>
        </>
      )}
      <Paragraph>
        If your client were to become compromised in an XSS attack, this JWT
        would remain safe since—for this demonstration—the signature is redacted
        from the client, and is stored in an HttpOnly cookie. The JavaScript has
        no way to access it. The first portion contains header data denoting the
        algorithm used, key ID, and the token type. The second portion contains
        a base64 encoded stringified JSON object as the payload, the final
        portion contains a signature that was generated using the private key on
        the server.
      </Paragraph>
      <Paragraph>
        Here is the decoded payload portion of your new JWT:
      </Paragraph>
      <CodeBlock className="text-white whitespace-pre text-left">
        {PAYLOAD}
      </CodeBlock>
      <Paragraph>
        If you were to attempt to modify the payload, the signature which can
        only be generated with the private key stored on the server would
        mismatch with the content, and would be treated as invalid. With this,
        we can process data and assign it on the server to ensure its integrity
        while removing the need to store data in our database. Since the data is
        stored with the user, and not on a database, there&apos;s no need to
        keep some central store of each user, their session, and number of
        visits.
      </Paragraph>
      <Paragraph>
        I personally consider JWTs misused when they are used in a situation
        where a simple API key or session token wouldn&apos;t change the
        functionality of the authentication scheme and when it serves
        little-to-no benefit in terms of the costs to run a service. While a
        useful and flexible tool, they tend to be overused, wastefully
        implemented or done so in a way that makes them redundant.
      </Paragraph>
      <Paragraph>
        Below this paragraph, you&apos;ll find a logout button. A particular
        behaviour with JWTs is that unlike a session stored on a centralized
        server, the session is never invalidated. This means that &quot;logging
        out&quot; does nothing more than throw away the JWT on the client. Since
        this website does nothing to version or expire the JWT, you could save
        and reuse the JWT after you logout, or reload a previous session state
        at any point just by saving and reutilizing your JWT.
      </Paragraph>
      <a href="/logout">
        <button className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-sm px-3 py-1.5 text-sm tracking-tighter font-playfair">
          Logout
        </button>
      </a>
      <Paragraph>
        Upon clicking the above button, you&apos;ll send a request to an
        endpoint that will clear the cookie, and redirect you back to this page.
      </Paragraph>
      <Paragraph>
        <span className="relative">
          <a
            className="text-blue-500 tracking-tight before:[content:'—'] before:absolute before:-translate-x-full before:-left-1"
            href="https://rida.dev"
          >
            <span className="underline underline-offset-2">
              Rida F&apos;kih
            </span>
          </a>
        </span>
      </Paragraph>
    </main>
  );
}
