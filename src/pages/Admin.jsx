import { useState, useEffect } from 'react';
import './Admin.css';

// Hook pintar untuk menyegerakan migrasi LocalStorage -> Cloud Database secara generik
function useCloudContent(section, defaultData) {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-content?section=' + section)
      .then(r => { if (r.ok) return r.json(); throw new Error('Not found'); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { console.log(`Memakai data bawaan untuk ${section}`); setLoading(false); });
  }, [section]);

  const saveContent = async (newData, showToast = false) => {
    setData(newData); // UI berubah secara instan (Optimistic update)
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: newData })
      });
      if(!response.ok) {
        throw new Error('Database Error 500');
      }
      if(showToast) alert(`${section} berhasil disimpan ke Database Utama!`);
    } catch (e) { 
      alert('GAGAL UPDATE. Silakan pastikan Database online / tabel global_content ada.'); 
    }
  };

  return [data, saveContent, loading, setData];
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Hero');
  const tabs = ['Hero', 'About', 'Experience', 'Achievement', 'Organization', 'Volunteer', 'Portfolio', 'Contact'];

  useEffect(() => {
    fetch('/api/init-db').catch(() => {});
  }, []);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard (Cloud Synced)</h1>
          <a href="/" className="btn-back">← Back to Site</a>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            {tabs.map(tab => (
              <button key={tab} className={`admin-nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
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
    description: "Passionate about process optimization, systems engineering...", cvLink: "/CV.pdf", photoUrl: ""
  };
  const [data, saveData, loading, setDataLocally] = useCloudContent('hero', defaultData);
  const [uploading, setUploading] = useState(null);

  const save = () => saveData(data, true);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(type);
    
    // Fungsi bantuan untuk mengirim hasil kompresi/bacaan file ke Server
    const uploadBase64 = async (base64Str, filename) => {
      try {
        const response = await fetch('/api/upload', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, fileBase64: base64Str })
        });
        
        if(!response.ok) throw new Error('Upload gagal');
        
        const newBlob = await response.json();
        const updatedData = { ...data, [type === 'photo' ? 'photoUrl' : 'cvLink']: newBlob.url };
        await saveData(updatedData, true); 
        alert("File sukses diunggah ke Vercel Blob & web telah diperbarui!");
      } catch (error) { 
        alert("Gagal mengunggah file. Pastikan Server Lokal berjalan baik."); 
      } finally { 
        setUploading(null); 
      }
    };

    // Apabila Gambar: Kompres sangat kecil dengan Canvas sebelum diupload
    if (type === 'photo' && file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600; // Kecilkan ke max batas 600px
        let scaleSize = 1;
        if (img.width > MAX_WIDTH) scaleSize = MAX_WIDTH / img.width;
        
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert ke base64 (85% JPEG) super ringan
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85); 
        URL.revokeObjectURL(img.src);
        uploadBase64(dataUrl, file.name);
      };
      img.src = URL.createObjectURL(file);
    } else {
      // Jika dokumen PDF (CV), langsung dibaca karena PDF aman dan stabil
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => uploadBase64(reader.result, file.name);
    }
  };

  if(loading) return <p>Loading data server...</p>;

  return (
    <section className="admin-section">
      <h2>Edit Hero Section</h2>
      <div className="admin-form">
        <input type="text" placeholder="Greeting" value={data.greeting} onChange={e => setDataLocally({...data, greeting: e.target.value})} />
        <input type="text" placeholder="Title" value={data.title} onChange={e => setDataLocally({...data, title: e.target.value})} />
        <input type="text" placeholder="Subtitle" value={data.subtitle} onChange={e => setDataLocally({...data, subtitle: e.target.value})} />
        <textarea placeholder="Description" value={data.description} onChange={e => setDataLocally({...data, description: e.target.value})}></textarea>
        
        <div style={{ marginBottom: '10px', padding: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Upload Foto Profil Publik:</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} disabled={uploading !== null} />
          {uploading === 'photo' && <p style={{color: 'var(--primary)'}}>Sedang mengunggah foto... mohon tunggu.</p>}
          {data.photoUrl && <p style={{ color: 'green' }}>✅ Foto Profil Online.</p>}
        </div>

        <div style={{ marginBottom: '10px', padding: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Upload Dokumen CV (PDF):</label>
          <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'cv')} disabled={uploading !== null} />
          {uploading === 'cv' && <p style={{color: 'var(--primary)'}}>Sedang mengunggah file CV... mohon tunggu.</p>}
          <input type="text" placeholder="Link CV" value={data.cvLink} onChange={e => setDataLocally({...data, cvLink: e.target.value})} />
        </div>

        <button className="btn-add" onClick={save}>Save Text Data to DB</button>
      </div>
    </section>
  );
};

const AboutAdmin = () => {
  const defaultData = { bio1: "Hi, I'm Audrey...", bio2: "My approach blends...", skills: [] };
  const [data, saveData, loading, setDataLocally] = useCloudContent('about', defaultData);
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 0 });

  const save = () => saveData(data, true);

  const addSkill = () => {
    if(!newSkill.name) return;
    setDataLocally({...data, skills: [...data.skills, { id: Date.now(), ...newSkill }]});
    setNewSkill({ name: '', percentage: 0 });
  };
  const removeSkill = (id) => setDataLocally({...data, skills: data.skills.filter(s => s.id !== id)});
  const moveSkillUp = (idx) => { if(idx===0) return; const s=[...data.skills]; [s[idx-1], s[idx]]=[s[idx], s[idx-1]]; setDataLocally({...data, skills: s}); }
  const moveSkillDown = (idx) => { if(idx===data.skills.length-1) return; const s=[...data.skills]; [s[idx+1], s[idx]]=[s[idx], s[idx+1]]; setDataLocally({...data, skills: s}); }

  if(loading) return <p>Loading data server...</p>;

  return (
    <section className="admin-section">
      <h2>Edit About Section</h2>
      <div className="admin-form">
        <textarea placeholder="Bio Paragraph 1" value={data.bio1} onChange={e => setDataLocally({...data, bio1: e.target.value})}></textarea>
        <textarea placeholder="Bio Paragraph 2" value={data.bio2} onChange={e => setDataLocally({...data, bio2: e.target.value})}></textarea>
        <button className="btn-add" onClick={save}>Save Bios to DB</button>
      </div>
      
      <h3 style={{marginTop: '2rem'}}>Manage Skills</h3>
      <div className="admin-form" style={{display: 'flex', gap: '1rem'}}>
        <input type="text" placeholder="Skill Name" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} />
        <input type="number" placeholder="Percentage" value={newSkill.percentage} onChange={e => setNewSkill({...newSkill, percentage: Number(e.target.value)})} />
        <button className="btn-add" onClick={addSkill}>Add locally</button>
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
      <button className="btn-add" onClick={save} style={{marginTop: '1rem', backgroundColor: 'red'}}>Save All Skills Config to DB</button>
    </section>
  );
};

const ExperienceAdmin = () => {
  const [list, saveList, loading] = useCloudContent('experience', []);
  const [form, setForm] = useState({ role: '', company: '', period: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const newList = editingId 
        ? list.map(i => i.id === editingId ? { ...form, id: editingId } : i)
        : [{ id: Date.now(), ...form }, ...list];
    
    saveList(newList); 
    setEditingId(null); setForm({ role: '', company: '', period: '', description: '' }); 
  };

  const edit = (i) => { setEditingId(i.id); setForm({ role: i.role, company: i.company, period: i.period, description: i.description }); };
  const remove = (id) => saveList(list.filter(i => i.id !== id));
  const moveUp = (idx) => { if(idx===0) return; const l=[...list]; [l[idx-1], l[idx]]=[l[idx], l[idx-1]]; saveList(l); };
  const moveDown = (idx) => { if(idx===list.length-1) return; const l=[...list]; [l[idx+1], l[idx]]=[l[idx], l[idx+1]]; saveList(l); };

  if(loading) return <p>Loading data server...</p>;

  return (
    <section className="admin-section">
      <h2 style={{color: 'green'}}>🟢 Live DB Sync: Experiences</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({role:'',company:'',period:'',description:''})}}>Cancel</button>}
        <button type="submit" className="btn-add">{editingId ? 'Update to DB' : 'Add to DB'}</button>
      </form>
      <div className="admin-list">
        {list.map((i, idx) => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.role}</strong> at {i.company} <br/> <small>{i.period}</small> <p>{i.description}</p>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
              <div style={{display:'flex', gap:'0.5rem'}}><button onClick={() => moveUp(idx)} className="btn-reorder">↑</button><button onClick={() => moveDown(idx)} className="btn-reorder">↓</button></div>
              <button onClick={() => edit(i)} className="btn-edit" style={{background:'var(--primary)', color:'white', border:'none', padding:'4px', width:'100%'}}>Edit</button>
              <button onClick={() => remove(i.id)} className="btn-delete" style={{width: '100%'}}>Delete DB</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const OrganizationAdmin = () => {
  const [list, saveList, loading] = useCloudContent('organization', []);
  const [form, setForm] = useState({ role: '', org: '', period: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const newList = editingId 
        ? list.map(i => i.id === editingId ? { ...form, id: editingId } : i)
        : [{ id: Date.now(), ...form }, ...list];
    saveList(newList); 
    setEditingId(null); setForm({ role: '', org: '', period: '', description: '' }); 
  };
  const edit = (i) => { setEditingId(i.id); setForm({ role: i.role, org: i.org, period: i.period, description: i.description }); };
  const remove = (id) => saveList(list.filter(i => i.id !== id));
  const moveUp = (idx) => { if(idx===0) return; const l=[...list]; [l[idx-1], l[idx]]=[l[idx], l[idx-1]]; saveList(l); };
  const moveDown = (idx) => { if(idx===list.length-1) return; const l=[...list]; [l[idx+1], l[idx]]=[l[idx], l[idx+1]]; saveList(l); };

  if(loading) return <p>Loading data server...</p>;

  return (
    <section className="admin-section">
      <h2 style={{color: 'green'}}>🟢 Live DB Sync: Organization</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Organization" value={form.org} onChange={e => setForm({...form, org: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea placeholder="Description (Opsional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <button type="submit" className="btn-add">{editingId ? 'Update to DB' : 'Add to DB'}</button>
      </form>
      <div className="admin-list">
        {list.map((i, idx) => (
           <div key={i.id} className="admin-list-item">
             <div className="item-details"><strong>{i.role}</strong> at {i.org} <p>{i.description}</p></div>
             <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', alignItems: 'flex-end'}}>
               <div style={{display:'flex', gap:'0.5rem'}}><button onClick={()=>moveUp(idx)} className="btn-reorder">↑</button><button onClick={()=>moveDown(idx)} className="btn-reorder">↓</button></div>
               <button onClick={()=>edit(i)} className="btn-edit" style={{background:'var(--primary)',color:'white',border:'none', padding:'4px', width:'100%'}}>Edit</button>
               <button onClick={()=>remove(i.id)} className="btn-delete" style={{width:'100%'}}>Delete</button>
             </div>
           </div>
        ))}
      </div>
    </section>
  );
};

const AchievementAdmin = () => {
    const [list, saveList, loading] = useCloudContent('achievement', []);
    const [form, setForm] = useState({ title: '', context: '', year: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => { 
        e.preventDefault(); 
        const newList = editingId ? list.map(i => i.id === editingId ? { ...form, id: editingId } : i) : [{ id: Date.now(), ...form }, ...list];
        saveList(newList); setEditingId(null); setForm({ title: '', context: '', year: '', description: '' }); 
    };
    const edit = (i) => { setEditingId(i.id); setForm({ title: i.title, context: i.context, year: i.year, description: i.description }); };
    const remove = (id) => saveList(list.filter(i => i.id !== id));
    const moveUp = (idx) => { if(idx===0) return; const l=[...list]; [l[idx-1], l[idx]]=[l[idx], l[idx-1]]; saveList(l); };
    const moveDown = (idx) => { if(idx===list.length-1) return; const l=[...list]; [l[idx+1], l[idx]]=[l[idx], l[idx+1]]; saveList(l); };
    
    if(loading) return <p>Loading server...</p>;

    return (
      <section className="admin-section">
        <h2 style={{color: 'green'}}>🟢 Live DB Sync: Achievements</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <input required type="text" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <input required type="text" placeholder="Context" value={form.context} onChange={e=>setForm({...form, context:e.target.value})} />
          <input required type="text" placeholder="Year" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} />
          <textarea placeholder="Desc (Opsional)" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
          <button type="submit" className="btn-add">{editingId ? 'Update to DB' : 'Save to DB'}</button>
        </form>
        <div className="admin-list">
          {list.map((i, idx) => (
             <div key={i.id} className="admin-list-item">
               <div className="item-details"><strong>{i.title}</strong><p>{i.description}</p></div>
               <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', alignItems: 'flex-end'}}>
                 <div style={{display:'flex', gap:'0.5rem'}}><button onClick={()=>moveUp(idx)} className="btn-reorder">↑</button><button onClick={()=>moveDown(idx)} className="btn-reorder">↓</button></div>
                 <button onClick={()=>edit(i)} style={{background:'var(--primary)', color:'white', width:'100%', padding:'4px', border:'none'}}>Edit</button>
                 <button onClick={()=>remove(i.id)} style={{width:'100%'}}>Del DB</button>
               </div>
             </div>
          ))}
        </div>
      </section>
    );
};

const VolunteerAdmin = () => {
    const [list, saveList, loading] = useCloudContent('volunteer', []);
    const [form, setForm] = useState({ role: '', organization: '', period: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => { 
        e.preventDefault(); 
        const newList = editingId ? list.map(i => i.id === editingId ? { ...form, id: editingId } : i) : [{ id: Date.now(), ...form }, ...list];
        saveList(newList); setEditingId(null); setForm({ role: '', organization: '', period: '', description: '' }); 
    };
    const edit = (i) => { setEditingId(i.id); setForm({ role: i.role, organization: i.organization, period: i.period, description: i.description }); };
    const remove = (id) => saveList(list.filter(i => i.id !== id));
    const moveUp = (idx) => { if(idx===0) return; const l=[...list]; [l[idx-1], l[idx]]=[l[idx], l[idx-1]]; saveList(l); };
    const moveDown = (idx) => { if(idx===list.length-1) return; const l=[...list]; [l[idx+1], l[idx]]=[l[idx], l[idx+1]]; saveList(l); };
    
    if(loading) return <p>Loading server...</p>;

    return (
      <section className="admin-section">
         <h2 style={{color: 'green'}}>🟢 Live DB Sync: Volunteer</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <input required type="text" placeholder="Role" value={form.role} onChange={e=>setForm({...form, role:e.target.value})} />
          <input required type="text" placeholder="Org" value={form.organization} onChange={e=>setForm({...form, organization:e.target.value})} />
          <input required type="text" placeholder="Period" value={form.period} onChange={e=>setForm({...form, period:e.target.value})} />
          <textarea placeholder="Desc (Opsional)" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
          <button type="submit" className="btn-add">{editingId ? 'Update to DB' : 'Save to DB'}</button>
        </form>
        <div className="admin-list">
          {list.map((i, idx) => (
             <div key={i.id} className="admin-list-item">
               <div className="item-details"><strong>{i.role}</strong><p>{i.organization}</p></div>
               <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', alignItems: 'flex-end'}}>
                 <div style={{display:'flex', gap:'0.5rem'}}><button onClick={()=>moveUp(idx)} className="btn-reorder">↑</button><button onClick={()=>moveDown(idx)} className="btn-reorder">↓</button></div>
                 <button onClick={()=>edit(i)} style={{background:'var(--primary)', color:'white', width:'100%', padding:'4px', border:'none'}}>Edit</button>
                 <button onClick={()=>remove(i.id)} style={{width:'100%'}}>Del DB</button>
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
    fetch('/api/get-projects').then(res => { if(res.ok) return res.json(); throw new Error(); }).then(data => { if(Array.isArray(data)) setList(data); }).catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editingId) {
       const response = await fetch('/api/update-project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) });
       if(response.ok) {
           alert("Project Berhasil Diupdate di Database!");
           setList(list.map(i => i.id === editingId ? {...form, id: editingId} : i));
           setEditingId(null); setForm({ title: '', description: '', link: '' });
       } else { alert("Gagal update project."); }
       return;
    }

    const response = await fetch('/api/add-project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (response.ok) {
      alert("Project Berhasil Ditambahkan!");
      setList([{ id: Date.now(), ...form }, ...list]);
      setForm({ title: '', description: '', link: '' });
    } else {
      alert("Gagal menambahkan ke database.");
    }
  };

  const edit = (i) => { setEditingId(i.id); setForm({ title: i.title, description: i.description, link: i.link }); };
  const remove = async (id) => {
    if(window.confirm("Hapus project dari database?")) {
      const response = await fetch('/api/delete-project', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id}) });
      if(response.ok) setList(list.filter(i => i.id !== id));
      else alert("Gagal menghapus project.");
    }
  };
  const moveUp = (idx) => { 
    if(idx===0) return; 
    const l=[...list]; [l[idx-1], l[idx]]=[l[idx], l[idx-1]]; 
    setList(l); 
    // Portfolio saves on per-item basis natively via add/update hooks, but reordering requires updating the DB. Wait, Portfolio items are independent rows!
    alert('Susunan untuk portfolio projects masih diurutkan berdasar waktu (ID) di database Neon.');
  };
  const moveDown = (idx) => { 
    if(idx===list.length-1) return; 
    const l=[...list]; [l[idx+1], l[idx]]=[l[idx], l[idx+1]]; 
    setList(l); 
    alert('Susunan untuk portfolio projects masih diurutkan berdasar waktu (ID) di database Neon.');
  };

  return (
    <section className="admin-section">
      <h2>Manage Portfolio / Projects (Table `projects`)</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <textarea placeholder="Desc (Opsional)" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
        <input type="text" placeholder="URL" value={form.link} onChange={e=>setForm({...form, link:e.target.value})} />
        <button type="submit" className="btn-add">Add to DB</button>
      </form>
      <div className="admin-list">
        {Array.isArray(list) && list.map((i, idx) => (
          <div key={i.id} className="admin-list-item">
             <div className="item-details"><strong>{i.title}</strong></div>
             <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', alignItems: 'flex-end'}}>
                 <div style={{display:'flex', gap:'0.5rem'}}><button onClick={()=>moveUp(idx)} className="btn-reorder">↑</button><button onClick={()=>moveDown(idx)} className="btn-reorder">↓</button></div>
                 <button onClick={()=>edit(i)} style={{background:'var(--primary)', color:'white', width:'100%', padding:'4px', border:'none'}}>Edit</button>
                 <button onClick={()=>remove(i.id)} style={{width:'100%'}}>Del DB</button>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactAdmin = () => {
  const defaultData = { title: "Let's talk", subtitle: "Say hi...", email: "hello@audrey.com", phone: "+62", linkedin: "url", github: "url" };
  const [data, saveData, loading, setDataLocally] = useCloudContent('contact', defaultData);

  const save = () => saveData(data, true);
  if(loading) return <p>Loading server...</p>;

  return (
    <section className="admin-section">
      <h2 style={{color: 'green'}}>🟢 Live DB Sync: Contact</h2>
      <div className="admin-form">
        <input type="text" placeholder="Title" value={data.title} onChange={e => setDataLocally({...data, title: e.target.value})} />
        <textarea placeholder="Subtitle" value={data.subtitle} onChange={e => setDataLocally({...data, subtitle: e.target.value})}></textarea>
        <input type="email" placeholder="Email" value={data.email} onChange={e => setDataLocally({...data, email: e.target.value})} />
        <input type="text" placeholder="Phone" value={data.phone} onChange={e => setDataLocally({...data, phone: e.target.value})} />
        <input type="text" placeholder="LinkedIn" value={data.linkedin} onChange={e => setDataLocally({...data, linkedin: e.target.value})} />
        <input type="text" placeholder="GitHub" value={data.github} onChange={e => setDataLocally({...data, github: e.target.value})} />
        <button className="btn-add" onClick={save}>Save Contact Data DB</button>
      </div>
    </section>
  );
};

export default Admin;
