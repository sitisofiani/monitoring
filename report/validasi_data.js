const { check } = require("express-validator");

module.exports.data = [
    check('id_indikator').not().isEmpty().withMessage('indikator tidak boleh kosong'),
    check('id_petugas').not().isEmpty().withMessage('petugas tidak boleh kosong'),
    check('nama_report').not().isEmpty().withMessage('nama_report tidak boleh kosong'),
    check('periode').not().not().isEmpty().withMessage('periode tidak boleh kosong')
]

module.exports.edit_data = [
    check('id_indikator').not().isEmpty().withMessage('id_indikator tidak boleh kosong'),
    check('id_petugas').not().isEmpty().withMessage('petugas tidak boleh kosong'),
    check('nama_report').not().isEmpty().withMessage('nama_report tidak boleh kosong'),
    check('periode').not().not().isEmpty().withMessage('periode tidak boleh kosong'),
]