import { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Hero');
  const tabs = ['Hero', 'About', 'Experience', 'Achievement', 'Organization', 'Volunteer', 'Portfolio', 'Contact'];

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <a href="/" className="btn-back">← Back to Site</a>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`admin-nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>
        <main className="admin-main-content">
          {activeTab === 'Hero' && <HeroAdmin />}
          {activeTab === 'About' && <AboutAdmin />}
          {activeTab === 'Experience' && <ExperienceAdmin />}
          {activeTab === 'Achievement' && <AchievementAdmin />}
          {activeTab === 'Organization' && <OrganizationAdmin />}
          {activeTab === 'Volunteer' && <VolunteerAdmin />}
          {activeTab === 'Portfolio' && <PortfolioAdmin />}
          {activeTab === 'Contact' && <ContactAdmin />}
        </main>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const HeroAdmin = () => {
  const defaultData = {
    greeting: "Hello, I'm", title: "Meliora Audrey", subtitle: "Industrial Engineering Student.",
    description: "Passionate about process optimization, systems engineering, and data-driven continuous improvement. Welcome to my portfolio.", cvLink: "/CV.pdf", photoUrl: ""
  };
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('portfolio_hero')) || defaultData);
  const [uploading, setUploading] = useState(null);

  const save = () => {
    localStorage.setItem('portfolio_hero', JSON.stringify(data));
    alert('Hero section saved!');
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(type);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const newBlob = await response.json();
      if(type === 'photo') {
        setData({...data, photoUrl: newBlob.url});
      } else {
        setData({...data, cvLink: newBlob.url});
      }
      alert("File berhasil diunggah! Link otomatis diperbarui.");
    } catch (error) {
      alert("Gagal mengunggah file.");
    } finally {
      setUploading(null);
    }
  };

  return (
    <section className="admin-section">
      <h2>Edit Hero Section</h2>
      <div className="admin-form">
        <input type="text" placeholder="Greeting" value={data.greeting} onChange={e => setData({...data, greeting: e.target.value})} />
        <input type="text" placeholder="Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
        <input type="text" placeholder="Subtitle" value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} />
        <textarea placeholder="Description" value={data.description} onChange={e => setData({...data, description: e.target.value})}></textarea>
        
        <div style={{ marginBottom: '10px', padding: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Upload Foto Profil Publik:</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} disabled={uploading !== null} />
          {uploading === 'photo' && <p style={{color: 'var(--primary)', fontSize: '0.9rem', marginTop: '5px'}}>Sedang mengunggah foto... mohon tunggu.</p>}
          {data.photoUrl && <p style={{ color: 'green', fontSize: '0.9rem', marginTop: '5px' }}>✅ Foto Profil: Tersimpan.</p>}
        </div>

        <div style={{ marginBottom: '10px', padding: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Upload Dokumen CV (PDF):</label>
          <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'cv')} disabled={uploading !== null} />
          {uploading === 'cv' && <p style={{color: 'var(--primary)', fontSize: '0.9rem', marginTop: '5px'}}>Sedang mengunggah file CV... mohon tunggu.</p>}
          <input type="text" placeholder="Atau tulis manual link CV..." value={data.cvLink} onChange={e => setData({...data, cvLink: e.target.value})} style={{marginTop: '10px'}} />
          {data.cvLink && data.cvLink.includes('vercel-storage') && <p style={{ color: 'green', fontSize: '0.9rem', marginTop: '5px' }}>✅ CV Serverless: Tersimpan.</p>}
        </div>

        <button className="btn-add" onClick={save}>Save Hero Data</button>
      </div>
    </section>
  );
};

const AboutAdmin = () => {
  const defaultData = {
    bio1: "Hi, I'm Audrey, a dedicated Industrial Engineering student at Universitas Gadjah Mada (UGM)...",
    bio2: "My approach blends analytical thinking with practical problem-solving...",
    skills: [{ id: 1, name: "Data Analysis (Python & Excel)", percentage: 90 }]
  };
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('portfolio_about')) || defaultData);
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 0 });

  const save = () => {
    localStorage.setItem('portfolio_about', JSON.stringify(data));
    alert('About section saved!');
  };

  const addSkill = () => {
    if(!newSkill.name) return;
    setData({...data, skills: [...data.skills, { id: Date.now(), ...newSkill }]});
    setNewSkill({ name: '', percentage: 0 });
  };
  const removeSkill = (id) => setData({...data, skills: data.skills.filter(s => s.id !== id)});
  const moveSkillUp = (index) => {
    if (index === 0) return;
    const s = [...data.skills]; [s[index - 1], s[index]] = [s[index], s[index - 1]];
    setData({...data, skills: s});
  }
  const moveSkillDown = (index) => {
    if (index === data.skills.length - 1) return;
    const s = [...data.skills]; [s[index + 1], s[index]] = [s[index], s[index + 1]];
    setData({...data, skills: s});
  }

  return (
    <section className="admin-section">
      <h2>Edit About Section</h2>
      <div className="admin-form">
        <textarea placeholder="Bio Paragraph 1" value={data.bio1} onChange={e => setData({...data, bio1: e.target.value})}></textarea>
        <textarea placeholder="Bio Paragraph 2" value={data.bio2} onChange={e => setData({...data, bio2: e.target.value})}></textarea>
        <button className="btn-add" onClick={save}>Save Bios</button>
      </div>
      
      <h3 style={{marginTop: '2rem'}}>Manage Skills</h3>
      <div className="admin-form" style={{display: 'flex', gap: '1rem'}}>
        <input type="text" placeholder="Skill Name" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} />
        <input type="number" placeholder="Percentage" value={newSkill.percentage} onChange={e => setNewSkill({...newSkill, percentage: Number(e.target.value)})} />
        <button className="btn-add" onClick={addSkill}>Add</button>
      </div>
      <div className="admin-list">
        {data.skills.map((s, idx) => (
          <div key={s.id} className="admin-list-item">
            <span>{s.name} - {s.percentage}%</span>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button onClick={() => moveSkillUp(idx)} className="btn-reorder">↑</button>
              <button onClick={() => moveSkillDown(idx)} className="btn-reorder">↓</button>
              <button className="btn-delete" onClick={() => removeSkill(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-add" onClick={save} style={{marginTop: '1rem'}}>Save Skills Configuration</button>
    </section>
  );
};

const ExperienceAdmin = () => {
  const defaultList = [{ id: 1, role: "Intern", company: "Company", period: "2024", description: "Desc" }];
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('portfolio_experiences')) || defaultList);
  const [form, setForm] = useState({ role: '', company: '', period: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => localStorage.setItem('portfolio_experiences', JSON.stringify(list)), [list]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (editingId) {
      setList(list.map(i => i.id === editingId ? { ...form, id: editingId } : i));
      setEditingId(null);
    } else {
      setList([{ id: Date.now(), ...form }, ...list]); 
    }
    setForm({ role: '', company: '', period: '', description: '' }); 
  };

  const edit = (i) => { setEditingId(i.id); setForm({ role: i.role, company: i.company, period: i.period, description: i.description }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));
  const moveUp = (index) => { if(index === 0) return; const l = [...list]; [l[index-1], l[index]] = [l[index], l[index-1]]; setList(l); };
  const moveDown = (index) => { if(index === list.length-1) return; const l = [...list]; [l[index+1], l[index]] = [l[index], l[index+1]]; setList(l); };

  return (
    <section className="admin-section">
      <h2>Manage Experiences</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({role:'',company:'',period:'',description:''})}} style={{marginBottom: '1rem'}}>Cancel Edit</button>}
        <button type="submit" className="btn-add">{editingId ? 'Update Experience' : 'Add Experience'}</button>
      </form>
      <div className="admin-list">
        {list.map((i, idx) => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.role}</strong> at {i.company} <br/><small>{i.period}</small> <p>{i.description}</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button onClick={() => moveUp(idx)} className="btn-reorder" title="Pindah Ke Atas">↑</button>
                <button onClick={() => moveDown(idx)} className="btn-reorder" title="Pindah Ke Bawah">↓</button>
              </div>
              <button onClick={() => edit(i)} className="btn-edit" style={{backgroundColor: 'var(--primary)', color: 'white', border:'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%'}}>Edit</button>
              <button onClick={() => remove(i.id)} className="btn-delete" style={{width: '100%'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const OrganizationAdmin = () => {
  const defaultList = [{ id: 1, role: "Member", org: "Organization", period: "2024", description: "Desc" }];
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('portfolio_organizations')) || defaultList);
  const [form, setForm] = useState({ role: '', org: '', period: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => localStorage.setItem('portfolio_organizations', JSON.stringify(list)), [list]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (editingId) {
      setList(list.map(i => i.id === editingId ? { ...form, id: editingId } : i));
      setEditingId(null);
    } else {
      setList([{ id: Date.now(), ...form }, ...list]); 
    }
    setForm({ role: '', org: '', period: '', description: '' }); 
  };

  const edit = (i) => { setEditingId(i.id); setForm({ role: i.role, org: i.org, period: i.period, description: i.description }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));
  const moveUp = (index) => { if(index === 0) return; const l = [...list]; [l[index-1], l[index]] = [l[index], l[index-1]]; setList(l); };
  const moveDown = (index) => { if(index === list.length-1) return; const l = [...list]; [l[index+1], l[index]] = [l[index], l[index+1]]; setList(l); };

  return (
    <section className="admin-section">
      <h2>Manage Organization</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Organization" value={form.org} onChange={e => setForm({...form, org: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({role:'',org:'',period:'',description:''})}}>Cancel Edit</button>}
        <button type="submit" className="btn-add">{editingId ? 'Update Organization' : 'Add Organization'}</button>
      </form>
      <div className="admin-list">
        {list.map((i, idx) => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.role}</strong> at {i.org} <br/><small>{i.period}</small> <p>{i.description}</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button onClick={() => moveUp(idx)} className="btn-reorder">↑</button>
                <button onClick={() => moveDown(idx)} className="btn-reorder">↓</button>
              </div>
              <button onClick={() => edit(i)} className="btn-edit" style={{backgroundColor: 'var(--primary)', color: 'white', border:'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%'}}>Edit</button>
              <button onClick={() => remove(i.id)} className="btn-delete" style={{width: '100%'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const AchievementAdmin = () => {
  const defaultList = [{ id: 1, title: "Award", context: "Level", year: "2024", description: "Desc" }];
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('portfolio_achievements')) || defaultList);
  const [form, setForm] = useState({ title: '', context: '', year: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => localStorage.setItem('portfolio_achievements', JSON.stringify(list)), [list]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if(editingId) { setList(list.map(i => i.id === editingId ? {...form, id: editingId} : i)); setEditingId(null); }
    else { setList([{ id: Date.now(), ...form }, ...list]); }
    setForm({ title: '', context: '', year: '', description: '' }); 
  };

  const edit = (i) => { setEditingId(i.id); setForm({ title: i.title, context: i.context, year: i.year, description: i.description }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));
  const moveUp = (index) => { if(index===0) return; const l=[...list]; [l[index-1], l[index]]=[l[index], l[index-1]]; setList(l); };
  const moveDown = (index) => { if(index===list.length-1) return; const l=[...list]; [l[index+1], l[index]]=[l[index], l[index+1]]; setList(l); };

  return (
    <section className="admin-section">
      <h2>Manage Achievements</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <input required type="text" placeholder="Context" value={form.context} onChange={e => setForm({...form, context: e.target.value})} />
        <input required type="text" placeholder="Year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({title:'',context:'',year:'',description:''})}}>Cancel Edit</button>}
        <button type="submit" className="btn-add">{editingId ? 'Update Achievement' : 'Add Achievement'}</button>
      </form>
      <div className="admin-list">
        {list.map((i, idx) => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.title}</strong> ({i.year}) - {i.context} <p>{i.description}</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button onClick={() => moveUp(idx)} className="btn-reorder">↑</button>
                <button onClick={() => moveDown(idx)} className="btn-reorder">↓</button>
              </div>
              <button onClick={() => edit(i)} className="btn-edit" style={{backgroundColor: 'var(--primary)', color: 'white', border:'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%'}}>Edit</button>
              <button onClick={() => remove(i.id)} className="btn-delete" style={{width: '100%'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const VolunteerAdmin = () => {
  const defaultList = [{ id: 1, role: "Volunteer", organization: "NGO", period: "2024", description: "Desc" }];
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('portfolio_volunteers')) || defaultList);
  const [form, setForm] = useState({ role: '', organization: '', period: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => localStorage.setItem('portfolio_volunteers', JSON.stringify(list)), [list]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if(editingId){ setList(list.map(i => i.id === editingId ? {...form, id: editingId}: i)); setEditingId(null); }
    else { setList([{ id: Date.now(), ...form }, ...list]); }
    setForm({ role: '', organization: '', period: '', description: '' }); 
  };

  const edit = (i) => { setEditingId(i.id); setForm({ role: i.role, organization: i.organization, period: i.period, description: i.description }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));
  const moveUp = (index) => { if(index===0) return; const l=[...list]; [l[index-1], l[index]]=[l[index], l[index-1]]; setList(l); };
  const moveDown = (index) => { if(index===list.length-1) return; const l=[...list]; [l[index+1], l[index]]=[l[index], l[index+1]]; setList(l); };

  return (
    <section className="admin-section">
      <h2>Manage Volunteers</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Organization" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({role:'',organization:'',period:'',description:''})}}>Cancel Action</button>}
        <button type="submit" className="btn-add">{editingId ? 'Update Volunteer' : 'Add Volunteer'}</button>
      </form>
      <div className="admin-list">
        {list.map((i, idx) => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.role}</strong> at {i.organization} <br/><small>{i.period}</small> <p>{i.description}</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button onClick={() => moveUp(idx)} className="btn-reorder">↑</button>
                <button onClick={() => moveDown(idx)} className="btn-reorder">↓</button>
              </div>
              <button onClick={() => edit(i)} className="btn-edit" style={{backgroundColor: 'var(--primary)', color: 'white', border:'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%'}}>Edit</button>
              <button onClick={() => remove(i.id)} className="btn-delete" style={{width: '100%'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const PortfolioAdmin = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', link: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('/api/get-projects').then((res) => res.json()).then((data) => setList(data)).catch((err) => console.error("Gagal ambil:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editingId) {
       // Since API edit is not defined yet by user, we simulate it locally to satisfy their direct "bisa di edit" request for frontend
       alert("API Update belum tersedia. Diupdate secara lokal sementara.");
       setList(list.map(i => i.id === editingId ? {...form, id: editingId} : i));
       setEditingId(null);
       setForm({ title: '', description: '', link: '' });
       return;
    }

    const response = await fetch('/api/add-project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (response.ok) {
      alert("Project Audrey Berhasil Disimpan!");
      setList([...list, { id: Date.now(), ...form }]);
      setForm({ title: '', description: '', link: '' });
    } else {
      alert("Gagal menyimpan ke database.");
    }
  };

  const edit = (i) => { setEditingId(i.id); setForm({ title: i.title, description: i.description, link: i.link }); };
  const remove = (id) => { alert("Hanya lokal"); setList(list.filter(i => i.id !== id)); };
  const moveUp = (index) => { if(index===0) return; const l=[...list]; [l[index-1], l[index]]=[l[index], l[index-1]]; setList(l); };
  const moveDown = (index) => { if(index===list.length-1) return; const l=[...list]; [l[index+1], l[index]]=[l[index], l[index+1]]; setList(l); };

  return (
    <section className="admin-section">
      <h2>Manage Portfolio / Projects (Database Connected)</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Project Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <input type="text" placeholder="Project Link (URL)" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
        {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({title:'',description:'',link:''})}}>Cancel</button>}
        <button type="submit" className="btn-add">{editingId ? 'Update Local' : 'Add Project API'}</button>
      </form>
      <div className="admin-list">
        {list.map((i, idx) => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.title}</strong> <p>{i.description}</p>
              {i.link && <small style={{color: 'var(--primary)'}}>Link: {i.link}</small>}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button onClick={() => moveUp(idx)} className="btn-reorder">↑</button>
                <button onClick={() => moveDown(idx)} className="btn-reorder">↓</button>
              </div>
              <button onClick={() => edit(i)} className="btn-edit" style={{backgroundColor: 'var(--primary)', color: 'white', border:'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%'}}>Edit</button>
              <button onClick={() => remove(i.id)} className="btn-delete" style={{width: '100%'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactAdmin = () => {
  const defaultData = { title: "Let's talk", subtitle: "Whether you have a question", email: "hello@audrey.com", phone: "+62", linkedin: "url", github: "url" };
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('portfolio_contact')) || defaultData);

  const save = () => { localStorage.setItem('portfolio_contact', JSON.stringify(data)); alert('Contact section saved!'); };

  return (
    <section className="admin-section">
      <h2>Edit Contact Section</h2>
      <div className="admin-form">
        <input type="text" placeholder="Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
        <textarea placeholder="Subtitle" value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})}></textarea>
        <input type="email" placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
        <input type="text" placeholder="Phone" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
        <input type="text" placeholder="LinkedIn" value={data.linkedin} onChange={e => setData({...data, linkedin: e.target.value})} />
        <input type="text" placeholder="GitHub" value={data.github} onChange={e => setData({...data, github: e.target.value})} />
        <button className="btn-add" onClick={save}>Save Contact Data</button>
      </div>
    </section>
  );
};

export default Admin;
