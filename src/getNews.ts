import { HLTV } from './config';
import axios, { AxiosResponse } from 'axios';
import { parseStringPromise, Options } from 'xml2js';

/**
 * News item fetched from the RSS feed.
 */
interface NewsItemResponse {
    title: string;
    description: string;
    link: string;
    pubDate: string;
}

/**
 * Processed news item returned to the user.
 */
interface NewsItem extends Omit<NewsItemResponse, 'pubDate'> {
    time: Date;
}

interface RSSParsedData {
    rss: {
        channel: {
            item: NewsItemResponse[];
        };
    };
}

/**
 * Fetches the latest news from the HLTV RSS feed.
 *
 * @returns {Promise<Array<{ title: string, description: string, link: string, time: Date }>>}
 * - `<NewsItem>.title` (string): Title of the news
 * - `<NewsItem>.description` (string): A brief summary of the news
 * - `<NewsItem>.link` (string): URL to the full news article.
 * - `<NewsItem>.time` (Date): Publication date
 */
export async function getNews(): Promise<NewsItem[]> {
    try {
        const response: AxiosResponse<string> = await axios.get(`${HLTV.BASE}/${HLTV.news}`);
        const rssData: string = response.data;

        const parseOptions: Options = { trim: true, explicitArray: false };
        const parsedData = (await parseStringPromise(
            rssData,
            parseOptions
        )) as RSSParsedData;

        const newsItems: NewsItem[] = parsedData.rss.channel.item.map(
            (item: NewsItemResponse): NewsItem => ({
                title: item.title,
                description: item.description,
                link: item.link,
                time: new Date(item.pubDate),
            })
        );

        return newsItems;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}
