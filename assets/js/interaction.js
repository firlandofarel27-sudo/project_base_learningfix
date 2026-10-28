/* MODAL */

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

  back.querySelector('[data-close]').onclick = () => back.remove();

  back.querySelector('[data-submit]').onclick = () => {
    back.remove();
    toast('Aksi berhasil (mode demo).');
  };
}

/* EVENT GLOBAL */

document.addEventListener('click', e => {
  const p = e.target.closest('[data-page]');

  if (p) {
    const page = p.dataset.page;

    if (page) {
      e.preventDefault();
      location.hash = page;

      renderPage(
        document.body.dataset.role || 'user',
        page
      );

      return;
    }
  }

  const b = e.target.closest('[data-action]');
  if (!b) return;

  const act = b.dataset.action;

  /* DETAIL LAPORAN */

  if (act === 'inspect') {
    const item = demoItems.find(i => i.id === b.dataset.id);

    if (item) {
      showModal(
        item.name,
        `<p class="muted">${item.id} · ${item.date}</p>
         <p><b>Kategori:</b> ${item.type}</p>
         <p><b>Lokasi:</b> ${item.place}</p>
         <p><b>Pelapor:</b> ${item.owner}</p>
         <p><b>Status:</b> ${item.status}</p>`,
        'Tutup'
      );
    }
  }

  /* EKSPOR LAPORAN */

  if (act === 'export') {
    const csv =
      'ID,Nama,Kategori,Lokasi,Status,Tanggal\n' +
      demoItems.map(i =>
        [
          i.id,
          i.name,
          i.type,
          i.place,
          i.status,
          i.date
        ].join(',')
      ).join('\n');

    const a = document.createElement('a');

    a.href = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv' })
    );

    a.download = 'laporan-titipin.csv';
    a.click();

    URL.revokeObjectURL(a.href);

    toast('Data laporan diekspor.');
  }

  /* TAMBAH PENGGUNA */

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
  }

  /* KELOLA PENGGUNA */

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
  }

  /* TAMBAH LOKASI */

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
  }

  /* SALIN KODE KLAIM */

  if (act === 'copy-code') {
    navigator.clipboard?.writeText('A7K3FP');
    toast('Kode klaim: A7K3FP');
  }
});

/* LOGIN */

if ($('#loginForm')) {
  $('#togglePass').onclick = () => {
    const i = $('#password');

    i.type = i.type === 'password'
      ? 'text'
      : 'password';

    $('#togglePass').textContent =
      i.type === 'password'
        ? 'Lihat'
        : 'Sembunyikan';
  };

  $('#loginForm').onsubmit = e => {
    e.preventDefault();
    toast('Login demo berhasil. Pilih peran di bagian bawah.');
  };
}

/* LOGIN SSO KAMPUS */

$('#sso')?.addEventListener('click', () => {
  toast('SSO kampus tersedia setelah backend dihubungkan.');
});

/* NOTIFIKASI */

$('#bell')?.addEventListener('click', () => {
  showModal(
    'Notifikasi',
    '<p>• 2 laporan baru menunggu pemeriksaan.</p><p>• Tiket klaim A7K3FP menunggu verifikasi.</p>',
    'Tandai dibaca'
  );
});

/* MENU MOBILE */

$('#menuBtn')?.addEventListener('click', () => {
  toast('Gunakan menu navigasi di bagian bawah layar.');
});

/* INISIALISASI DASHBOARD */

if (document.body.dataset.role) {
  const role = document.body.dataset.role;

  document.querySelector('#app').innerHTML = shell(role);

  const pg = location.hash.slice(1) || 'home';

  renderPage(role, pg);

  window.addEventListener('hashchange', () => {
    renderPage(
      role,
      location.hash.slice(1) || 'home'
    );
  });
}