const yts = require('yt-search');

export default async function handler(req, res) {
    const { q } = req.query; // Pega o nome da música enviado na URL

    if (!q) {
        return res.status(400).json({ error: 'Envie o nome da música' });
    }

    try {
        const r = await yts(q);
        const video = r.videos[0]; // Pega o primeiro resultado da busca

        if (!video) {
            return res.status(404).json({ error: 'Música não encontrada' });
        }

        // Retorna os dados para o MTA
        return res.status(200).json({
            title: video.title,
            videoId: video.videoId,
            url: video.url,
            // Exemplo conectando com um stream direto de áudio
            streamUrl: `https://invidious.nerdvpn.de/latest_version?id=${video.videoId}&italic=0&type=audio`
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar áudio' });
    }
}
