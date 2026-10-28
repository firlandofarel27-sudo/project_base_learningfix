/* HALAMAN LAPORAN */

function reportsPage(role) {
  return `
    ${heading(
      role === 'user' ? 'Laporan Saya' : 'Manajemen Laporan',
      role === 'user'
        ? 'Pantau status laporan yang Anda buat.'
        : 'Cari, tinjau, dan kelola laporan kampus.',
      '<button class="btn primary" data-page="report">＋ Buat laporan</button>'
    )}

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="tableSearch"
                  placeholder="Cari nama atau ID laporan...">
      </div>

      <select class="select" id="statusFilter">
        <option value="">Semua status</option>
        <option>Menunggu</option>
        <option>Diproses</option>
        <option>Terverifikasi</option>
        <option>Selesai</option>
        <option>Prioritas</option>
      </select>

      <button class="btn outline" data-action="export">
        ↓ Ekspor
      </button>
    </div>

    <section class="panel" id="tablePanel">
      ${table(
        role === 'user'
          ? demoItems.filter(i =>
              ['TP-1042', 'TP-1038', 'TP-1036'].includes(i.id))
          : demoItems
      )}
    </section>
  `;
}

/* FORM LAPORAN */

function reportForm() {
  return `
    ${heading(
      'Buat laporan baru',
      'Ceritakan detail barang hilang, barang temuan, atau kerusakan fasilitas.'
    )}

    <section class="form-panel" style="padding:22px">
      <div class="section-head">
        <h2>Informasi laporan</h2>
        <span class="status blue">Langkah 1 dari 1</span>
      </div>

      <form id="reportForm" class="form-grid">
        <div class="field">
          <label>Jenis laporan *</label>
          <select required id="reportType">
            <option>Barang hilang</option>
            <option>Barang temuan</option>
            <option>Kerusakan fasilitas</option>
          </select>
        </div>

        <div class="field">
          <label>Nama barang / fasilitas *</label>
          <input required placeholder="Contoh: Dompet hitam">
        </div>

        <div class="field">
          <label>Lokasi kejadian *</label>
          <select required>
            <option value="">Pilih lokasi</option>
            <option>Perpustakaan</option>
            <option>Gedung A</option>
            <option>Gedung B</option>
            <option>Kantin</option>
            <option>Parkiran Timur</option>
            <option>Laboratorium</option>
          </select>
        </div>

        <div class="field">
          <label>Tanggal kejadian *</label>
          <input type="date" required value="2026-10-13">
        </div>

        <div class="field full-width">
          <label>Deskripsi detail *</label>
          <textarea required placeholder="Jelaskan ciri-ciri barang, warna, lokasi detail, atau kerusakan..."></textarea>
        </div>

        <div class="field full-width">
          <label>Foto pendukung (opsional)</label>
          <div class="upload">
            ＋<br>
            <b>Unggah foto</b><br>
            <small>PNG, JPG atau JPEG</small><br>
            <input type="file" accept="image/*" id="photoUpload">
          </div>
        </div>

        <div class="field full-width">
          <label class="check">
            <input type="checkbox" required>
            Saya memastikan informasi yang diberikan benar.
          </label>
        </div>

        <div class="field full-width"
             style="display:flex;justify-content:flex-end;gap:10px">
          <button type="button" class="btn outline" data-page="home">
            Batal
          </button>

          <button class="btn primary" type="submit">
            Kirim laporan →
          </button>
        </div>
      </form>
    </section>
  `;
}

/* KATALOG BARANG */

function catalogPage() {
  return `
    ${heading(
      'Katalog barang',
      'Jelajahi barang temuan yang dilaporkan di lingkungan kampus.'
    )}

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="catalogSearch"
                  placeholder="Cari barang atau lokasi...">
      </div>

      <select class="select" id="categoryFilter">
        <option value="">Semua kategori</option>
        <option>Barang temuan</option>
        <option>Barang hilang</option>
        <option>Kerusakan fasilitas</option>
      </select>

      <select class="select" id="locationFilter">
        <option value="">Semua lokasi</option>
        <option>Perpustakaan</option>
        <option>Gedung</option>
        <option>Kantin</option>
        <option>Parkiran</option>
      </select>
    </div>

    <div class="item-grid" id="catalogGrid">
      ${demoItems.map(itemCard).join('')}
    </div>
  `;
}

/* VERIFIKASI KLAIM */

function verifyPage() {
  return `
    ${heading(
      'Verifikasi klaim',
      'Periksa kode tiket sebelum penyerahan barang.'
    )}

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-head">
          <h2>Masukkan kode klaim</h2>
        </div>

        <form id="verifyForm">
          <div class="field">
            <label>Kode klaim 6 karakter</label>

            <input
              id="claimCode"
              required
              minlength="6"
              maxlength="6"
              placeholder="Contoh: A7K3FP"
              style="width:100%;padding:14px;border:1px solid var(--line);border-radius:8px;text-transform:uppercase;letter-spacing:3px"
            >
          </div>

          <button class="btn primary" style="margin-top:14px">
            Verifikasi kode →
          </button>
        </form>

        <div id="verifyResult"></div>
      </section>

      <section class="panel">
        <h2 style="font-size:15px;margin-top:0">
          Panduan verifikasi
        </h2>

        ${[
          ['1', 'Cocokkan kode', 'Pastikan kode sesuai tiket klaim pengguna.'],
          ['2', 'Periksa identitas', 'Cocokkan identitas dan detail barang.'],
          ['3', 'Konfirmasi serah terima', 'Simpan bukti penyerahan barang.']
        ].map(x => `
          <div class="action-row">
            <div class="mini-icon">${x[0]}</div>
            <div class="action-copy">
              <b>${x[1]}</b>
              <small>${x[2]}</small>
            </div>
          </div>
        `).join('')}
      </section>
    </div>
  `;
}