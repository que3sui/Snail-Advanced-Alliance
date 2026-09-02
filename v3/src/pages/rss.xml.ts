import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_NAME } from "../lib/constants";

export async function GET(context) {
  const events = await getCollection("events");
  const dialogues = await getCollection("dialogues");

  const items = [...events, ...dialogues]
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((item) => {
      const isDialogue = "interviewee" in item.data;
      return {
        title: item.data.title,
        pubDate: item.data.date,
        description: item.data.summary,
        link: isDialogue ? `/dialogues/${item.id}/` : `/events/${item.id}/`,
      };
    });

  return rss({
    title: SITE_NAME,
    description: "让喜欢折腾的人凑在一起折腾",
    site: context.site,
    items,
    customData: `<language>zh-cn</language>`,
  });
}
