const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function toast(msg) {
  let old = $('.toast');
  if (old) old.remove();

  let t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

/* -------------------------------------------------------
   DEMO DATA STORE
   Saat backend tersedia, ganti bagian ini dengan fetch()
------------------------------------------------------- */

const demoItems = [
  {
    id: 'TP-1042',
    name: 'Dompet Hitam',
    type: 'Barang hilang',
    place: 'Perpustakaan · Lantai 2',
    date: '13 Okt 2026',
    status: 'Menunggu',
    owner: 'Raka Pratama',
    desc: 'Dompet kulit pria warna hitam, berisi KTM dan uang tunai sekitar Rp150.000.'
  },
  {
    id: 'TP-1041',
    name: 'AC Rusak Lab 3',
    type: 'Kerusakan fasilitas',
    place: 'Gedung B · Lab 3',
    date: '13 Okt 2026',
    status: 'Prioritas',
    owner: 'Dina Putri',
    desc: 'AC tidak dingin sejak pagi. Ruangan sangat panas dan mengganggu aktivitas praktikum.'
  },
  {
    id: 'TP-1038',
    name: 'Kunci Motor',
    type: 'Barang temuan',
    place: 'Parkiran Timur',
    date: '12 Okt 2026',
    status: 'Terverifikasi',
    owner: 'Fajar Ramadhan',
    desc: 'Kunci motor dengan gantungan kunci merah berbentuk helm. Ditemukan di dekat pos parkir timur.'
  },
  {
    id: 'TP-1036',
    name: 'Botol Minum',
    type: 'Barang temuan',
    place: 'Kantin Utama',
    date: '12 Okt 2026',
    status: 'Selesai',
    owner: 'Nadia Putri',
    desc: 'Botol minum warna abu-abu merek Hydro Flask, sudah diserahkan ke posko satpam.'
  },
  {
    id: 'TP-1033',
    name: 'Laptop Silver',
    type: 'Barang hilang',
    place: 'Ruang Kelas A-203',
    date: '11 Okt 2026',
    status: 'Menunggu',
    owner: 'Rizky Maulana',
    desc: 'Laptop Asus warna silver, sticker Python di cover. Tertinggal saat kelas berakhir jam 13.00.'
  },
  {
    id: 'TP-1029',
    name: 'Proyektor Rusak',
    type: 'Kerusakan fasilitas',
    place: 'Gedung C · Kelas 2',
    date: '10 Okt 2026',
    status: 'Diproses',
    owner: 'Bagas Saputra',
    desc: 'Proyektor tidak dapat menampilkan gambar. Kabel HDMI sudah dicoba semua, tetap tidak berfungsi.'
  }
];

/* Demo klaim store (berbasis localStorage agar persisten selama sesi) */
function getClaimsStore() {
  try {
    return JSON.parse(localStorage.getItem('titipin_claims') || '[]');
  } catch {
    return [];
  }
}

function saveClaimsStore(claims) {
  try {
    localStorage.setItem('titipin_claims', JSON.stringify(claims));
  } catch { /* noop */ }
}

/* Demo laporan store */
function getReportsStore() {
  try {
    return JSON.parse(localStorage.getItem('titipin_reports') || '[]');
  } catch {
    return [];
  }
}

function saveReportsStore(reports) {
  try {
    localStorage.setItem('titipin_reports', JSON.stringify(reports));
  } catch { /* noop */ }
}

function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

function generateTicketId() {
  const existing = [...demoItems, ...getReportsStore()];
  const maxId = existing.reduce((max, i) => {
    const num = parseInt((i.id || '').replace('TP-', '')) || 0;
    return Math.max(max, num);
  }, 1042);
  return 'TP-' + (maxId + 1);
}

/* -------------------------------------------------------
   ROLE & NAVIGASI
------------------------------------------------------- */

function roleInfo(role) {
  if (role === 'user') {
    return {
      name: 'Nadia Putri',
      title: 'Mahasiswa',
      greet: 'Selamat pagi, Nadia',
      subtitle: 'Pantau laporan dan temukan barang Anda.',
      nav: [
        ['home', '⌂', 'Beranda'],
        ['catalog', '▦', 'Katalog'],
        ['report', '＋', 'Laporan'],
        ['reports', '▤', 'Riwayat'],
        ['claims', '◈', 'Klaim'],
        ['profile', '●', 'Profil']
      ]
    };
  }

  if (role === 'admin') {
    return {
      name: 'Bayu Santoso',
      title: 'Staf IT',
      greet: 'Selamat pagi, Pak Bayu',
      subtitle: 'Ada 6 hal yang perlu perhatian Anda.',
      nav: [
        ['home', '⌂', 'Home'],
        ['reports', '▤', 'Reports'],
        ['verify', '▣', 'Verify'],
        ['analytics', '▥', 'Analytics'],
        ['profile', '●', 'Profile']
      ]
    };
  }

  return {
    name: 'Super Admin',
    title: 'Administrator Sistem',
    greet: 'Selamat pagi, Super Admin',
    subtitle: 'Ringkasan pengelolaan seluruh sistem TITIPIN.',
    nav: [
      ['home', '⌂', 'Dashboard'],
      ['users', '♙', 'Manajemen User'],
      ['reports', '▤', 'Semua Laporan'],
      ['locations', '⌖', 'Lokasi & Unit'],
      ['analytics', '▥', 'Analitik Sistem'],
      ['settings', '⚙', 'Pengaturan']
    ]
  };
}

/* -------------------------------------------------------
   SHELL LAYOUT (Sidebar + Topbar + Content area)
------------------------------------------------------- */

function shell(role) {
  const info = roleInfo(role);
  const initials = info.name.split(' ')
    .map(x => x[0]).slice(0, 2).join('');

  /* Bottom nav: max 5 item terpenting, label dipersingkat */
  const bottomNavItems = info.nav.slice(0, 5);

  return `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <a class="brand" href="index.html">
          <span class="brand-mark">⌕</span>
          <div>
            <b>TITIPIN</b>
            <small>Campus Care</small>
          </div>
        </a>

        <div class="side-label">Menu utama</div>

        <nav class="nav-links">
          ${info.nav.map(([k, ic, l]) => `
            <a class="nav-link"
               href="#${k}"
               data-page="${k}">
              <span class="nav-icon">${ic}</span>${l}
            </a>
          `).join('')}
        </nav>

        <div class="side-bottom">
          <div class="profile-mini">
            <div class="avatar">${initials}</div>
            <div>
              ${info.name}
              <small>${info.title}</small>
            </div>
          </div>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div style="display:flex;align-items:center;gap:10px">
            <button class="icon-btn mobile-menu" id="menuBtn" aria-label="Buka menu">
              ☰
            </button>
            <span class="breadcrumb">
              TITIPIN / <b id="crumb">Beranda</b>
            </span>
          </div>

          <div class="top-actions">
            <button class="icon-btn"
                    id="bell"
                    aria-label="Notifikasi">
              ♧<i class="notification-dot"></i>
            </button>

            <a class="top-user" href="#profile" data-page="profile">
              <div class="avatar">${initials}</div>
              <div>
                ${info.name}
                <small>${info.title}</small>
              </div>
            </a>
          </div>
        </header>

        <section class="content" id="pageContent"></section>
      </main>

      <nav class="mobile-nav" aria-label="Navigasi utama">
        ${bottomNavItems.map(([k, ic, l]) => `
          <a href="#${k}" data-page="${k}" aria-label="${l}">
            <span>${ic}</span>${l}
          </a>
        `).join('')}
      </nav>
    </div>
  `;
}

/* -------------------------------------------------------
   KOMPONEN UI REUSABLE
------------------------------------------------------- */

function stat(icon, label, num, note) {
  return `
    <article class="stat-card">
      <div class="stat-icon">${icon}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-number">${num}</div>
      <div class="stat-note">${note}</div>
    </article>
  `;
}

function actionRow(item, button = 'Cek') {
  return `
    <div class="action-row">
      <div class="mini-icon">${typeIconChar(item.type)}</div>

      <div class="action-copy">
        <b>${item.name}</b>
        <small>${item.type} · ${item.place}</small>
      </div>

      <button class="btn small dark"
              data-action="inspect"
              data-id="${item.id}">
        ${button}
      </button>
    </div>
  `;
}

function table(items, admin = false) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID LAPORAN</th>
            <th>JUDUL</th>
            <th>KATEGORI</th>
            <th>LOKASI</th>
            <th>STATUS</th>
            <th>TANGGAL</th>
            <th>AKSI</th>
          </tr>
        </thead>

        <tbody>
          ${items.map(i => `
            <tr>
              <td>${i.id}</td>
              <td><b>${i.name}</b></td>
              <td>${i.type}</td>
              <td>${i.place}</td>

              <td>
                <span class="status ${statusClass(i.status)}">${i.status}</span>
              </td>

              <td>${i.date}</td>

              <td>
                <button class="btn small outline"
                        data-action="inspect"
                        data-id="${i.id}">
                  Detail
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function heading(title, sub, actions = '') {
  return `
    <div class="welcome">
      <div>
        <div class="greeting">${sub}</div>
        <h1>${title}</h1>
      </div>

      <div class="welcome-actions">${actions}</div>
    </div>
  `;
}

/* -------------------------------------------------------
   HELPER FUNCTIONS
------------------------------------------------------- */

function statusClass(status) {
  if (status === 'Selesai' || status === 'Terverifikasi') return 'green';
  if (status === 'Prioritas') return 'red';
  if (status === 'Diproses') return 'blue';
  return '';
}

/* Ikon teks konsisten (menggantikan emoji acak) */
function typeIconChar(type) {
  if (type === 'Barang hilang') return '⊗';
  if (type === 'Barang temuan') return '◇';
  if (type === 'Kerusakan fasilitas') return '⚡';
  return '▣';
}

function typeIconClass(type) {
  if (type === 'Barang hilang') return 'lost';
  if (type === 'Barang temuan') return 'found';
  if (type === 'Kerusakan fasilitas') return 'facility';
  return 'found';
}

function typeLabel(type) {
  if (type === 'Barang hilang') return 'Hilang';
  if (type === 'Barang temuan') return 'Temuan';
  if (type === 'Kerusakan fasilitas') return 'Fasilitas';
  return type;
}
