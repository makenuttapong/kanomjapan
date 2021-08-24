import firebase from 'firebase';
import "firebase/firestore"
import "firebase/auth"

var firebaseConfig = {
  apiKey: "AIzaSyDsSLgMNVN4DyBVd7U41fBPmiqdWDRdaqw",
  authDomain: "shoppingleay.firebaseapp.com",
  projectId: "shoppingleay",
  storageBucket: "shoppingleay.appspot.com",
  messagingSenderId: "31626078655",
  appId: "1:31626078655:web:7a375e2d0054f6eba9d90a",
  measurementId: "G-MHX7QB2FXL"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;

const providerGoogle= new firebase.auth.GoogleAuthProvider();

export const providerG = providerGoogle.setCustomParameters({
  prompt: 'select_account'
});

const providerFacebook= new firebase.auth.FacebookAuthProvider();
providerFacebook.addScope('public_profile')
export const providerF = providerFacebook.setCustomParameters({
  display: 'popup',
  auth_type: 'reauthenticate'
});