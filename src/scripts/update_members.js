const fs = require('fs');
const path = require('path');

const membersPath = path.join(__dirname, '../data/members.json');
const additionalDataPath = path.join(__dirname, '../data/addtional_data.json');

// Read the JSON files
const members = JSON.parse(fs.readFileSync(membersPath, 'utf8'));
const additionalData = JSON.parse(fs.readFileSync(additionalDataPath, 'utf8'));

// Create a map of name and party to email
const emailMap = new Map();
additionalData.rows.forEach((row) => {
  const key = `${row.name}-${row.partyName}`;
  emailMap.set(key, row.email);
});

// Update members with email information
members.forEach((member) => {
  const key = `${member.name}-${member.party}`;
  if (emailMap.has(key)) {
    member.email = emailMap.get(key);
  }
});

// Write the updated members back to the file
fs.writeFileSync(membersPath, JSON.stringify(members, null, 2), 'utf8');

console.log('Members updated with email information');
