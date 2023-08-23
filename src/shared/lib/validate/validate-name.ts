export default function validateName(value: string): boolean {
  const pattern = /^[^\d!@#№$%^&*()_+=[\]{}|;:'"<>,.?/\\]+$/u;
  return pattern.test(value);
}
