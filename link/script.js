const convertBtn = document.getElementById('convertBtn');
const urlInput = document.getElementById('tiktokUrl');
const resultCard = document.getElementById('resultCard');
const spinner = document.getElementById('spinner');
const btnText = document.getElementById('btnText');

const directDlBtn = document.getElementById('directDlBtn');
let currentVideoUrl = '';

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
            const title = video.title || 'Video Tanpa Judul';
            document.getElementById('videoTitle').innerText = title;
            
            const dlBtn = document.getElementById('downloadBtn');
            // 'play' adalah video tanpa watermark, 'hdplay' adalah kualitas HD
            const videoUrl = video.hdplay || video.play;
            dlBtn.href = videoUrl;
            currentVideoUrl = videoUrl;
            
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

directDlBtn.addEventListener('click', async () => {
    if (!currentVideoUrl) return;

    setLoading(true);
    try {
        const response = await fetch(currentVideoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tiktok_reonzy_${Date.now()}.mp4`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        alert('Gagal download langsung: ' + error.message);
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