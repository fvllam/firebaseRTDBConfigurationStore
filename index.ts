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
	private _db: admin.database.Database;
	get db(): admin.database.Database {
		if (!this._db)
			console.error(
				'DB instance not defined, please call one of the init methods before trying to use the Store'
			);
		return this._db;
	}
	set db(theDb: admin.database.Database) {
		this._db = theDb;
	}

	/**
	 * Creates an instance of FirebaseRTDBConfigurationStore.
	 *
	 * @param {string} userID
	 * @param {admin.AppOptions} [options] Firebase Admin Configuration
	 * @param {string} [globalPath]
	 * @param {string} [userPath]
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	constructor(public userID: string, globalPath?: string, userPath?: string) {
		super(userID, globalPath, userPath);
	}

	/**
	 * Initialize with a preexisting instance of Firebase Admin.
	 *
	 * @param {typeof admin} firebaseAdminInstance A preexisting instance of Firebase admin.
	 * @returns {this}
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	public initWithAdminInstance(firebaseAdminInstance: typeof admin): this {
		this.db = firebaseAdminInstance.database();
		return this;
	}

	/**
	 * Initialize with a new instance of Firebase Admin.  To use an external configuration, supply some options.
	 *
	 * @param {typeof admin} options Firebase Admin Configuration
	 * @returns {this}
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	public init(options?: admin.AppOptions): this {
		initializeFirebase(options);
		this.db = admin.database();
		return this;
	}
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
	 * Retrieve data from a given path, if there is no entry at the path a default will be created and returned.
	 * @param settingsPath Path to where the data will be located within the Realtime Database.
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
	 *
	 *
	 * @protected
	 * @template T
	 * @param {string} settingsPath
	 * @param {T} value
	 * @returns {Promise<T>}
	 * @memberof FirebaseRTDBConfigurationStore
	 */
	protected updateData<T>(settingsPath: string, value: T): Promise<T> {
		throw new Error('Method not implemented.');
	}
}
