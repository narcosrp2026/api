const yts = require('yt-search');

export default async function handler(req, res) {
    // Permite conexões de qualquer origem (evita bloqueio no MTA)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Captura o termo digitado (seja via ?q=, ?search= ou ?nome=)
    const query = req.query.q || req.query.search || req.query.nome || req.query.name;

    if (!query) {
        return res.status(200).json([]);
    }

    try {
        // Busca até 15 resultados no YouTube
        const searchResults = await yts(query);
        const videos = searchResults.videos.slice(0, 15);

        if (!videos || videos.length === 0) {
            return res.status(200).json([]);
        }

        // Mapeia os dados preenchendo todas as variações de nomes de chaves que scripts de MTA costumam usar
        const listaFormatada = videos.map((video, index) => {
            const streamDirectUrl = `https://invidious.nerdvpn.de/latest_version?id=${video.videoId}&italic=0&type=audio`;
            
            return {
                id: video.videoId,
                index: index + 1,
                // Variantes de Título/Nome
                title: video.title,
                name: video.title,
                nome: video.title,
                titulo: video.title,
                
                // Variantes do Artista/Canal
                author: video.author.name,
                artist: video.author.name,
                artista: video.author.name,

                // Variantes da Duração
                duration: video.timestamp,
                tempo: video.timestamp,

                // Variantes do Link do Áudio (para tocar no playSound)
                url: streamDirectUrl,
                streamUrl: streamDirectUrl,
                audio: streamDirectUrl,
                link: streamDirectUrl,
                src: streamDirectUrl
            };
        });

        return res.status(200).json(listaFormatada);
    } catch (error) {
        console.error('Erro na busca:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar áudio' });
    }
}
