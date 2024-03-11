'use strict';

const express = require('express');

const dataModules = require('../schemas/index-models');
const basicAuth = require('../../src/auth/middleware/basic.js');
const bearerAuth = require('../../src/auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;

  console.log('modelName from v1.js:', modelName);

  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', basicAuth, handleGetAll);
router.get('/:model/:id', basicAuth, handleGetOne);
router.post('/:model', bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);


async function handleGetAll(req, res, next) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (error) {
    next(error);
  }
}

async function handleGetOne(req, res, next) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id);
    if(!theRecord) {
      return res.status(404).json({ message: 'Record not found'});
    }
    res.status(200).json(theRecord);
  } catch (error) {
    next(error);
  }
}

async function handleCreate(req, res, next) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    next(error);
  }
}

async function handleUpdate(req, res, next) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj);
    if(!updatedRecord) {
      return res.status(404).json({ message: 'Record not found'});
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }
}

async function handleDelete(req, res, next) {
  try {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    if(!deletedRecord) {
      return res.status(404).json({ message: `Record not found `});
    }
    res.status(200).json({ message: `Record ${id} deleted` });
  } catch (error) {
    next(error);
  }
}

module.exports = router;
