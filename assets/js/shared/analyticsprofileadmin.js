/* ANALITIK */

function analyticsPage(role) {
  return `
    ${heading(
      role === 'super' ? 'Analitik sistem' : 'Analitik laporan',
      'Pantau tren dan kinerja layanan TITIPIN.',
      `<select class="select" id="periodSelect">
        <option>7 hari terakhir</option>
        <option>30 hari terakhir</option>
        <option>Tahun ini</option>
      </select>`
    )}

    <div class="stats">
      ${stat('▤', 'Total laporan', '1.284', 'Periode terpilih')}
      ${stat('✓', 'Terselesaikan', '92,4%', 'Di atas target 85%')}
      ${stat('◷', 'Rata-rata waktu', '1,8 hari', '-0,4 hari dari periode lalu')}
      ${stat('♙', 'Pengguna aktif', '846', '+14% periode lalu')}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <h2 style="font-size:15px">
          Laporan berdasarkan kategori
        </h2>

        <div class="chart-bars">
          ${[
            ['Barang hilang', 72, 72],
            ['Barang temuan', 88, 88],
            ['Kerusakan fasilitas', 46, 46],
            ['Lainnya', 24, 24]
          ].map(x => `
            <div class="bar-row">
              <span>${x[0]}</span>
              <div class="bar-track">
                <span style="width:${x[1]}%"></span>
              </div>
              <b>${x[2]}%</b>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="panel">
        <h2 style="font-size:15px">Status penyelesaian</h2>
        <div class="target-number">92,4%</div>

        <p class="muted" style="font-size:11px">
          Laporan selesai sesuai standar layanan
        </p>

        <div class="progress">
          <span style="width:92.4%"></span>
        </div>

        <div class="action-row">
          <div class="mini-icon">✓</div>
          <div class="action-copy">
            <b>Selesai</b>
            <small>1.186 laporan</small>
          </div>
          <span class="status green">92,4%</span>
        </div>

        <div class="action-row">
          <div class="mini-icon">◷</div>
          <div class="action-copy">
            <b>Dalam proses</b>
            <small>98 laporan</small>
          </div>
          <span class="status">7,6%</span>
        </div>
      </section>
    </div>
  `;
}

/* PROFIL */

function profilePage(role) {
  const info = roleInfo(role);

  const email = role === 'user'
    ? 'nadia@kampus.ac.id'
    : role === 'admin'
      ? 'bayu@kampus.ac.id'
      : 'superadmin@kampus.ac.id';

  return `
    ${heading(
      'Profil saya',
      'Kelola informasi akun dan preferensi Anda.'
    )}

    <section class="panel" style="max-width:720px">
      <div style="display:flex;align-items:center;gap:16px;padding-bottom:20px;border-bottom:1px solid var(--line)">
        <div class="avatar" style="width:64px;height:64px;font-size:20px">
          ${info.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
        </div>

        <div>
          <h2 style="margin:0 0 6px">${info.name}</h2>
          <p class="muted" style="margin:0">
            ${info.title} · Kampus
          </p>
        </div>

        <span class="status green" style="margin-left:auto">
          Aktif
        </span>
      </div>

      <form id="profileForm" class="form-grid" style="padding-top:20px">
        <div class="field">
          <label>Nama lengkap</label>
          <input value="${info.name}" required>
        </div>

        <div class="field">
          <label>Email kampus</label>
          <input type="email" value="${email}" required>
        </div>

        <div class="field">
          <label>Peran</label>
          <input value="${info.title}" disabled>
        </div>

        <div class="field">
          <label>Nomor telepon</label>
          <input placeholder="08xxxxxxxxxx">
        </div>

        <div class="field full-width">
          <button class="btn primary">Simpan perubahan</button>
          <a class="btn outline" href="index.html">Keluar</a>
        </div>
      </form>
    </section>
  `;
}

/* MANAJEMEN USER */

function usersPage() {
  return `
    ${heading(
      'Manajemen pengguna',
      'Kelola akses, peran, dan status akun kampus.',
      '<button class="btn primary" data-action="add-user">＋ Tambah pengguna</button>'
    )}

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="tableSearch" placeholder="Cari nama atau email...">
      </div>

      <select class="select">
        <option>Semua peran</option>
        <option>Mahasiswa</option>
        <option>Staf</option>
        <option>Admin</option>
      </select>
    </div>

    <section class="panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>NAMA</th>
              <th>EMAIL</th>
              <th>PERAN</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Nadia Putri</td>
              <td>nadia@kampus.ac.id</td>
              <td>Mahasiswa</td>
              <td><span class="status green">Aktif</span></td>
              <td>
                <button class="btn small outline" data-action="edit-user">
                  Kelola
                </button>
              </td>
            </tr>

            <tr>
              <td>Bayu Santoso</td>
              <td>bayu@kampus.ac.id</td>
              <td>Staf IT</td>
              <td><span class="status green">Aktif</span></td>
              <td>
                <button class="btn small outline" data-action="edit-user">
                  Kelola
                </button>
              </td>
            </tr>

            <tr>
              <td>Dina Putri</td>
              <td>dina@kampus.ac.id</td>
              <td>Admin Unit</td>
              <td><span class="status">Menunggu</span></td>
              <td>
                <button class="btn small outline" data-action="edit-user">
                  Kelola
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

/* PENGATURAN */

function settingsPage() {
  return `
    ${heading(
      'Pengaturan sistem',
      'Konfigurasi aturan dan layanan TITIPIN.'
    )}

    <section class="panel" style="max-width:800px">
      <form id="settingsForm" class="form-grid">
        <div class="field">
          <label>Nama aplikasi</label>
          <input value="TITIPIN Campus Care">
        </div>

        <div class="field">
          <label>Durasi penyimpanan laporan (hari)</label>
          <input type="number" value="90" min="1">
        </div>

        <div class="field">
          <label>Target penyelesaian (%)</label>
          <input type="number" value="85" min="1" max="100">
        </div>

        <div class="field">
          <label>Notifikasi email</label>
          <select>
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>
        </div>

        <div class="field full-width">
          <button class="btn primary">Simpan pengaturan</button>
        </div>
      </form>
    </section>
  `;
}