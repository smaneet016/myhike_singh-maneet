import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

// -------------------------------------------------------------
// Function to populate user info in the profile form
// Fetches user data from Firestore and fills in the form fields
// -------------------------------------------------------------
function populateUserInfo() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Reference to the user document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Unpack the data
          const userData = userSnap.data();

          // Extract the fields
          const { name = "", school = "", city = "" } = userData;

          // Update the form fields
          document.getElementById("nameInput").value = name;
          document.getElementById("schoolInput").value = school;
          document.getElementById("cityInput").value = city;
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting user document:", error);
      }
    } else {
      console.log("No user is signed in");
    }
  });
}

// Run the function
populateUserInfo();

// -------------------------------------------------------------
// Function to enable editing of user info form fields
// -------------------------------------------------------------
document.querySelector("#editButton").addEventListener("click", editUserInfo);

function editUserInfo() {
  document.getElementById("personalInfoFields").disabled = false;
}

// -------------------------------------------------------------
// Function to save user info to Firestore
// -------------------------------------------------------------
document.querySelector("#saveButton").addEventListener("click", saveUserInfo);

async function saveUserInfo() {
  const user = auth.currentUser;

  if (!user) {
    console.log("No user logged in");
    return;
  }

  try {
    // Reference to the user document
    const userRef = doc(db, "users", user.uid);

    // Get values from input fields
    const name = document.getElementById("nameInput").value;
    const school = document.getElementById("schoolInput").value;
    const city = document.getElementById("cityInput").value;

    // Update Firestore document
    await updateDoc(userRef, {
      name: name,
      school: school,
      city: city
    });

    console.log("Profile successfully updated!");

    // Disable the fieldset again after saving
    document.getElementById("personalInfoFields").disabled = true;

  } catch (error) {
    console.error("Error updating profile:", error);
  }
}