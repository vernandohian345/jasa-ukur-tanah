// --- KONFIGURASI (TIDAK DIPAKAI, BISA DIABAIKAN) ---
const USER = 'admin';
const PASS = 'admin123';

// --- 0. HANDLE LOGIN (WAJIB ADA UNTUK login.html) ---
async function handleLogin(event) {
    event.preventDefault();

    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');

    // Jika elemen tidak ada, berarti bukan di halaman login
    if (!usernameEl || !passwordEl) return;

    const username = usernameEl.value;
    const password = passwordEl.value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            localStorage.setItem('admin_session', 'true');
            window.location.href = 'admin.html';
        } else {
            const data = await res.json();
            alert(data.error || 'Login gagal');
            console.log('LOGIN ERROR:', data);
        }
    } catch (err) {
        alert('Gagal terhubung ke server');
    }
}

// --- 1. CEK SESSION LOGIN (HANYA UNTUK admin.html) ---
document.addEventListener('DOMContentLoaded', () => {

    // Jika ini halaman login, JANGAN redirect
    if (document.getElementById('username')) {
        return;
    }

    const isLogin = localStorage.getItem('admin_session');

    if (isLogin !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Jika sudah login dan halaman admin
    if (typeof loadTable === 'function') {
        loadTable();
    }
});

function logout() {
    localStorage.removeItem('admin_session');
    window.location.href = 'login.html';
}

// --- 2. EVENT LISTENER (PREVIEW GAMBAR) ---
const fileInputEl = document.getElementById('inputFile');
if (fileInputEl) {
    fileInputEl.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                document.getElementById('imgPreview').src = evt.target.result;
                document.getElementById('previewBox').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// --- 3. AMBIL DATA DARI DATABASE (API) ---
async function loadTable() {
    try {
        const res = await fetch('/api/gallery');
        const data = await res.json();

        const tbody = document.getElementById('gallery-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="ps-4"><img src="${item.gambar}" class="admin-thumb"></td>
                <td class="fw-bold">${item.judul}</td>
                <td class="text-muted text-truncate" style="max-width: 200px;">${item.deskripsi}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-warning me-1" onclick="editData(${item.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteData(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert('Gagal memuat data.');
    }
}

// --- 4. SIMPAN / UPDATE DATA ---
async function saveData() {
    const id = document.getElementById('editId').value;
    const judul = document.getElementById('inputJudul').value;
    const deskripsi = document.getElementById('inputDeskripsi').value;
    const fileInput = document.getElementById('inputFile');
    const imgPreview = document.getElementById('imgPreview').src;

    if (!judul || !deskripsi) {
        alert('Harap lengkapi judul dan deskripsi!');
        return;
    }

    let finalImage = "";

    if (id) {
        const oldData = await (await fetch('/api/gallery')).json();
        const oldItem = oldData.find(x => x.id == id);

        finalImage = (fileInput.files && fileInput.files[0])
            ? imgPreview
            : oldItem.gambar;
    } else {
        if (!fileInput.files || !fileInput.files[0]) {
            alert('Mohon upload foto!');
            return;
        }
        finalImage = imgPreview;
    }

    const method = id ? 'PUT' : 'POST';
    const payload = { judul, deskripsi, gambar: finalImage };
    if (id) payload.id = id;

    try {
        const res = await fetch('/api/gallery', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(
                document.getElementById('galleryModal')
            ).hide();
            loadTable();
        } else {
            alert('Gagal menyimpan data');
        }
    } catch {
        alert('Terjadi kesalahan koneksi');
    }
}

// --- 5. MODAL ---
async function openModal(isEdit = false, id = null) {
    document.getElementById('galleryForm').reset();
    document.getElementById('previewBox').style.display = 'none';

    if (isEdit) {
        const data = await (await fetch('/api/gallery')).json();
        const item = data.find(x => x.id === id);

        document.getElementById('modalTitle').innerText = 'Edit Gallery';
        document.getElementById('editId').value = item.id;
        document.getElementById('inputJudul').value = item.judul;
        document.getElementById('inputDeskripsi').value = item.deskripsi;
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
    if (!confirm('Yakin ingin menghapus foto ini?')) return;

    try {
        await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
        loadTable();
    } catch {
        alert('Gagal menghapus data');
    }
}
