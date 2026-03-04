// Firestore imports (TOP of the file)
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";


// your other code below
import {
    onAuthReady
} from "./authentication.js"

// Function to read the quote of the day from Firestore
function readQuote(day) {
    const quoteDocRef = doc(db, "quotes", day); // Get a reference to the document
  
    onSnapshot(
      quoteDocRef,
      (docSnap) => {
        // Listen for real-time updates
        if (docSnap.exists()) {
          //Document existence check
          document.getElementById("quote-goes-here").innerHTML =
            docSnap.data().quote;
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        //Listener/system error
        console.error("Error listening to document: ", error);
      },
    );
  }

function addHikeData() {
    const hikesRef = collection(db, "hikes");
    console.log("Adding sample hike data...");

    addDoc(hikesRef, {
        code: "BBY01",
        name: "Burnaby Lake Park Trail",
        city: "Burnaby",
        level: "easy",
        details: "A lovely place for a lunch walk.",
        length: 10,
        hike_time: 60,
        lat: 49.2467097082573,
        lng: -122.9187029619698,
        last_updated: serverTimestamp()
    });

    addDoc(hikesRef, {
        code: "AM01",
        name: "Buntzen Lake Trail",
        city: "Anmore",
        level: "moderate",
        details: "Close to town, and relaxing.",
        length: 10.5,
        hike_time: 80,
        lat: 49.3399431028579,
        lng: -122.8590849676639,
        last_updated: serverTimestamp()
    });

    addDoc(hikesRef, {
        code: "NV01",
        name: "Mount Seymour Trail",
        city: "North Vancouver",
        level: "hard",
        details: "Amazing ski slope views.",
        length: 8.2,
        hike_time: 120,
        lat: 49.38847101455571,
        lng: -122.94092543551031,
        last_updated: serverTimestamp()
    });
}
// Seeds the "hikes" collection with initial data if it is empty
async function seedHikes() {

    const hikesRef = collection(db, "hikes");
    const querySnapshot = await getDocs(hikesRef);

    if (querySnapshot.empty) {

        console.log("Hikes collection is empty. Seeding data...");
        addHikeData();

    } else {

        console.log("Hikes collection already contains data. Skipping seed.");
    }
}

// Call the seeding function when the main.html page loads.
seedHikes();

function displayCardsDynamically() {
    let cardTemplate = document.getElementById("hikeCardTemplate");
    const hikesCollectionRef = collection(db, "hikes");

    getDocs(hikesCollectionRef)
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

                // Clone the template
                let newcard = cardTemplate.content.cloneNode(true);   //cardTemplate.content gives inside of the template. cloneNode(true) make a deep copy
                const hike = doc.data();

                // Populate the card
                newcard.querySelector('.card-title').textContent = hike.name;
                newcard.querySelector('.card-text').textContent = hike.details || `Located in ${hike.city}.`;
                newcard.querySelector('.card-length').textContent = hike.length;

                // Append to container
                document.getElementById("hikes-go-here").appendChild(newcard);
            });

        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
}

displayCardsDynamically();
// Function to read the quote of the day from Firestore
function readQuote(day) {
    const quoteDocRef = doc(db, "quotes", day); // Get a reference to the document

    onSnapshot(quoteDocRef, docSnap => { // Listen for real-time updates
        if (docSnap.exists()) {          //Document existence check
            document.getElementById("quote-goes-here").innerHTML = docSnap.data().quote;
        } else {
            console.log("No such document!");
        }
    }, (error) => {                      //Listener/system error
        console.error("Error listening to document: ", error);
    });
}

readQuote("Tuesday");

function showName() {
      const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

      // Wait for Firebase to determine the current authentication state.
      // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
      // The user's name is extracted from the Firebase Authentication object
      // You can "go to console" to check out current users. 
      onAuthReady((user) => {
          if (!user) {
              // If no user is signed in → redirect back to login page.
              location.href = "index.html";
              return;
          }

          // If a user is logged in:
          // Use their display name if available, otherwise show their email.
          const name = user.displayName || user.email;

          // Update the welcome message with their name/email.
          if (nameElement) {
              nameElement.textContent = `${name}!`;
          }
      });
}

showName();

