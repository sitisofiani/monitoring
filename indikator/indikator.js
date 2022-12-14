const express = require("express");
const router = express.Router();
const database = require("../config/database");
const validasi_data = require("./validasi_data");
const verifikasi_validasi_data = require("../middleware/verifikasi_validasi_data");

router.get('/', async (req, res) => {
    try {
        const result = await database
            .select(
                "indikator.id_indikator",
                "indikator.nama_indikator",
                "jenis_device.nama_jenis",
                "indikator.satuan",
                "indikator.minimum",
                "indikator.maksimum",
                "indikator.status",
                "indikator.icon",
                "device.nama_device",
            )
            .from('tb_indikator as indikator')
            .leftJoin('tb_device as device', 'indikator.id_device', 'device.id_device')
            .leftJoin('tb_jenis_device as jenis_device', 'device.id_jenis_device', 'jenis_device.id_jenis_device')
            .where('indikator.status', 'a')
            .modify(function (queryBuilder) {
                if (req.query.cari) {
                    queryBuilder.where('indikator.nama_indikator', 'like', '%' + req.query.cari + '%')
                        .orWhere('indikator.satuan', 'like', '%' + req.query.cari + '%')
                }
            })
            .paginate({
                perPage: parseInt(req.query.limit) || 5000,
                currentPage: req.query.page || null,
                isLengthAware: true
            });

        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: result.data,
            per_page: result.pagination.perPage,
            total_pages: req.query.limit ? result.pagination.to : null,
            total_data: req.query.limit ? result.pagination.total : null
        })

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

// Get All indikator by id Device
router.get('/device/:id_device', async (req, res) => {
    try {
        const result = await database
            .select(
                "indikator.id_indikator",
                "indikator.nama_indikator",
                "indikator.satuan",
                "indikator.minimum",
                "indikator.maksimum",
                "indikator.status",
                "indikator.icon",
            )
            .from('tb_indikator as indikator')
            .where('indikator.status', 'a')
            .where('indikator.id_device', req.params.id_device)

        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: result,
        })

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.post('/', validasi_data.data, verifikasi_validasi_data, async (req, res) => {
    const data = req.body;
    const input = {
        ...data,
        status: "a",
        created_at: new Date(),
        updated_at: new Date
    }
    try {
        const simpan = await database("tb_indikator").insert(input);
        if (simpan) {
            return res.status(201).json({
                status: 1,
                message: "Berhasil",
                result: {
                    id_indikator: simpan[0],
                    ...input
                }
            })
        } else {
            return res.status(422).json({
                status: 0,
                message: "Gagal simpan",
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.put('/:id_indikator', validasi_data.edit_data, verifikasi_validasi_data, async (req, res) => {
    const data = req.body;
    data.updated_at = new Date();
    try {
        const result = await database("tb_indikator").where('id_indikator', req.params.id_indikator).first();
        if (result) {
            await database("tb_indikator").update(data).where('id_indikator', req.params.id_indikator);
            return res.status(201).json({
                status: 1,
                message: "Berhasil"
            })
        } else {
            return res.status(422).json({
                status: 0,
                message: "Data tidak ditemukan",
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.delete('/:id_indikator', async (req, res) => {
    const data = {
        status: "t",
        updated_at: new Date()
    }
    try {
        const update = await database("tb_indikator").update(data).where('id_indikator', req.params.id_indikator);
        if (update) {
            return res.status(201).json({
                status: 1,
                message: "Berhasil",
            })
        } else {
            return res.status(422).json({
                status: 0,
                message: "Gagal",
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.get('/:id_indikator', async (req, res) => {
    try {
        const result = await database
            .select(
                "indikator.id_indikator",
                "indikator.nama_indikator",
                "indikator.satuan",
                "indikator.minimum",
                "indikator.maksimum",
                "indikator.status",
                "indikator.icon",
                "device.id_device",
            )
            .from('tb_indikator as indikator')
            .leftJoin('tb_device as device', 'indikator.id_device', 'device.id_device')
            .where('indikator.status', 'a')
            .andWhere('indikator.id_indikator', req.params.id_indikator)
            .first();

        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: result
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});


module.exports = router;