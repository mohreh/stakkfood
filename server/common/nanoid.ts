import { customAlphabet } from 'nanoid';

export const idGenerator = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
);

export const authenticationCodeGenerator = customAlphabet('0123456789', 5);
