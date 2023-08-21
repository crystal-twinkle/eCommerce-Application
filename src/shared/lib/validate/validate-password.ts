export default function validatePassword(password: string) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%^&*])(?!.*\s).{8,}$/;
  return passwordPattern.test(password);
}
