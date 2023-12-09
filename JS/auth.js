const msalConfig = {
  auth: {
    clientId: "dd4d4393-7d99-44d5-bddf-674e3880656e",
    authority:
      "https://mystreams.b2clogin.com/mystreams.onmicrosoft.com/B2C_1_mystream",
    knownAuthorities: ["mystreams.b2clogin.com"],
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

function signIn() {
  msalInstance.loginRedirect({
    scopes: ["openid", "profile"],
  });
}

function joinNow() {
  msalInstance.loginRedirect({
    scopes: ["openid", "profile"],
  });
}

function signOut() {
  msalInstance.logout();
}

function showWelcomeMessage(account) {
  // Set welcome message
  document.getElementById(
    "welcomeMessage"
  ).innerText = `Welcome, ${account.name}`;
  document.getElementById("welcomeMessage").style.display = "block";

  // Hide Sign In link and show Sign Out link
  document.getElementById("authNav").style.display = "none";
  document.getElementById("signOutButton").style.display = "block";

  // Show main content (form and other elements that require authentication)
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("watchVideos").style.display = "block";
}

// Modify this function to hide elements when the user is not signed in
function hideContentForUnauthenticatedUser() {
  // Hide welcome message
  document.getElementById("welcomeMessage").style.display = "none";

  // Show Sign In link and hide Sign Out link
  document.getElementById("authNav").style.display = "block";
  document.getElementById("signOutButton").style.display = "none";

  // Hide main content
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("watchVideos").style.display = "none";
}

// Update the handleResponse function
// function handleResponse(response) {
//   if (response !== null && response.account !== null) {
//     sessionStorage.setItem("msalAccount", response.account.username);
//     showWelcomeMessage(response.account);
//   } else {
//     const currentAccounts = msalInstance.getAllAccounts();
//     if (!currentAccounts || currentAccounts.length < 1) {
//       hideContentForUnauthenticatedUser();
//       return;
//     }
//     showWelcomeMessage(currentAccounts[0]);
//   }
// }

function handleResponse(response) {
  if (response !== null && response.account !== null) {
    sessionStorage.setItem("msalAccount", response.account.username);
    showWelcomeMessage(response.account);

    // Check if the logged-in user's email matches the specific email
    if (response.account.username === "sacharya979@gmail.com") {
      // Display upload form
      document.getElementById("uploadForm").style.display = "block";
      document.getElementById("watchVideos").style.display = "none";
    } else if (response.account.username === "secondemail@example.com") {
      // Hide upload form
      document.getElementById("uploadForm").style.display = "none";
      document.getElementById("watchVideos").style.display = "block";
    }
  } else {
    hideContentForUnauthenticatedUser();
  }
}

msalInstance
  .handleRedirectPromise()
  .then(handleResponse)
  .catch((err) => {
    console.error(err);
  });

document.addEventListener("DOMContentLoaded", (event) => {
  let account = sessionStorage.getItem("msalAccount");
  if (account) {
    showWelcomeMessage({ name: account });
  }
});
