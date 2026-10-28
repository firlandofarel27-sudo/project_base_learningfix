/* -------------------------------------------------------
   MODAL UMUM
------------------------------------------------------- */

function showModal(title, body, submitText = 'Simpan') {
  const back = document.createElement('div');
  back.className = 'modal-backdrop';

  back.innerHTML = `
    <div class="modal">
      <h2>${title}</h2>
      ${body}

      <div class="modal-actions">
        <button class="btn outline" data-close>
          Batal
        </button>
        <button class="btn primary" data-submit>
          ${submitText}
        </button>
      </div>
    </div>
  `;

  document.body.append(back);

  back.querySelector('[data-close]').onclick  = () => back.remove();
  back.querySelector('[data-submit]').onclick = () => {
    back.remove();
    toast('Aksi berhasil (mode demo).');
  };
}

/* -------------------------------------------------------
   EVENT GLOBAL (click delegation)
------------------------------------------------------- */

document.addEventListener('click', e => {
  /* ---- Navigasi halaman ---- */
  const p = e.target.closest('[data-page]');
  if (p) {
    const page = p.dataset.page;
    if (page) {
      e.preventDefault();
      /* Hanya set hash — hashchange listener yang render */
      location.hash = page;
      return;
    }
  }

  const b = e.target.closest('[data-action]');
  if (!b) return;

  const act = b.dataset.action;

  /* ---- SWITCH TAB KATALOG ---- */
  if (act === 'switch-tab') {
    _catalogTab = b.dataset.tab || 'lost-found';
    const role  = document.body.dataset.role || 'user';
    $('#pageContent').innerHTML = catalogPage(_catalogTab);
    bindPage(role, 'catalog');

    /* Update active state tombol tab */
    $$('.tab-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.tab === _catalogTab)
    );
    return;
  }

  /* ---- DETAIL LAPORAN / BARANG ---- */
  if (act === 'inspect') {
    const allItems = [...demoItems, ...getReportsStore()];
    const item = allItems.find(i => i.id === b.dataset.id);

    if (item) {
      const role    = document.body.dataset.role || 'user';
      const canClaim = role === 'user' &&
                       item.type === 'Barang temuan' &&
                       item.status !== 'Selesai';

      const body = `
        <p class="muted" style="margin-top:0">${item.id} · ${item.date}</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:4px">KATEGORI</div>
            <span class="status ${item.type === 'Barang hilang' ? 'red' : item.type === 'Kerusakan fasilitas' ? '' : 'blue'}">
              ${item.type}
            </span>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:4px">STATUS</div>
            <span class="status ${statusClass(item.status)}">${item.status}</span>
          </div>
        </div>

        <p><b>Lokasi:</b> ${item.place}</p>
        ${item.desc ? `<p style="font-size:12px;background:#f8faf9;border-radius:8px;padding:12px;line-height:1.6">${item.desc}</p>` : ''}
        <p style="font-size:11px;color:var(--muted)"><b>Dilaporkan oleh:</b> ${item.owner}</p>

        ${canClaim ? `
          <div style="margin-top:12px;padding:12px;background:#edf8ff;border-radius:8px;border:1px solid #c7e4ff">
            <b style="font-size:12px">Apakah ini barang Anda?</b>
            <p style="font-size:11px;color:var(--muted);margin:6px 0 10px">
              Klik "Ajukan Klaim" untuk memulai proses pengambilan barang.
            </p>
            <button class="btn primary small"
                    data-action="claim-item"
                    data-id="${item.id}"
                    data-name="${item.name}">
              ◈ Ajukan Klaim Barang Ini
            </button>
          </div>
        ` : ''}
      `;

      showModal(item.name, body, 'Tutup');
    }
    return;
  }

  /* ---- AJUKAN KLAIM BARANG ---- */
  if (act === 'claim-item') {
    const itemId   = b.dataset.id;
    const itemName = b.dataset.name || demoItems.find(i => i.id === itemId)?.name || 'Barang';

    /* Tutup modal detail jika terbuka */
    document.querySelector('.modal-backdrop')?.remove();

    const back = document.createElement('div');
    back.className = 'modal-backdrop';

    back.innerHTML = `
      <div class="modal" style="width:min(100%,520px)">
        <h2>Ajukan Klaim — ${itemName}</h2>
        <p class="muted" style="font-size:12px;margin-top:-6px">
          Berikan bukti kepemilikan agar petugas dapat memverifikasi.
        </p>

        <form class="claim-form" id="claimForm">
          <div class="field" style="margin-bottom:14px">
            <label style="font-size:11px;font-weight:700;display:block;margin-bottom:6px">
              Ciri khusus barang Anda *
            </label>
            <textarea id="claimDesc" required
              placeholder="Contoh: Ada goresan di sudut kanan, sticker berwarna biru, isinya KTM atas nama Nadia dan dua kartu ATM...">
            </textarea>
          </div>

          <div class="field" style="margin-bottom:4px">
            <label style="font-size:11px;font-weight:700;display:block;margin-bottom:6px">
              Foto bukti kepemilikan (opsional)
            </label>
            <p class="muted" style="font-size:10px;margin:0 0 8px">
              Nota pembelian, foto lama bersama barang, atau foto isi barang.
            </p>
            <input type="file" accept="image/*" id="claimPhoto" style="font-size:11px">
          </div>
        </form>

        <div class="modal-actions">
          <button class="btn outline" id="claimCancel">Batal</button>
          <button class="btn primary" id="claimSubmit">Kirim pengajuan klaim →</button>
        </div>
      </div>
    `;

    document.body.append(back);

    back.querySelector('#claimCancel').onclick = () => back.remove();

    back.querySelector('#claimSubmit').onclick = () => {
      const desc = back.querySelector('#claimDesc').value.trim();
      if (!desc) {
        toast('Harap isi ciri khusus barang Anda.');
        return;
      }

      /* Generate kode klaim unik */
      const code = generateCode(6);
      const item = demoItems.find(i => i.id === itemId);
      const dateStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      const newClaim = {
        claimCode : code,
        itemId,
        itemName,
        place     : item?.place || '',
        desc,
        status    : 'Menunggu verifikasi',
        date      : dateStr
      };

      const claims = getClaimsStore();
      claims.push(newClaim);
      saveClaimsStore(claims);

      back.remove();

      /* Tampilkan hasil kode klaim */
      const resultBack = document.createElement('div');
      resultBack.className = 'modal-backdrop';
      resultBack.innerHTML = `
        <div class="modal" style="width:min(100%,480px);text-align:center">
          <div class="success-icon" style="margin:0 auto 14px">✓</div>
          <h2 style="margin:0 0 8px">Klaim berhasil diajukan!</h2>
          <p class="muted" style="font-size:12px;margin:0 0 4px">
            Tunjukkan kode ini ke petugas posko satpam untuk mengambil barang.
          </p>

          <div class="claim-result-box">
            <div style="font-size:11px;color:var(--muted)">Kode klaim Anda</div>
            <div class="claim-code-display">${code}</div>
            <small style="color:var(--muted)">Gedung Rektorat Lt. 1 · Senin–Jumat 07.00–17.00</small>
          </div>

          <div class="modal-actions" style="justify-content:center;gap:10px;margin-top:18px">
            <button class="btn outline" id="claimCopyCode" data-code="${code}">
              Salin kode
            </button>
            <button class="btn primary" id="claimGoTicket">
              Lihat Tiket Klaim →
            </button>
          </div>
        </div>
      `;

      document.body.append(resultBack);

      resultBack.querySelector('#claimCopyCode').onclick = () => {
        navigator.clipboard?.writeText(code);
        toast('Kode klaim disalin: ' + code);
      };

      resultBack.querySelector('#claimGoTicket').onclick = () => {
        resultBack.remove();
        location.hash = 'claims';
      };
    };

    return;
  }

  /* ---- EKSPOR LAPORAN (CSV) ---- */
  if (act === 'export') {
    const allItems = [...demoItems, ...getReportsStore()];
    /* Escape CSV field agar aman dari CSV injection */
    const escapeCsv = v => `"${String(v).replace(/"/g, '""')}"`;

    const csv =
      'ID,Nama,Kategori,Lokasi,Status,Tanggal\n' +
      allItems.map(i =>
        [i.id, i.name, i.type, i.place, i.status, i.date]
          .map(escapeCsv)
          .join(',')
      ).join('\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `laporan-titipin-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);

    toast('Data laporan diekspor.');
    return;
  }

  /* ---- TAMBAH PENGGUNA ---- */
  if (act === 'add-user') {
    showModal('Tambah pengguna', `
      <div class="field">
        <label>Nama lengkap</label>
        <input placeholder="Nama pengguna">
      </div>
      <div class="field" style="margin-top:12px">
        <label>Email kampus</label>
        <input type="email" placeholder="nama@kampus.ac.id">
      </div>
      <div class="field" style="margin-top:12px">
        <label>Peran</label>
        <select>
          <option>Mahasiswa</option>
          <option>Staf</option>
          <option>Admin Unit</option>
          <option>Super Admin</option>
        </select>
      </div>
    `);
    return;
  }

  /* ---- KELOLA PENGGUNA ---- */
  if (act === 'edit-user') {
    showModal('Kelola pengguna', `
      <div class="field">
        <label>Status akun</label>
        <select>
          <option>Aktif</option>
          <option>Ditangguhkan</option>
        </select>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Peran</label>
        <select>
          <option>Mahasiswa</option>
          <option>Staf</option>
          <option>Admin Unit</option>
          <option>Super Admin</option>
        </select>
      </div>
    `);
    return;
  }

  /* ---- TAMBAH LOKASI ---- */
  if (act === 'add-location') {
    showModal('Tambah lokasi', `
      <div class="field">
        <label>Nama lokasi / unit</label>
        <input placeholder="Contoh: Gedung D">
      </div>
      <div class="field" style="margin-top:12px">
        <label>Jenis</label>
        <select>
          <option>Gedung</option>
          <option>Fasilitas</option>
          <option>Unit layanan</option>
        </select>
      </div>
    `);
    return;
  }

  /* ---- SALIN KODE KLAIM ---- */
  if (act === 'copy-code') {
    const code = b.dataset.code || 'A7K3FP';
    navigator.clipboard?.writeText(code);
    toast('Kode klaim disalin: ' + code);
    return;
  }
});

/* -------------------------------------------------------
   LOGIN FORM (jika ada halaman login terpisah)
------------------------------------------------------- */

const loginForm = $('#loginForm');
if (loginForm) {
  const togglePass = $('#togglePass');

  if (togglePass) {
    togglePass.onclick = () => {
      const i = $('#password');
      i.type = i.type === 'password' ? 'text' : 'password';
      togglePass.textContent = i.type === 'password' ? 'Lihat' : 'Sembunyikan';
    };
  }

  loginForm.onsubmit = e => {
    e.preventDefault();
    toast('Login demo berhasil. Pilih peran di bagian bawah.');
  };
}

/* -------------------------------------------------------
   SSO / TOMBOL KHUSUS
------------------------------------------------------- */

$('#sso')?.addEventListener('click', () => {
  toast('SSO kampus tersedia setelah backend dihubungkan.');
});

$('#bell')?.addEventListener('click', () => {
  const claims  = getClaimsStore();
  const newCount = claims.length;
  showModal(
    'Notifikasi',
    `<p>• 2 laporan baru menunggu pemeriksaan.</p>
     <p>• Tiket klaim A7K3FP menunggu verifikasi.</p>
     ${newCount > 0 ? `<p>• ${newCount} klaim baru yang Anda ajukan sedang diproses.</p>` : ''}`,
    'Tandai dibaca'
  );
});

/* -------------------------------------------------------
   SIDEBAR MOBILE (toggle overlay)
------------------------------------------------------- */

$('#menuBtn')?.addEventListener('click', () => {
  const sidebar = $('#sidebar');
  const overlay = $('#sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
});

document.addEventListener('click', e => {
  if (e.target.id === 'sidebarOverlay') {
    $('#sidebar')?.classList.remove('open');
    $('#sidebarOverlay')?.classList.remove('open');
  }
});

/* -------------------------------------------------------
   INISIALISASI DASHBOARD
------------------------------------------------------- */

if (document.body.dataset.role) {
  const role = document.body.dataset.role;

  document.querySelector('#app').innerHTML = shell(role);

  const pg = location.hash.slice(1) || 'home';
  renderPage(role, pg);

  window.addEventListener('hashchange', () => {
    renderPage(role, location.hash.slice(1) || 'home');
  });
}
