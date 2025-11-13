const XLSX = require('xlsx');
const fs = require('fs');

// Excel date converter
const excelDateToJSDate = (serial) => {
  if (!serial || typeof serial !== 'number') return null;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
};

// Read Excel
const workbook = XLSX.readFile('TM Roster (1).xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, {header: 1});

let sql = '-- Auto-generated birthday import SQL\n';
sql += '-- Run this in Supabase SQL Editor\n\n';
sql += '-- First, add the date_of_birth column if not exists\n';
sql += 'ALTER TABLE team_members ADD COLUMN IF NOT EXISTS date_of_birth DATE;\n\n';
sql += '-- Insert team members with birthdays\n\n';

for (let i = 1; i < data.length; i++) {
  const row = data[i];
  if (!row[1]) continue; // Skip if no name

  const name = row[1].replace(/'/g, "''"); // Escape quotes
  const job = (row[2] || '').replace(/'/g, "''");
  const dob = excelDateToJSDate(row[7]);

  // Determine position
  let position = 'Server';
  if (job.includes('Host')) position = 'Host';
  else if (job.includes('Bar')) position = 'Bartender';
  else if (job.includes('Kitchen') || job.includes('Cook')) position = 'Kitchen';
  else if (job.includes('Bus')) position = 'Busser';
  else if (job.includes('Runner')) position = 'Runner';
  else if (job.includes('To Go')) position = 'To-Go';
  else if (job.includes('QA')) position = 'QA';
  else if (job.includes('Dish')) position = 'Dishwasher';
  else if (job.includes('Manager')) position = 'Manager';
  else if (job.includes('Server')) position = 'Server';

  sql += `INSERT INTO team_members (name, phone, email, position, date_of_birth)\n`;
  sql += `VALUES ('${name}', '-', '-', '${position}', ${dob ? `'${dob}'` : 'NULL'})\n`;
  sql += `ON CONFLICT DO NOTHING;\n\n`;
}

sql += '-- Done! This will import all team members with their birthdays.\n';

fs.writeFileSync('supabase/import_birthdays.sql', sql);
console.log('✅ Generated: supabase/import_birthdays.sql');
console.log('📊 Total records:', data.length - 1);
console.log('\n🚀 Next steps:');
console.log('1. Open Supabase Dashboard → SQL Editor');
console.log('2. Copy/paste contents of supabase/import_birthdays.sql');
console.log('3. Click RUN');
console.log('4. Refresh /birthdays page');
