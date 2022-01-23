const functions = require("firebase-functions");
const axios = require("axios");
const cheerio = require("cheerio");

exports.scrape = functions.https.onRequest(async (request, respone) => {
	const axiosConfig = {
		url: "https://tikkio.com/in/bodo",
	};

	const getEventData = async () =>
		await axios(axiosConfig).then((res) => {
			const $ = cheerio.load(res.data);
			const data = [];
			$(".top-event").map((index, element) => {
				const link = $(element).attr("href");
				const title = $(element).find(".title").attr("title");
				const description = $(element).find(".location").text();
				const image = $(element).find(".image").attr("data-src");
				data.push({ link, title, description, image });
			});

			functions.logger.log(data);
			return JSON.stringify(data);
		});

	respone.send(await getEventData());
});
