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

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function showDetailModal(id) {
  const produk = await fetchProdukById(id);
  
  if (produk.error) {
    alert('Gagal memuat detail produk');
    return;
  }

  // Ambil data produk (bisa berupa object atau array)
  const product = Array.isArray(produk) ? produk[0] : produk;
  if (!product) {
    alert('Produk tidak ditemukan');
    return;
  }

  console.log('showDetailModal - Product ID:', product.id_produk);

  // Isi modal dengan data
  document.getElementById('modalTitle').textContent = product.nama_produk;
  document.getElementById('detailNama').textContent = product.nama_produk;
  document.getElementById('detailKategori').textContent = product.jenis_kategori || 'Tanpa kategori';
  document.getElementById('detailHarga').textContent = formatRupiah(product.harga);
  document.getElementById('detailStok').textContent = product.stok + ' unit';
  document.getElementById('detailDeskripsi').textContent = product.deskripsi || 'Tidak ada deskripsi';
  document.getElementById('detailCreated').textContent = formatDate(product.created_at);
  document.getElementById('detailUpdated').textContent = formatDate(product.updated_at);
  
  // Set gambar
  const imageUrl = product.gambar ? `${UPLOAD_BASE}/${product.gambar}` : 'images/logo.png';
  document.getElementById('detailImage').src = imageUrl;
  
  // Set href tombol edit dengan URL yang benar
  const editBtn = document.getElementById('editBtn');
  if (editBtn) {
    editBtn.href = `update.html?id=${product.id_produk}`;
    editBtn.dataset.productId = product.id_produk;
    sessionStorage.setItem('editProductId', product.id_produk);
    console.log('Edit button href set to:', editBtn.href);
    console.log('SessionStorage editProductId set to:', sessionStorage.getItem('editProductId'));
  }
  
  // Tampilkan modal
  const modal = new bootstrap.Modal(document.getElementById('detailModal'));
  modal.show();
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
              <button class="btn-update" onclick="showDetailModal('${item.id_produk}')">
                <i class="bi bi-eye me-1"></i>Detail
              </button>
              <button class="btn-hapus" onclick="handleDeleteProduk('${item.id_produk}')" title="Hapus Produk">
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
  const deskripsi = document.getElementById('deskripsi-produk').value.trim();

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
  if (deskripsi) {
    formData.append('deskripsi', deskripsi);
  }

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
  let id = params.get('id');
  console.log('loadProdukForEdit - ID dari URL:', id);

  if (!id) {
    id = sessionStorage.getItem('editProductId');
    console.log('loadProdukForEdit - ID dari sessionStorage:', id);
    if (id) {
      sessionStorage.removeItem('editProductId');
    }
  }

  if (!id) {
    alert('ID Produk tidak ditemukan di URL! Kembali ke halaman utama.');
    window.location.href = 'index.html';
    return;
  }

  const produk = await fetchProdukById(id);
  console.log('API Response:', produk);
  
  if (!produk || produk.error) {
    alert(produk?.error || 'Produk tidak ditemukan');
    return;
  }

  // Handle jika API mengembalikan array
  const product = Array.isArray(produk) ? produk[0] : produk;
  
  if (!product) {
    alert('Data produk kosong');
    console.error('Product data is empty', produk);
    return;
  }

  console.log('Product data:', product);

  document.getElementById('nama-produk').value = product.nama_produk || '';
  document.getElementById('stok-produk').value = product.stok || '';
  document.getElementById('deskripsi-produk').value = product.deskripsi || '';

  // Format harga dengan titik setiap 3 digit
  const hargaEl = document.getElementById('harga-produk');
  if (hargaEl && product.harga) {
    const raw = String(Math.round(product.harga));
    hargaEl.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Set kategori - tunggu category dropdown siap
  if (product.kategori_id) {
    const select = document.getElementById('kategori-produk');
    if (select) {
      select.value = product.kategori_id;
      console.log('Kategori set ke:', product.kategori_id);
    } else {
      console.warn('Kategori select element tidak ditemukan');
    }
  }

  // Tampilkan gambar existing
  if (product.gambar) {
    const imgPreview = document.getElementById('img-preview');
    const imgPlaceholder = document.getElementById('img-placeholder');
    const btnRemove = document.getElementById('btn-remove-img');
    if (imgPreview) {
      imgPreview.src = `${UPLOAD_BASE}/${product.gambar}`;
      imgPreview.style.display = 'block';
      if (imgPlaceholder) imgPlaceholder.style.display = 'none';
      if (btnRemove) btnRemove.style.display = 'flex';
      console.log('Gambar dimuat:', product.gambar);
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
  const deskripsi = document.getElementById('deskripsi-produk').value.trim();

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
  if (deskripsi) {
    formData.append('deskripsi', deskripsi);
  }

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
