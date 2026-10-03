const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Passenger request error:", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Next.js Passenger server ready on ${port}`);
    });

    process.on("SIGTERM", () => {
      server.close(() => {
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("Failed to start Passenger Next.js server:", err);
    process.exit(1);
  });
