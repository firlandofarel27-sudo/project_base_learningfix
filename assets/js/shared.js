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

const demoItems = [
  {
    id: 'TP-1042',
    name: 'Dompet Hitam',
    type: 'Barang hilang',
    place: 'Perpustakaan · Lantai 2',
    date: '13 Okt 2026',
    status: 'Menunggu',
    emoji: '👛',
    owner: 'Raka Pratama'
  },
  {
    id: 'TP-1041',
    name: 'AC Rusak Lab 3',
    type: 'Kerusakan fasilitas',
    place: 'Gedung B · Lab 3',
    date: '13 Okt 2026',
    status: 'Prioritas',
    emoji: '❄️',
    owner: 'Dina Putri'
  },
  {
    id: 'TP-1038',
    name: 'Kunci Motor',
    type: 'Barang temuan',
    place: 'Parkiran Timur',
    date: '12 Okt 2026',
    status: 'Terverifikasi',
    emoji: '🔑',
    owner: 'Fajar Ramadhan'
  },
  {
    id: 'TP-1036',
    name: 'Botol Minum',
    type: 'Barang temuan',
    place: 'Kantin Utama',
    date: '12 Okt 2026',
    status: 'Selesai',
    emoji: '🧴',
    owner: 'Nadia Putri'
  },
  {
    id: 'TP-1033',
    name: 'Laptop Silver',
    type: 'Barang hilang',
    place: 'Ruang Kelas A-203',
    date: '11 Okt 2026',
    status: 'Menunggu',
    emoji: '💻',
    owner: 'Rizky Maulana'
  },
  {
    id: 'TP-1029',
    name: 'Proyektor',
    type: 'Kerusakan fasilitas',
    place: 'Gedung C · Kelas 2',
    date: '10 Okt 2026',
    status: 'Diproses',
    emoji: '📽️',
    owner: 'Bagas Saputra'
  }
];

function roleInfo(role) {
  if (role === 'user') {
    return {
      name: 'Nadia Putri',
      title: 'Mahasiswa',
      greet: 'Selamat pagi, Nadia',
      subtitle: 'Pantau laporan dan temukan barang Anda.',
      nav: [
        ['home', '⌂', 'Beranda'],
        ['catalog', '▦', 'Katalog Barang'],
        ['report', '＋', 'Buat Laporan'],
        ['reports', '▤', 'Laporan Saya'],
        ['claims', '◈', 'Tiket Klaim'],
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

function navHref(role, key) {
  if (key === 'logout') return 'index.html';
  return '#' + key;
}

function shell(role) {
  const info = roleInfo(role);
  const initials = info.name.split(' ')
    .map(x => x[0]).slice(0, 2).join('');

  return `
    <div class="app-shell">
      <aside class="sidebar">
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
            <button class="icon-btn mobile-menu" id="menuBtn">
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

            <a class="top-user" href="#profile">
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

      <nav class="mobile-nav">
        ${info.nav.slice(0, 5).map(([k, ic, l]) => `
          <a href="#${k}" data-page="${k}">
            <span>${ic}</span>${l}
          </a>
        `).join('')}
      </nav>
    </div>
  `;
}

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
      <div class="mini-icon">${item.emoji}</div>

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
                <span class="status ${
                  i.status === 'Selesai' ||
                  i.status === 'Terverifikasi' ? 'green' :
                  i.status === 'Prioritas' ? 'red' :
                  i.status === 'Diproses' ? 'blue' : ''
                }">${i.status}</span>
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