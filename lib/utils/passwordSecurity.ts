// Common weak passwords that should be blocked
const COMMON_PASSWORDS = [
  "password",
  "password123",
  "123456",
  "12345678",
  "123456789",
  "qwerty",
  "abc123",
  "monkey",
  "1234567",
  "letmein",
  "trustno1",
  "dragon",
  "baseball",
  "iloveyou",
  "master",
  "sunshine",
  "ashley",
  "bailey",
  "passw0rd",
  "shadow",
  "123123",
  "654321",
  "superman",
  "qazwsx",
  "michael",
  "football",
  "admin",
  "admin123",
  "test",
  "test123",
  "welcome",
  "welcome123",
  "login",
  "pass",
  "pass123",
];

// Check if password is in the common passwords list
export function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return COMMON_PASSWORDS.some(
    (commonPass) =>
      lowerPassword === commonPass || lowerPassword.includes(commonPass)
  );
}

// Calculate comprehensive password strength (0-5)
export function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Check length
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("Password is too short (minimum 8 characters)");
  }

  if (password.length >= 12) {
    score++;
  }

  // Check for lowercase and uppercase
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  if (hasLower && hasUpper) {
    score++;
  } else if (!hasLower || !hasUpper) {
    feedback.push("Use both uppercase and lowercase letters");
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("Add at least one number");
  }

  // Check for special characters
  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("Add at least one special character (!@#$%^&*)");
  }

  // Check for common passwords
  if (isCommonPassword(password)) {
    score = Math.max(0, score - 2);
    feedback.push("This password is too common - choose something unique");
  }

  return { score: Math.min(score, 5), feedback };
}

// Get strength label and color
export function getPasswordStrengthInfo(score: number): {
  label: string;
  color: string;
  textColor: string;
} {
  switch (score) {
    case 0:
    case 1:
      return { label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    case 2:
      return {
        label: "Fair",
        color: "bg-orange-500",
        textColor: "text-orange-500",
      };
    case 3:
      return {
        label: "Good",
        color: "bg-yellow-500",
        textColor: "text-yellow-500",
      };
    case 4:
      return {
        label: "Strong",
        color: "bg-green-500",
        textColor: "text-green-500",
      };
    case 5:
      return {
        label: "Very Strong",
        color: "bg-emerald-500",
        textColor: "text-emerald-500",
      };
    default:
      return { label: "", color: "bg-gray-700", textColor: "text-gray-500" };
  }
}
