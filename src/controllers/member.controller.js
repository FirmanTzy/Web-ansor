const { Member } = require('../models');

async function getMembers(req, res) {
  const members = await Member.findAll({ order: [['id', 'DESC']] });
  return res.json(members);
}

async function createMember(req, res) {
  const { nama, jabatan, status_keanggotaan } = req.body;

  if (!nama) {
    return res.status(400).json({ message: 'nama is required' });
  }

  const member = await Member.create({
    nama,
    jabatan: jabatan ?? null,
    status_keanggotaan: status_keanggotaan ?? 'Aktif',
  });

  return res.status(201).json(member);
}

module.exports = {
  getMembers,
  createMember,
};

