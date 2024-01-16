// please dont read my code, it sucks
let currentPage = 1;
const totalQuestions = 10;

function navigate(current, next, direction) {
    const currentElement = document.getElementById(current);
    const nextElement = document.getElementById(next);

    currentElement.style.display = 'none';
    nextElement.style.display = 'block';

    const labels = nextElement.querySelectorAll('.question label');
    labels.forEach(label => {
        label.style.animation = 'slideInForward 0.5s ease';
    });

    setTimeout(() => {
        labels.forEach(label => {
            label.style.animation = '';
        });
    }, 500);

    if (direction === 'forward') {
        currentPage += 1;
        if (currentPage > totalQuestions) {
            showResult();
        }
    } else if (direction === 'backward') {
        currentPage -= 1;
    }

    if (currentPage < 1) {
        currentPage = 1;
    }
}

function showResult() {
    let introvertScore = 0;
    let extrovertScore = 0;
    let communistScore = 0;

    for (let i = 1; i <= totalQuestions; i++) {
        const selectedValue = document.querySelector(`input[name="q${i}"]:checked`)?.value;
        if (selectedValue === null) {
            return;
        }
        introvertScore += (selectedValue === 'A') ? 1 : 0;
        extrovertScore += (selectedValue === 'B') ? 1 : 0;
        communistScore += (selectedValue === 'C') ? 1 : 0;
    }

    const body = document.body;

    if (communistScore >= introvertScore && communistScore >= extrovertScore) {
        body.classList.add('background-fade');
        const div = document.getElementById('cont');
        div.classList.add('background-fade');
        div.classList.remove('container');

        const existingImage = document.getElementById('communism');
        if (!existingImage) {
            const img = document.createElement('img');
            img.src = 'communism.png';
            img.id = 'communism';
            img.style.opacity = '0';
            img.style.position = 'absolute';
            img.style.left = '50%';
            img.style.top = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.classList.add('flag');

            div.insertBefore(img, div.firstChild);

            img.offsetWidth;
            img.style.transition = 'opacity 30s ease';
            img.style.opacity = '1';

            // reset tab title
            document.title = 'Communism';
            // icon
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = 'communism.png';
            document.getElementsByTagName('head')[0].appendChild(link);

            // if anyone wants, let me know and ill make a direct link that just leads to this masterpiece
        }
    }

    const resultPage = document.getElementById('resultPage');
    if (resultPage) {
        if (communistScore >= introvertScore && communistScore >= extrovertScore) {
            resultPage.innerHTML = `<p> </p> `;
            const title = document.getElementById('title');

            title.style.display = 'none';
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            fetch('https://raw.githubusercontent.com/MrBreakNFix/website/main/music.ogg')
                .then(response => response.arrayBuffer())
                .then(data => audioContext.decodeAudioData(data))
                .then(buffer => {
                    const audioSource = audioContext.createBufferSource();
                    audioSource.buffer = buffer;

                    const gainNode = audioContext.createGain();
                    audioSource.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 60);
                    // fade in over a min
                    audioSource.start();
                    // loop
                    audioSource.loop = true;
                })
                .catch(error => console.error('Error loading audio:', error));
        } else {
            const result = (introvertScore >= extrovertScore) ? 'Introvert' : 'Extrovert';
            resultPage.innerHTML = `<p>Your personality result: ${result}</p>`;
        }
        resultPage.style.display = 'block';
    }

}