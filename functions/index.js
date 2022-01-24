const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

const corsModule = require("cors");
const cors = corsModule({ origin: "https://bodokal.web.app" });

const axiosConfig = {
	url: "https://tikkio.com/in/bodo",
};

exports.scrape = functions.https.onRequest((request, response) => {
	cors(request, response, async () => {
		const getEventData = async () =>
			await axios(axiosConfig).then((res) => {
				const $ = cheerio.load(res.data);
				const data = [];
				$(".top-event").map((index, element) => {
					const link = $(element).attr("href");
					const title = $(element).find(".title").attr("title");
					const description = $(element)
						.find(".location")
						.html()
						.split("<br>");
					const date = description[0];
					const location = description[1];
					const image = $(element).find(".image").attr("data-src");
					data.push({ link, title, date, location, image });
				});

				functions.logger.log(data);
				return JSON.stringify(data);
			});

		response.send(await getEventData());
	});
});
