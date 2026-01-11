function openGallery(images) {
    const modal = document.getElementById('galleryModal');
    const content = document.getElementById('galleryContent');

    content.innerHTML = '';
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        content.appendChild(img);
    });

    modal.classList.add('active');
}

function closeGallery() {
    document.getElementById('galleryModal').classList.remove('active');
}
