import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

console.log("profile.js loaded");

// -------------------------------------------------------------
// Function to populate user info in the profile form
// -------------------------------------------------------------
function populateUserInfo() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const { name = "", school = "", city = "" } = userData;

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

// run function
populateUserInfo();

// -------------------------------------------------------------
// Edit button
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("editButton");

  if (editButton) {
    editButton.addEventListener("click", editUserInfo);
  } else {
    console.log("editButton not found");
  }
});

function editUserInfo() {
  console.log("Edit clicked");
  document.getElementById("personalInfoFields").disabled = false;
}