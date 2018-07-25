# firebaseRTDBConfigurationStore
Simple application settings or document storage using your Firebase project's Realtime Database.  Global configurations will be stored under `/internal/global/` and user-specific configurations will be stored under `/internal/users/<userId>`.

# Prerequisite
You need to initialize access to Firebase services before using this module.  Something like this if using this from Firebase Cloud Functions:

```ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
function initializeFirebase() {
	if (admin.apps.length === 0) {
		admin.initializeApp(functions.config().firebase);
	}
}
```

# Usage
## Create and initialize the object.
 
 ```ts
 const currentUserId = '1234';
 const settings = new FirebaseRTDBConfigurationStore(initializeFirebase, currentUserId);
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