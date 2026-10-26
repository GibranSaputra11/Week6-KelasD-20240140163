const API_URL = 'https://dummyjson.com/products';

let productsData = [];

const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const productGrid = document.getElementById('productGrid');
const statusInfo = document.getElementById('statusInfo');


function getProductsFromAPI() {
  statusInfo.textContent = 'Sedang memuat data dari API...';

  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      return response.json(); 
    })
    .then(data => {
      productsData = data.products;

      statusInfo.textContent = `Berhasil memuat ${productsData.length} produk dari API.`;

      isiDropdownKategori(productsData);

      tampilkanProduk(productsData);
    })
    .catch(error => {
      console.error('Error Fetch API:', error);
      statusInfo.textContent = 'Gagal memuat produk dari API. Pastikan terhubung ke internet.';
      statusInfo.style.color = '#cc0000';
    });
}
function tampilkanProduk(listProduk) {
  productGrid.innerHTML = '';

  if (listProduk.length === 0) {
    productGrid.innerHTML = '<p style="color:#666;">Produk tidak ditemukan.</p>';
    return;
  }

  listProduk.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-item';

    const paramNama = encodeURIComponent(item.title);
    const paramHarga = encodeURIComponent(item.price);
    const paramKategori = encodeURIComponent(item.category);

    card.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <div class="product-title">${item.title}</div>
      <div class="product-category">${item.category}</div>
      <div class="product-price">$${item.price}</div>
      <a href="caption.html?nama=${paramNama}&harga=${paramHarga}&kategori=${paramKategori}" class="btn-caption-link">
        Buat Caption
      </a>
    `;

    productGrid.appendChild(card);
  });
}


function isiDropdownKategori(listProduk) {
  const kategoriUnik = [];
  listProduk.forEach(item => {
    if (!kategoriUnik.includes(item.category)) {
      kategoriUnik.push(item.category);
    }
  });

  kategoriUnik.forEach(kategori => {
    const option = document.createElement('option');
    option.value = kategori;
    option.textContent = kategori.charAt(0).toUpperCase() + kategori.slice(1);
    categorySelect.appendChild(option);
  });
}

function filterProduk() {
  const kataKunci = searchInput.value.toLowerCase().trim();
  const kategoriDipilih = categorySelect.value;

  const hasilFilter = productsData.filter(item => {
    const cocokNama = item.title.toLowerCase().includes(kataKunci);

    const cocokKategori = kategoriDipilih === 'all' || item.category === kategoriDipilih;

    return cocokNama && cocokKategori;
  });

  tampilkanProduk(hasilFilter);
}

searchInput.addEventListener('input', filterProduk);

categorySelect.addEventListener('change', filterProduk);

getProductsFromAPI();
