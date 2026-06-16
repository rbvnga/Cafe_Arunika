/* ======================================================
   ARUNIKA CAFÉ & COWORKING SPACE — script.js
   Berisi:
   1. showPage()    → navigasi antar halaman
   2. filterMenu()  → filter tab di halaman Menu
   3. selectRoom()  → update ringkasan booking
   4. updateSummary() → sinkronisasi form booking ke summary
====================================================== */


/* ===== 1. NAVIGASI HALAMAN ===== */
/*
  Fungsi ini dipanggil ketika user klik link navbar
  atau tombol di dalam halaman.

  Cara kerja:
  - Sembunyikan SEMUA elemen dengan class "page"
  - Tampilkan hanya elemen dengan id "page-{name}"
  - Tandai link navbar yang aktif dengan class "active"
  - Footer disembunyikan di halaman login & signup
    (supaya tampilannya full-screen)
*/
function showPage(name) {
  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  // Tampilkan halaman yang dituju
  var target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
  }

  // Update highlight link navbar
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
  });
  var activeLink = document.querySelector('.nav-links a[data-page="' + name + '"]');
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Sembunyikan footer di halaman login & signup
  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.style.display = (name === 'login' || name === 'signup') ? 'none' : 'block';
  }

  // Scroll ke atas halaman
  window.scrollTo({ top: 0, behavior: 'instant' });
}


/* ===== 2. FILTER MENU ===== */
/*
  Fungsi ini dipanggil ketika user klik tab kategori
  di halaman Menu (Semua / Coffee / Non Coffee / dll).

  Cara kerja:
  - Tandai tab yang diklik sebagai "active"
  - Jika "semua" dipilih → tampilkan semua section
  - Jika kategori lain → sembunyikan yang lain,
    tampilkan hanya section dengan data-cat yang cocok
*/
function filterMenu(cat, clickedTab) {
  // Update style tab
  document.querySelectorAll('.cat-tab').forEach(function(tab) {
    tab.classList.remove('active');
  });
  clickedTab.classList.add('active');

  // Tampilkan / sembunyikan section menu
  document.querySelectorAll('.menu-section').forEach(function(section) {
    if (cat === 'semua') {
      section.style.display = 'block';
    } else if (section.dataset.cat === cat) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
}


/* ===== 3. PILIH RUANGAN DI BOOKING ===== */
/*
  Fungsi ini dipanggil ketika user klik salah satu
  kartu ruangan di halaman Booking.

  Cara kerja:
  - Simpan nama ruangan dan harga per jam
  - Panggil updateSummary() untuk refresh ringkasan
*/
var selectedRoom     = 'Small Room';
var selectedPricePerJam = 25000;

function selectRoom(roomName, pricePerJam) {
  selectedRoom        = roomName;
  selectedPricePerJam = pricePerJam;
  updateSummary();
}


/* ===== 4. UPDATE RINGKASAN BOOKING ===== */
/*
  Fungsi ini membaca nilai dari form (tanggal, waktu, durasi)
  lalu menghitung total dan memperbarui tampilan ringkasan
  di sebelah kanan halaman Booking.
*/
function updateSummary() {
  // Ambil nilai dari form
  var dateInput = document.getElementById('booking-date');
  var timeInput = document.getElementById('booking-time');
  var durInput  = document.getElementById('booking-dur');

  var dateVal  = dateInput  ? dateInput.value  : '2026-06-20';
  var timeVal  = timeInput  ? timeInput.value  : '10:00 - 12:00';
  var durVal   = durInput   ? parseInt(durInput.value) : 2;

  // Format tanggal → "20 Jun 2026"
  var dateFormatted = formatDate(dateVal);

  // Hitung total
  var total = selectedPricePerJam * durVal;
  var totalFormatted = 'Rp' + total.toLocaleString('id-ID');

  // Update elemen di ringkasan
  var elRoom  = document.getElementById('sum-room');
  var elDate  = document.getElementById('sum-date');
  var elTime  = document.getElementById('sum-time');
  var elTotal = document.getElementById('sum-total');

  if (elRoom)  elRoom.textContent  = selectedRoom;
  if (elDate)  elDate.textContent  = dateFormatted;
  if (elTime)  elTime.textContent  = timeVal + ' · ' + durVal + ' Jam';
  if (elTotal) elTotal.textContent = totalFormatted;
}


/* ===== HELPER: FORMAT TANGGAL ===== */
/*
  Mengubah string "2026-06-20" menjadi "20 Jun 2026"
*/
function formatDate(dateStr) {
  if (!dateStr) return '-';
  var parts = dateStr.split('-');
  var year  = parts[0];
  var month = parseInt(parts[1]) - 1;
  var day   = parseInt(parts[2]);
  var bulan = ['Jan','Feb','Mar','Apr','Mei','Jun',
               'Jul','Agu','Sep','Okt','Nov','Des'];
  return day + ' ' + bulan[month] + ' ' + year;
}


/* ===== 5. EVENT LISTENERS SAAT HALAMAN DIMUAT ===== */
/*
  Ketika halaman selesai dimuat (DOMContentLoaded),
  pasang event listener ke form booking supaya
  ringkasan auto-update saat user ganti tanggal/waktu/durasi.
*/
document.addEventListener('DOMContentLoaded', function() {

  // Pastikan halaman Home aktif saat pertama kali dibuka
  showPage('home');

  // Auto-update ringkasan ketika input booking berubah
  var inputs = ['booking-date', 'booking-time', 'booking-dur'];
  inputs.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateSummary);
    }
  });

  // Update summary pertama kali dengan nilai default
  updateSummary();

});