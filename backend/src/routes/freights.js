import express, { Router } from 'express';
import { Freight } from '../models/Freight.js';

const router = Router();

// GET /api/freights - List all freights
router.get('/', async (req, res) => {
  try {
    const { 
      originCity, 
      originState, 
      destinationCity, 
      destinationState, 
      truckType, 
      minValue, 
      maxValue,
      status,
      search 
    } = req.query;
    
    let filter = { isActive: true };
    
    // Filter by origin
    if (originCity) {
      filter['origin.city'] = { $regex: originCity, $options: 'i' };
    }
    if (originState) {
      filter['origin.state'] = { $regex: originState, $options: 'i' };
    }
    
    // Filter by destination
    if (destinationCity) {
      filter['destination.city'] = { $regex: destinationCity, $options: 'i' };
    }
    if (destinationState) {
      filter['destination.state'] = { $regex: destinationState, $options: 'i' };
    }
    
    // Filter by truck type
    if (truckType) {
      filter.truckType = truckType;
    }
    
    // Filter by freight value range
    if (minValue || maxValue) {
      filter.freightValue = {};
      if (minValue) filter.freightValue.$gte = parseFloat(minValue);
      if (maxValue) filter.freightValue.$lte = parseFloat(maxValue);
    }
    
    // Filter by status
    if (status) {
      filter.status = status;
    }
    
    // Search by product name or description
    if (search) {
      filter.$or = [
        { 'product.name': { $regex: search, $options: 'i' } },
        { 'product.type': { $regex: search, $options: 'i' } }
      ];
    }
    
    const freights = await Freight.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: freights,
      count: freights.length
    });
  } catch (error) {
    console.error('Error fetching freights:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar fretes'
    });
  }
});

// GET /api/freights/:id - Get freight by ID
router.get('/:id', async (req, res) => {
  try {
    const freight = await Freight.findById(req.params.id);
    
    if (!freight) {
      return res.status(404).json({
        success: false,
        error: 'Frete não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: freight
    });
  } catch (error) {
    console.error('Error fetching freight:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar frete'
    });
  }
});

// POST /api/freights - Create new freight
router.post('/', async (req, res) => {
  try {
    const {
      product,
      quantity,
      origin,
      destination,
      truckType,
      freightValue,
      deliveryTime,
      carrier
    } = req.body;
    
    // Validate required fields
    if (!product || !quantity || !origin || !destination || !truckType || !freightValue || !deliveryTime || !carrier) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }
    
    // Validate product info
    if (!product.name || !product.type || !product.weight || !product.unit) {
      return res.status(400).json({
        success: false,
        error: 'Informações do produto incompletas'
      });
    }
    
    // Validate origin and destination
    if (!origin.city || !origin.state || !destination.city || !destination.state) {
      return res.status(400).json({
        success: false,
        error: 'Origem e destino devem ser preenchidos'
      });
    }
    
    // Validate carrier info
    if (!carrier.name || !carrier.cpfCnpj || !carrier.phone || !carrier.email || !carrier.truckLicensePlate) {
      return res.status(400).json({
        success: false,
        error: 'Informações da transportadora incompletas'
      });
    }
    
    const freight = new Freight({
      product: {
        name: product.name,
        type: product.type,
        weight: parseFloat(product.weight),
        unit: product.unit
      },
      quantity: parseInt(quantity),
      origin,
      destination,
      truckType,
      freightValue: parseFloat(freightValue),
      deliveryTime: parseInt(deliveryTime),
      carrier
    });
    
    const savedFreight = await freight.save();
    
    res.status(201).json({
      success: true,
      data: savedFreight,
      message: 'Frete cadastrado com sucesso'
    });
  } catch (error) {
    console.error('Error creating freight:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao cadastrar frete'
    });
  }
});

// PUT /api/freights/:id - Update freight
router.put('/:id', async (req, res) => {
  try {
    const freight = await Freight.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!freight) {
      return res.status(404).json({
        success: false,
        error: 'Frete não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: freight,
      message: 'Frete atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating freight:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar frete'
    });
  }
});

// DELETE /api/freights/:id - Soft delete freight
router.delete('/:id', async (req, res) => {
  try {
    const freight = await Freight.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!freight) {
      return res.status(404).json({
        success: false,
        error: 'Frete não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Frete removido com sucesso'
    });
  } catch (error) {
    console.error('Error deleting freight:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover frete'
    });
  }
});

// PUT /api/freights/:id/status - Update freight status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status é obrigatório'
      });
    }
    
    const freight = await Freight.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!freight) {
      return res.status(404).json({
        success: false,
        error: 'Frete não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: freight,
      message: 'Status do frete atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating freight status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status do frete'
    });
  }
});

export default router;
