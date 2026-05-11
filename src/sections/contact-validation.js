const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name, email, message }) {
  const e = {};
  if (!name?.trim()) e.name = 'Required';
  if (!email?.trim()) e.email = 'Required';
  else if (!EMAIL.test(email)) e.email = 'Invalid email';
  if (!message?.trim()) e.message = 'Required';
  return e;
}
