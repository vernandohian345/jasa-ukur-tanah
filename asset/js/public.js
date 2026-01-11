// document.addEventListener('DOMContentLoaded', () => {
//     loadGallery();
// });

// async function loadGallery() {
//     const container = document.getElementById('public-gallery-container');
    
//     // Tampilkan loading sementara
//     container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-success" role="status"></div></div>';

//     try {
//         // 1. AMBIL DATA DARI API DATABASE (Bukan LocalStorage)
//         const res = await fetch('/api/gallery');
//         const data = await res.json();

//         // 2. Bersihkan container (Hapus loading)
//         container.innerHTML = '';

//         // 3. Jika data kosong
//         if (!data || data.length === 0) {
//             container.innerHTML = `
//                 <div class="col-12 text-center py-5">
//                     <i class="bi bi-images text-muted display-4"></i>
//                     <p class="text-muted mt-3">Belum ada galeri yang ditambahkan oleh admin.</p>
//                 </div>`;
//             return;
//         }

//         // 4. Render Data
//         // PERHATIKAN: Nama properti disesuaikan dengan Database (gambar, judul, deskripsi)
//         data.forEach(item => {
//             const col = document.createElement('div');
//             col.className = 'col-md-6 col-lg-4 mb-4';
//             col.innerHTML = `
//                 <div class="gallery-card h-100 shadow-sm border-0">
//                     <img src="${item.gambar}" class="gallery-img" alt="${item.judul}">
//                     <div class="p-3 bg-white rounded-bottom">
//                         <h5 class="fw-bold mb-1 text-truncate">${item.judul}</h5>
//                         <p class="small text-muted text-truncate">${item.deskripsi}</p>
//                     </div>
//                 </div>`;
//             container.appendChild(col);
//         });

//     } catch (error) {
//         console.error('Gagal memuat gallery:', error);
//         container.innerHTML = `
//             <div class="col-12 text-center py-5">
//                 <p class="text-danger">Gagal memuat data. Pastikan Backend berjalan (<code>vercel dev</code>).</p>
//             </div>`;
//     }
// }