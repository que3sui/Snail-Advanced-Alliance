import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@/lib/constants";

export async function GET() {
  const events = await getCollection("events");
  const dialogues = await getCollection("dialogues");

  const items = [...events, ...dialogues]
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((item) => {
      const isDialogue = "interviewee" in item.data;
      return {
        title: item.data.title,
        pubDate: item.data.date,
        description: isDialogue ? item.data.summary : item.data.summary,
        link: isDialogue ? `/dialogues/${item.id}/` : `/events/${item.id}/`,
      };
    });

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: SITE.url,
    items,
    customData: `<language>zh-cn</language>`,
  });
}
