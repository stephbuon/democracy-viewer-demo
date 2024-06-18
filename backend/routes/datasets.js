const express = require('express');
const router = express.Router();
const control = require("../controllers/datasets");
const { authenticateJWT } = require("../middleware/authentication");
const util = require("../util/file_management");

// Route to create a dataset
router.post('/', authenticateJWT, async(req, res, next) => {
    try {
        // Upload file to server
        await util.uploadFile(req, res);

        if (!req.file) {
            // If file failed to upload, throw error
            res.status(400).json({ message: "No uploaded file" });
        } else {
            // Create dataset in database from file
            const result = await control.createDataset(req.file.path, req.user.username);
            res.status(201).json(result);
        }
        
    } catch (err) {
        console.error('Failed to create dataset:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to create a dataset via an api
router.post('/api', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.createDatasetAPI(req.body.endpoint, req.user.username, req.body.token);
        res.status(201).json(result);
    } catch (err) {
        console.error('Failed to create dataset via API:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to upload dataset records into database
router.post('/upload', authenticateJWT, async(req, res, next) => {
    try {
        await control.uploadDataset(req.knex, req.body.table_name, req.body.metadata, req.body.text, req.body.tags, req.user);
        res.status(201).end();
    } catch (err) {
        console.error('Failed to upload dataset:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to add a tag for a dataset
router.post('/tags', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.addTag(req.knex, req.user.username, req.body.dataset, req.body.tags);
        res.status(201).json(result);
    } catch (err) {
        console.error('Failed to add dataset tag:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to add one or more text columns to a dataset
router.post('/text', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.addTextCols(req.knex, req.user.username, req.body.dataset, req.body.cols);
        res.status(201).json(result);
    } catch (err) {
        console.error('Failed to add dataset text column(s):', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to like a dataset
router.post('/like/:table', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.addLike(req.knex, req.user.username, req.params.table);
        res.status(201).json(result);
    } catch (err) {
        console.error('Failed to add dataset text column(s):', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to change dataset metadata
router.put('/metadata/:table', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.updateMetadata(req.knex, req.user.username, req.params.table, req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to update dataset metadata:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to increment a dataset's clicks
router.put('/click/:table', async(req, res, next) => {
    try {
        const result = await control.incClicks(req.knex, req.params.table);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to click on dataset:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get dataset metadata
router.get('/metadata/:table', async(req, res, next) => {
    try {
        const result = await control.getMetadata(req.knex, req.params.table);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to get dataset metadata:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get all unique tags
router.get('/tags/unique', async(req, res, next) => {
    try {
        const results = await control.getUniqueTags(req.knex);
        res.status(200).json(results);
    } catch (err) {
        console.error('Failed to get unique tags:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get all tags for a dataset
router.get('/tags/dataset/:table', async(req, res, next) => {
    try {
        const results = await control.getTags(req.knex, req.params.table);
        res.status(200).json(results);
    } catch (err) {
        console.error('Failed to get dataset tags:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get text columns for a dataset
router.get('/text/:table', async(req, res, next) => {
    try {
        const results = await control.getTextCols(req.knex, req.params.table);
        res.status(200).json(results);
    } catch (err) {
        console.error('Failed to get dataset text columns:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to filter datasets
router.get('/filter/:page', async(req, res, next) => {
    try {
        let results;
        if (req.user) {
            results = await control.getFilteredDatasets(req.knex, req.query, req.user.username, req.params.page);
        } else {
            results = await control.getFilteredDatasets(req.knex, req.query, undefined, req.params.page);
        }
        res.status(200).json(results);
    } catch (err) {
        console.error('Failed to get filtered datasets:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get number of dataset filter results
router.get('/count/filter', async(req, res, next) => {
    try {
        let result;
        if (req.user) {
            result = await control.getFilteredDatasetsCount(req.knex, req.query, req.user.username);
        } else {
            result = await control.getFilteredDatasetsCount(req.knex, req.query, undefined);
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to get filtered datasets count:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to subset a dataset
router.get('/subset/:table/:page/:pageLength', async(req, res, next) => {
    try {
        const results = await control.getSubset(req.knex, req.params.table, req.query, req.user, req.params.page, req.params.pageLength);
        res.status(200).json(results);
    } catch (err) {
        console.error('Failed to get dataset subset:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to download a subset of a dataset
router.get('/download/subset/:table', async(req, res, next) => {
    try {
        // Generate file
        const result = await control.downloadSubset(req.knex, req.params.table, req.query, req.user ? req.user.username : undefined);
        // Download file
        res.status(200).download(result, (err) => {
            // Error handling
            if (err) {
                console.log("Failed to download dataset subset:", err);
                res.status(500).json({ message: err.toString() });
                next();
            }
        });
    } catch (err) {
        console.error('Failed to download dataset subset:', err);
        res.status(500).json({ message: err.toString() });
        next();
    }
});

// Route to get dataset records by ids
router.get('/ids/:table', async(req, res, next) => {
    try {
        const result = await control.getRecordsByIds(req.knex, req.params.table, Array.isArray(req.query.id) ? req.query.id : [ req.query.id ]);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to get dataset ids:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to download a subset of a dataset by ids
router.get('/download/ids/:table', async(req, res, next) => {
    try {
        // Generate file
        const result = await control.downloadIds(req.knex, req.params.table, Array.isArray(req.query.id) ? req.query.id : [ req.query.id ]);
        // Download file
        res.status(200).download(result, (err) => {
            // Error handling
            if (err) {
                console.log("Failed to download dataset ids:", err);
                res.status(500).json({ message: err.toString() });
                next();
            }
        });
    } catch (err) {
        console.error('Failed to download dataset ids:', err);
        res.status(500).json({ message: err.toString() });
        next();
    }
});

// Route to get dataset column names
router.get('/columns/:table', async(req, res, next) => {
    try {
        const result = await control.getColumnNames(req.knex, req.params.table);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to get dataset column names:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get dataset column names
router.get('/columns/:table/values/:column', async(req, res, next) => {
    try {
        const result = await control.getColumnValues(req.params.table, req.params.column);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to get dataset column names:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get the percentage of a data set that has been uploaded to the database
router.get('/upload/:table', async(req, res, next) => {
    try {
        const result = await control.getUploadPercent(req.knex, req.params.table);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to get dataset upload percentage:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to delete a datset and its metadata
router.delete('/:table', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.deleteDataset(req.knex, req.user.username, req.params.table);
        res.status(204).json(result);
    } catch (err) {
        console.error('Failed to get dataset records:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to delete the given tag on the given dataset
router.delete('/:table/tags/:tag', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.deleteTag(req.knex, req.user.username, req.params.table, req.params.tag);
        res.status(204).json(result);
    } catch (err) {
        console.error('Failed to delete tag:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to delete a text col for a dataset
router.delete('/:table/text/:col', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.deleteTextCol(req.knex, req.user.username, req.params.table, req.params.col);
        res.status(204).json(result);
    } catch (err) {
        console.error('Failed to delete text column:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to delete a user's like
router.delete('/like/:table', authenticateJWT, async(req, res, next) => {
    try {
        const result = await control.deleteLike(req.knex, req.user.username, req.params.table);
        res.status(204).json(result);
    } catch (err) {
        console.error('Failed to delete like:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

module.exports = router;