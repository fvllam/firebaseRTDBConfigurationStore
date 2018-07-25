import * as admin from 'firebase-admin';

export interface IConfiguration {
	init(): Promise<IConfiguration>;
	setGlobalData<T>(key: string, value: T): Promise<T>;
	getGlobalData<T>(key: string, defaultValue?: T): Promise<T>;
	setUserData<T>(key: string, value: T): Promise<T>;
	getUserData<T>(key: string, defaultValue?: T): Promise<T>;
}

export class FirebaseRTDBConfigurationStore {
	db: admin.database.Database;

	constructor(firebaseInitializer: () => void, public userID: string) {
		firebaseInitializer();
	}

	private setData<T>(settingsPath: string, value: T): Promise<T> {
		const dbPath = this.db.ref(settingsPath);
		return dbPath.set(value).then(() => value);
	}

	private getData<T>(settingsPath: string, defaultValue?: T): Promise<T> {
		const dbPath = this.db.ref(settingsPath);
		return dbPath.once('value').then(data => {
			const val = data.val();
			if (val === null && defaultValue !== undefined) return this.setData(settingsPath, defaultValue);
			return val;
		});
	}

	init(): Promise<IConfiguration> {
		this.db = admin.database();
		return Promise.resolve(this);
	}

	private getGlobalSettingsPath(key: string): string {
		return `internal/global/${key}`;
	}

	private getUserSettingsPath(key: string): string {
		return `internal/user/${this.userID}/${key}`;
	}

	setGlobalData<T>(key: string, value: T): Promise<T> {
		return this.setData<T>(this.getGlobalSettingsPath(key), value);
	}

	getGlobalData<T>(key: string, defaultValue?: T): Promise<T> {
		return this.getData<T>(this.getGlobalSettingsPath(key), defaultValue);
	}

	setUserData<T>(key: string, value: T): Promise<T> {
		return this.setData<T>(this.getUserSettingsPath(key), value);
	}

	getUserData<T>(key: string, defaultValue?: T): Promise<T> {
		return this.getData<T>(this.getUserSettingsPath(key), defaultValue);
	}
}
