import { openDB } from "idb";
import { BehaviorSubject, from, switchMap, debounceTime } from "rxjs";

// Map to store observables for each store
const recordsStreams = new Map();

// Create or get an observable for a given store
const getRecordsStream = (storeName) => {
  if (!recordsStreams.has(storeName)) {
    recordsStreams.set(storeName, new BehaviorSubject([]));
  }
  return recordsStreams.get(storeName);
};

// Generic IndexedDB API with RxJS
const dbService = {
    openDatabase: () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('BaptismRegistry', 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create an object store for baptism_registry with serialNumber as the keyPath
                if (!db.objectStoreNames.contains('baptism_registry')) {
                    db.createObjectStore('baptism_registry', { keyPath: 'serialNumber' });
                }
            };

            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
        });
    },

    saveRecord: (volumeNo, serialNumber, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await dbService.openDatabase();

                // Open a transaction on the 'baptism_registry' object store
                const transaction = db.transaction(['baptism_registry'], 'readwrite');
                const store = transaction.objectStore('baptism_registry');

                // Set the key of the data to be a combination of volumeNo and serialNumber
                data.volumeNo = volumeNo; // Attach volumeNo to data
                data.serialNumber = serialNumber; // Ensure serialNumber is part of the data object

                store.put(data); // Add or update the record with serialNumber as the key

                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => reject(event.target.error);
            } catch (error) {
                reject(error);
            }
        });
    },

    getRecordBySerialNumber: (volumeNo, serialNumber) => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await dbService.openDatabase();

                const transaction = db.transaction(['baptism_registry'], 'readonly');
                const store = transaction.objectStore('baptism_registry');
                const record = store.get(serialNumber); // Use serialNumber as the key

                record.onsuccess = () => resolve(record.result);
                record.onerror = (event) => reject(event.target.error);
            } catch (error) {
                reject(error);
            }
        });
    },

    getAllRecords: (volumeNo) => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await dbService.openDatabase();

                const transaction = db.transaction(['baptism_registry'], 'readonly');
                const store = transaction.objectStore('baptism_registry');
                const allRecords = store.getAll(); // Retrieve all records

                allRecords.onsuccess = () => resolve(allRecords.result);
                allRecords.onerror = (event) => reject(event.target.error);
            } catch (error) {
                reject(error);
            }
        });
    },

    // New deleteRecord method to delete a record by serialNumber
    deleteRecord: (serialNumber) => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await dbService.openDatabase();

                const transaction = db.transaction(['baptism_registry'], 'readwrite');
                const store = transaction.objectStore('baptism_registry');

                const deleteRequest = store.delete(serialNumber); // Use serialNumber as the key to delete the record

                deleteRequest.onsuccess = () => resolve(`Record with serialNumber ${serialNumber} deleted successfully.`);
                deleteRequest.onerror = (event) => reject(event.target.error);
            } catch (error) {
                reject(error);
            }
        });
    }
};

export default dbService;