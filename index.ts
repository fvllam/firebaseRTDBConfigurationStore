import * as admin from "firebase-admin";
import {
  BaseConfigurationStore,
  IConfigurationStore
} from "@fvlab/configurationstore";

export function initializeFirebase(): void {
  if (admin.apps.length === 0) {
    // admin.initializeApp(functions.config().firebase)
    admin.initializeApp();
    console.log("firebase app initialized", admin.apps.length);
  } else {
    console.log("firebase app ALREADY initialized", admin.apps.length);
  }
}

export class FirebaseRTDBConfigurationStore extends BaseConfigurationStore {
  db: admin.database.Database;

  // constructor(public userID: string, private globalPath = 'internal/global/', private userPath = 'internal/user/') {}

  protected setData<T>(settingsPath: string, value: T): Promise<T> {
    const dbPath = this.db.ref(settingsPath);
    return dbPath.set(value).then(() => value);
  }

  protected getData<T>(settingsPath: string, defaultValue?: T): Promise<T> {
    const dbPath = this.db.ref(settingsPath);
    return dbPath.once("value").then(data => {
      const val = data.val();
      if (val === null && defaultValue !== undefined)
        return this.setData(settingsPath, defaultValue);
      return val;
    });
  }

  init(): Promise<IConfigurationStore> {
    initializeFirebase();
    this.db = admin.database();
    return Promise.resolve(this);
  }
}
