/* ROUTING HALAMAN */

function contentFor(role, page) {
  if (page === 'home') {
    return role === 'user' ? homeUser()
      : role === 'admin' ? homeAdmin()
      : homeSuper();
  }

  if (page === 'catalog') return catalogPage();
  if (page === 'report') return reportForm();
  if (page === 'reports') return reportsPage(role);
  if (page === 'verify') return verifyPage();
  if (page === 'analytics') return analyticsPage(role);
  if (page === 'profile') return profilePage(role);
  if (page === 'users') return usersPage();
  if (page === 'settings') return settingsPage();

  if (page === 'claims') {
    return `
      ${heading(
        'Tiket klaim',
        'Lihat tiket dan kode klaim barang Anda.'
      )}

      <section class="panel" style="max-width:650px;text-align:center;padding:28px">
        <div style="font-size:42px">◈</div>
        <h2>Dompet Hitam</h2>
        <p class="muted">Perpustakaan · Lantai 2</p>

        <div class="timeline">
          <div class="timeline-step active">
            ✓<br>Laporan dibuat
          </div>
          <div class="timeline-step active">
            ✓<br>Klaim diajukan
          </div>
          <div class="timeline-step">
            3<br>Serah terima
          </div>
        </div>

        <p class="muted">Kode klaim Anda</p>
        <h1 style="letter-spacing:7px;color:var(--navy)">A7K3FP</h1>

        <button class="btn primary" data-action="copy-code">
          Salin kode
        </button>
      </section>
    `;
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

  return homeAdmin();
}

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

/* EVENT DAN INTERAKSI HALAMAN */

function bindPage(role, page) {
  const search = $('#tableSearch');
  const filter = $('#statusFilter');

  if (search) {
    const update = () => {
      const q = search.value.toLowerCase();
      const st = filter?.value || '';

      const list = demoItems.filter(i =>
        `${i.id} ${i.name} ${i.type} ${i.place}`
          .toLowerCase().includes(q) &&
        (!st || i.status === st)
      );

      const visible = role === 'user'
        ? list.filter(i =>
            ['TP-1042', 'TP-1038', 'TP-1036'].includes(i.id))
        : list;

      const panel = $('#tablePanel');

      if (panel) {
        panel.innerHTML = table(visible);
      }
    };

    search.addEventListener('input', update);
    filter?.addEventListener('change', update);
  }

  const cs = $('#catalogSearch');

  if (cs) {
    const update = () => {
      const q = cs.value.toLowerCase();
      const cat = $('#categoryFilter').value;
      const loc = $('#locationFilter').value;

      const list = demoItems.filter(i =>
        `${i.name} ${i.place}`.toLowerCase().includes(q) &&
        (!cat || i.type === cat) &&
        (!loc || i.place.toLowerCase().includes(loc.toLowerCase()))
      );

      $('#catalogGrid').innerHTML = list.length
        ? list.map(itemCard).join('')
        : '<div class="empty">Tidak ada barang yang cocok.</div>';
    };

    cs.addEventListener('input', update);
    $('#categoryFilter').addEventListener('change', update);
    $('#locationFilter').addEventListener('change', update);
  }

  $('#reportForm')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Laporan berhasil dikirim (mode demo).');
    setTimeout(() => location.hash = 'reports', 800);
  });

  $('#verifyForm')?.addEventListener('submit', e => {
    e.preventDefault();

    const code = $('#claimCode').value.toUpperCase();
    const res = $('#verifyResult');

    res.innerHTML = code === 'A7K3FP'
      ? `<div style="margin-top:18px;padding:14px;background:#edf8e8;border-radius:8px">
          <b>✓ Kode valid</b>
          <p class="muted">Dompet Hitam · Nadia Putri</p>
          <button class="btn primary" id="confirmHand">
            Konfirmasi serah terima
          </button>
        </div>`
      : '<p style="color:#c55b54;font-size:12px;margin-top:15px">Kode tidak ditemukan. Periksa kembali tiket klaim.</p>';

    $('#confirmHand')?.addEventListener('click', () => {
      toast('Serah terima berhasil dikonfirmasi.');
      res.innerHTML = '<span class="status green">Klaim selesai</span>';
    });
  });

  $('#profileForm')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Profil berhasil disimpan (mode demo).');
  });

  $('#settingsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Pengaturan tersimpan (mode demo).');
  });

  $('#periodSelect')?.addEventListener('change', () => {
    toast('Periode analitik diubah: ' + $('#periodSelect').value);
  });
}