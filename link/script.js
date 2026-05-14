const convertBtn = document.getElementById('convertBtn');
const urlInput = document.getElementById('tiktokUrl');
const resultCard = document.getElementById('resultCard');
const spinner = document.getElementById('spinner');
const btnText = document.getElementById('btnText');

convertBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();

    if (!url || !url.includes('tiktok.com')) {
        alert('Mohon masukkan link TikTok yang valid!');
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