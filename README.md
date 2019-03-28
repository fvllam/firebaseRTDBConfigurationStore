# FirebaseRTDBConfigurationStore

Simple application settings or document storage using your Firebase project's Realtime Database. Global configurations will be stored under `/internal/global/` and user-specific configurations will be stored under `/internal/user/<userId>`. The paths can be configured by passing optional arguments to the constructor.

# Prerequisite

This module can be used within a Firebase project since it can implicitly initialize the Firebase app to access the project's Firebase services. It can also be used in a standalone project, such as with [Express](https://expressjs.com/).

# Usage

## Initialization

Before anything can be read or written to the Realtime database the library must be initialized. This is a necessary step to setup the Firebase configuration. There are two types of initialization available.

### Initialize with Options

The first type of initialization available allows the library to be initialized with the default [Firebase Admin](https://firebase.google.com/docs/admin/setup) instance. If there are no other Firebase Admin instances being used in the project then this is the quickest, and easiest option available.

It also provides an optional `options` parameter that allows custom Firebase Admin `AppOptions` to be used. This is required when using the library outside of [Firebase Functions](https://firebase.google.com/docs/functions/).

```ts
public init(options?: admin.AppOptions): this
```

### Initialize with an Existing Firebase Admin Instance

The second type of initialization available allows the library to be initialized with an existing instance of Firebase Admin. The Admin library does not prefer multiple initializations so this allows this library to reuse one that has already been created. This option also works outside of Firebase functions.

```ts
public initWithAdminInstance(firebaseAdminInstance: typeof admin): this
```

## Create and initialize the object.

```ts
const currentUserId = '1234';
const settings = new FirebaseRTDBConfigurationStore(currentUserId, '/custom/pathToGlobalConfig/', '/custom/pathToUserConfig');
return settings.init().then(() => {...});
```

## Retrieve values by key or get it's default value if a value doesn't exist for the key.

```ts
return settings.getGlobalData('someKey', 'default value')
.then(globalValue => ...);
```

```ts
return settings.getUserData('someOtherKey', 'default value')
.then(userValue => ...);
```

## Set the key-value pair.

```ts
return settings.setGlobalData('someKey', 'some value')
.then(globalValue => ...);
```

```ts
return settings.setUserData('someOtherKey', 'some value')
.then(userValue => ...);
```
