// --- KONFIGURASI ---
const USER = 'admin';
const PASS = 'admin123';

// --- 1. CEK SESSION LOGIN ---
document.addEventListener('DOMContentLoaded', () => {
    const isLogin = localStorage.getItem('admin_session');
    
    // Jika belum login, tendang ke login.html
    if (isLogin !== 'true') {
        window.location.href = 'login.html';
        return; 
    }

    // Jika sudah login, muat data dari Database
    loadTable();
});

function logout() {
    localStorage.removeItem('admin_session');
    window.location.href = 'login.html';
}

// --- 2. EVENT LISTENER (PREVIEW GAMBAR) ---
document.getElementById('inputFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(evt){
            document.getElementById('imgPreview').src = evt.target.result;
            document.getElementById('previewBox').style.display = 'block';
        };
        reader.readAsDataURL(file); // Ubah ke Base64
    }
});

// --- 3. AMBIL DATA DARI DATABASE (API) ---
async function loadTable() {
    try {
        // Fetch ke API gallery
        const res = await fetch('/api/gallery');
        const data = await res.json();
        
        const tbody = document.getElementById('gallery-table-body');
        tbody.innerHTML = '';

        // Mapping: Kolom DB 'judul' dan 'deskripsi' ke Tabel
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="ps-4"><img src="${item.gambar}" class="admin-thumb"></td>
                <td class="fw-bold">${item.judul}</td>
                <td class="text-muted text-truncate" style="max-width: 200px;">${item.deskripsi}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-warning me-1" onclick="editData(${item.id})"><i class="bi bi-pencil"></i> Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteData(${item.id})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert('Gagal memuat data. Pastikan Backend (vercel dev) sudah jalan.');
    }
}

// --- 4. SIMPAN / UPDATE DATA (Kirim ke Database) ---
async function saveData() {
    const id = document.getElementById('editId').value;
    const judul = document.getElementById('inputJudul').value;
    const deskripsi = document.getElementById('inputDeskripsi').value;
    const fileInput = document.getElementById('inputFile');
    const imgPreview = document.getElementById('imgPreview').src;

    if(!judul || !deskripsi) {
        alert('Harap lengkapi judul dan deskripsi!');
        return;
    }

    // Tentukan gambar final (Base64)
    let finalImage = "";

    if (id) {
        // --- MODE EDIT ---
        // Ambil data lama dulu
        const oldData = await (await fetch('/api/gallery')).json();
        const oldItem = oldData.find(x => x.id == id);
        
        // Jika upload file baru, pakai baru. Jika tidak, pakai lama.
        if (fileInput.files && fileInput.files[0]) {
            finalImage = imgPreview; // Base64 Baru
        } else {
            finalImage = oldItem.gambar; // Base64 Lama
        }
    } else {
        // --- MODE TAMBAH BARU ---
        if(!fileInput.files || !fileInput.files[0]) {
            alert('Mohon upload foto!');
            return;
        }
        finalImage = imgPreview; // Base64 Baru
    }

    // Kirim ke API
    const method = id ? 'PUT' : 'POST';
    const payload = {
        judul, 
        deskripsi, 
        gambar: finalImage
    };
    if(id) payload.id = id;

    try {
        const res = await fetch('/api/gallery', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if(res.ok) {
            const modalEl = document.getElementById('galleryModal');
            bootstrap.Modal.getInstance(modalEl).hide();
            loadTable(); // Refresh tabel
        } else {
            alert('Gagal menyimpan data');
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi');
    }
}

// --- 5. BUKA MODAL (AMBIL DATA SPESIFIK JIKA EDIT) ---
async function openModal(isEdit = false, id = null) {
    document.getElementById('galleryForm').reset();
    document.getElementById('previewBox').style.display = 'none';
    
    if (isEdit) {
        // Ambil detail data dari database untuk diisi di form
        const data = await (await fetch('/api/gallery')).json();
        const item = data.find(x => x.id === id);
        
        document.getElementById('modalTitle').innerText = 'Edit Gallery';
        document.getElementById('editId').value = item.id;
        document.getElementById('inputJudul').value = item.judul;
        document.getElementById('inputDeskripsi').value = item.deskripsi;
        
        // Tampilkan gambar lama
        document.getElementById('imgPreview').src = item.gambar;
        document.getElementById('previewBox').style.display = 'block';
    } else {
        document.getElementById('modalTitle').innerText = 'Tambah Gallery';
        document.getElementById('editId').value = '';
    }
    
    new bootstrap.Modal(document.getElementById('galleryModal')).show();
}

function editData(id) {
    openModal(true, id);
}

// --- 6. HAPUS DATA ---
async function deleteData(id) {
    if(!confirm('Yakin ingin menghapus foto ini?')) return;
    
    try {
        await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
        loadTable(); // Refresh tabel
    } catch (error) {
        alert('Gagal menghapus data');
    }
}