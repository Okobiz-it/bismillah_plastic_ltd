const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'home', collection: 'HomeContent' },
  { name: 'products', collection: 'Product' },
  { name: 'testimonials', collection: 'Testimonial' },
  { name: 'clients', collection: 'Client' },
  { name: 'certifications', collection: 'Certification' },
  { name: 'goals', collection: 'Goal' },
  { name: 'team', collection: 'TeamMember' },
  { name: 'services', collection: 'ServiceStat' },
  { name: 'countries', collection: 'Country' },
  { name: 'contact', collection: 'ContactInfo' },
  { name: 'inquiries', collection: 'Inquiry' },
  { name: 'settings', collection: 'Settings' },
];

const srcDir = path.join(__dirname, 'src/modules');

for (const mod of modules) {
  if (mod.name === 'auth') continue; // already done
  
  const modDir = path.join(srcDir, mod.name);
  if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });

  const modelContent = `import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // define schema fields here based on requirements
}, { timestamps: true });

export const ${mod.collection} = mongoose.model('${mod.collection}', schema);
`;

  const controllerContent = `import type { Request, Response, NextFunction } from 'express';
import { ${mod.collection} } from './${mod.name}.model.js';
import { sendResponse } from '../../core/utils/response.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ${mod.collection}.find({});
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

// Add create, update, delete here
`;

  const routesContent = `import express from 'express';
import { getAll } from './${mod.name}.controller.js';
import { protect } from '../../core/middleware/auth.js';

const router = express.Router();

router.get('/', getAll);
// router.post('/', protect, create);
// router.put('/:id', protect, update);
// router.delete('/:id', protect, remove);

export default router;
`;

  if (!fs.existsSync(path.join(modDir, `${mod.name}.model.ts`)))
    fs.writeFileSync(path.join(modDir, `${mod.name}.model.ts`), modelContent);
    
  if (!fs.existsSync(path.join(modDir, `${mod.name}.controller.ts`)))
    fs.writeFileSync(path.join(modDir, `${mod.name}.controller.ts`), controllerContent);
    
  if (!fs.existsSync(path.join(modDir, `${mod.name}.routes.ts`)))
    fs.writeFileSync(path.join(modDir, `${mod.name}.routes.ts`), routesContent);
}

console.log('Scaffolded all modules.');
