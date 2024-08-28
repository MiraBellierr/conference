import firebase from "@react-native-firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyBi3IW-Dw9bBbDyaqqb9NfMXyKUBfcDwmU",
  appId: "1:653716565351:android:90ae74158418e6267353c2",
  projectId: 'conference-55fd6',
  databaseURL: "https://conference-55fd6-default-rtdb.asia-southeast1.firebasedatabase.app/",
  messagingSenderId: "653716565351",
  storageBucket: "gs://conference-55fd6.appspot.com",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase Initialized")
} else {
  firebase.app(); // if already initialized, use that one
}
