import { openDB } from "idb";
import { VERIFIED_PLATFORMS } from "./compliance";

const DB_NAME = "CreatorEDF_DB";
const DB_VERSION = 1;

/**
 * Initialize IndexedDB with schema
 */
export async function getDb() {
  if (typeof window === "undefined") {
    return null; // Server-side safety guard
  }

  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // 1. Exporter Profile (Key: id)
      if (!db.objectStoreNames.contains("exporter_profile")) {
        db.createObjectStore("exporter_profile", { keyPath: "id" });
      }

      // 2. Recipient / Platform Profiles (Key: id)
      if (!db.objectStoreNames.contains("recipient_profiles")) {
        db.createObjectStore("recipient_profiles", { keyPath: "id" });
      }

      // 3. Invoices (Key: id)
      if (!db.objectStoreNames.contains("invoices")) {
        const invStore = db.createObjectStore("invoices", { keyPath: "id" });
        invStore.createIndex("invoiceNumber", "invoiceNumber", { unique: false });
        invStore.createIndex("invoiceDate", "invoiceDate", { unique: false });
      }

      // 4. AdSense Revenue Records (Key: id)
      if (!db.objectStoreNames.contains("revenue_records")) {
        const revStore = db.createObjectStore("revenue_records", { keyPath: "id" });
        revStore.createIndex("month", "month", { unique: false });
      }

      // 5. Document Downloads Archive (Key: id)
      if (!db.objectStoreNames.contains("document_downloads")) {
        db.createObjectStore("document_downloads", { keyPath: "id" });
      }
    },
  });
}

/**
 * Exporter Profile Methods
 */
export async function getExporterProfile() {
  const db = await getDb();
  if (!db) return null;
  const profile = await db.get("exporter_profile", "current");
  return profile || null;
}

export async function saveExporterProfile(profileData) {
  const db = await getDb();
  if (!db) return null;
  const data = {
    ...profileData,
    id: "current",
    updatedAt: new Date().toISOString(),
  };
  await db.put("exporter_profile", data);
  return data;
}

/**
 * Recipient / Platform Profile Methods
 */
export async function getRecipientProfiles() {
  const db = await getDb();
  if (!db) return [];
  const list = await db.getAll("recipient_profiles");
  if (list.length === 0) {
    // Auto-seed pre-verified platform entities
    await seedDefaultRecipients();
    return await db.getAll("recipient_profiles");
  }
  return list;
}

export async function getRecipientProfile(id) {
  const db = await getDb();
  if (!db) return null;
  return await db.get("recipient_profiles", id);
}

export async function saveRecipientProfile(recipientData) {
  const db = await getDb();
  if (!db) return null;
  const id = recipientData.id || `custom_${Date.now()}`;
  const data = {
    ...recipientData,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.put("recipient_profiles", data);
  return data;
}

export async function deleteRecipientProfile(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete("recipient_profiles", id);
}

export async function seedDefaultRecipients() {
  const db = await getDb();
  if (!db) return;
  const tx = db.transaction("recipient_profiles", "readwrite");
  for (const platform of VERIFIED_PLATFORMS) {
    await tx.store.put({
      ...platform,
      isVerified: true,
      updatedAt: new Date().toISOString(),
    });
  }
  await tx.done;
}

/**
 * Invoices Store Methods
 */
export async function getInvoices() {
  const db = await getDb();
  if (!db) return [];
  return await db.getAll("invoices");
}

export async function getInvoice(id) {
  const db = await getDb();
  if (!db) return null;
  return await db.get("invoices", id);
}

export async function saveInvoice(invoiceData) {
  const db = await getDb();
  if (!db) return null;
  const id = invoiceData.id || `inv_${Date.now()}`;
  const data = {
    ...invoiceData,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.put("invoices", data);
  return data;
}

export async function deleteInvoice(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete("invoices", id);
}

/**
 * Revenue Records Store Methods
 */
export async function getRevenueRecords() {
  const db = await getDb();
  if (!db) return [];
  return await db.getAll("revenue_records");
}

export async function saveRevenueRecord(recordData) {
  const db = await getDb();
  if (!db) return null;
  const id = recordData.id || `rev_${Date.now()}`;
  const data = {
    ...recordData,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.put("revenue_records", data);
  return data;
}

export async function deleteRevenueRecord(id) {
  const db = await getDb();
  if (!db) return;
  await db.delete("revenue_records", id);
}

/**
 * Downloads Archive Methods
 */
export async function getDownloads() {
  const db = await getDb();
  if (!db) return [];
  return await db.getAll("document_downloads");
}

export async function saveDownload(downloadData) {
  try {
    const db = await getDb();
    if (!db) return null;
    const id = downloadData.id || `dl_${Date.now()}`;
    const data = {
      ...downloadData,
      id,
      timestamp: new Date().toISOString(),
    };
    await db.put("document_downloads", data);
    return data;
  } catch (err) {
    console.warn("Local IndexedDB saveDownload failed (non-blocking):", err);
    return null;
  }
}

/**
 * Privacy & Data Sovereignty Methods
 */
export async function clearAllLocalData() {
  const db = await getDb();
  if (!db) return;
  const storeNames = [
    "exporter_profile",
    "recipient_profiles",
    "invoices",
    "revenue_records",
    "document_downloads",
  ];
  for (const name of storeNames) {
    const tx = db.transaction(name, "readwrite");
    await tx.store.clear();
    await tx.done;
  }
}

export async function exportAllLocalDataJson() {
  const db = await getDb();
  if (!db) return "{}";
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    exporterProfile: await db.get("exporter_profile", "current"),
    recipientProfiles: await db.getAll("recipient_profiles"),
    invoices: await db.getAll("invoices"),
    revenueRecords: await db.getAll("revenue_records"),
    downloads: await db.getAll("document_downloads"),
  };
  return JSON.stringify(data, null, 2);
}

export async function importLocalDataJson(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const db = await getDb();
    if (!db) return false;

    if (data.exporterProfile) {
      await db.put("exporter_profile", data.exporterProfile);
    }
    if (Array.isArray(data.recipientProfiles)) {
      const tx = db.transaction("recipient_profiles", "readwrite");
      for (const p of data.recipientProfiles) {
        await tx.store.put(p);
      }
      await tx.done;
    }
    if (Array.isArray(data.invoices)) {
      const tx = db.transaction("invoices", "readwrite");
      for (const inv of data.invoices) {
        await tx.store.put(inv);
      }
      await tx.done;
    }
    if (Array.isArray(data.revenueRecords)) {
      const tx = db.transaction("revenue_records", "readwrite");
      for (const rev of data.revenueRecords) {
        await tx.store.put(rev);
      }
      await tx.done;
    }
    return true;
  } catch (err) {
    console.error("Failed to import JSON data:", err);
    return false;
  }
}

/**
 * Erase all local records and reset IndexedDB
 */
export async function clearAllData() {
  const db = await getDb();
  if (!db) return;
  const tx = db.transaction(
    ["exporter_profile", "recipient_profiles", "invoices", "revenue_records", "document_downloads"],
    "readwrite"
  );
  await Promise.all([
    tx.objectStore("exporter_profile").clear(),
    tx.objectStore("recipient_profiles").clear(),
    tx.objectStore("invoices").clear(),
    tx.objectStore("revenue_records").clear(),
    tx.objectStore("document_downloads").clear(),
  ]);
  await tx.done;
}

