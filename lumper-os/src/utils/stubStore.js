const DB_NAME = 'lumperos-docs';
const STORE   = 'paystubs';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

export async function saveStub(file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).add({
      name: file.name,
      size: file.size,
      type: file.type,
      saved: new Date().toISOString(),
      blob: file,
    });
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function listStubs() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result.reverse());
    req.onerror   = () => reject(req.error);
  });
}

export async function deleteStub(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

export function viewStub(stub) {
  const url = URL.createObjectURL(stub.blob);
  const a   = document.createElement('a');
  a.href    = url;
  a.target  = '_blank';
  a.rel     = 'noopener';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
