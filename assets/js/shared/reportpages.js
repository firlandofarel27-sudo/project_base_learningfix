/* HALAMAN LAPORAN */

function reportsPage(role) {
  const userReports = getReportsStore();
  const allItems    = [...demoItems, ...userReports];

  const displayed = role === 'user'
    ? [
        ...demoItems.filter(i => ['TP-1042', 'TP-1038', 'TP-1036'].includes(i.id)),
        ...userReports
      ]
    : allItems;

  return `
    ${heading(
      role === 'user' ? 'Laporan Saya' : 'Manajemen Laporan',
      role === 'user'
        ? 'Pantau status laporan yang Anda buat.'
        : 'Cari, tinjau, dan kelola laporan kampus.',
      role === 'user'
        ? '<button class="btn primary" data-page="report">＋ Buat laporan</button>'
        : '<button class="btn outline" data-action="export">↓ Ekspor</button>'
    )}

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="tableSearch"
                  placeholder="Cari nama atau ID laporan...">
      </div>

      <select class="select" id="statusFilter">
        <option value="">Semua status</option>
        <option value="Menunggu">Menunggu</option>
        <option value="Diproses">Diproses</option>
        <option value="Terverifikasi">Terverifikasi</option>
        <option value="Selesai">Selesai</option>
        <option value="Prioritas">Prioritas</option>
      </select>

      ${role !== 'user' ? `
        <button class="btn outline" data-action="export">
          ↓ Ekspor
        </button>
      ` : ''}
    </div>

    <section class="panel" id="tablePanel">
      ${table(displayed)}
    </section>
  `;
}

/* -------------------------------------------------------
   FORM LAPORAN (Versi UX Diperbaiki)
------------------------------------------------------- */

function reportForm() {
  const today = new Date().toISOString().split('T')[0];

  return `
    ${heading(
      'Buat laporan baru',
      'Ceritakan detail barang hilang, temuan, atau kerusakan fasilitas.'
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
            <option value="Barang hilang">Barang hilang</option>
            <option value="Barang temuan">Barang temuan</option>
            <option value="Kerusakan fasilitas">Kerusakan fasilitas</option>
          </select>
        </div>

        <div class="field">
          <label>Nama barang / fasilitas *</label>
          <input required id="reportName" placeholder="Contoh: Dompet kulit hitam">
        </div>

        <div class="field">
          <label>Lokasi kejadian *</label>
          <select required id="reportPlace">
            <option value="">Pilih lokasi</option>
            <option>Perpustakaan</option>
            <option>Gedung A</option>
            <option>Gedung B</option>
            <option>Gedung C</option>
            <option>Kantin Utama</option>
            <option>Parkiran Timur</option>
            <option>Laboratorium</option>
            <option>Aula Utama</option>
          </select>
        </div>

        <div class="field">
          <label>Detail lokasi spesifik</label>
          <input id="reportPlaceDetail"
                 placeholder="Contoh: Lantai 2, meja dekat jendela">
        </div>

        <div class="field">
          <label>Tanggal kejadian *</label>
          <input type="date" required id="reportDate" value="${today}">
        </div>

        <div class="field">
          <label>Perkiraan waktu kejadian</label>
          <select id="reportTime">
            <option value="">Tidak tahu / tidak ingat</option>
            <option value="Sebelum jam 08.00">Sebelum jam 08.00 (Pagi awal)</option>
            <option value="08.00 – 10.00">08.00 – 10.00 (Pagi)</option>
            <option value="10.00 – 12.00">10.00 – 12.00 (Menjelang siang)</option>
            <option value="12.00 – 14.00">12.00 – 14.00 (Siang)</option>
            <option value="14.00 – 16.00">14.00 – 16.00 (Sore awal)</option>
            <option value="16.00 – 18.00">16.00 – 18.00 (Sore)</option>
            <option value="Setelah jam 18.00">Setelah jam 18.00 (Malam)</option>
          </select>
        </div>

        <div class="field full-width">
          <label>Deskripsi detail *</label>
          <textarea required
                    id="reportDesc"
                    placeholder="Jelaskan ciri-ciri barang (warna, merek, isi), kondisi kerusakan, atau informasi tambahan yang membantu petugas..."></textarea>
        </div>

        <div class="field full-width">
          <label>Foto pendukung (opsional)</label>
          <div class="upload" id="uploadZone">
            <label class="upload-trigger" for="photoUpload">
              <div class="upload-icon">＋</div>
              <b style="font-size:12px">Pilih atau seret foto ke sini</b>
              <small>PNG, JPG, atau JPEG · Maks 5 MB</small>
            </label>
            <input type="file"
                   accept="image/*"
                   id="photoUpload">
            <div id="photoPreviewContainer"></div>
          </div>
        </div>

        <div class="field full-width">
          <label class="check">
            <input type="checkbox" required>
            Saya menyatakan bahwa informasi yang diberikan adalah benar dan dapat dipertanggungjawabkan.
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

/* -------------------------------------------------------
   KATALOG BARANG (Dengan Tab Switcher)
------------------------------------------------------- */

function catalogPage(activeTab = 'lost-found') {
  const lostFoundItems = demoItems.filter(
    i => i.type === 'Barang hilang' || i.type === 'Barang temuan'
  );
  const facilityItems = demoItems.filter(
    i => i.type === 'Kerusakan fasilitas'
  );

  const displayedItems = activeTab === 'lost-found' ? lostFoundItems : facilityItems;

  return `
    ${heading(
      'Katalog',
      'Jelajahi barang temuan dan laporan kerusakan di kampus.'
    )}

    <!-- TAB SWITCHER -->
    <div class="tab-bar">
      <button class="tab-btn ${activeTab === 'lost-found' ? 'active' : ''}"
              data-action="switch-tab"
              data-tab="lost-found">
        ◇ Barang Hilang & Temuan
      </button>
      <button class="tab-btn ${activeTab === 'facility' ? 'active' : ''}"
              data-action="switch-tab"
              data-tab="facility">
        ⚡ Kerusakan Fasilitas
      </button>
    </div>

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="catalogSearch"
                  placeholder="${activeTab === 'lost-found'
                    ? 'Cari nama barang atau lokasi...'
                    : 'Cari fasilitas atau lokasi...'}">
      </div>

      ${activeTab === 'lost-found' ? `
        <select class="select" id="categoryFilter">
          <option value="">Semua kategori</option>
          <option value="Barang temuan">Barang temuan</option>
          <option value="Barang hilang">Barang hilang</option>
        </select>
      ` : ''}

      <select class="select" id="locationFilter">
        <option value="">Semua lokasi</option>
        <option>Perpustakaan</option>
        <option>Gedung</option>
        <option>Kantin</option>
        <option>Parkiran</option>
        <option>Laboratorium</option>
      </select>
    </div>

    <div class="item-grid" id="catalogGrid">
      ${displayedItems.length
        ? displayedItems.map(itemCard).join('')
        : emptyState(activeTab)
      }
    </div>
  `;
}

/* -------------------------------------------------------
   EMPTY STATE YANG ACTIONABLE
------------------------------------------------------- */

function emptyState(tab = 'lost-found') {
  if (tab === 'lost-found') {
    return `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">⌕</div>
        <h3>Tidak ada barang yang cocok</h3>
        <p>Coba ubah kata kunci pencarian atau filter.<br>
           Belum menemukan barang Anda?</p>
        <button class="btn primary" data-page="report">
          ＋ Buat Laporan Barang Hilang
        </button>
      </div>
    `;
  }

  return `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">⚡</div>
      <h3>Tidak ada laporan fasilitas yang cocok</h3>
      <p>Menemukan kerusakan fasilitas di kampus?</p>
      <button class="btn primary" data-page="report">
        ＋ Laporkan Kerusakan Fasilitas
      </button>
    </div>
  `;
}

/* -------------------------------------------------------
   VERIFIKASI KLAIM (Admin)
------------------------------------------------------- */

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
              style="width:100%;padding:14px;border:1px solid var(--line);border-radius:8px;text-transform:uppercase;letter-spacing:3px;font-size:18px;font-weight:700;text-align:center"
            >
          </div>

          <button class="btn primary full" style="margin-top:14px" type="submit">
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
          ['1', 'Cocokkan kode', 'Pastikan kode sesuai tiket klaim yang ditunjukkan pengguna.'],
          ['2', 'Periksa identitas', 'Cocokkan nama dan detail barang dengan KTM/identitas.'],
          ['3', 'Konfirmasi serah terima', 'Klik konfirmasi dan simpan bukti penyerahan barang.']
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
