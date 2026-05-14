const convertBtn = document.getElementById('convertBtn');
const urlInput = document.getElementById('tiktokUrl');
const resultCard = document.getElementById('resultCard');
const spinner = document.getElementById('spinner');
const btnText = document.getElementById('btnText');

convertBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();

    // Regex untuk validasi URL TikTok yang lebih ketat
    // Mencocokkan format umum video TikTok (www, vm, m, atau vt)
    const tiktokUrlRegex = /^(https?:\/\/(?:www\.|vm\.|m\.|vt\.)?tiktok\.com\/(?:@[\w.]+\/video\/(\d+)|v\/(\d+)|[a-zA-Z0-9]+))\/?.*$/;
    if (!url || !tiktokUrlRegex.test(url)) {
        alert('Mohon masukkan tautan video TikTok yang valid (contoh: https://www.tiktok.com/@user/video/...)!');
        return;
    }

    // UI State Loading
    setLoading(true);
    resultCard.classList.add('hidden');

    try {
        // Menggunakan API TikWM
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.code === 0 && result.data) {
            const video = result.data;
            
            document.getElementById('videoThumb').src = video.cover;
            document.getElementById('videoTitle').innerText = video.title || 'Video Tanpa Judul';
            
            const dlBtn = document.getElementById('downloadBtn');
            // 'play' adalah video tanpa watermark, 'hdplay' adalah kualitas HD
            dlBtn.href = video.hdplay || video.play;
            
            resultCard.classList.remove('hidden');
        } else {
            throw new Error(result.msg || 'Gagal mengambil data');
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan: ' + error.message);
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');
        convertBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
        convertBtn.disabled = false;
    }
}