const captionForm = document.getElementById('captionForm');
const selectTemplate = document.getElementById('selectTemplate');
const previewTemplateText = document.getElementById('previewTemplateText');

const inputNama = document.getElementById('inputNama');
const inputHarga = document.getElementById('inputHarga');
const inputKategori = document.getElementById('inputKategori');
const inputCatatan = document.getElementById('inputCatatan');

const errorNama = document.getElementById('errorNama');
const errorHarga = document.getElementById('errorHarga');

const outputCaption = document.getElementById('outputCaption');
const btnReset = document.getElementById('btnReset');
const btnCopy = document.getElementById('btnCopy');
const copyStatus = document.getElementById('copyStatus');

function updateTemplatePreview() {
  const templateKey = selectTemplate.value;
  previewTemplateText.textContent = templateKoleksi[templateKey];
}

selectTemplate.addEventListener('change', updateTemplatePreview);
function bacaParameterURL() {
  const params = new URLSearchParams(window.location.search);
  const nama = params.get('nama');
  const harga = params.get('harga');
  const kategori = params.get('kategori');

  if (nama) inputNama.value = nama;
  if (harga) inputHarga.value = harga;
  if (kategori) inputKategori.value = kategori;

  if (nama && harga) {
    generateCaption();
  }
}


function generateCaption() {
  const nama = inputNama.value.trim();
  const harga = inputHarga.value.trim();
  const kategori = inputKategori.value.trim() || 'Umum';
  const catatan = inputCatatan.value.trim();
  const templateKey = selectTemplate.value;

  let isValid = true;

  if (nama === '') {
    errorNama.textContent = 'Nama barang tidak boleh kosong!';
    inputNama.style.borderColor = '#cc0000'; 
    isValid = false;
  } else {
    errorNama.textContent = '';
    inputNama.style.borderColor = '#cccccc';
  }

  if (harga === '' || parseFloat(harga) <= 0 || isNaN(harga)) {
    errorHarga.textContent = 'Harga harus berupa angka dan lebih dari 0!';
    inputHarga.style.borderColor = '#cc0000'; 
    isValid = false;
  } else {
    errorHarga.textContent = '';
    inputHarga.style.borderColor = '#cccccc';
  }

  if (!isValid) return;

  let templateTeks = templateKoleksi[templateKey];

  const formatCatatan = catatan ? `(${catatan})` : '';

  const hasilCaption = templateTeks
    .replaceAll('{nama_barang}', nama)
    .replaceAll('{harga}', harga)
    .replaceAll('{kategori}', kategori)
    .replaceAll('{catatan}', formatCatatan);

  outputCaption.textContent = hasilCaption;

  outputCaption.style.color = '#111111';
  outputCaption.style.fontWeight = 'bold';
  outputCaption.style.lineHeight = '1.6';

  copyStatus.textContent = '';
}

captionForm.addEventListener('submit', function(event) {
  event.preventDefault();
  generateCaption();
});

inputNama.addEventListener('input', function() {
  if (inputNama.value.trim() !== '') {
    errorNama.textContent = '';
    inputNama.style.borderColor = '#cccccc';
  }
});

inputHarga.addEventListener('input', function() {
  if (inputHarga.value.trim() !== '' && parseFloat(inputHarga.value) > 0) {
    errorHarga.textContent = '';
    inputHarga.style.borderColor = '#cccccc';
  }
});

btnReset.addEventListener('click', function() {
  captionForm.reset();

  errorNama.textContent = '';
  errorHarga.textContent = '';
  inputNama.style.borderColor = '#cccccc';
  inputHarga.style.borderColor = '#cccccc';

  outputCaption.innerHTML = '<em>Silakan isi form di atas dan klik tombol "Buat Caption".</em>';
  outputCaption.style.color = '#333333';
  outputCaption.style.fontWeight = 'normal';
  copyStatus.textContent = '';

  updateTemplatePreview();
});

btnCopy.addEventListener('click', function() {
  const teks = outputCaption.textContent;

  if (teks.includes('Silakan isi form')) {
    alert('Belum ada caption yang dibuat! Silakan isi form terlebih dahulu.');
    return;
  }

  navigator.clipboard.writeText(teks).then(() => {
    copyStatus.textContent = '✓ Caption berhasil disalin!';
    setTimeout(() => {
      copyStatus.textContent = '';
    }, 2500);
  });
});

updateTemplatePreview();
bacaParameterURL();
