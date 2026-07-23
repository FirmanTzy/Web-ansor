const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const { Admin } = require('../models');

// ── Konfigurasi Nodemailer ──────────────────────────────────────────────────
function createTransporter() {
  // Untuk development, gunakan Ethereal (https://ethereal.email/) atau
  // gunakan SMTP riil via env vars.
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: dump email ke console (development saja)
  return {
    sendMail: async (mailOptions) => {
      // eslint-disable-next-line no-console
      console.log('═══════════════════════════════════════════════');
      // eslint-disable-next-line no-console
      console.log('📧 NODEMAILER FALLBACK (no SMTP configured)');
      // eslint-disable-next-line no-console
      console.log(`To       : ${mailOptions.to}`);
      // eslint-disable-next-line no-console
      console.log(`Subject  : ${mailOptions.subject}`);
      // eslint-disable-next-line no-console
      console.log(`Body     :\n${mailOptions.html || mailOptions.text}`);
      // eslint-disable-next-line no-console
      console.log('═══════════════════════════════════════════════');
    },
  };
}

// ── Login ───────────────────────────────────────────────────────────────────
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  const admin = await Admin.findOne({ where: { username } });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    subject: String(admin.id),
  });

  return res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
    },
  });
}

// ── Helper: Generate 6-digit OTP ────────────────────────────────────────────
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── Lupa Password (kirim OTP ke email) ─────────────────────────────────────
async function forgotPassword(req, res) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username / email harus diisi.' });
  }

  // Cari admin berdasarkan username (email)
  const admin = await Admin.findOne({ where: { username } });
  if (!admin) {
    // Jangan beri tahu apakah username terdaftar atau tidak (security)
    return res.json({
      message:
        'Jika username terdaftar, kode OTP akan dikirim ke email admin.',
    });
  }

  // Generate 6-digit OTP
  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

  // Simpan OTP (hash) ke field resetPasswordToken yang sudah ada
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  admin.resetPasswordToken = hashedOtp;
  admin.resetPasswordExpires = otpExpires;
  await admin.save();

  // Kirim email berisi OTP
  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"GP Ansor Kujorowesi" <noreply@ansor-kujorowesi.id>',
      to: username,
      subject: 'Kode OTP Reset Password - GP Ansor Ranting Kujorowesi',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#008000;">Kode OTP Reset Password</h2>
          <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun GP Ansor Ranting Kujorowesi.</p>
          <div style="text-align:center;margin:32px 0;">
            <div style="background:#f0fdf4;border:2px dashed #008000;border-radius:12px;padding:20px 32px;display:inline-block;">
              <span style="font-size:32px;font-weight:900;letter-spacing:8px;color:#008000;font-family:monospace;">${otp}</span>
            </div>
          </div>
          <p>Masukkan kode OTP di atas pada halaman reset password.</p>
          <p>Kode ini berlaku selama <strong>5 menit</strong>.</p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="font-size:12px;color:#94a3b8;">GP Ansor Ranting Kujorowesi</p>
        </div>
      `,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Gagal mengirim email OTP:', err);
    // Tetap beri respon sukses ke client (security)
  }

  return res.json({
    message:
      'Jika username terdaftar, kode OTP akan dikirim ke email admin.',
  });
}

// ── Verifikasi OTP ─────────────────────────────────────────────────────────
async function verifyOtp(req, res) {
  const { username, otp } = req.body;

  if (!username || !otp) {
    return res.status(400).json({ message: 'Username dan kode OTP harus diisi.' });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: 'Kode OTP harus berupa 6 digit angka.' });
  }

  // Cari admin berdasarkan username
  const admin = await Admin.findOne({ where: { username } });
  if (!admin) {
    return res.status(400).json({ message: 'Kode OTP tidak valid atau sudah kedaluwarsa.' });
  }

  // Cek apakah OTP expires
  if (!admin.resetPasswordExpires || new Date() > admin.resetPasswordExpires) {
    return res.status(400).json({ message: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.' });
  }

  // Verifikasi OTP (hash comparison)
  const hashedOtpInput = crypto.createHash('sha256').update(otp).digest('hex');
  if (admin.resetPasswordToken !== hashedOtpInput) {
    return res.status(400).json({ message: 'Kode OTP yang dimasukkan salah.' });
  }

  // Generate temporary token for password reset (valid 10 menit)
  const tempToken = crypto.randomBytes(32).toString('hex');
  admin.resetPasswordToken = tempToken;
  // Perpanjang expiry untuk proses reset password
  admin.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
  await admin.save();

  return res.json({
    message: 'Kode OTP valid.',
    tempToken,
  });
}

// ── Reset Password ─────────────────────────────────────────────────────────
async function resetPassword(req, res) {
  const { tempToken, password, passwordConfirm } = req.body;

  if (!tempToken) {
    return res.status(400).json({ message: 'Token reset diperlukan. Lakukan verifikasi OTP terlebih dahulu.' });
  }

  if (!password || !passwordConfirm) {
    return res.status(400).json({ message: 'Password dan konfirmasi password harus diisi.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter.' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Password dan konfirmasi password tidak cocok.' });
  }

  // Cari admin berdasarkan tempToken yang belum expired
  const admin = await Admin.findOne({
    where: {
      resetPasswordToken: tempToken,
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!admin) {
    return res.status(400).json({ message: 'Sesi reset password tidak valid atau sudah kedaluwarsa. Silakan ulangi dari awal.' });
  }

  // Hash password baru
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  admin.password = hashedPassword;
  admin.resetPasswordToken = null;
  admin.resetPasswordExpires = null;
  await admin.save();

  return res.json({ message: 'Password berhasil direset. Silakan login dengan password baru.' });
}

module.exports = {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};

