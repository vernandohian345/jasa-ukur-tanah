// --- KONFIGURASI DUMMY ---
const USER = 'admin';
const PASS = 'admin123';

// --- EVENT LISTENER UPLOAD PREVIEW ---
document.getElementById('inputFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(evt){
            document.getElementById('imgPreview').src = evt.target.result;
            document.getElementById('previewBox').style.display = 'block';
        };
        reader.readAsDataURL(file); // Konversi gambar ke Base64 String
    }
});

// --- LOGIN ---
function handleLogin(e) {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;

            if(u === USER && p === PASS) {
                // 1. Simpan status login di LocalStorage (Sebagai pengganti Session)
                localStorage.setItem('admin_session', 'true');

                // 2. Redirect ke Dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Username/Password Salah!');
            }
        }

function logout() {
    window.location.reload();
}

// --- 1. CEK KEAMANAN (SAAT HALAMAN DIBUKA) ---
        document.addEventListener('DOMContentLoaded', () => {
            const isLogin = localStorage.getItem('admin_session');
            
            // Jika tidak ada status login, tendang user kembali ke login
            if (isLogin !== 'true') {
                window.location.href = 'login.html';
                return; 
            }

            // Jika aman, muat data tabel
            loadTable();
        });

        function logout() {
            // Hapus status login
            localStorage.removeItem('admin_session');
            // Redirect ke halaman login
            window.location.href = 'login.html';
        }

        // --- 2. LOGIC PREVIEW GAMBAR ---
        document.getElementById('inputFile').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(file){
                const reader = new FileReader();
                reader.onload = function(evt){
                    document.getElementById('imgPreview').src = evt.target.result;
                    document.getElementById('previewBox').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // --- 3. RENDER TABEL DARI LOCALSTORAGE ---
        function loadTable() {
            const savedData = localStorage.getItem('geoGalleryData');
            const tbody = document.getElementById('gallery-table-body');
            tbody.innerHTML = '';

            if(!savedData) return;

            const data = JSON.parse(savedData);
            
            data.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="ps-4"><img src="${item.image}" class="admin-thumb"></td>
                    <td class="fw-bold">${item.title}</td>
                    <td class="text-muted text-truncate" style="max-width: 200px;">${item.desc}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-warning me-1" onclick="editData(${index})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteData(${index})"><i class="bi bi-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // --- 4. MODAL FORM ---
        const modalEl = document.getElementById('galleryModal');
        const modalInstance = new bootstrap.Modal(modalEl);

        function openModal(isEdit = false, index = null) {
            document.getElementById('galleryForm').reset();
            document.getElementById('previewBox').style.display = 'none';
            
            if (isEdit) {
                const data = JSON.parse(localStorage.getItem('geoGalleryData'));
                const item = data[index];
                
                document.getElementById('modalTitle').innerText = 'Edit Gallery';
                document.getElementById('editId').value = index;
                document.getElementById('inputJudul').value = item.title;
                document.getElementById('inputDeskripsi').value = item.desc;
                
                document.getElementById('imgPreview').src = item.image;
                document.getElementById('previewBox').style.display = 'block';
            } else {
                document.getElementById('modalTitle').innerText = 'Tambah Gallery';
                document.getElementById('editId').value = '';
            }
            modalInstance.show();
        }

        // --- 5. SIMPAN DATA ---
        function saveData() {
            const index = document.getElementById('editId').value;
            const title = document.getElementById('inputJudul').value;
            const desc = document.getElementById('inputDeskripsi').value;
            const imgPreview = document.getElementById('imgPreview').src;

            if(!title || !desc || imgPreview === window.location.href) {
                alert('Harap lengkapi judul, deskripsi, dan foto!');
                return;
            }

            let data = JSON.parse(localStorage.getItem('geoGalleryData')) || [];

            if (index !== '') {
                data[index] = { title, desc, image: imgPreview };
            } else {
                data.push({ title, desc, image: imgPreview });
            }

            localStorage.setItem('geoGalleryData', JSON.stringify(data));
            modalInstance.hide();
            loadTable();
        }

        function editData(index) {
            openModal(true, index);
        }

        function deleteData(index) {
            if(confirm('Yakin ingin menghapus foto ini?')) {
                let data = JSON.parse(localStorage.getItem('geoGalleryData'));
                data.splice(index, 1);
                localStorage.setItem('geoGalleryData', JSON.stringify(data));
                loadTable();
            }
        }