document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
});

function loadGallery() {
    // 1. Ambil data dari LocalStorage browser
    const savedData = localStorage.getItem('geoGalleryData');
    const container = document.getElementById('public-gallery-container');
    
    // 2. Jika kosong, tampilkan pesan
    if (!savedData) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-images text-muted display-4"></i>
                <p class="text-muted">Belum ada galeri yang ditambahkan oleh admin.</p>
            </div>`;
        return;
    }

    // 3. Parse JSON dan Render
    const galleryData = JSON.parse(savedData);
    container.innerHTML = ''; // Bersihkan loading

    galleryData.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="gallery-card h-100">
                <img src="${item.image}" class="gallery-img" alt="${item.title}">
                <div class="p-3 bg-white">
                    <h5 class="fw-bold mb-1 text-truncate">${item.title}</h5>
                    <p class="small text-muted text-truncate">${item.desc}</p>
                </div>
            </div>`;
        container.appendChild(col);
    });
}