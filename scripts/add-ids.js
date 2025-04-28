const fs = require('fs');
const path = require('path');

const membersPath = path.join(__dirname, '../src/data/members.json');

const membersData = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

const updatedMembers = membersData.map((member, index) => ({
  id: index + 1,
  ...member,
}));

fs.writeFileSync(membersPath, JSON.stringify(updatedMembers, null, 2));

console.log('ID 추가 완료!');
