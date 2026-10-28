/* DASHBOARD ADMIN */

function homeAdmin() {
  return `
    ${heading(
      'Ringkasan hari ini',
      'Selamat pagi, Pak Bayu',
      '<button class="btn outline" data-page="reports">Lihat laporan</button>'
    )}

    <div class="stats">
      ${stat('▤', 'Total Laporan', '128', '+12% bulan ini')}
      ${stat('▣', 'Klaim Pending', '14', 'Perlu diverifikasi')}
      ${stat('⬡', 'Kerusakan Aktif', '9', '3 prioritas tinggi')}
      ${stat('◷', 'Selesai Hari Ini', '42', 'Sesuai target')}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-head">
          <h2>Perlu Tindakan</h2>
          <a href="#reports">Lihat semua</a>
        </div>

        ${demoItems.slice(0, 3).map(i => actionRow(i)).join('')}
      </section>

      <section class="panel">
        <div class="section-head">
          <h2>Target layanan bulanan</h2>
        </div>

        <div class="target-number">86%</div>

        <p class="muted" style="font-size:11px">
          108 dari 125 laporan terselesaikan
        </p>

        <div class="progress">
          <span style="width:86%"></span>
        </div>

        <p class="muted" style="font-size:10px">
          14% lagi untuk mencapai target bulanan.
        </p>

        <button class="btn outline full" data-page="analytics">
          Lihat analitik
        </button>
      </section>
    </div>
  `;
}

/* DASHBOARD SUPER ADMIN */

function homeSuper() {
  return `
    ${heading(
      'Dashboard sistem',
      'Ikhtisar aktivitas seluruh kampus',
      '<button class="btn primary" data-action="add-user">＋ Tambah pengguna</button>'
    )}

    <div class="stats">
      ${stat('♙', 'Total Pengguna', '2.486', '+8,4% bulan ini')}
      ${stat('▤', 'Total Laporan', '1.284', 'Seluruh unit kampus')}
      ${stat(
        '✓',
        'Tingkat Selesai',
        '92,4%',
        '<span class="positive">+3,2% dari bulan lalu</span>'
      )}
      ${stat('⌁', 'Unit Aktif', '18', 'Semua unit terhubung')}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-head">
          <h2>Aktivitas terbaru</h2>
          <a href="#reports">Semua laporan →</a>
        </div>

        ${demoItems.slice(0, 3).map(i => actionRow(i, 'Detail')).join('')}
      </section>

      <section class="panel">
        <div class="section-head">
          <h2>Kesehatan sistem</h2>
          <span class="status green">Normal</span>
        </div>

        <div class="target-number">99,8%</div>

        <p class="muted" style="font-size:11px">
          Uptime dalam 30 hari terakhir
        </p>

        <div class="progress">
          <span style="width:99.8%"></span>
        </div>

        <div class="action-row">
          <div class="mini-icon">✓</div>
          <div class="action-copy">
            <b>Database</b>
            <small>Beroperasi normal</small>
          </div>
          <span class="status green">Aktif</span>
        </div>

        <div class="action-row">
          <div class="mini-icon">✓</div>
          <div class="action-copy">
            <b>Layanan notifikasi</b>
            <small>Sinkron terakhir 2 menit lalu</small>
          </div>
          <span class="status green">Aktif</span>
        </div>
      </section>
    </div>
  `;
}