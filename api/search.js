const yts = require('yt-search');

export default async function handler(req, res) {
    // Permite CORS total
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Captura o termo de busca em qualquer variável possível (q, search, name, nome, query, etc)
    const query = req.query.q || req.query.search || req.query.name || req.query.nome || req.query.query || req.query.input;

    // Se o script fizer requisição sem parâmetro ou para testar ping
    if (!query) {
        return res.status(200).json([]);
    }

    try {
        const searchResults = await yts(query);
        const videos = searchResults.videos.slice(0, 15);

        // Retorna a lista no formato completo de chaves
        const listaFormatada = videos.map((video, index) => {
            const streamDirectUrl = `https://invidious.nerdvpn.de/latest_version?id=${video.videoId}&italic=0&type=audio`;
            
            return {
                id: video.videoId,
                index: index + 1,
                title: video.title,
                name: video.title,
                nome: video.title,
                author: video.author.name,
                duration: video.timestamp,
                url: streamDirectUrl,
                streamUrl: streamDirectUrl,
                link: streamDirectUrl,
                src: streamDirectUrl
            };
        });

        return res.status(200).json(listaFormatada);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar música' });
    }
}
