import UserAgent from 'user-agents';

export const HLTV = {
    BASE: 'https://www.hltv.org',
    CDN: 'https://img-cdn.hltv.org',
    news: 'rss/news',
};

export const USER_AGENT = new UserAgent().toString();
