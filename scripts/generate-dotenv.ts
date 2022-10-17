import fs from 'fs';
import crypto from 'crypto';

const salt = crypto.randomBytes(48).toString('hex');
const data = fs.readFileSync('example.env', 'utf-8');

const newData = data.replace('\r\n', '\n')
  .split('\n')
  .map(line => line.split(/=(.*)/, 2).map(part => part.trim()))
  .filter(([key]) => !['SALT', ''].includes(key))
  .map(parts => parts.join('='))
  .concat(`SALT=${salt}`)
  .join('\n');

fs.writeFileSync('.env', newData);
