/* DASHBOARD USER */

function homeUser() {
  const myReports = getReportsStore();
  const myClaims  = getClaimsStore();

  const totalLaporan = 4 + myReports.length;
  const totalKlaim   = 1 + myClaims.length;

  return `
    ${heading(
      'Beranda',
      'Halo, Nadia! Senang melihat Anda kembali.',
      '<button class="btn primary" data-page="report">＋ Buat Laporan</button>'
    )}

    <div class="stats">
      ${stat('▤', 'Laporan Saya', totalLaporan, '2 masih diproses')}
      ${stat('⌕', 'Barang Ditemukan', '12', 'Di sekitar kampus')}
      ${stat('◈', 'Tiket Klaim', totalKlaim, 'Pantau status klaim Anda')}
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
          <h2>Barang temuan terbaru</h2>
          <a href="#catalog" data-page="catalog">Lihat semua →</a>
        </div>

        <div class="item-grid">
          ${demoItems
              .filter(i => i.type === 'Barang temuan')
              .slice(0, 3)
              .map(itemCard).join('')}
        </div>
      </section>

      <section class="panel">
        <div class="section-head">
          <h2>Aktivitas laporan</h2>
          <a href="#reports" data-page="reports">Detail</a>
        </div>

        ${actionRow(demoItems[0], 'Lihat')}
        ${actionRow(demoItems[2], 'Klaim')}

        <div style="margin-top:16px;padding:14px;background:#f3f8e9;border-radius:8px">
          <b style="font-size:12px">💡 Tips TITIPIN</b>
          <p class="muted" style="font-size:11px;margin-bottom:0">
            Tambahkan lokasi dan ciri khusus yang jelas agar
            barang lebih mudah diverifikasi oleh petugas.
          </p>
        </div>
      </section>
    </div>
  `;
}

/* --- ITEM CARD (Desain profesional, tanpa emoji besar) --- */

function itemCard(i) {
  const iconClass = typeIconClass(i.type);
  const iconChar  = typeIconChar(i.type);
  const sClass    = statusClass(i.status);

  /* Hanya barang temuan yang bisa diklaim */
  const canClaim = i.type === 'Barang temuan' && i.status !== 'Selesai';

  return `
    <article class="item-card">
      <div class="item-photo">
        <div class="item-photo-icon ${iconClass}">
          ${iconChar}
        </div>
        <span class="item-type-badge">
          <span class="status ${iconClass === 'lost' ? 'red' : iconClass === 'facility' ? '' : 'blue'}">
            ${typeLabel(i.type)}
          </span>
        </span>
        ${i.status !== 'Menunggu' ? `
          <span class="item-status-badge">
            <span class="status ${sClass}">${i.status}</span>
          </span>
        ` : ''}
      </div>

      <div class="item-body">
        <h3>${i.name}</h3>

        <p>
          ⌖ ${i.place}<br>
          ◷ ${i.date}
        </p>

        <div class="item-foot">
          <small>${i.id}</small>

          <div style="display:flex;gap:6px">
            <button class="btn small outline"
                    data-action="inspect"
                    data-id="${i.id}">
              Detail
            </button>
            ${canClaim ? `
              <button class="btn small primary"
                      data-action="claim-item"
                      data-id="${i.id}">
                Klaim
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </article>
  `;
}
