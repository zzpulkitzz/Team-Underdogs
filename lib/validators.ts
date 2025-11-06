export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long"
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least one number"
  }

  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter"
  }

  return null
}

export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}
