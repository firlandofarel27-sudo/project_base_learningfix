/* DASHBOARD USER */

function homeUser() {
  return `
    ${heading(
      'Beranda',
      'Halo, Nadia! Senang melihat Anda kembali.',
      '<button class="btn primary" data-page="report">＋ Buat Laporan</button>'
    )}

    <div class="stats">
      ${stat('▤', 'Laporan Saya', '4', '2 masih diproses')}
      ${stat('⌕', 'Barang Ditemukan', '12', 'Di sekitar kampus')}
      ${stat('◈', 'Tiket Klaim', '1', 'Menunggu verifikasi')}
      ${stat(
        '✓',
        'Laporan Selesai',
        '3',
        '<span class="positive">Terima kasih sudah peduli!</span>'
      )}
    </div>

    <div class="dashboard-grid">
      <section>
        <div class="section-head">
          <h2>Barang terbaru</h2>
          <a href="#catalog">Lihat semua →</a>
        </div>

        <div class="item-grid">
          ${demoItems.slice(0, 3).map(itemCard).join('')}
        </div>
      </section>

      <section class="panel">
        <div class="section-head">
          <h2>Aktivitas laporan</h2>
          <a href="#reports">Detail</a>
        </div>

        ${actionRow(demoItems[0], 'Lihat')}
        ${actionRow(demoItems[2], 'Klaim')}

        <div style="margin-top:16px;padding:14px;background:#f3f8e9;border-radius:8px">
          <b style="font-size:12px">💡 Tips TITIPIN</b>
          <p class="muted" style="font-size:11px;margin-bottom:0">
            Tambahkan lokasi dan foto yang jelas agar barang
            lebih mudah ditemukan.
          </p>
        </div>
      </section>
    </div>
  `;
}

function itemCard(i) {
  return `
    <article class="item-card">
      <div class="item-photo">
        ${i.emoji}

        <span class="status ${
          i.status === 'Selesai' ? 'green' :
          i.status === 'Prioritas' ? 'red' : 'blue'
        }">${i.type}</span>
      </div>

      <div class="item-body">
        <h3>${i.name}</h3>

        <p>
          ⌖ ${i.place}<br>
          ◷ ${i.date}
        </p>

        <div class="item-foot">
          <small>${i.id}</small>

          <button class="btn small outline"
                  data-action="inspect"
                  data-id="${i.id}">
            Lihat detail
          </button>
        </div>
      </div>
    </article>
  `;
}