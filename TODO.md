# TODO: Implementasi Reset Password dengan OTP

## Steps

- [x] 1. Analisis kode yang ada
- [x] 2. Perencanaan dan persetujuan
- [x] 3. Model Admin - Field `resetPasswordToken` dan `resetPasswordExpires` sudah ada (reuse untuk OTP)
- [x] 4. Update Auth Controller - modifikasi `forgotPassword` (kirim OTP), tambah `verifyOtp`, update `resetPassword` (via tempToken)
- [x] 5. Update Auth Routes - tambah endpoint `/verify-otp`, ubah `/reset-password/:token` jadi `/reset-password` (POST body)
- [x] 6. Redesign forgot-password.html - multi-step OTP flow (Step 1: Kirim OTP, Step 2: Verifikasi OTP, Step 3: Reset Password)
- [x] 7. Update reset-password.html - redirect ke forgot-password dengan penjelasan
- [ ] 8. Testing dan verifikasi

## Catatan

- **OTP**: 6 digit angka, berlaku 5 menit, di-hash SHA256 sebelum disimpan di DB
- **TempToken**: Dihasilkan setelah OTP valid, berlaku 10 menit untuk sesi reset password
- **Keamanan**: OTP di-hash, respon ambigu untuk mencegah user enumeration

