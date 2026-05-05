// API URL base
const API_BASE = 'http://localhost:8000/api.php';
const UPLOAD_BASE = 'http://localhost:8000/uploads';

async function requestApi(url, options = {}) {
  if (options.body instanceof FormData) {
    if (options.headers) {
      delete options.headers['Content-Type'];
      delete options.headers['content-type'];
    }
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Gagal menghubungi API');
    }
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    return { error: error.message || 'Terjadi kesalahan jaringan' };
  }
}

async function fetchAllProduk() {
  return await requestApi(`${API_BASE}?action=fetchProduk`);
}

async function fetchAllKategori() {
  return await requestApi(`${API_BASE}?action=fetchKategori`);
}

async function fetchProdukById(id) {
  return await requestApi(`${API_BASE}?action=fetchProdukById&id=${encodeURIComponent(id)}`);
}

async function populateKategoriDropdown() {
  const kategori = await fetchAllKategori();
  const select = document.getElementById('kategori-produk');
  if (!select) return;

  if (kategori.error) {
    select.innerHTML = '<option value="" disabled selected>Gagal memuat kategori</option>';
    return;
  }

  select.innerHTML = '<option value="" disabled selected>Pilih kategori</option>' +
    kategori.map(k => `<option value="${k.id_kategori}">${k.jenis_kategori}</option>`).join('');
}

async function addProduk(produkData) {
  return await requestApi(`${API_BASE}?action=addProduk`, {
    method: 'POST',
    body: produkData,
  });
}

async function updateProduk(id, produkData) {
  return await requestApi(`${API_BASE}?action=updateProduk&id=${encodeURIComponent(id)}`, {
    method: 'POST',
    body: produkData,
  });
}

async function deleteProduk(id) {
  return await requestApi(`${API_BASE}?action=deleteProduk&id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

function updateImagePreview(fileOrUrl) {
  const preview = document.getElementById('image-preview');
  if (!preview) return;

  if (!fileOrUrl) {
    preview.innerHTML = '<div class="image-placeholder"><div class="placeholder-icon">🖼️</div><div class="placeholder-text">Belum ada gambar</div></div>';
    return;
  }

  if (typeof fileOrUrl === 'string') {
    preview.innerHTML = `<img src="${fileOrUrl}" alt="Preview Gambar" class="preview-img">`;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    preview.innerHTML = `<img src="${reader.result}" alt="Preview Gambar" class="preview-img">`;
  };
  reader.readAsDataURL(fileOrUrl);
}

async function displayProduk() {
  const produk = await fetchAllProduk();
  const container = document.getElementById('produk-container');
  if (!container) return;

  if (produk.error) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-danger">${produk.error}</div></div>`;
    return;
  }

  if (!produk.length) {
    container.innerHTML = '<div class="col-12"><p class="text-center text-muted">Belum ada produk.</p></div>';
    return;
  }

  container.innerHTML = produk.map(item => {
    const kategori = item.jenis_kategori ? item.jenis_kategori : 'Tanpa kategori';
    const imageUrl = item.gambar ? `${UPLOAD_BASE}/${item.gambar}` : 'images/logo.png';
    return `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="product-card h-100">
          <div class="img-wrapper">
            <img src="${imageUrl}" alt="${item.nama_produk}" loading="lazy">
          </div>
          <div class="card-body">
            <span class="product-kategori">${kategori}</span>
            <h5 class="product-title">${item.nama_produk}</h5>
            <div class="product-stock"><i class="bi bi-box-seam me-1"></i>Stok: ${item.stok}</div>
            <div class="product-price">${formatRupiah(item.harga)}</div>
            <div class="product-actions">
              <a href="update.html?id=${item.id_produk}" class="btn-update">
                <i class="bi bi-pencil me-1"></i>Edit
              </a>
              <button class="btn-hapus" onclick="handleDeleteProduk('${item.id_produk}')">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function handleDeleteProduk(id) {
  if (!confirm('Yakin ingin menghapus produk ini?')) {
    return;
  }
  const result = await deleteProduk(id);
  if (result.success) {
    alert('Produk berhasil dihapus');
    displayProduk();
  } else {
    alert('Gagal hapus produk: ' + result.error);
  }
}

async function handleAddProduk(event) {
  event.preventDefault();
  const nama = document.getElementById('nama-produk').value.trim();

  // Strip titik pemisah ribuan sebelum parse
  const hargaRaw = document.getElementById('harga-produk').value.replace(/\./g, '');
  const harga = parseFloat(hargaRaw);

  const stok = parseInt(document.getElementById('stok-produk').value, 10);
  const kategori_id = document.getElementById('kategori-produk').value;

  // Coba baca dari input-file (add.html baru) atau gambar-produk (fallback)
  const gambarInput = document.getElementById('input-file') || document.getElementById('gambar-produk');

  if (!nama || isNaN(harga) || isNaN(stok) || !kategori_id) {
    alert('Nama, harga, stok, dan kategori harus diisi dengan benar.');
    return;
  }

  const formData = new FormData();
  formData.append('nama_produk', nama);
  formData.append('harga', harga);
  formData.append('stok', stok);
  formData.append('kategori_id', kategori_id);

  // Cek apakah ada file yang dipilih
  if (gambarInput && gambarInput.files && gambarInput.files.length > 0) {
    formData.append('gambar', gambarInput.files[0]);
  }

  // Cek apakah ada foto dari kamera (canvas blob)
  const cameraCanvas = document.getElementById('camera-canvas');
  if (cameraCanvas && cameraCanvas.width > 0 && !(gambarInput && gambarInput.files && gambarInput.files.length > 0)) {
    await new Promise(resolve => {
      cameraCanvas.toBlob(blob => {
        if (blob) formData.append('gambar', blob, 'foto-kamera.jpg');
        resolve();
      }, 'image/jpeg', 0.85);
    });
  }

  const result = await addProduk(formData);

  if (result.success) {
    alert('Produk berhasil ditambahkan');
    window.location.href = 'index.html';
  } else {
    alert('Gagal tambah produk: ' + result.error);
  }
}

async function loadProdukForEdit() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const produk = await fetchProdukById(id);
  if (!produk || produk.error) {
    alert(produk?.error || 'Produk tidak ditemukan');
    return;
  }

  document.getElementById('nama-produk').value = produk.nama_produk || '';
  document.getElementById('stok-produk').value = produk.stok || '';

  // Format harga dengan titik setiap 3 digit
  const hargaEl = document.getElementById('harga-produk');
  if (hargaEl && produk.harga) {
    const raw = String(Math.round(produk.harga));
    hargaEl.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Set kategori
  if (produk.kategori_id) {
    const select = document.getElementById('kategori-produk');
    if (select) select.value = produk.kategori_id;
  }

  // Tampilkan gambar existing
  if (produk.gambar) {
    const imgPreview = document.getElementById('img-preview');
    const imgPlaceholder = document.getElementById('img-placeholder');
    const btnRemove = document.getElementById('btn-remove-img');
    if (imgPreview) {
      imgPreview.src = `${UPLOAD_BASE}/${produk.gambar}`;
      imgPreview.style.display = 'block';
      if (imgPlaceholder) imgPlaceholder.style.display = 'none';
      if (btnRemove) btnRemove.style.display = 'flex';
    }
  }
}

async function handleUpdateProduk(event) {
  event.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert('ID produk tidak ditemukan');
    return;
  }

  const nama = document.getElementById('nama-produk').value.trim();

  // Strip titik pemisah ribuan sebelum parse
  const hargaRaw = document.getElementById('harga-produk').value.replace(/\./g, '');
  const harga = parseFloat(hargaRaw);

  const stok = parseInt(document.getElementById('stok-produk').value, 10);
  const kategori_id = document.getElementById('kategori-produk').value;

  // Coba baca dari input-file (update.html baru) atau gambar-produk (fallback)
  const gambarInput = document.getElementById('input-file') || document.getElementById('gambar-produk');

  if (!nama || isNaN(harga) || isNaN(stok) || !kategori_id) {
    alert('Nama, harga, stok, dan kategori harus diisi dengan benar.');
    return;
  }

  const formData = new FormData();
  formData.append('nama_produk', nama);
  formData.append('harga', harga);
  formData.append('stok', stok);
  formData.append('kategori_id', kategori_id);

  if (gambarInput && gambarInput.files && gambarInput.files.length > 0) {
    formData.append('gambar', gambarInput.files[0]);
  }

  // Cek foto dari kamera
  const cameraCanvas = document.getElementById('camera-canvas');
  if (cameraCanvas && cameraCanvas.width > 0 && !(gambarInput && gambarInput.files && gambarInput.files.length > 0)) {
    await new Promise(resolve => {
      cameraCanvas.toBlob(blob => {
        if (blob) formData.append('gambar', blob, 'foto-kamera.jpg');
        resolve();
      }, 'image/jpeg', 0.85);
    });
  }

  const result = await updateProduk(id, formData);

  if (result.success) {
    alert('Produk berhasil diupdate');
    window.location.href = 'index.html';
  } else {
    alert('Gagal update produk: ' + result.error);
  }
}
