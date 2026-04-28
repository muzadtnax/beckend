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
    const imageUrl = item.gambar ? `${UPLOAD_BASE}/${item.gambar}` : 'images/download.png';
    return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${imageUrl}" alt="${item.nama_produk}" class="card-img-top" style="height: 180px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.nama_produk}</h5>
            <p class="card-text text-muted mb-1">Kategori: ${kategori}</p>
            <p class="card-text mb-1">Stok: ${item.stok}</p>
            <p class="card-text mb-3 fw-bold">${formatRupiah(item.harga)}</p>
            <p class="card-text text-truncate mb-3">${item.deskripsi || '-'}</p>
            <div class="mt-auto d-grid gap-2">
              <a href="update.html?id=${item.id_produk}" class="btn btn-sm btn-primary">Edit</a>
              <button class="btn btn-sm btn-danger" onclick="handleDeleteProduk('${item.id_produk}')">Hapus</button>
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
  const harga = parseFloat(document.getElementById('harga-produk').value);
  const stok = parseInt(document.getElementById('stok-produk').value, 10);
  const deskripsi = document.getElementById('deskripsi-produk').value.trim();
  const kategori_id = document.getElementById('kategori-produk').value;
  const gambarInput = document.getElementById('gambar-produk');

  if (!nama || isNaN(harga) || isNaN(stok) || !kategori_id) {
    alert('Nama, harga, stok, dan kategori harus diisi dengan benar.');
    return;
  }

  const formData = new FormData();
  formData.append('nama_produk', nama);
  formData.append('harga', harga);
  formData.append('stok', stok);
  formData.append('deskripsi', deskripsi);
  formData.append('kategori_id', kategori_id);
  if (gambarInput && gambarInput.files.length > 0) {
    formData.append('gambar', gambarInput.files[0]);
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
  document.getElementById('harga-produk').value = produk.harga || '';
  document.getElementById('stok-produk').value = produk.stok || '';
  document.getElementById('deskripsi-produk').value = produk.deskripsi || '';
  if (produk.kategori_id) {
    document.getElementById('kategori-produk').value = produk.kategori_id;
  }
  if (produk.gambar) {
    updateImagePreview(`${UPLOAD_BASE}/${produk.gambar}`);
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
  const harga = parseFloat(document.getElementById('harga-produk').value);
  const stok = parseInt(document.getElementById('stok-produk').value, 10);
  const deskripsi = document.getElementById('deskripsi-produk').value.trim();
  const kategori_id = document.getElementById('kategori-produk').value;
  const gambarInput = document.getElementById('gambar-produk');

  if (!nama || isNaN(harga) || isNaN(stok) || !kategori_id) {
    alert('Nama, harga, stok, dan kategori harus diisi dengan benar.');
    return;
  }

  const formData = new FormData();
  formData.append('nama_produk', nama);
  formData.append('harga', harga);
  formData.append('stok', stok);
  formData.append('deskripsi', deskripsi);
  formData.append('kategori_id', kategori_id);
  if (gambarInput && gambarInput.files.length > 0) {
    formData.append('gambar', gambarInput.files[0]);
  }

  const result = await updateProduk(id, formData);

  if (result.success) {
    alert('Produk berhasil diupdate');
    window.location.href = 'index.html';
  } else {
    alert('Gagal update produk: ' + result.error);
  }
}
