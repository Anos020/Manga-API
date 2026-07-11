const axios = require('axios');

class Mangakakalot {
    constructor() {
        this.apiUrl = "https://api.mangadex.org";
    }

    async latestRelease() {
        try {
            const response = await axios.get(`${this.apiUrl}/manga`, {
                params: {
                    limit: 20,
                    order: { updatedAt: 'desc' },
                    includes: ['cover_art']
                }
            });
            
            const mangaList = response.data.data.map(manga => {
                const coverRel = manga.relationships.find(r => r.type === 'cover_art');
                const fileName = coverRel ? coverRel.attributes?.fileName : '';
                return {
                    id: manga.id,
                    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'Unknown',
                    img: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : '',
                    chapters: []
                };
            });
            return { results: mangaList };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async latestManga(page = 1) {
        try {
            const limit = 20;
            const offset = (page - 1) * limit;
            const response = await axios.get(`${this.apiUrl}/manga`, {
                params: {
                    limit: limit,
                    offset: offset,
                    order: { latestUploadedChapter: 'desc' },
                    includes: ['cover_art']
                }
            });

            const mangaList = response.data.data.map(manga => {
                const coverRel = manga.relationships.find(r => r.type === 'cover_art');
                const fileName = coverRel ? coverRel.attributes?.fileName : '';
                return {
                    id: manga.id,
                    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'Unknown',
                    img: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : '',
                    description: manga.attributes.description.en || ''
                };
            });
            return { results: mangaList };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async search(query, page = 1) {
        try {
            const limit = 20;
            const offset = (page - 1) * limit;
            const response = await axios.get(`${this.apiUrl}/manga`, {
                params: {
                    title: query,
                    limit: limit,
                    offset: offset,
                    includes: ['cover_art']
                }
            });

            const mangaList = response.data.data.map(manga => {
                const coverRel = manga.relationships.find(r => r.type === 'cover_art');
                const fileName = coverRel ? coverRel.attributes?.fileName : '';
                return {
                    id: manga.id,
                    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'Unknown',
                    img: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : '',
                    author: 'Unknown'
                };
            });
            return { results: mangaList };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async chapterInfo(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/manga/${id}/feed`, {
                params: {
                    limit: 100,
                    translatedLanguage: ['en'],
                    order: { chapter: 'asc' }
                }
            });

            const chapters = response.data.data.map(ch => ({
                chapterID: ch.id,
                chapterName: ch.attributes.title || `Chapter ${ch.attributes.chapter}`,
                chapterCode: ch.attributes.chapter
            }));

            return { results: { chapters } };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async FetchChapter(id, chapterID) {
        try {
            const response = await axios.get(`${this.apiUrl}/at-home/server/${chapterID}`);
            const baseUrl = response.data.baseUrl;
            const hash = response.data.chapter.hash;
            const files = response.data.chapter.data;

            const images = files.map(file => `${baseUrl}/data/${hash}/${file}`);

            return { results: { chapter: { images } } };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new Mangakakalot();
