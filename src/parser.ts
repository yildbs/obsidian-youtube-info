import { requestUrl, stringifyYaml } from "obsidian";

const isYoutubeUrl = async (url:string) => {
    return true;
};

const getYoutubeInfo= async (youtubeUrl: string) => {
    try {
		const response = await requestUrl({
			url: youtubeUrl
		});

		const parser = new DOMParser();
		const html = parser.parseFromString(response.text, "text/html");

		let title =
            html
            .querySelector("body div meta[itemprop='name']")
            .getAttribute("content")
			.replace(/\(.*\)/gi, "")
			.replace(/\[.*\]/gi, "")
			.replace(":", "：")
			.replace("?", "？")
			.trim();
			;

        let datePublished = 
            html
            .querySelector("body div meta[itemprop='datePublished']")
            .getAttribute("content")
			.replace(/\(.*\)/gi, "")
			.replace(/\[.*\]/gi, "")
			.replace(":", "：")
			.replace("?", "？")
			.trim();
        
        let genre = 
            html
            .querySelector("body div meta[itemprop='genre']")
            .getAttribute("content")
			.replace(/\(.*\)/gi, "")
			.replace(/\[.*\]/gi, "")
			.replace(":", "：")
			.replace("?", "？")
			.trim();

        let duration = 
            html
            .querySelector("body div meta[itemprop='duration']")
            .getAttribute("content")
			.replace(/\(.*\)/gi, "")
			.replace(/\[.*\]/gi, "")
			.replace(":", "：")
			.replace("?", "？")
			.trim()
			.replace(/([a-zA-Z])/g, " ")
			.trim()
			.split(" ");

        let thumbnailUrl = 
            html
            .querySelector("body div link[itemprop='thumbnailUrl']")
            .getAttribute("href");

		let creator = 
            html
            .querySelector("body div link[itemprop='name']")
            .getAttribute("content")
			.replace(/\(.*\)/gi, "")
			.replace(/\[.*\]/gi, "")
			.replace(":", "：")
			.replace("?", "？")
			.trim();
			;

        let keywords = []
			html
            .querySelector("head meta[name='keywords']")
            .getAttribute("content")
			.replace(/\(.*\)/gi, "")
			.replace(/\[.*\]/gi, "")
			.replace(":", "：")
			.replace("?", "？")
			.split(",")
			.forEach((k)=> {
				keywords.push(k.trim().replace(/ /g, "_"))
			})
			;

        const frontmatter = {
title : `${title}`,
tag: `${keywords.join(" ")}`,
publish_date: `${datePublished}`,
start_study_date: `${
	moment(new Date()).format().split("T")[0]
}`,
finish_study_date: `${
	moment(new Date()).format().split("T")[0]
}`,
duration : `${duration[0]}M ${duration[1]}S`,
creator : `${creator}`,
genre : `${genre}`,
		} ;

		const result = `---
${stringifyYaml(frontmatter)}---

![Cover](${thumbnailUrl})

# ${title}`;
		return result;
	} catch (err) {
		console.log(err);
        return err;
	}
};

export { getYoutubeInfo };
