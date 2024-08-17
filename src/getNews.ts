import { HLTV } from './config'
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  time: string;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${HLTV.BASE}/${HLTV.news}`);
    const rssData = response.data;

    const parsedData = await parseStringPromise(rssData, { trim: true, explicitArray: false });

    const newsItems = parsedData.rss.channel.item.map((item: any) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      time: new Date(item.pubDate).toISOString(),
    }));

    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}