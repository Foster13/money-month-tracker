# Money Month Tracker - Project Review & Next Updates

Berdasarkan analisis menyeluruh terhadap arsitektur, _codebase_, dan insiden _bug_ terakhir (JWT bloat), berikut adalah hasil _review_ project **Money Month Tracker** beserta daftar perbaikan/fitur yang direkomendasikan untuk pengembangan selanjutnya (berdasarkan prinsip _Test-Driven Development_ & _Webapp Testing_).

## 📊 Project Assessment (Rating: 7/10)

**Hal-hal yang sudah baik (Positives):**

- **Tech Stack Modern:** Penggunaan Next.js 14, TailwindCSS, Radix UI, dan Zustand adalah kombinasi yang sangat solid dan cepat.
- **Optimistic UI:** Implementasi di `transactionStore.ts` sudah menggunakan konsep _Optimistic UI_ (memperbarui _state_ lokal sebelum menunggu _response_ dari database), yang membuat aplikasi terasa sangat cepat di sisi pengguna.
- **Proxy Pattern:** Menggunakan `/api/proxy` untuk _bypass_ pemblokiran _adblocker_ di browser adalah langkah yang cerdas, meskipun memerlukan ketelitian tinggi dalam manajemen _header_ (seperti _bug_ yang baru saja kita perbaiki).

**Area yang Perlu Perbaikan (Negatives):**

- **NOL Test Coverage:** Meskipun _library_ `vitest` dan `@testing-library/react` sudah terpasang di `package.json`, tidak ditemukan satu pun file _test_ (`.test.ts` atau `.spec.ts`) di dalam _project_. Ini sangat melanggar prinsip _Test-Driven Development_ (TDD).
- **Store yang Membengkak (Fat Store):** `transactionStore.ts` melakukan terlalu banyak hal (menyimpan _state_, memanggil API Supabase, sinkronisasi data, dan migrasi kategori).

---

## 🚀 Daftar Improvement untuk `Next Update`

Berikut adalah daftar fitur dan perbaikan teknis yang harus diprioritaskan di _update_ selanjutnya, disusun secara rinci:

### 1. Implementasi Otomatisasi Testing (TDD & E2E)

_Prioritas: Sangat Tinggi 🔴_

Sesuai dengan standar `/test-driven-development` dan `/webapp-testing`, aplikasi keuangan **wajib** memiliki _automated tests_ karena berurusan dengan data uang yang sensitif (tidak boleh ada salah hitung atau transaksi hilang).

- **Unit Testing:** Buat test untuk fungsi-fungsi kalkulasi keuangan dan konversi _exchange rates_.
- **Store Testing:** Test logika di `transactionStore.ts` (apakah _optimistic UI_ di-_revert_ dengan benar jika API gagal?).
- **E2E Webapp Testing:** Gunakan _Playwright_ untuk menguji alur pengguna secara end-to-end: _Login -> Tambah Transaksi Income -> Tambah Transaksi Expense -> Cek Saldo Akhir_.

### 2. Refactoring `transactionStore.ts` & Manajemen Data

_Prioritas: Tinggi 🟠_

Saat ini Zustand menangani _Remote State_ (data dari database) dan _Local State_ (UI state).

- **Solusi:** Pisahkan! Gunakan **TanStack Query (React Query)** untuk mengurus pengambilan data (_fetching_), _caching_, dan _synchronization_ dengan Supabase.
- Biarkan **Zustand** hanya mengurus hal-hal terkait antarmuka (misalnya: _dark mode_, status _sidebar_, atau transaksi mana yang sedang di-_select_).

### 3. Arsitektur Offline-First (PWA Enhancement)

_Prioritas: Menengah 🟡_

Saya melihat `next-pwa` di `package.json`. Namun, karena aplikasi bergantung pada `/api/proxy`, jika pengguna kehilangan sinyal saat menginput transaksi, proses akan gagal dan data hilang.

- **Solusi:** Implementasikan _Service Worker_ dengan **Background Sync Queue**. Jika user _offline_, transaksi disimpan sementara di _IndexedDB_ browser. Begitu sinyal kembali, _Service Worker_ akan otomatis mengirimkan antrean transaksi tersebut ke Supabase.

### 4. Peningkatan Supabase Database Best Practices

_Prioritas: Menengah 🟡_

Berdasarkan _skill_ `/supabase-postgres-best-practices`:

- Pastikan semua tabel (`transactions`, `user_preferences`) sudah mengaktifkan **Row Level Security (RLS)** yang ketat.
- Saat ini `user_preferences` menyimpan konfigurasi (termasuk _categories_ dan _exchangeRates_) dalam bentuk format _JSON_ raksasa. Jika kategori pengguna bertambah banyak, melakukan _query_ atau _update_ ke dalam kolom JSON akan membebani database.
- **Solusi:** Pisahkan tabel kategori menjadi tabel _relational_ tersendiri (`categories` table) dengan relasi _Foreign Key_ ke tabel `transactions`.

### 5. Penyempurnaan Integrasi Bot WhatsApp

_Prioritas: Rendah (Fitur Baru) 🟢_

Saya menemukan ada `src/app/api/wa/route.ts` yang mengindikasikan adanya integrasi WhatsApp.

- **Solusi:** Kembangkan fitur **NLP (Natural Language Processing)** sederhana atau integrasikan dengan AI (seperti Gemini/OpenAI) agar pengguna cukup chat: _"Makan siang pake ayam geprek 25ribu"_. Bot otomatis mengenali nominal `25000`, kategori `Food`, tipe `Expense`, dan otomatis menyimpannya ke Supabase.

---

_Dokumen ini dibuat menggunakan pendekatan analitis dari Antigravity Agent untuk membantu perencanaan roadmap project ke depan._
