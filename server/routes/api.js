import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Enterprise from '../models/Enterprise.js';
import Demand from '../models/Demand.js';
import IndustrialPark from '../models/IndustrialPark.js';
import Factory from '../models/Factory.js';
import { enterprisesData } from '../../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust load of all 480 KCNs
let fullKcnData = [];
const possiblePaths = [
  path.resolve(__dirname, '../data/industrialParksFull.json'),
  path.resolve(__dirname, '../../src/data/industrialParksFull.json'),
  path.resolve(process.cwd(), 'server/data/industrialParksFull.json'),
  path.resolve(process.cwd(), 'src/data/industrialParksFull.json'),
  path.resolve('server/data/industrialParksFull.json')
];

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (data && data.length >= 400) {
        fullKcnData = data;
        console.log(`✅ API: Đã nạp thành công ${fullKcnData.length} KCN từ: ${p}`);
        break;
      }
    } catch (e) {}
  }
}

// Robust load of Enterprises
let fullEnterprisesData = [];
const possibleEntPaths = [
  path.resolve(__dirname, '../data/enterprisesFull.json'),
  path.resolve(__dirname, '../../src/data/enterprisesFull.json'),
  path.resolve(process.cwd(), 'server/data/enterprisesFull.json'),
  path.resolve(process.cwd(), 'src/data/enterprisesFull.json'),
  path.resolve('server/data/enterprisesFull.json')
];

for (const p of possibleEntPaths) {
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (data && data.length > 0) {
        fullEnterprisesData = data;
        console.log(`✅ API: Đã nạp thành công ${fullEnterprisesData.length} Nhà cung ứng từ: ${p}`);
        break;
      }
    } catch (e) {}
  }
}

// Robust load of Factories (14,237 Factories)
let fullFactoriesData = [];
const possibleFacPaths = [
  path.resolve(__dirname, '../data/factoriesFull.json'),
  path.resolve(__dirname, '../../src/data/factoriesFull.json'),
  path.resolve(process.cwd(), 'server/data/factoriesFull.json'),
  path.resolve(process.cwd(), 'src/data/factoriesFull.json'),
  path.resolve('server/data/factoriesFull.json')
];

for (const p of possibleFacPaths) {
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (data && data.length > 0) {
        fullFactoriesData = data;
        console.log(`✅ API: Đã nạp thành công ${fullFactoriesData.length} Nhà máy từ: ${p}`);
        break;
      }
    } catch (e) {}
  }
}

const router = express.Router();

// 1. Health check & MongoDB Status
router.get('/status', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'online',
    mongodb: {
      connected: isConnected,
      host: isConnected ? mongoose.connection.host : null,
      name: isConnected ? mongoose.connection.name : null,
    },
    timestamp: new Date().toISOString()
  });
});

// 2. Enterprises (Nhà cung ứng) API with 18 Phases, Stage, Category & Full-text search
router.get('/enterprises', async (req, res) => {
  try {
    const { q, stage, phase, province, category, industry, page = 1, limit = 20 } = req.query;
    const isAll = limit === 'all' || parseInt(limit) >= 2000;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = isAll ? 5000 : Math.max(1, parseInt(limit) || 20);

    // If enterprisesFull.json was updated dynamically, try reloading if empty
    if (fullEnterprisesData.length === 0) {
      for (const p of possibleEntPaths) {
        if (fs.existsSync(p)) {
          try {
            const data = JSON.parse(fs.readFileSync(p, 'utf8'));
            if (data && data.length > 0) { fullEnterprisesData = data; break; }
          } catch (e) {}
        }
      }
    }

    if (mongoose.connection.readyState === 1) {
      let query = {};

      if (q) {
        const clean = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const map = { a: '[aàáảãạăằắẳẵặâầấẩẫậ]', e: '[eèéẻẽẹêềếểễệ]', i: '[iìíỉĩị]', o: '[oòóỏõọôồốổỗộơờớởỡợ]', u: '[uùúủũụưừứửữự]', y: '[yỳýỷỹỵ]', d: '[dđ]' };
        let flexPattern = '';
        for (const char of clean) { flexPattern += map[char] || (/[a-z0-9]/i.test(char) ? char : `\\${char}`); }

        query.$or = [
          { name: { $regex: flexPattern, $options: 'i' } },
          { products: { $regex: flexPattern, $options: 'i' } },
          { industry: { $regex: flexPattern, $options: 'i' } },
          { description: { $regex: flexPattern, $options: 'i' } },
          { address: { $regex: flexPattern, $options: 'i' } }
        ];
      }
      if (stage && stage !== 'all') {
        query.stages = parseInt(stage);
      }
      if (phase && phase !== 'all') {
        query.phases = phase;
      }
      if (province && province !== 'all' && province !== 'Toàn quốc') {
        const clean = province.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const map = { a: '[aàáảãạăằắẳẵặâầấẩẫậ]', e: '[eèéẻẽẹêềếểễệ]', i: '[iìíỉĩị]', o: '[oòóỏõọôồốổỗộơờớởỡợ]', u: '[uùúủũụưừứửữự]', y: '[yỳýỷỹỵ]', d: '[dđ]' };
        let flexProv = '';
        for (const char of clean) { flexProv += map[char] || (/[a-z0-9]/i.test(char) ? char : `\\${char}`); }
        query.province = { $regex: flexProv, $options: 'i' };
      }
      if (category && category !== 'all') {
        const clean = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const map = { a: '[aàáảãạăằắẳẵặâầấẩẫậ]', e: '[eèéẻẽẹêềếểễệ]', i: '[iìíỉĩị]', o: '[oòóỏõọôồốổỗộơờớởỡợ]', u: '[uùúủũụưừứửữự]', y: '[yỳýỷỹỵ]', d: '[dđ]' };
        let flexCat = '';
        for (const char of clean) { flexCat += map[char] || (/[a-z0-9]/i.test(char) ? char : `\\${char}`); }
        query.$or = [
          ...(query.$or || []),
          { category: { $regex: flexCat, $options: 'i' } },
          { industry: { $regex: flexCat, $options: 'i' } }
        ];
      }

      const total = await Enterprise.countDocuments(query);
      if (total > 0) {
        const totalPages = Math.ceil(total / pageSize) || 1;
        const list = await Enterprise.find(query)
          .sort({ isVerified: -1, rating: -1, createdAt: -1 })
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize);

        return res.json({
          success: true,
          count: list.length,
          total,
          totalPages,
          currentPage: pageNum,
          pageSize,
          data: list,
          source: 'mongodb'
        });
      }
    }

    // Fallback filter over full JSON dataset
    let filtered = fullEnterprisesData.length > 0 ? [...fullEnterprisesData] : [...enterprisesData];
    
    if (q) {
      const qClean = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(e => {
        const nameClean = (e.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const indClean = (e.industry || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const prodClean = (Array.isArray(e.products) ? e.products.join(' ') : (e.products || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const addrClean = (e.address || e.location || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nameClean.includes(qClean) || indClean.includes(qClean) || prodClean.includes(qClean) || addrClean.includes(qClean);
      });
    }
    if (stage && stage !== 'all') {
      const stgNum = parseInt(stage);
      filtered = filtered.filter(e => e.stages && e.stages.includes(stgNum));
    }
    if (phase && phase !== 'all') {
      filtered = filtered.filter(e => e.phases && e.phases.includes(phase));
    }
    if (province && province !== 'all' && province !== 'Toàn quốc') {
      const provClean = province.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(e => {
        const eProv = (e.province || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return eProv.includes(provClean) || provClean.includes(eProv);
      });
    }
    if (category && category !== 'all') {
      const catClean = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      filtered = filtered.filter(e => {
        const catNameClean = (e.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const indNameClean = (e.industry || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return catNameClean.includes(catClean) || indNameClean.includes(catClean) || catClean.includes(catNameClean) || catClean.includes(indNameClean);
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginated = isAll ? filtered : filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    return res.json({
      success: true,
      count: paginated.length,
      total,
      totalPages,
      currentPage: pageNum,
      pageSize,
      data: paginated,
      source: 'local'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2.0. Single Enterprise by ID API
router.get('/enterprises/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const doc = await Enterprise.findOne({ $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] });
      if (doc) {
        return res.json({ success: true, data: doc });
      }
    }

    // Fallback from enterprisesFull dataset
    const found = fullEnterprisesData.find(e => String(e.id) === String(id) || String(e._id) === String(id));
    if (found) {
      return res.json({ success: true, data: found });
    }

    return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung ứng' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2.1. Categories & A-Z Alphabetical Index API (3,418 Categories from Trang Vang)
router.get('/categories', (req, res) => {
  try {
    const catPath = path.resolve(__dirname, '../data/industryCategories69Pages.json');
    if (fs.existsSync(catPath)) {
      const data = JSON.parse(fs.readFileSync(catPath, 'utf8'));
      return res.json({ success: true, count: data.length, data });
    }
    return res.json({ success: true, count: 0, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/categories/alphabetical', (req, res) => {
  try {
    const alphPath = path.resolve(__dirname, '../data/categoriesAlphabetical.json');
    if (fs.existsSync(alphPath)) {
      const data = JSON.parse(fs.readFileSync(alphPath, 'utf8'));
      return res.json({ success: true, data });
    }
    return res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2.2. Factories (Nhà máy trong KCN) API (14.237+ Nhà máy)
router.get('/factories', async (req, res) => {
  try {
    const { q, province, kcn, kcnId, type, industry, page = 1, limit = 24 } = req.query;
    const isAll = limit === 'all' || parseInt(limit) >= 20000;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = isAll ? 20000 : Math.max(1, parseInt(limit) || 24);

    // Fallback reload if empty
    if (fullFactoriesData.length === 0) {
      for (const p of possibleFacPaths) {
        if (fs.existsSync(p)) {
          try {
            const data = JSON.parse(fs.readFileSync(p, 'utf8'));
            if (data && data.length > 0) { fullFactoriesData = data; break; }
          } catch (e) {}
        }
      }
    }

    if (mongoose.connection.readyState === 1) {
      let query = {};

      if (q) {
        const clean = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const map = { a: '[aàáảãạăằắẳẵặâầấẩẫậ]', e: '[eèéẻẽẹêềếểễệ]', i: '[iìíỉĩị]', o: '[oòóỏõọôồốổỗộơờớởỡợ]', u: '[uùúủũụưừứửữự]', y: '[yỳýỷỹỵ]', d: '[dđ]' };
        let flexPattern = '';
        for (const char of clean) { flexPattern += map[char] || (/[a-z0-9]/i.test(char) ? char : `\\${char}`); }

        query.$or = [
          { name: { $regex: flexPattern, $options: 'i' } },
          { kcnName: { $regex: flexPattern, $options: 'i' } },
          { address: { $regex: flexPattern, $options: 'i' } },
          { industry: { $regex: flexPattern, $options: 'i' } },
          { type: { $regex: flexPattern, $options: 'i' } }
        ];
      }
      if (province && province !== 'all' && province !== 'Toàn quốc') {
        const clean = province.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const map = { a: '[aàáảãạăằắẳẵặâầấẩẫậ]', e: '[eèéẻẽẹêềếểễệ]', i: '[iìíỉĩị]', o: '[oòóỏõọôồốổỗộơờớởỡợ]', u: '[uùúủũụưừứửữự]', y: '[yỳýỷỹỵ]', d: '[dđ]' };
        let flexProv = '';
        for (const char of clean) { flexProv += map[char] || (/[a-z0-9]/i.test(char) ? char : `\\${char}`); }
        query.province = { $regex: flexProv, $options: 'i' };
      }
      if (kcnId && kcnId !== 'all') {
        query.kcnId = kcnId;
      } else if (kcn && kcn !== 'all') {
        const clean = kcn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const map = { a: '[aàáảãạăằắẳẵặâầấẩẫậ]', e: '[eèéẻẽẹêềếểễệ]', i: '[iìíỉĩị]', o: '[oòóỏõọôồốổỗộơờớởỡợ]', u: '[uùúủũụưừứửữự]', y: '[yỳýỷỹỵ]', d: '[dđ]' };
        let flexKcn = '';
        for (const char of clean) { flexKcn += map[char] || (/[a-z0-9]/i.test(char) ? char : `\\${char}`); }
        query.kcnName = { $regex: flexKcn, $options: 'i' };
      }
      if (type && type !== 'all') {
        query.type = { $regex: type, $options: 'i' };
      }
      if (industry && industry !== 'all') {
        query.industry = { $regex: industry, $options: 'i' };
      }

      const total = await Factory.countDocuments(query);
      if (total > 0) {
        const totalPages = Math.ceil(total / pageSize) || 1;
        const list = await Factory.find(query)
          .sort({ no: 1 })
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize);

        return res.json({
          success: true,
          count: list.length,
          total,
          totalPages,
          currentPage: pageNum,
          pageSize,
          data: list,
          source: 'mongodb'
        });
      }
    }

    // Fallback filter over full JSON dataset
    let filtered = [...fullFactoriesData];

    if (q) {
      const qClean = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => {
        const nameClean = (f.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const kcnClean = (f.kcnName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const addrClean = (f.address || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const indClean = (f.industry || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const typeClean = (f.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nameClean.includes(qClean) || kcnClean.includes(qClean) || addrClean.includes(qClean) || indClean.includes(qClean) || typeClean.includes(qClean);
      });
    }
    if (province && province !== 'all' && province !== 'Toàn quốc') {
      const provClean = province.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => {
        const fProv = (f.province || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return fProv.includes(provClean) || provClean.includes(fProv);
      });
    }
    if (kcnId && kcnId !== 'all') {
      filtered = filtered.filter(f => f.kcnId === kcnId);
    } else if (kcn && kcn !== 'all') {
      const kcnClean = kcn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => (f.kcnName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kcnClean));
    }
    if (type && type !== 'all') {
      const typeClean = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => (f.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(typeClean));
    }
    if (industry && industry !== 'all') {
      const indClean = industry.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => (f.industry || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(indClean));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginated = isAll ? filtered : filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    return res.json({
      success: true,
      count: paginated.length,
      total,
      totalPages,
      currentPage: pageNum,
      pageSize,
      data: paginated,
      source: 'local'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Single Factory Detail
router.get('/factories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const fac = await Factory.findOne({ $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] });
      if (fac) return res.json({ success: true, data: fac, source: 'mongodb' });
    }
    const found = fullFactoriesData.find(f => String(f.id) === String(id) || String(f._id) === String(id) || String(f.no) === String(id));
    if (found) return res.json({ success: true, data: found, source: 'local' });
    return res.status(404).json({ success: false, message: 'Không tìm thấy nhà máy' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Demands (Đăng nhu cầu B2B) API
router.get('/demands', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const demands = await Demand.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: demands.length, data: demands });
    }
    return res.json({ success: true, count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/demands', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newDemand = new Demand(req.body);
      const saved = await newDemand.save();
      return res.status(201).json({ success: true, data: saved });
    }
    return res.status(201).json({ success: true, data: { ...req.body, _id: Date.now().toString() }, message: 'Saved in memory' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 4. Industrial Parks (KCN) API with Pagination, Filter & Full Factory Detail
router.get('/industrial-parks', async (req, res) => {
  try {
    const { q, province, region, page = 1, limit = 20 } = req.query;
    const isAll = limit === 'all' || parseInt(limit) >= 500;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = isAll ? 500 : Math.max(1, parseInt(limit) || 20);

    let fallbackData = fullKcnData;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (q) {
        // Flexible Vietnamese diacritics regex
        const map = {
          a: '[aàáảãạăằắẳẵặâầấẩẫậ]',
          e: '[eèéẻẽẹêềếểễệ]',
          i: '[iìíỉĩị]',
          o: '[oòóỏõọôồốổỗộơờớởỡợ]',
          u: '[uùúủũụưừứửữự]',
          y: '[yỳýỷỹỵ]',
          d: '[dđ]'
        };
        const clean = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let flexPattern = '';
        for (const char of clean) {
          flexPattern += map[char] || (/[a-z0-9]/i.test(char) ? char : `\\${char}`);
        }

        query.$or = [
          { name: { $regex: flexPattern, $options: 'i' } },
          { province: { $regex: flexPattern, $options: 'i' } },
          { investor: { $regex: flexPattern, $options: 'i' } },
          { 'factories.name': { $regex: flexPattern, $options: 'i' } },
          { 'factories.industry': { $regex: flexPattern, $options: 'i' } }
        ];
      }
      if (province && province !== 'all') {
        query.province = { $regex: province, $options: 'i' };
      }
      if (region && region !== 'all') {
        query.region = region;
      }

      const total = await IndustrialPark.countDocuments(query);
      if (total >= 400 || (q || province !== 'all' || region !== 'all')) {
        const totalPages = Math.ceil(total / pageSize) || 1;
        const list = await IndustrialPark.find(query)
          .sort({ stt: 1, createdAt: -1 })
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize);

        if (list.length > 0) {
          return res.json({
            success: true,
            count: list.length,
            total,
            totalPages,
            currentPage: pageNum,
            pageSize,
            data: list,
            source: 'mongodb'
          });
        }
      }
    }

    // Fallback filter over all 480 KCNs
    let filtered = [...fallbackData];
    if (q) {
      const qClean = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(k => {
        const nameClean = (k.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const provClean = (k.province || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const hasFac = k.factories && k.factories.some(f => {
          const fn = (f.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const fi = (f.industry || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return fn.includes(qClean) || fi.includes(qClean);
        });
        return nameClean.includes(qClean) || provClean.includes(qClean) || hasFac;
      });
    }
    if (province && province !== 'all') {
      const provLower = province.toLowerCase();
      filtered = filtered.filter(k => k.province && k.province.toLowerCase().includes(provLower));
    }
    if (region && region !== 'all') {
      filtered = filtered.filter(k => k.region === region);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginated = isAll ? filtered : filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    return res.json({
      success: true,
      count: paginated.length,
      total,
      totalPages,
      currentPage: pageNum,
      pageSize,
      data: paginated,
      source: 'local'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4.1. Single Industrial Park Detail with all Factories
router.get('/industrial-parks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const kcn = await IndustrialPark.findOne({
        $or: [
          { id: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          { stt: isNaN(id) ? -1 : parseInt(id) }
        ]
      });

      if (kcn) {
        return res.json({ success: true, data: kcn, source: 'mongodb' });
      }
    }

    // Fallback JSON lookup
    try {
      const fs = await import('fs');
      const path = await import('path');
      const localJsonPath = path.resolve('server/data/industrialParksFull.json');
      if (fs.existsSync(localJsonPath)) {
        const list = JSON.parse(fs.readFileSync(localJsonPath, 'utf8'));
        const found = list.find(k => k.id === id || String(k.stt) === String(id) || k.name.toLowerCase().includes(id.toLowerCase()));
        if (found) {
          return res.json({ success: true, data: found, source: 'local' });
        }
      }
    } catch (e) {}

    const mockFound = industrialParksData.find(k => String(k.id) === String(id) || k.name.toLowerCase().includes(id.toLowerCase()));
    if (mockFound) {
      return res.json({ success: true, data: mockFound, source: 'local_mock' });
    }

    return res.status(404).json({ success: false, message: 'Không tìm thấy khu công nghiệp' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4.2. Global Search for Factories across all KCNs
router.get('/factories', async (req, res) => {
  try {
    const { q, province, type, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.max(1, parseInt(limit) || 20);

    let allFactories = [];
    if (mongoose.connection.readyState === 1) {
      let matchQuery = {};
      if (province && province !== 'all') {
        matchQuery.province = { $regex: province, $options: 'i' };
      }

      const kcns = await IndustrialPark.find(matchQuery).select('name province region factories');
      kcns.forEach(k => {
        if (k.factories && k.factories.length > 0) {
          k.factories.forEach(f => {
            allFactories.push({
              ...f.toObject(),
              industrialParkName: k.name,
              industrialParkId: k.id,
              province: k.province,
              region: k.region
            });
          });
        }
      });
    } else {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const localJsonPath = path.resolve('server/data/industrialParksFull.json');
        if (fs.existsSync(localJsonPath)) {
          const kcns = JSON.parse(fs.readFileSync(localJsonPath, 'utf8'));
          kcns.forEach(k => {
            if (k.factories && k.factories.length > 0) {
              k.factories.forEach(f => {
                allFactories.push({
                  ...f,
                  industrialParkName: k.name,
                  industrialParkId: k.id,
                  province: k.province,
                  region: k.region
                });
              });
            }
          });
        }
      } catch (e) {}
    }

    if (q) {
      const qLower = q.toLowerCase();
      allFactories = allFactories.filter(f => 
        (f.name && f.name.toLowerCase().includes(qLower)) ||
        (f.industry && f.industry.toLowerCase().includes(qLower)) ||
        (f.address && f.address.toLowerCase().includes(qLower)) ||
        (f.industrialParkName && f.industrialParkName.toLowerCase().includes(qLower))
      );
    }
    if (type && type !== 'all') {
      allFactories = allFactories.filter(f => f.type && f.type.toLowerCase().includes(type.toLowerCase()));
    }

    const total = allFactories.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginated = allFactories.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    return res.json({
      success: true,
      count: paginated.length,
      total,
      totalPages,
      currentPage: pageNum,
      pageSize,
      data: paginated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Seed MongoDB with initial dataset
router.post('/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'MongoDB chưa được kết nối. Vui lòng kiểm tra MONGODB_URI trong .env' });
    }

    // Seed enterprises
    await Enterprise.deleteMany({});
    await Enterprise.insertMany(enterprisesData);

    // Seed industrial parks
    await IndustrialPark.deleteMany({});
    await IndustrialPark.insertMany(industrialParksData);

    res.json({
      success: true,
      message: 'Khởi tạo dữ liệu mẫu lên MongoDB thành công!',
      counts: {
        enterprises: enterprisesData.length,
        industrialParks: industrialParksData.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
