import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, Upload, Download } from 'lucide-react';
import { supabase } from '../supabase';
import * as XLSX from 'xlsx';

const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliYellow: 'rgb(255, 198, 11)'
};

const INITIAL_TEAM_DATA = [
  { name: "Aarica Mccray", phone: "(248) 376-1436", email: "c00605mgr@chilis.com", position: "Server" },
  { name: "Alana Jonutz", phone: "(402) 415-4032", email: "ajonutz1357@gmail.com", position: "Server" },
  { name: "Alex Fillmore", phone: "(248) 933-5015", email: "afileo73@gmail.com", position: "Server" },
  { name: "Alexus Bass", phone: "(586) 823-9432", email: "alexusbass9@gmail.com", position: "Host" },
  { name: "Alicia Amador", phone: "(248) 875-9767", email: "Saharared52@gmail.com", position: "Server" },
  { name: "Allison OConnor-Foss", phone: "(248) 466-4642", email: "allisonoconnorfoss@gmail.com", position: "Host" },
  { name: "Alyssa Regan", phone: "(248) 210-9056", email: "reganalyssa21@gmail.com", position: "QA" },
  { name: "Andrew Hyttinen", phone: "(248) 983-7424", email: "drewhyt@gmail.com", position: "To-Go" },
  { name: "Antonio Rosas-Ocampo", phone: "(313) 213-4282", email: "tonitorosas56@gmail.com", position: "Busser" },
  { name: "Ashley Blackwell", phone: "(248) 873-6671", email: "Ashleyblackwell2021@gmail.com", position: "Server" },
  { name: "Autumn Morse", phone: "(248) 571-6797", email: "Morseautumn03@gmail.com", position: "Host" },
  { name: "Autumn Nelson", phone: "(947) 999-6129", email: "autumnnelson804@gmail.com", position: "Host" },
  { name: "Autumn Roll", phone: "(586) 272-4774", email: "c00605mgr@chilis.com", position: "Server" },
  { name: "Bailey Booker", phone: "(248) 930-2489", email: "baileybooker11@gmail.com", position: "Server" },
  { name: "Blake Jadczak", phone: "(248) 318-5779", email: "bjadczak827@gmail.com", position: "QA" },
  { name: "Brenda Batrez", phone: "(248) 825-0236", email: "brendaly6464@gmail.com", position: "Server" },
  { name: "Brie Uhley", phone: "-", email: "c00605mgr@chilis.com", position: "Shift Leader" },
  { name: "Canon Stoecker", phone: "(989) 378-4136", email: "notdanosuu@gmail.com", position: "Runner" },
  { name: "Charizma Northern", phone: "(248) 252-8090", email: "charizma.northern17@gmail.com", position: "Server" },
  { name: "Chase Petersen", phone: "(248) 884-8964", email: "Cpetersen1199@gmail.com", position: "Server" },
  { name: "Christopher JonesBarnes", phone: "-", email: "-", position: "Kitchen" },
  { name: "Chrys-Tal Murphy", phone: "(947) 239-5256", email: "cristal85.cm@gmail.com", position: "Night Cleaner" },
  { name: "Cici Dobbs", phone: "(248) 602-7131", email: "cicidobbs@icloud.com", position: "Server" },
  { name: "Connor Trojanowski", phone: "(313) 739-4477", email: "Connor8403@gmail.com", position: "Runner" },
  { name: "Cresta Ishler", phone: "(567) 461-8764", email: "ishlercresta@gmail.com", position: "Server" },
  { name: "Dennis Lehman", phone: "(248) 215-6690", email: "dennis.lehman2007@gmail.com", position: "Busser" },
  { name: "Devon Steed", phone: "(248) 277-1929", email: "devondteed25@yahoo.com", position: "Dishwasher" },
  { name: "Edwin Mendoza Perdomo", phone: "(248) 933-8481", email: "edwin782018@gmail.com", position: "Server" },
  { name: "Elisia Mauricio", phone: "(586) 277-9105", email: "elisiamauricio427@gmail.com", position: "Server" },
  { name: "Elizabeth Avila", phone: "(248) 982-3877", email: "avila2elizabeth@gmail.com", position: "Server" },
  { name: "Emma Tomas", phone: "(248) 214-5488", email: "emmanicole1317@gmail.com", position: "Server" },
  { name: "Emmanuel Arellano", phone: "(248) 466-4011", email: "auburnhillschilis@gmail.com", position: "Kitchen" },
  { name: "Esteban Torres", phone: "(248) 953-7826", email: "camaron13.at@icloud.com", position: "Kitchen" },
  { name: "Felipe Ochoa", phone: "-", email: "-", position: "Kitchen" },
  { name: "Gene Cottingham", phone: "(248) 747-1941", email: "imemc7374@yahoo.com", position: "Kitchen" },
  { name: "Guadalupe Ramos Ochoa", phone: "(248) 499-4584", email: "guadalupeochoa502@gmail.com", position: "Kitchen" },
  { name: "Hector Tiscareno", phone: "(248) 250-0701", email: "hecto.tiscareno@gmail.com", position: "Kitchen" },
  { name: "Herwin Albarracin", phone: "-", email: "c00605mgr@chilis.com", position: "Kitchen" },
  { name: "Hope Ridner", phone: "(248) 786-7575", email: "Hoperidner23@yahoo.com", position: "Server" },
  { name: "Irina Marmueva", phone: "(586) 222-5511", email: "famous5610@gmail.com", position: "To-Go" },
  { name: "Jason Ramos Ochoa", phone: "(248) 986-6712", email: "jasonramosochoa86@gmail.com", position: "Host" },
  { name: "Jason Roberts", phone: "(248) 915-8176", email: "robertsjason983@gmail.com", position: "Manager" },
  { name: "Jaxson Greenwood", phone: "(248) 296-5202", email: "greenwoodjax12@gmail.com", position: "Busser" },
  { name: "Jeff Fordyce", phone: "(248) 929-2886", email: "zrek8282@gmail.com", position: "Night Cleaner" },
  { name: "JJ Mendez", phone: "(248) 222-2190", email: "jjvitale9@gmail.com", position: "Busser" },
  { name: "Johanna Ramos", phone: "(248) 396-9080", email: "johannaochoa245@gmail.com", position: "QA" },
  { name: "John Olenski", phone: "(832) 756-5450", email: "johnolenski@gmail.com", position: "Manager" },
  { name: "Jose Abarca-Chavez", phone: "(248) 904-4119", email: "c00605mgr@chilis.com", position: "Kitchen" },
  { name: "Jose Carrasco", phone: "(702) 572-7331", email: "Ccja27452377@gmail.com", position: "Kitchen" },
  { name: "Josh Mabbitt", phone: "(586) 719-4442", email: "kingmabbitt9692@gmail.com", position: "Kitchen" },
  { name: "Juan Ochoa", phone: "(586) 260-0249", email: "famous5610@gmail.com", position: "Kitchen" },
  { name: "Kara Gallegly", phone: "(810) 834-4092", email: "karag123@icloud.com", position: "Server" },
  { name: "Kermit Manigault", phone: "(943) 266-0276", email: "manigaultjavonte@gmail.com", position: "Host" },
  { name: "Kuumba Touray", phone: "(248) 759-6373", email: "Kuumbaktouray@gmail.com", position: "Host" },
  { name: "Lauren Parrott", phone: "(248) 222-9735", email: "laurenparrott05@icloud.com", position: "Server" },
  { name: "Lela Huff", phone: "(248) 402-3470", email: "lelahuff07@gmail.com", position: "Server" },
  { name: "Leslie Bernal Martinez", phone: "(248) 622-9024", email: "Jadu.blossom25@gmail.com", position: "Busser" },
  { name: "Leslie Richmond", phone: "(810) 201-0223", email: "Murfee2221922@icloud.com", position: "Runner" },
  { name: "Lettie Talley", phone: "(810) 294-9627", email: "careerminded10@gmail.com", position: "Server" },
  { name: "Lilli Stivers", phone: "(586) 924-0883", email: "lil.stivs13@gmail.com", position: "To-Go" },
  { name: "Lynda Bernard", phone: "(313) 741-9460", email: "lynberna7school@gmail.com", position: "Host" },
  { name: "Matthew Staines", phone: "(111) 111-1111", email: "c00605mgr@chilis.com", position: "Shift Leader" },
  { name: "Mike D Drapinski", phone: "(248) 860-2234", email: "c00605mgr@chilis.com", position: "Night Cleaner" },
  { name: "Nick Contreras", phone: "(404) 637-5987", email: "c00605mgr@chilis.com", position: "Server" },
  { name: "Nicole Sullivan", phone: "(248) 980-4405", email: "nicolesullivan7640@gmail.com", position: "Server" },
  { name: "Pedro Zambrano", phone: "(248) 877-2518", email: "Pedrocuauro94@gmail.com", position: "Kitchen" },
  { name: "Pierre Wallace", phone: "(248) 515-3777", email: "pierre.wallace17@gmail.com", position: "Runner" },
  { name: "Pratheepan Sivanathan", phone: "(737) 336-5698", email: "spratheepan@gmail.com", position: "Kitchen" },
  { name: "Riley Otzenberger", phone: "(586) 804-0054", email: "rileyotzenberger0407@gmail.com", position: "Kitchen" },
  { name: "Ruperto Ramos", phone: "(248) 499-2686", email: "c00605mgr@chilis.com", position: "Kitchen" },
  { name: "Sadie Siemen", phone: "(810) 867-0720", email: "sadiesiemen@oakland.edu", position: "Host" },
  { name: "Sam Barkley", phone: "(248) 781-6206", email: "sambarkley557@gmail.com", position: "Runner" },
  { name: "Sandra Zamora", phone: "(248) 250-0701", email: "zsandra32@yahoo.com", position: "Kitchen" },
  { name: "Selena Barnstable", phone: "(248) 749-0116", email: "Lenabearv07@gmail.com", position: "Runner" },
  { name: "Selvon Davis", phone: "(248) 630-4665", email: "selvondavis19@gmail.com", position: "Busser" },
  { name: "Sydney Shefferly", phone: "(248) 894-4256", email: "sydneyshefferly1@icloud.com", position: "Server" },
  { name: "Tarzar Jackson", phone: "(248) 285-8155", email: "tarzaranthonyjackson@icloud.com", position: "Host" },
  { name: "Tiffany Rodriguez", phone: "(313) 912-5662", email: "sweetnessalways89@yahoo.com", position: "Manager" },
  { name: "Tiffany Wright", phone: "(586) 722-4594", email: "Tiffany.noel.wright@gmail.com", position: "Manager" },
  { name: "Tracy Anderson", phone: "(248) 945-2771", email: "c00605mgr@chilis.com", position: "Shift Leader" },
  { name: "Tyanna Denny", phone: "(313) 439-5868", email: "darealparismarie2002@icloud.com", position: "Server" },
  { name: "Ulysses Scott", phone: "(248) 222-2168", email: "ulyscottv156@gmail.com", position: "Busser" },
  { name: "Valerie Raiss", phone: "(248) 568-3938", email: "Valerie.raiss@gmail.com", position: "Server" },
  { name: "Will Scruggs", phone: "(248) 678-5283", email: "williebear94@gmail.com", position: "Server" }
];

const TeamManagement = ({ manager }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: '',
    position: 'Server'
  });

  const positions = ['All', 'Server', 'Host', 'Runner', 'Busser', 'Bartender', 'To-Go', 'QA', 'Kitchen', 'Dishwasher', 'Shift Leader', 'Manager', 'Night Cleaner'];

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('team_members')
        .insert([newMember]);

      if (error) throw error;

      setNewMember({ name: '', phone: '', email: '', position: 'Server' });
      setShowAddForm(false);
      await loadTeamMembers();
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Failed to add team member');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member');
    }
  };

  const handleImportInitialData = async () => {
    if (!window.confirm(`Import ${INITIAL_TEAM_DATA.length} team members from the Excel file?`)) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .insert(INITIAL_TEAM_DATA);

      if (error) throw error;
      await loadTeamMembers();
      alert('Team members imported successfully!');
    } catch (error) {
      console.error('Error importing team members:', error);
      alert('Failed to import team members');
    }
  };

  // Convert Excel date serial number to Month-Day only (no year for privacy)
  const excelDateToMonthDay = (serial) => {
    if (!serial || typeof serial !== 'number') return null;
    // Excel dates are days since 1900-01-01
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const month = String(date_info.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date_info.getUTCDate()).padStart(2, '0');
    return `--${month}-${day}`; // ISO 8601 partial date format (e.g., --02-04)
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Get data with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0];

      // Find column indexes
      const nameIdx = headers.findIndex(h => h === 'Legal Name' || h === 'All Employees');
      const jobIdx = headers.findIndex(h => h === 'Primary Job' || h.includes('Job'));
      const dobIdx = headers.findIndex(h => h === 'Date of Birth');

      // Parse data rows (skip header)
      const teamData = jsonData
        .slice(1)
        .filter(row => row[nameIdx]) // Must have a name
        .map(row => {
          // Extract position from job title
          let position = 'Server'; // default
          const jobTitle = row[jobIdx] || '';

          if (jobTitle.includes('Server')) position = 'Server';
          else if (jobTitle.includes('Host')) position = 'Host';
          else if (jobTitle.includes('Bar')) position = 'Bartender';
          else if (jobTitle.includes('Kitchen') || jobTitle.includes('Cook')) position = 'Kitchen';
          else if (jobTitle.includes('Bus')) position = 'Busser';
          else if (jobTitle.includes('Runner') || jobTitle.includes('Food Runner')) position = 'Runner';
          else if (jobTitle.includes('To Go') || jobTitle.includes('ToGo')) position = 'To-Go';
          else if (jobTitle.includes('QA')) position = 'QA';
          else if (jobTitle.includes('Dish')) position = 'Dishwasher';
          else if (jobTitle.includes('Manager')) position = 'Manager';
          else if (jobTitle.includes('Shift Leader')) position = 'Shift Leader';
          else if (jobTitle.includes('Night Cleaner')) position = 'Night Cleaner';

          return {
            name: row[nameIdx],
            phone: '-',
            email: '-',
            position: position,
            date_of_birth: dobIdx >= 0 ? excelDateToMonthDay(row[dobIdx]) : null
          };
        })
        .filter(member => member.name && member.name.trim() !== '');

      if (teamData.length === 0) {
        alert('No valid team members found in the Excel file');
        return;
      }

      const withBirthdays = teamData.filter(m => m.date_of_birth).length;
      const confirmImport = window.confirm(
        `Found ${teamData.length} team members (${withBirthdays} with birthdays). Import them?`
      );

      if (!confirmImport) return;

      const { error } = await supabase
        .from('team_members')
        .insert(teamData);

      if (error) throw error;

      await loadTeamMembers();
      alert(`Successfully imported ${teamData.length} team members! (${withBirthdays} with birthdays)`);
      event.target.value = ''; // Reset file input
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to import Excel file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = filterPosition === 'All' || member.position === filterPosition;
    return matchesSearch && matchesPosition;
  });

  return (
    <div style={{ backgroundColor: colors.chiliNavy, minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold" style={{ color: 'white' }}>
            Team Management
          </h1>

          <div style={{ width: '150px' }}></div>
        </div>

        {/* Action Bar */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  maxWidth: '400px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `2px solid ${colors.chiliGreen}`,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              />

              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: `2px solid ${colors.chiliGreen}`,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              >
                {positions.map(pos => (
                  <option key={pos} value={pos} style={{ backgroundColor: colors.chiliNavy }}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: uploading ? colors.chiliGray : colors.chiliYellow,
                  color: colors.chiliNavy,
                  opacity: uploading ? 0.6 : 1
                }}
              >
                <Upload size={20} />
                {uploading ? 'Uploading...' : 'Upload Excel File'}
              </button>
              {teamMembers.length === 0 && (
                <button
                  onClick={handleImportInitialData}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: colors.chiliRed, color: 'white' }}
                >
                  <Download size={20} />
                  Quick Import ({INITIAL_TEAM_DATA.length})
                </button>
              )}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                style={{ backgroundColor: colors.chiliGreen, color: 'white' }}
              >
                <UserPlus size={20} />
                Add Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', marginBottom: '20px', border: `2px solid ${colors.chiliGreen}` }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliGreen }}>
              Add New Team Member
            </h2>
            <form onSubmit={handleAddMember} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Name *</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Phone</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Position *</label>
                <select
                  required
                  value={newMember.position}
                  onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  {positions.filter(p => p !== 'All').map(pos => (
                    <option key={pos} value={pos} style={{ backgroundColor: colors.chiliNavy }}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: colors.chiliGreen, color: 'white' }}
                >
                  Add Team Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div className="text-3xl font-bold" style={{ color: colors.chiliGreen }}>{teamMembers.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>Total Team Members</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div className="text-3xl font-bold" style={{ color: colors.chiliYellow }}>{teamMembers.filter(m => m.position === 'Server').length}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>Servers</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div className="text-3xl font-bold" style={{ color: colors.chiliRed }}>{teamMembers.filter(m => m.position === 'Kitchen').length}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>Kitchen</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div className="text-3xl font-bold" style={{ color: 'white' }}>{filteredMembers.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>Filtered Results</div>
          </div>
        </div>

        {/* Team Members Table */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.chiliGreen, fontWeight: 'bold' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.chiliGreen, fontWeight: 'bold' }}>Phone</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.chiliGreen, fontWeight: 'bold' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: colors.chiliGreen, fontWeight: 'bold' }}>Position</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: colors.chiliGreen, fontWeight: 'bold' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                      Loading team members...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                      No team members found. {teamMembers.length === 0 && 'Click "Import Excel Data" to get started!'}
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, index) => (
                    <tr
                      key={member.id}
                      style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                      }}
                    >
                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>{member.name}</td>
                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>{member.phone}</td>
                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>{member.email}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            backgroundColor: colors.chiliGreen,
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          {member.position}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: colors.chiliRed, color: 'white' }}
                          title="Delete team member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
