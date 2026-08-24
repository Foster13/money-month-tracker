# 🚀 Project Update & Version History

## 📦 Current Version: v1.1.5 (Cloud Sync & Auth Update)

### ✨ What's New & Upgraded (This Session)

1. **Supabase Cloud Sync (Cross-Device)**
   - Created Supabase PostgreSQL schema (`transactions`, `user_preferences`) and locked the core architecture.
   - Upgraded `transactionStore.ts` to seamlessly sync with the database while preserving `localStorage` as an offline cache.
   - Used "Optimistic UI + Fire-and-forget" approach: interactions feel instantaneous while syncing happens in the background.
2. **Global AuthGuard & Login UI**
   - Built a lightweight `AuthGuard` wrapper to intercept and protect routes without heavy Next.js middleware.
   - Designed a modern gradient login/register form with native HTML5 form validation.
   - Added secure session persistence that automatically pulls cloud data upon login.
3. **Month-over-Month Comparisons**
   - Implemented `subMonths` calculations (date-fns) in `Dashboard.tsx`.
   - Added inline `+/- %` comparison text directly into `Summary.tsx` widget cards for an instant financial health check (YAGNI approach: avoided making a dedicated page).

---

## 🔮 Next Upgrades (Future Versions)

### ✅ v1.2.0: PWA & Offline Readiness (Completed)

- **Service Workers & PWA Manifest**: Setup completed (`next-pwa`). App is installable on Mobile and Desktop.
- **Offline Caching**: Configured via Workbox to handle core assets and data resilience.
- **Production Deployment**: Ready for Vercel deployment.

### 🗑️ v1.3.0: Security & Data Privacy (Scrapped - YAGNI)

- _Data Encryption / PIN / Auto Backup_: Dropped. We already have **Supabase Auth** & **Cloud Sync**. LocalStorage is inherently sandboxed. No need for over-engineered crypto-bloat or redundant JSON backups when we have a live PostgreSQL database. OS-level lock screens render in-app PINs redundant.

### ⏳ Next Action: User-Driven Updates

- Currently waiting for actual user feedback post-deployment.
- _Note:_ Code is clean. Let's not add features until a user explicitly complains about a problem.
