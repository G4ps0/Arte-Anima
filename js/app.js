// Sezione: Recensioni Opere Mirko Sabini
const sezioni = [
    {
        nome: "Recensioni Opere Mirko Sabini",
        playlist: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI",
        videoList: [
            {
                url: "https://youtu.be/aKA6QhAkhQI?si=RXxw2MuXMlVNe3uh",
                title: "Recensioni Opere Mirko Sabini - Video 1"
            },
            {
                url: "https://youtu.be/6oM6ki8D5uU?si=drM257sfY7nGu5hS",
                title: "Recensioni Opere Mirko Sabini - Video 2"
            },
            {
                url: "https://www.youtube.com/watch?v=lQ2Nh1xz5IU&list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI&index=3&pp=iAQB",
                title: "Recensioni Opere Mirko Sabini - Video 3"
            },
            {
                url: "https://www.youtube.com/watch?v=diGYxvC6Kks&list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI&index=4&pp=iAQB",
                title: "Recensioni Opere Mirko Sabini - Video 4"
            },
            {
                url: "https://www.youtube.com/watch?v=KLQAMLWU51Q&list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI&index=5&pp=iAQB",
                title: "Recensioni Opere Mirko Sabini - Video 5"
            },
            {
                url: "https://www.youtube.com/watch?v=39zV1SBoLtM&list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI&index=6&pp=iAQB",
                title: "Recensioni Opere Mirko Sabini - Video 6"
            },
            {
                url: "https://www.youtube.com/watch?v=rO3sBuumwCM&list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI&index=7&pp=iAQB",
                title: "Recensioni Opere Mirko Sabini - Video 7"
            },
            {
                url: "https://www.youtube.com/watch?v=4xcw7BGm8pY&list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI&index=8&pp=iAQB",
                title: "Recensioni Opere Mirko Sabini - Video 8"
            },
            {
                url: "https://www.youtube.com/watch?v=VtAk8DCXDV8&list=PL30nV9p8EmCDJumFF8QzG6456ojZ_56lI&index=9&pp=iAQB",
                title: "Recensioni Opere Mirko Sabini - Video 9"
            }
        ]
    },
    {
        nome: "La Massoneria - Il punto di vista di Giuliano Di Bernardo",
        playlist: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCCp3Z9ch4NIeL5sjpoSdjPf",
        videoList: [
            {
                url: "https://www.youtube.com/embed/XIwWtdqAyuI",
                title: "1. La Massoneria - Introduzione"
            },
            {
                url: "https://www.youtube.com/embed/zGFsZ25qA44",
                title: "2. La Massoneria - Storia e Origini"
            },
            {
                url: "https://www.youtube.com/embed/Jv9DY4lfDgE",
                title: "3. I Gradi Massonici e la Struttura"
            },
            {
                url: "https://www.youtube.com/embed/SUf5f4oQh5c",
                title: "4. I Simboli Massonici"
            },
            {
                url: "https://www.youtube.com/embed/_oSDUa7p7ps",
                title: "5. La Massoneria e la Società"
            },
            {
                url: "https://www.youtube.com/embed/ppo72WCaljw",
                title: "6. I Riti Massonici"
            },
            {
                url: "https://www.youtube.com/embed/LJj5zC_Sy6k",
                title: "7. La Massoneria nel Mondo Contemporaneo"
            },
            {
                url: "https://www.youtube.com/embed/W54b3ddnzqg",
                title: "8. Domande e Risposte sulla Massoneria"
            },
            {
                url: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCCp3Z9ch4NIeL5sjpoSdjPf",
                title: "Vedi tutta la playlist"
            }
        ]
    }
];

function getYouTubeVideoId(url) {
    if (!url) return null;
    // Gestione vari formati URL YouTube
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
}

function renderSezioni() {
    const container = document.getElementById('sections-container');
    container.innerHTML = '';
    sezioni.forEach((sec, idx) => {
        const card = document.createElement('div');
        card.className = 'section-card';
        card.innerHTML = `
            <div class="section-title-row">
                <div class="section-title">${sec.nome}</div>
                <button class="toggle-videos-btn">Mostra video</button>
            </div>
            <div class="section-playlist">
                <iframe width="420" height="236" src="${sec.playlist}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="video-list"></div>
        `;
        // Gestione pulsante Mostra/Nascondi video
        const toggleBtn = card.querySelector('.toggle-videos-btn');
        const videoListDiv = card.querySelector('.video-list');
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = card.classList.contains('active');
            if (isActive) {
                card.classList.remove('active');
                toggleBtn.textContent = 'Mostra video';
                videoListDiv.innerHTML = '';
            } else {
                // Chiudi eventuali altre sezioni aperte
                document.querySelectorAll('.section-card.active').forEach(c => {
                    c.classList.remove('active');
                    c.querySelector('.toggle-videos-btn').textContent = 'Mostra video';
                    c.querySelector('.video-list').innerHTML = '';
                });
                card.classList.add('active');
                toggleBtn.textContent = 'Nascondi video';
                renderVideoList(videoListDiv, sec.videoList);
            }
        });
        container.appendChild(card);
    });
}

function renderVideoList(container, videos) {
    container.innerHTML = '';
    videos.forEach(video => {
        const videoId = getYouTubeVideoId(video.url);
        if (!videoId) return;
        const single = document.createElement('div');
        single.className = 'single-video';
        single.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            <div class="video-title">${video.title}</div>
        `;
        container.appendChild(single);
    });
}

document.addEventListener('DOMContentLoaded', renderSezioni);
