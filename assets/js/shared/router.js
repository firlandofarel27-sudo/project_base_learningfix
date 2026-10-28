/* ROUTING HALAMAN */

/* State tab katalog (persisten selama sesi navigasi) */
let _catalogTab = 'lost-found';

function contentFor(role, page) {
  if (page === 'home') {
    return role === 'user' ? homeUser()
      : role === 'admin' ? homeAdmin()
      : homeSuper();
  }

  if (page === 'catalog')   return catalogPage(_catalogTab);
  if (page === 'report')    return reportForm();
  if (page === 'reports')   return reportsPage(role);
  if (page === 'verify')    return verifyPage();
  if (page === 'analytics') return analyticsPage(role);
  if (page === 'profile')   return profilePage(role);
  if (page === 'users')     return usersPage();
  if (page === 'settings')  return settingsPage();

  if (page === 'claims') {
    const claims = getClaimsStore();
    return claimsPage(claims);
  }

  if (page === 'locations') {
    return `
      ${heading(
        'Lokasi & unit',
        'Kelola gedung, fasilitas, dan unit layanan.',
        '<button class="btn primary" data-action="add-location">＋ Tambah lokasi</button>'
      )}
      <section class="panel">
        ${table(demoItems)}
      </section>
    `;
  }

  /* Fallback berdasarkan role */
  if (role === 'user')  return homeUser();
  if (role === 'admin') return homeAdmin();
  return homeSuper();
}

/* -------------------------------------------------------
   HALAMAN TIKET KLAIM (Dinamis dari store)
------------------------------------------------------- */

function claimsPage(claims) {
  /* Gabungkan klaim hardcoded demo + klaim baru dari store */
  const demoClaim = {
    claimCode: 'A7K3FP',
    itemId: 'TP-1042',
    itemName: 'Dompet Hitam',
    place: 'Perpustakaan · Lantai 2',
    status: 'Menunggu verifikasi',
    date: '13 Okt 2026'
  };

  const allClaims = [demoClaim, ...claims];

  return `
    ${heading(
      'Tiket Klaim',
      'Lihat tiket dan kode klaim barang Anda.'
    )}

    ${allClaims.map((c, idx) => `
      <section class="panel" style="max-width:620px;margin-bottom:16px">
        <div class="section-head">
          <h2 style="font-size:15px">${c.itemName}</h2>
          <span class="status ${c.status === 'Selesai' ? 'green' : 'blue'}">
            ${c.status}
          </span>
        </div>
        <p class="muted" style="font-size:11px;margin:0 0 16px">
          ${c.place || ''} · ${c.date}
        </p>

        <div class="timeline">
          <div class="timeline-step active">✓<br>Laporan dibuat</div>
          <div class="timeline-step active">✓<br>Klaim diajukan</div>
          <div class="timeline-step ${c.status === 'Selesai' ? 'active' : ''}">
            ${c.status === 'Selesai' ? '✓' : '3'}<br>Serah terima
          </div>
        </div>

        <p class="muted" style="font-size:11px;margin:16px 0 6px">
          Tunjukkan kode ini ke petugas posko satpam:
        </p>
        <div class="ticket-code-box">
          <div class="ticket-id">${c.claimCode}</div>
          <small>Kode berlaku hingga serah terima selesai</small>
        </div>

        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn outline small"
                  data-action="copy-code"
                  data-code="${c.claimCode}">
            Salin kode
          </button>
          <span style="font-size:10px;color:var(--muted);align-self:center">
            📍 Posko Satpam: Gedung Rektorat Lantai 1
          </span>
        </div>
      </section>
    `).join('')}
  `;
}

/* -------------------------------------------------------
   RENDER HALAMAN
------------------------------------------------------- */

function renderPage(role, page) {
  const info = roleInfo(role);

  $('#pageContent').innerHTML = contentFor(role, page);

  $('#crumb').textContent =
    (info.nav.find(x => x[0] === page) || [])[2] || 'Beranda';

  $$('[data-page]').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page)
  );

  $$('.mobile-nav a').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page)
  );

  bindPage(role, page);
}

/* -------------------------------------------------------
   BIND EVENTS PER HALAMAN
------------------------------------------------------- */

function bindPage(role, page) {
  /* ---- Tabel Laporan: Search + Filter ---- */
  const search = $('#tableSearch');
  const filter = $('#statusFilter');

  if (search) {
    const update = () => {
      const q  = search.value.toLowerCase();
      const st = filter ? filter.value : '';

      const userReports = getReportsStore();
      const allItems    = [...demoItems, ...userReports];

      const base = role === 'user'
        ? [
            ...demoItems.filter(i =>
              ['TP-1042', 'TP-1038', 'TP-1036'].includes(i.id)),
            ...userReports
          ]
        : allItems;

      const visible = base.filter(i =>
        `${i.id} ${i.name} ${i.type} ${i.place}`
          .toLowerCase().includes(q) &&
        (!st || i.status === st)
      );

      const panel = $('#tablePanel');
      if (panel) panel.innerHTML = table(visible);
    };

    search.oninput = update;
    if (filter) filter.onchange = update;
  }

  /* ---- Katalog: Search + Filter + Tab ---- */
  const cs = $('#catalogSearch');

  if (cs) {
    const catEl = $('#categoryFilter');
    const locEl = $('#locationFilter');

    const update = () => {
      const q   = cs.value.toLowerCase();
      const cat = catEl ? catEl.value : '';
      const loc = locEl ? locEl.value : '';

      const sourceItems = _catalogTab === 'lost-found'
        ? demoItems.filter(i => i.type !== 'Kerusakan fasilitas')
        : demoItems.filter(i => i.type === 'Kerusakan fasilitas');

      const list = sourceItems.filter(i =>
        `${i.name} ${i.place}`.toLowerCase().includes(q) &&
        (!cat || i.type === cat) &&
        (!loc || i.place.toLowerCase().includes(loc.toLowerCase()))
      );

      const grid = $('#catalogGrid');
      if (grid) {
        grid.innerHTML = list.length
          ? list.map(itemCard).join('')
          : emptyState(_catalogTab);
      }
    };

    cs.oninput = update;
    if (catEl) catEl.onchange = update;
    if (locEl) locEl.onchange = update;
  }

  /* ---- Form Laporan: Submit + Image Preview ---- */
  const reportFormEl = $('#reportForm');
  if (reportFormEl) {
    /* Live image preview */
    const photoInput = $('#photoUpload');
    const previewCon = $('#photoPreviewContainer');

    if (photoInput && previewCon) {
      photoInput.onchange = () => {
        const file = photoInput.files[0];
        if (!file) { previewCon.innerHTML = ''; return; }

        const reader = new FileReader();
        reader.onload = ev => {
          previewCon.innerHTML = `
            <div class="photo-preview-wrap" style="margin-top:14px">
              <img class="photo-preview"
                   src="${ev.target.result}"
                   alt="Preview foto">
              <button class="photo-preview-remove"
                      type="button"
                      id="removePhoto"
                      title="Hapus foto">✕</button>
            </div>
          `;
          $('#removePhoto').onclick = () => {
            photoInput.value = '';
            previewCon.innerHTML = '';
          };
        };
        reader.readAsDataURL(file);
      };
    }

    /* Submit: tampilkan success modal dengan nomor tiket */
    reportFormEl.onsubmit = e => {
      e.preventDefault();

      const type   = $('#reportType')?.value || 'Barang hilang';
      const name   = $('#reportName')?.value || 'Tidak disebutkan';
      const place  = $('#reportPlace')?.value || '';
      const detail = $('#reportPlaceDetail')?.value || '';
      const date   = $('#reportDate')?.value || new Date().toISOString().split('T')[0];
      const time   = $('#reportTime')?.value || '';
      const desc   = $('#reportDesc')?.value || '';

      const newId = generateTicketId();
      const dateStr = new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      const newReport = {
        id: newId,
        name,
        type,
        place: detail ? `${place} · ${detail}` : place,
        date: dateStr,
        status: 'Menunggu',
        owner: 'Nadia Putri',
        desc
      };

      const reports = getReportsStore();
      reports.push(newReport);
      saveReportsStore(reports);

      showSuccessModal(newId, name, place, time);
    };
  }

  /* ---- Form Verifikasi ---- */
  const verifyFormEl = $('#verifyForm');
  if (verifyFormEl) {
    verifyFormEl.onsubmit = e => {
      e.preventDefault();

      const code = $('#claimCode').value.toUpperCase().trim();
      const res  = $('#verifyResult');

      /* Cek di klaim hardcoded + store */
      const validCodes = ['A7K3FP', ...getClaimsStore().map(c => c.claimCode)];
      const matchedClaim = getClaimsStore().find(c => c.claimCode === code);
      const matchedName  = code === 'A7K3FP'
        ? 'Dompet Hitam · Nadia Putri'
        : matchedClaim
          ? `${matchedClaim.itemName} · Nadia Putri`
          : null;

      if (validCodes.includes(code)) {
        res.innerHTML = `
          <div style="margin-top:18px;padding:14px;background:#edf8e8;border-radius:8px">
            <b>✓ Kode valid</b>
            <p class="muted">${matchedName}</p>
            <button class="btn primary" id="confirmHand">
              Konfirmasi serah terima
            </button>
          </div>`;

        const confirmBtn = $('#confirmHand');
        if (confirmBtn) {
          confirmBtn.onclick = () => {
            toast('Serah terima berhasil dikonfirmasi.');
            res.innerHTML = '<span class="status green">✓ Klaim selesai — Barang telah diserahterimakan</span>';
          };
        }
      } else {
        res.innerHTML = `
          <div style="margin-top:14px;padding:14px;background:#fff3f2;border-radius:8px;border:1px solid #f5c6c3">
            <b style="color:#c0392b">✕ Kode tidak ditemukan</b>
            <p class="muted" style="font-size:11px;margin:6px 0 0">
              Pastikan kode diketik dengan benar. Hubungi pelapor untuk mengecek tiket klaim mereka.
            </p>
          </div>`;
      }
    };
  }

  /* ---- Form Profil ---- */
  const profileFormEl = $('#profileForm');
  if (profileFormEl) {
    profileFormEl.onsubmit = e => {
      e.preventDefault();
      toast('Profil berhasil disimpan (mode demo).');
    };
  }

  /* ---- Form Pengaturan ---- */
  const settingsFormEl = $('#settingsForm');
  if (settingsFormEl) {
    settingsFormEl.onsubmit = e => {
      e.preventDefault();
      toast('Pengaturan tersimpan (mode demo).');
    };
  }

  /* ---- Period Select Analitik ---- */
  const periodSelect = $('#periodSelect');
  if (periodSelect) {
    periodSelect.onchange = () => {
      toast('Periode analitik diubah: ' + periodSelect.value);
    };
  }
}

/* -------------------------------------------------------
   MODAL SUKSES — Laporan Berhasil Dibuat
------------------------------------------------------- */

function showSuccessModal(ticketId, itemName, place, time) {
  const back = document.createElement('div');
  back.className = 'modal-backdrop';

  back.innerHTML = `
    <div class="modal" style="width:min(100%,520px)">
      <div class="success-modal">
        <div class="success-icon">✓</div>
        <h2 style="margin:0 0 6px">Laporan berhasil dikirim!</h2>
        <p class="muted" style="font-size:12px;margin:0">
          Terima kasih, ${itemName} sudah kami catat.
          Petugas akan menindaklanjuti sesegera mungkin.
        </p>

        <div class="ticket-code-box">
          <small>Nomor tiket laporan Anda</small>
          <div class="ticket-id">${ticketId}</div>
          <small>Simpan nomor ini untuk melacak status laporan</small>
        </div>

        <div class="next-steps">
          <p>Langkah selanjutnya:</p>
          <div class="next-step-item">
            <div class="next-step-num">1</div>
            <span>Petugas satpam akan memverifikasi laporan dalam <b>1×24 jam</b>.</span>
          </div>
          <div class="next-step-item">
            <div class="next-step-num">2</div>
            <span>Pantau status di menu <b>Laporan Saya</b>.</span>
          </div>
          <div class="next-step-item">
            <div class="next-step-num">3</div>
            <span>Posko penemuan barang: <b>Gedung Rektorat Lt. 1</b>, buka Senin–Jumat 07.00–17.00.</span>
          </div>
        </div>
      </div>

      <div class="modal-actions" style="justify-content:center;gap:10px">
        <button class="btn outline" id="successClose">
          Tutup
        </button>
        <button class="btn primary" id="successGoReports">
          Lihat Laporan Saya →
        </button>
      </div>
    </div>
  `;

  document.body.append(back);

  back.querySelector('#successClose').onclick = () => {
    back.remove();
    location.hash = 'home';
  };

  back.querySelector('#successGoReports').onclick = () => {
    back.remove();
    location.hash = 'reports';
  };
}
