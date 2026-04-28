// API URL base
const API_BASE = '../backend/api.php';

// Fetch all produk
async function fetchAllProduk() {
  try {
    const response = await fetch(`${API_BASE}?action=fetchProduk`);
    if (!response.ok) throw new Error('Gagal fetch produk');
    return await response.json();
  } catch (error) {
    console.error('Error fetchAllProduk:', error);
    return [];
  }
}

// Fetch all kategori
async function fetchAllKategori() {
  try {
    const response = await fetch(`${API_BASE}?action=fetchKategori`);
    if (!response.ok) throw new Error('Gagal fetch kategori');
    return await response.json();
  } catch (error) {
    console.error('Error fetchAllKategori:', error);
    return [];
  }
}

// Add produk
async function addProduk(produkData) {
  try {
    const response = await fetch(`${API_BASE}?action=addProduk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(produkData)
    });
    
    if (!response.ok) throw new Error('Gagal tambah produk');
    return await response.json();
  } catch (error) {
    console.error('Error addProduk:', error);
    return { error: error.message };
  }
}

// Update produk
async function updateProduk(id, produkData) {
  try {
    const response = await fetch(`${API_BASE}?action=updateProduk&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(produkData)
    });
    
    if (!response.ok) throw new Error('Gagal update produk');
    return await response.json();
  } catch (error) {
    console.error('Error updateProduk:', error);
    return { error: error.message };
  }
}

// Delete produk
async function deleteProduk(id) {
  try {
    const response = await fetch(`${API_BASE}?action=deleteProduk&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Gagal delete produk');
    return await response.json();
  } catch (error) {
    console.error('Error deleteProduk:', error);
    return { error: error.message };
  }
}

// Format harga ke Rp
function formatRupiah(harga) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(harga);
}

// Display produk di halaman index
async function displayProduk() {
  const produk = await fetchAllProduk();
  const container = document.getElementById('produk-container');
  
  if (!container) return;
  
  if (produk.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">Tidak ada produk</p>';
    return;
  }
  
  container.innerHTML = produk.map(p => `
    <div class="col-6 col-md-4 col-lg-2">
      <div class="card product-card h-100">
        <div class="img-wrapper"><img src="images/preview.jpg" alt="${p.nama_produk}"></div>
        <div class="card-body p-2">
          <h5 class="product-title">${p.nama_produk}</h5>
          <div class="product-stock">Stok: ${p.stok}</div>
          <div class="product-price">${formatRupiah(p.harga)}</div>
          <div class="d-flex gap-2 mt-2">
            <a href="update.html?id=${p.id_produk}" class="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill">Edit</a>
            <button onclick="deleteProdukConfirm(${p.id_produk})" class="btn btn-outline-danger btn-sm rounded-pill">Hapus</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Delete dengan konfirmasi
function deleteProdukConfirm(id) {
  if (confirm('Yakin hapus produk ini?')) {
    deleteProduk(id).then(result => {
      if (result.success) {
        alert('Produk berhasil dihapus');
        displayProduk();
      } else {
        alert('Gagal hapus produk: ' + result.error);
      }
    });
  }
}

// Populate kategori dropdown
async function populateKategoriDropdown() {
  const kategori = await fetchAllKategori();
  const select = document.getElementById('kategori-select');
  
  if (!select) return;
  
  select.innerHTML = '<option selected disabled>Pilih Kategori</option>' + 
    kategori.map(k => `<option value="${k.id_kategori}">${k.jenis_kategori}</option>`).join('');
}

// Handle form submit di add.html
async function handleAddProduk(event) {
  event.preventDefault();
  
  const nama = document.getElementById('nama-produk').value;
  const harga = parseFloat(document.getElementById('harga-produk').value);
  const stok = parseInt(document.getElementById('stok-produk').value);
  const deskripsi = document.getElementById('deskripsi-produk').value;
  
  if (!nama || !harga || !stok) {
    alert('Nama, harga, dan stok harus diisi!');
    return;
  }
  
  const result = await addProduk({
    nama_produk: nama,
    harga: harga,
    stok: stok,
    deskripsi: deskripsi
  });
  
  if (result.success) {
    alert('Produk berhasil ditambahkan!');
    window.location.href = 'index.html';
  } else {
    alert('Gagal tambah produk: ' + result.error);
  }
}

// Untuk halaman update
async function loadProdukForEdit() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (!id) return;
  
  const produk = await fetchAllProduk();
  const item = produk.find(p => p.id_produk == id);
  
  if (!item) return;
  
  document.getElementById('nama-produk').value = item.nama_produk;
  document.getElementById('harga-produk').value = item.harga;
  document.getElementById('stok-produk').value = item.stok;
  document.getElementById('deskripsi-produk').value = item.deskripsi || '';
}

// Handle form submit di update.html
async function handleUpdateProduk(event) {
  event.preventDefault();
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (!id) {
    alert('ID produk tidak ditemukan');
    return;
  }
  
  const nama = document.getElementById('nama-produk').value;
  const harga = parseFloat(document.getElementById('harga-produk').value);
  const stok = parseInt(document.getElementById('stok-produk').value);
  const deskripsi = document.getElementById('deskripsi-produk').value;
  
  if (!nama || !harga || !stok) {
    alert('Nama, harga, dan stok harus diisi!');
    return;
  }
  
  const result = await updateProduk(id, {
    nama_produk: nama,
    harga: harga,
    stok: stok,
    deskripsi: deskripsi
  });
  
  if (result.success) {
    alert('Produk berhasil diupdate!');
    window.location.href = 'index.html';
  } else {
    alert('Gagal update produk: ' + result.error);
  }
}
