const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const client = require("./discord/main");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/api/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).end("No image uploaded");

  let images;
  Array.isArray(req.files.image)
    ? (images = req.files.image.map((img) => ({
        name: img.name,
        attachment: img.data,
      })))
    : (images = [
        { name: req.files.image.name, attachment: req.files.image.data },
      ]);

  const channel = await client.channels.fetch(process.env.GUILD_CHANNEL);

  try {
    const urls = await channel
      .send({ files: [...images] })
      .then((msg) => msg.attachments.map((attach) => attach.url));

    res.status(200).send(urls);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

client.login(process.env.BOT_TOKEN);

module.exports = app;
