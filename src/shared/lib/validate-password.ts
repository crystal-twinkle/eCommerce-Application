export default function validatePassword(password) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^&*])[A-Za-z\d@$!%^&*]{8,}$/;
  return passwordPattern.test(password);
}
