import { rdb } from "./firebase-config";

export default class FirebaseRealtimeDatabaseService {
  constructor() {
    this.db = rdb.ref("/");
    this.get.bind(this);
    this.create.bind(this);
    this.update.bind(this);
    this.delete.bind(this);
  }

  get(path, callback) {
    return this.db.child(path).on("value", callback);
  }

  create(path, data) {
    return new Promise((resolve, reject) => {
        rdb.ref(path).set(data)
            .then(() => resolve("Data successfully written"))
            .catch((error) => reject(error));
    });
  }

  update(path, data) {
    return this.db.child(path).update(data);
  }

  delete(path) {
    return this.db.child(path).remove();
  }
}
