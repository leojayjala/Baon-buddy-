// Helper to convert Firebase Auth errors into beginner-friendly messages.
// Firebase returns error codes like "auth/invalid-credential".
// We map the common ones to something readable for users.

export function getAuthErrorMessage(error) {
  const code = error?.code ?? "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password": // older code (kept for compatibility)
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with that email. Please register first.";
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a bit and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";
    default:
      return error?.message ?? "Something went wrong. Please try again.";
  }
}

