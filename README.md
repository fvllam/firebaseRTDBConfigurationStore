# firebaseRTDBConfigurationStore

Simple application settings or document storage using your Firebase project's Realtime Database. Global configurations will be stored under `/internal/global/` and user-specific configurations will be stored under `/internal/user/<userId>`.  The paths can be configured by passing optional arguments to the constructor.

# Prerequisite

This module should only be used within a Firebase project since it implicitly initializes the Firebase app to access the project's Firebase services.

# Usage

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
