const SESSION_KEY = "tiptopWarrantySession";
const CLAIMS_KEY = "tiptopWarrantyClaims";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function saveSession(username) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user: username, loggedInAt: new Date().toISOString() }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Redirects to the login page if there's no session, and fills in the
// "signed in as" / sign-out controls when there is one. Call on every
// page except the login page itself.
function requireSession() {
  const session = getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  const userEl = document.getElementById("sessionUser");
  if (userEl) userEl.textContent = session.user;
  const signOutEl = document.getElementById("signOutLink");
  if (signOutEl) {
    signOutEl.addEventListener("click", (e) => {
      e.preventDefault();
      clearSession();
      window.location.href = "index.html";
    });
  }
  return session;
}

function getClaims() {
  try {
    return JSON.parse(localStorage.getItem(CLAIMS_KEY)) || [];
  } catch {
    return [];
  }
}

function addClaim(record) {
  const list = getClaims();
  list.unshift(record);
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(list));
}

function getClaim(claimId) {
  return getClaims().find((c) => c.claimId === claimId) || null;
}

// Returns the updated claim, or null if claimId wasn't found.
function updateClaimStatus(claimId, { status, approvedBy, note }) {
  const list = getClaims();
  const claim = list.find((c) => c.claimId === claimId);
  if (!claim) return null;
  claim.status = status;
  claim.statusUpdatedAt = new Date().toISOString();
  if (approvedBy) claim.approvedBy = approvedBy;
  if (note) claim.statusNote = note;
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(list));
  return claim;
}
