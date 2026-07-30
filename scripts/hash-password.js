#!/usr/bin/env node
const { hashPassword } = require('../server/auth');

const password = process.argv[2];
if (!password) {
  console.error('Использование: npm run hash-password -- "<пароль>"');
  process.exit(1);
}

console.log(hashPassword(password));
