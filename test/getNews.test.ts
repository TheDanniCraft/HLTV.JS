import { getNews } from '../src/index';
import { HLTV } from '../src/config';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

jest.mock('axios');
jest.mock('xml2js', () => ({
    parseStringPromise: jest.fn(),
}));

describe('getNews', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockedParseStringPromise = parseStringPromise as jest.MockedFunction<typeof parseStringPromise>;

    const mockRSSData = `
        <rss>
            <channel>
                <item>
                    <title>News Title 1</title>
                    <description>Summary of news 1</description>
                    <link>http://example.com/news1</link>
                    <pubDate>Thu, 31 Aug 2023 14:00:00 +0000</pubDate>
                </item>
                <item>
                    <title>News Title 2</title>
                    <description>Summary of news 2</description>
                    <link>http://example.com/news2</link>
                    <pubDate>Fri, 01 Sep 2023 10:00:00 +0000</pubDate>
                </item>
            </channel>
        </rss>
    `;

    const parsedRSSData = {
        rss: {
            channel: {
                item: [
                    {
                        title: 'News Title 1',
                        description: 'Summary of news 1',
                        link: 'http://example.com/news1',
                        pubDate: 'Thu, 31 Aug 2023 14:00:00 +0000',
                    },
                    {
                        title: 'News Title 2',
                        description: 'Summary of news 2',
                        link: 'http://example.com/news2',
                        pubDate: 'Fri, 01 Sep 2023 10:00:00 +0000',
                    },
                ],
            },
        },
    };

    beforeEach(() => {
        mockedAxios.get.mockReset();
        mockedParseStringPromise.mockReset();
    });

    it('should fetch and parse news items correctly', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockRSSData });
        mockedParseStringPromise.mockResolvedValueOnce(parsedRSSData);

        const newsItems = await getNews();

        expect(newsItems).toEqual([
            {
                title: 'News Title 1',
                description: 'Summary of news 1',
                link: 'http://example.com/news1',
                time: new Date('Thu, 31 Aug 2023 14:00:00 +0000'),
            },
            {
                title: 'News Title 2',
                description: 'Summary of news 2',
                link: 'http://example.com/news2',
                time: new Date('Fri, 01 Sep 2023 10:00:00 +0000'),
            },
        ]);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${HLTV.BASE}/${HLTV.news}`
        );
        expect(mockedParseStringPromise).toHaveBeenCalledWith(mockRSSData, {
            trim: true,
            explicitArray: false,
        });
    });

    it('should handle errors from the axios request', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

        await expect(getNews()).rejects.toThrow('Network error');
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${HLTV.BASE}/${HLTV.news}`
        );
    });

    it('should handle errors during XML parsing', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockRSSData });
        mockedParseStringPromise.mockRejectedValueOnce(
            new Error('XML parsing error')
        );

        await expect(getNews()).rejects.toThrow('XML parsing error');
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${HLTV.BASE}/${HLTV.news}`
        );
    });
});
