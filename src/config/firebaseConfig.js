import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
        apiKey: "AIzaSyDhEKuzq1eNoVhLy0KtA97XeGQjAEEKw3o",
        authDomain: "wireframer-cse316.firebaseapp.com",
        databaseURL: "https://wireframer-cse316.firebaseio.com",
        projectId: "wireframer-cse316",
        storageBucket: "wireframer-cse316.appspot.com",
        messagingSenderId: "182311183374",
        appId: "1:182311183374:web:45b68041da5f0682f5885f",
        measurementId: "G-16T4SENTP3"    
}
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;