import * as admin from 'firebase-admin';
import { BaseConfigurationStore, IConfigurationStore } from '@fvlab/configurationstore';

/**
 * Initialize Firebase Admin if it hasn't already been initialized.
 *
 * @export
 * @param {admin.AppOptions} [options] Firebase Configuration
 */
export function initializeFirebase(options?: admin.AppOptions): void {
	if (admin.apps.length === 0) {
		admin.initializeApp(options);
		console.log('RTDB Config Store: firebase app initialized: App Count:', admin.apps.length);
	} else {
		console.log('RTDB Config Store: firebase app ALREADY initialized: App Count:', admin.apps.length);
	}
}

/**
 * Firebase Realtime Database Configuration Store
 */
export class FirebaseRTDBConfigurationStore extends BaseConfigurationStore {
	/**
	 * The current database instance.
	 *
	 * @private
	 * @type {admin.database.Database}
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	private _db: admin.database.Database;

	/**
	 * The current database instance.
	 *
	 * @type {admin.database.Database}
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	get db(): admin.database.Database {
		if (!this._db)
			console.error(
				'DB instance not defined, please call one of the init methods before trying to use the Store.'
			);
		return this._db;
	}
	set db(theDb: admin.database.Database) {
		this._db = theDb;
	}

	/**
	 * Creates an instance of FirebaseRTDBConfigurationStore.
	 *
	 * @param {string} userID Serves as the key base for user paths and allows for multiple instances of the same data to exist.
	 * @param {admin.AppOptions} [options] Firebase Admin Configuration
	 * @param {string} [globalPath] Path to set the global configuration items at.
	 * @param {string} [userPath] Path to set the user configuration items at.
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	constructor(public userID: string, globalPath?: string, userPath?: string) {
		super(userID, globalPath, userPath);
	}

	/**
	 * Initialize with a preexisting instance of Firebase Admin.
	 *
	 * @param {typeof admin} firebaseAdminInstance A preexisting instance of Firebase admin.
	 * @returns {this} The current instance of the library.
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	public initWithAdminInstance(firebaseAdminInstance: typeof admin): this {
		this.db = firebaseAdminInstance.database();
		return this;
	}

	/**
	 * Initialize with a new instance of Firebase Admin.  To use an external
	 * configuration, supply some options.
	 *
	 * @param {typeof admin} options Firebase Admin Configuration
	 * @returns {this} The current instance of the library.
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	public init(options?: admin.AppOptions): this {
		initializeFirebase(options);
		this.db = admin.database();
		return this;
	}
	/**
	 * Store data at the provided path. Overwrites existing data at that path.
	 *
	 * @param settingsPath Path to where the data will be located within the Realtime Database.
	 * @param value Data to set at the specified path.
	 * @returns Data that was set.
	 */
	protected setData<T>(settingsPath: string, value: T): Promise<T> {
		const dbPath = this.db.ref(settingsPath);
		return dbPath.set(value).then(() => value);
	}

	/**
	 * Retrieve data from a given path, if there is no entry at the path a default
	 * will be created and returned.
	 * @param settingsPath Path to where the data will be located within the
	 * Realtime Database.
	 * @param defaultValue Data to set and return if no data at the given path.
	 *
	 * @returns Data at given path, or default value if there is no data the path.
	 */
	protected getData<T>(settingsPath: string, defaultValue?: T): Promise<T> {
		const dbPath = this.db.ref(settingsPath);
		return dbPath.once('value').then(data => {
			const val = data.val();
			if (val === null && defaultValue !== undefined) return this.setData(settingsPath, defaultValue);
			return val;
		});
	}

	/**
	 * Updates the data stored at the provided path without overwriting existing
	 * data.
	 *
	 * @protected
	 * @param {string} settingsPath Path to where the data will be located within the Realtime Database.
	 * @param {T} value Data to update and return.
	 * @returns {Promise<T>} Data that was set
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	protected updateData<T>(settingsPath: string, value: T): Promise<T> {
		const dbPath = this.db.ref(settingsPath);
		return dbPath.update(Array.isArray(value) ? Object.assign({}, value) : value).then(() => value);
	}
}
