export default function notEmpty(value: string): boolean {
  const pattern = /^[^\d!@#№$%^&*()_+=[\]{}|;:'"<>,.?/\\]+$/u;
  return pattern.test(value);
}
