import * as admin from "firebase-admin";
import {
  BaseConfigurationStore,
  IConfigurationStore
} from "@fvlab/configurationstore";

/**
 * Initialize Firebase Admin if it hasn't already been initialized.
 *
 * @export
 * @param {admin.AppOptions} [options] Firebase Configuration
 */
export function initializeFirebase(options?: admin.AppOptions): void {
  if (admin.apps.length === 0) {
    // admin.initializeApp(functions.config().firebase)
    admin.initializeApp(options);
    console.log("RTDB Config Store: firebase app initialized: App Count", admin.apps.length);
  } else {
    console.log("RTDB Config Store: firebase app ALREADY initialized: App Count", admin.apps.length);
  }
}

/**
 * Firebase Realtime Database Configuration Store
 */
export class FirebaseRTDBConfigurationStore extends BaseConfigurationStore {
  db: admin.database.Database;

  // constructor(public userID: string, private globalPath = 'internal/global/', private userPath = 'internal/user/') {}

  /**
   * Store data at the provided path.
   * @param settingsPath Path to where the data will be located within the Realtime Database.
   * @param value Data to set at the specified path.
   * 
   * @returns Data that was set.
   */
  protected setData<T>(settingsPath: string, value: T): Promise<T> {
    const dbPath = this.db.ref(settingsPath);
    return dbPath.set(value).then(() => value);
  }

  /**
   * Retreve data from a given path, if there is no entry at the path a default will be created and returned.
   * @param settingsPath Path to where the data will be located within the Realtime Database.
   * @param defaultValue Data to set and return if no data at the given path.
   * 
   * @returns Data at given path, or default value if there is no data the path.
   */
  protected getData<T>(settingsPath: string, defaultValue?: T): Promise<T> {
    const dbPath = this.db.ref(settingsPath);
    return dbPath.once("value").then(data => {
      const val = data.val();
      if (val === null && defaultValue !== undefined)
        return this.setData(settingsPath, defaultValue);
      return val;
    });
  }

  /**
   * Initialize the Configuration Store.  **This step is required to be done before any functionality can be used.**
   */
  init(): Promise<IConfigurationStore> {
    initializeFirebase();
    this.db = admin.database();
    return Promise.resolve(this);
  }
}
