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

  const zoomModal = document.getElementById("zoomModal");
  const zoomImage = document.getElementById("zoomImage");
  const zoomClose = document.getElementById("zoomClose");

  // SEMUA GAMBAR DALAM MODAL GALERI
  document.addEventListener("click", function(e) {
    if (e.target.closest("#galleryContent img")) {
      zoomModal.classList.add("active");
      zoomImage.src = e.target.src;
    }
  });

  // TUTUP ZOOM
  zoomClose.onclick = () => {
    zoomModal.classList.remove("active");
  };

  zoomModal.onclick = (e) => {
    if (e.target === zoomModal) {
      zoomModal.classList.remove("active");
    }
  };
