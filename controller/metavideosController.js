// Require Modules
const uuid = require('uuid/v4')
const axios = require('axios')
const {
    check,
    validationResult
} = require('express-validator');


module.exports = {
    validate: (method) => {
        switch (method) {
            case "store":
                return [
                    check('duration', 'The fields duration is required').exists(),
                    check('file_path', 'The fields file_path is required').exists(),
                    check('size', 'The fields size is required').exists(),
                    check('file_name', 'The fields file_name is required').exists(),
                    check('format', 'The fields format is required').exists(),
                    check('resolution', 'The fields resolution is required').exists()
                ]
                break;
            case "update":
                return [
                    check('metadata_id', 'The fields metadata_id is required').exists(),
                    check('metavideo_id', 'The fields metavideo_id is required').exists()
                ]
        }
    },
    get: async (req, res, next) => {
        try {
            // get api endpoint
            const dbil = process.env.DBIL_API + 'content/metadata/'

            // Get Metadata By Id
            let axiosReq = await axios.get(dbil + req.params.id)

            // check status Request
            if (axiosReq.status !== 200) {
                res.send({
                    "status": {
                        "code": 503,
                        "message": "Bad Gateway"
                    }
                })
            }
            if (axiosReq.data.code && axiosReq.data.code !== 200) {
                res.send(axiosReq.data)
            }

            // Get Metavideos
            let metavideos = axiosReq.data.metavideos

            // return response
            res.send({
                status: {
                    code: 200,
                    message: "get metavideos success"
                },
                result: {
                    total: metavideos.length,
                    metavideos: metavideos
                }
            })
        } catch (error) {
            next(error)
        }
    },
    store: async (req, res, next) => {
        // check validation
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                code: 422,
                success: false,
                message: errors.array()
            });
        }

        try {
            // get api endpoint
            const dbil = process.env.DBIL_API + 'content/metadata/'

            // Get Metadata By Id
            let axiosReq = await axios.get(dbil + req.params.id)

            // check status Request
            if (axiosReq.status !== 200) {
                res.send({
                    "status": {
                        "code": 503,
                        "message": "Bad Gateway"
                    }
                })
            }
            if (axiosReq.data.code && axiosReq.data.code !== 200) {
                res.send(axiosReq.data)
            }

            // Get Metavideos
            let metavideos = axiosReq.data.metavideos ? axiosReq.data.metavideos : []


            // Get Time
            const now = new Date().toISOString();

            // Set New video Id
            var newVideo_id = uuid()

            // New Metavideos
            let newMetavideos = [{
                "duration": req.body.duration,
                "file_path": req.body.file_path,
                "size": req.body.size,
                "updated_at": now,
                "file_name": req.body.file_name,
                "format": req.body.format,
                "created_at": now,
                "id": newVideo_id,
                "resolution": req.body.resolution
            }]

            // Contact Old Metavideos And New Metavideos
            const axiosSet = metavideos.concat(newMetavideos)

            // Set Metavideos
            await axios({
                method: "post",
                url: dbil + 'update/' + req.params.id,
                data: {
                    "metavideos": axiosSet
                }
            })

            // return response
            return res.send({
                "status": {
                    "code": 200,
                    "message": "upload success"
                },
                "result": {
                    "video_id": newVideo_id
                }
            })
        } catch (error) {
            next(error)
        }
    },

    update: async (req, res, next) => {
        // check validation
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                code: 422,
                success: false,
                message: errors.array()
            });
        }

        try {
            // get api endpoint
            const dbil = process.env.DBIL_API + 'content/metadata/'

            // Get Metadata By Id
            let axiosReq = await axios.get(dbil + req.body.metadata_id)

            // check status Request
            if (axiosReq.status !== 200) {
                res.send({
                    "status": {
                        "code": 503,
                        "message": "Bad Gateway"
                    }
                })
            }
            if (axiosReq.data.code && axiosReq.data.code !== 200) {
                res.send(axiosReq.data)
            }

            // Get Metavideos
            let metavideos = axiosReq.data.metavideos ? axiosReq.data.metavideos : []


            // Get Time
            const now = new Date().toISOString();

            //  Search Old Metavideo
            let oldVideo
            metavideos = metavideos.filter((items) => {
                if (items.id === req.body.metavideo_id) {
                    oldVideo = items
                }
                return items.id !== req.body.metavideo_id
            })
            if (!oldVideo) {
                return res.send({
                    status: {
                        code: 404,
                        message: "Metavideo Not Found"
                    }
                })
            }

            // New Metavideos
            let newMetavideos = [{
                "duration": req.body.duration ? req.body.duration : oldVideo.duration,
                "file_path": req.body.file_path ? req.body.file_path : oldVideo.file_path,
                "size": req.body.size ? req.body.size : oldVideo.size,
                "updated_at": now,
                "file_name": req.body.file_name ? req.body.file_name : oldVideo.file_name,
                "format": req.body.format ? req.body.format : oldVideo.format,
                "created_at": oldVideo.created_at,
                "id": oldVideo.id,
                "resolution": req.body.resolution ? req.body.resolution : oldVideo.resolution
            }]

            // Concat Old Metavideos And New Metavideos
            const axiosSet = metavideos.concat(newMetavideos)

            // Set Metavideos
            await axios({
                method: "post",
                url: dbil + 'update/' + req.params.id,
                data: {
                    "metavideos": axiosSet
                }
            })

            // return response
            return res.send({
                "status": {
                    "code": 200,
                    "message": "update success"
                }
            })
        } catch (error) {
            next(error)
        }
    },

    delete: async (req, res, next) => {
        // check validation
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                code: 422,
                success: false,
                message: errors.array()
            });
        }

        try {
            // get api endpoint
            const dbil = process.env.DBIL_API + 'content/metadata/'

            // Get Metadata By Id
            let axiosReq = await axios.get(dbil + req.body.metadata_id)

            // check status Request
            if (axiosReq.status !== 200) {
                res.send({
                    "status": {
                        "code": 503,
                        "message": "Bad Gateway"
                    }
                })
            }
            if (axiosReq.data.code && axiosReq.data.code !== 200) {
                res.send(axiosReq.data)
            }

            // Get Metavideos
            let metavideos = axiosReq.data.metavideos ? axiosReq.data.metavideos : []

            //  Search Old Metavideo
            let oldVideo
            metavideos = metavideos.filter((items) => {
                if (items.id === req.body.metavideo_id) {
                    oldVideo = items
                }
                return items.id !== req.body.metavideo_id
            })
            if (!oldVideo) {
                return res.send({
                    status: {
                        code: 404,
                        message: "Metavideo Not Found"
                    }
                })
            }

            // Set Metavideos
            let axiosSet = metavideos
            await axios({
                method: "post",
                url: dbil + 'update/' + req.params.id,
                data: {
                    "metavideos": axiosSet
                }
            })

            // return response
            return res.send({
                "status": {
                    "code": 200,
                    "message": "delete success"
                }
            })
        } catch (error) {
            next(error)
        }
    }
}