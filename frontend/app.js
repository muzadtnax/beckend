const mysql = require('mysql2/promise')

// Konfigurasi koneksi MySQL
const dbConfig = {
  host: '127.0.0.1',
  user: 'root', // Ganti jika user berbeda
  password: '', // Ganti jika ada password
  database: 'e_katalog'
}

// Fungsi untuk membuat koneksi
async function createConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (err) {
    console.error('Error creating connection:', err)
    throw err
  }
}

// Fungsi untuk fetch semua kategori
async function fetchKategori() {
  let connection
  try {
    connection = await createConnection()
    const [rows] = await connection.execute('SELECT * FROM tb_kategori')
    return rows
  } catch (err) {
    console.error('Error fetching kategori:', err)
    return null
  } finally {
    if (connection) await connection.end()
  }
}

// Fungsi untuk fetch semua produk
async function fetchProduk() {
  let connection
  try {
    connection = await createConnection()
    const [rows] = await connection.execute('SELECT * FROM tb_produk')
    return rows
  } catch (err) {
    console.error('Error fetching produk:', err)
    return null
  } finally {
    if (connection) await connection.end()
  }
}

// Fungsi untuk fetch produk dengan kategori (join)
async function fetchProdukDenganKategori() {
  let connection
  try {
    connection = await createConnection()
    const [rows] = await connection.execute(`
      SELECT p.id_produk, p.nama_produk, p.harga, p.stok, k.jenis_kategori
      FROM tb_produk p
      JOIN tb_produk_kategori pk ON p.id_produk = pk.id_produk
      JOIN tb_kategori k ON pk.id_kategori = k.id_kategori
    `)
    return rows
  } catch (err) {
    console.error('Error fetching produk dengan kategori:', err)
    return null
  } finally {
    if (connection) await connection.end()
  }
}

// Fungsi untuk fetch relasi produk-kategori
async function fetchProdukKategori() {
  let connection
  try {
    connection = await createConnection()
    const [rows] = await connection.execute(`
      SELECT pk.id_produk_kategori, p.nama_produk, p.harga, p.stok, k.jenis_kategori
      FROM tb_produk_kategori pk
      JOIN tb_produk p ON pk.id_produk = p.id_produk
      JOIN tb_kategori k ON pk.id_kategori = k.id_kategori
    `)
    return rows
  } catch (err) {
    console.error('Error fetching produk kategori:', err)
    return null
  } finally {
    if (connection) await connection.end()
  }
}

// Contoh penggunaan
async function main() {
  console.log('Fetching kategori...')
  const kategori = await fetchKategori()
  console.log('Kategori:', kategori)

  console.log('Fetching produk...')
  const produk = await fetchProduk()
  console.log('Produk:', produk)

  console.log('Fetching produk dengan kategori...')
  const produkKategori = await fetchProdukDenganKategori()
  console.log('Produk dengan kategori:', produkKategori)

  console.log('Fetching relasi produk-kategori...')
  const relasi = await fetchProdukKategori()
  console.log('Relasi:', relasi)
}

main().catch(console.error)