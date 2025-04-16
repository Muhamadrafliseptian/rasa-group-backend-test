const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/inventory/InventoryController');

router.post('/', inventoryController.addBookStock);
router.get('/', inventoryController.getAllInventory);
router.get('/:id', inventoryController.getInventoryById);
router.put('/:id', inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);
module.exports = router;
