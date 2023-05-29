const path = require("path");
const { GUID_CHANNEL } = require("../config.json");
const express = require("express");
const fileUpload = require("express-fileupload");
const clients = require("./login");

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

  try {
    const start = Date.now();
    const urls = await sendHandler(images);
    console.log(Date.now() - start);
    res.status(200).send(urls);
  } catch (error) {
    res.status(400).send(error);
  }
});

const getDiscUrl = async ({ channel, images, retryCount }) => {
  try {
    const urls = await channel
      .send({ files: [...images] })
      .then((msg) => msg.attachments.map((attach) => attach.url));

    return urls;
  } catch (error) {
    if (retryCount) {
      console.log("Retry");
      retryCount--;
      return await getDiscUrl({ channel, images, retryCount });
    } else {
      throw error;
    }
  }
};

const getDiscUrls = (channel, images) => {
  return new Promise(async (resolve) => {
    let count = Math.ceil(images.length / 10);
    let urls = [];

    do {
      const res = await getDiscUrl({
        channel,
        images: images.slice(urls.length, urls.length + 10),
        retryCount: 5,
      });

      urls.push(...res);
      count--;
    } while (count > 0);

    resolve(urls);
  });
};

const sendHandler = async (images) => {
  let urls;

  if (images.length > 30) {
    let sendCount = Math.ceil(images.length / clients.length);
    let index = 0;

    let promise = [];
    for (const client of clients) {
      const channel = await client.channels.fetch(GUID_CHANNEL);

      const promiseUrls = getDiscUrls(
        channel,
        images.slice(index, index + sendCount)
      );
      index += sendCount;
      promise.push(promiseUrls);
    }
    urls = (await Promise.all(promise)).flat();
  } else {
    const channel = await clients[0].channels.fetch(GUID_CHANNEL);
    urls = await getDiscUrls(channel, images);
  }

  return urls;
};

module.exports = app;
