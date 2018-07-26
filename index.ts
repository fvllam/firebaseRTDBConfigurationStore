import * as admin from "firebase-admin"

export interface IConfiguration {
  init(): Promise<IConfiguration>
  setGlobalData<T>(key: string, value: T): Promise<T>
  getGlobalData<T>(key: string, defaultValue?: T): Promise<T>
  setUserData<T>(key: string, value: T): Promise<T>
  getUserData<T>(key: string, defaultValue?: T): Promise<T>
}

export function initializeFirebase() {
  if (admin.apps.length === 0) {
    //admin.initializeApp(functions.config().firebase)
    admin.initializeApp()
    console.log("firebase app initialized", admin.apps.length)
  } else console.log("firebase app ALREADY initialized", admin.apps.length)
}

export class FirebaseRTDBConfigurationStore {
  db: admin.database.Database

  constructor(public userID: string, private globalPath = 'internal/global/', private userPath = 'internal/user/') {}

  private setData<T>(settingsPath: string, value: T): Promise<T> {
    const dbPath = this.db.ref(settingsPath)
    return dbPath.set(value).then(() => value)
  }

  private getData<T>(settingsPath: string, defaultValue?: T): Promise<T> {
    const dbPath = this.db.ref(settingsPath)
    return dbPath.once("value").then(data => {
      const val = data.val()
      if (val === null && defaultValue !== undefined) return this.setData(settingsPath, defaultValue)
      return val
    })
  }

  init(): Promise<IConfiguration> {
    initializeFirebase()
    this.db = admin.database()
    return Promise.resolve(this)
  }

  private getGlobalSettingsPath(key: string): string {
    return `${this.globalPath}${key}`
  }

  private getUserSettingsPath(key: string): string {
    return `${this.userPath}${this.userID}/${key}`
  }

  setGlobalData<T>(key: string, value: T): Promise<T> {
    return this.setData<T>(this.getGlobalSettingsPath(key), value)
  }

  getGlobalData<T>(key: string, defaultValue?: T): Promise<T> {
    return this.getData<T>(this.getGlobalSettingsPath(key), defaultValue)
  }

  setUserData<T>(key: string, value: T): Promise<T> {
    return this.setData<T>(this.getUserSettingsPath(key), value)
  }

  getUserData<T>(key: string, defaultValue?: T): Promise<T> {
    return this.getData<T>(this.getUserSettingsPath(key), defaultValue)
  }
}
