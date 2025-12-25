import Datastore from 'nedb-promises';
import path from 'path';
import fs from 'fs';

// Helper to determine if we are in the Next.js build phase
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test';

const getDbInstance = (filename: string) => {
  if (isBuildPhase) {
    // Return a dummy object that mimics the Datastore interface to prevent build errors
    return {
      find: () => Promise.resolve([]),
      findOne: () => Promise.resolve(null),
      insert: () => Promise.resolve({}),
      update: () => Promise.resolve(0),
      remove: () => Promise.resolve(0),
      count: () => Promise.resolve(0),
    } as any;
  }

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      console.error('Failed to create data directory:', e);
    }
  }

  return Datastore.create({ 
    filename: path.join(dataDir, filename), 
    autoload: true 
  });
};

// Lazy initialization using Proxies
let adminsDbInstance: any = null;
let customersDbInstance: any = null;

export const adminsDb = new Proxy({} as any, {
  get: (target, prop) => {
    if (!adminsDbInstance) {
      adminsDbInstance = getDbInstance('admins.db');
    }
    return adminsDbInstance[prop];
  }
});

export const customersDb = new Proxy({} as any, {
  get: (target, prop) => {
    if (!customersDbInstance) {
      customersDbInstance = getDbInstance('customers.db');
    }
    return customersDbInstance[prop];
  }
});
