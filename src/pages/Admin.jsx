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

// --- SUB COMPONENTS FOR EACH TAB ---

const HeroAdmin = () => {
  const defaultData = {
    greeting: "Hello, I'm", title: "Meliora Audrey", subtitle: "Industrial Engineering Student.",
    description: "Passionate about process optimization, systems engineering, and data-driven continuous improvement. Welcome to my portfolio.", cvLink: "/CV.pdf"
  };
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('portfolio_hero')) || defaultData);

  const save = () => {
    localStorage.setItem('portfolio_hero', JSON.stringify(data));
    alert('Hero section saved!');
  };

  return (
    <section className="admin-section">
      <h2>Edit Hero Section</h2>
      <div className="admin-form">
        <input type="text" placeholder="Greeting" value={data.greeting} onChange={e => setData({...data, greeting: e.target.value})} />
        <input type="text" placeholder="Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
        <input type="text" placeholder="Subtitle" value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} />
        <textarea placeholder="Description" value={data.description} onChange={e => setData({...data, description: e.target.value})}></textarea>
        <input type="text" placeholder="CV Link" value={data.cvLink} onChange={e => setData({...data, cvLink: e.target.value})} />
        <button className="btn-add" onClick={save}>Save Hero Data</button>
      </div>
    </section>
  );
};

const AboutAdmin = () => {
  const defaultData = {
    bio1: "Hi, I'm Audrey, a dedicated Industrial Engineering student at Universitas Gadjah Mada (UGM). I have a strong passion for solving complex operational problems and creating highly efficient systems processes.",
    bio2: "My approach blends analytical thinking with practical problem-solving. I specialize in supply chain management, operational research, data analysis, and lean manufacturing principles. I am eager to apply my knowledge to drive continuous improvement in real-world scenarios.",
    skills: [{ id: 1, name: "Data Analysis (Python & Excel)", percentage: 90 }, { id: 2, name: "Operations Research", percentage: 85 }]
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
        {data.skills.map(s => (
          <div key={s.id} className="admin-list-item">
            <span>{s.name} - {s.percentage}%</span>
            <button className="btn-delete" onClick={() => removeSkill(s.id)}>Delete</button>
          </div>
        ))}
      </div>
      <button className="btn-add" onClick={save} style={{marginTop: '1rem'}}>Save Skills to Global</button>
    </section>
  );
};

const ExperienceAdmin = () => {
  const defaultList = [{ id: 1, role: "Intern", company: "Company", period: "2024", description: "Desc" }];
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('portfolio_experiences')) || defaultList);
  const [form, setForm] = useState({ role: '', company: '', period: '', description: '' });

  useEffect(() => localStorage.setItem('portfolio_experiences', JSON.stringify(list)), [list]);

  const add = (e) => { e.preventDefault(); setList([{ id: Date.now(), ...form }, ...list]); setForm({ role: '', company: '', period: '', description: '' }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));

  return (
    <section className="admin-section">
      <h2>Manage Experiences</h2>
      <form className="admin-form" onSubmit={add}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <button type="submit" className="btn-add">Add Experience</button>
      </form>
      <div className="admin-list">
        {list.map(i => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.role}</strong> at {i.company} ({i.period}) <p>{i.description}</p>
            </div>
            <button onClick={() => remove(i.id)} className="btn-delete">Delete</button>
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

  useEffect(() => localStorage.setItem('portfolio_organizations', JSON.stringify(list)), [list]);

  const add = (e) => { e.preventDefault(); setList([{ id: Date.now(), ...form }, ...list]); setForm({ role: '', org: '', period: '', description: '' }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));

  return (
    <section className="admin-section">
      <h2>Manage Organization</h2>
      <form className="admin-form" onSubmit={add}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Organization" value={form.org} onChange={e => setForm({...form, org: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <button type="submit" className="btn-add">Add Organization</button>
      </form>
      <div className="admin-list">
        {list.map(i => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.role}</strong> at {i.org} ({i.period}) <p>{i.description}</p>
            </div>
            <button onClick={() => remove(i.id)} className="btn-delete">Delete</button>
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

  useEffect(() => localStorage.setItem('portfolio_achievements', JSON.stringify(list)), [list]);

  const add = (e) => { e.preventDefault(); setList([{ id: Date.now(), ...form }, ...list]); setForm({ title: '', context: '', year: '', description: '' }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));

  return (
    <section className="admin-section">
      <h2>Manage Achievements</h2>
      <form className="admin-form" onSubmit={add}>
        <input required type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <input required type="text" placeholder="Context" value={form.context} onChange={e => setForm({...form, context: e.target.value})} />
        <input required type="text" placeholder="Year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <button type="submit" className="btn-add">Add Achievement</button>
      </form>
      <div className="admin-list">
        {list.map(i => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.title}</strong> ({i.year}) - {i.context} <p>{i.description}</p>
            </div>
            <button onClick={() => remove(i.id)} className="btn-delete">Delete</button>
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

  useEffect(() => localStorage.setItem('portfolio_volunteers', JSON.stringify(list)), [list]);

  const add = (e) => { e.preventDefault(); setList([{ id: Date.now(), ...form }, ...list]); setForm({ role: '', organization: '', period: '', description: '' }); };
  const remove = (id) => setList(list.filter(i => i.id !== id));

  return (
    <section className="admin-section">
      <h2>Manage Volunteers</h2>
      <form className="admin-form" onSubmit={add}>
        <input required type="text" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <input required type="text" placeholder="Organization" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} />
        <input required type="text" placeholder="Period" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <button type="submit" className="btn-add">Add Volunteer</button>
      </form>
      <div className="admin-list">
        {list.map(i => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.role}</strong> at {i.organization} ({i.period}) <p>{i.description}</p>
            </div>
            <button onClick={() => remove(i.id)} className="btn-delete">Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
};

const PortfolioAdmin = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', link: '' });

  // Panggil jembatan API untuk ambil data awal
  useEffect(() => {
    fetch('/api/get-projects')
      .then((res) => res.json())
      .then((data) => setList(data))
      .catch((err) => console.error("Gagal ambil data:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/add-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        link: form.link
      }),
    });

    if (response.ok) {
      alert("Project Audrey Berhasil Disimpan!");
      
      // Update list lokal di Admin supaya langsung terlihat masuk
      setList([...list, { id: Date.now(), title: form.title, description: form.description, link: form.link }]);
      
      // Kosongkan form
      setForm({ title: '', description: '', link: '' });
    } else {
      alert("Gagal menyimpan ke database.");
    }
  };

  const remove = (id) => {
    alert("Hapus ke database belum terkonfigurasi. Penghapusan sifatnya sementara di tampilan ini.");
    setList(list.filter(i => i.id !== id));
  };

  return (
    <section className="admin-section">
      <h2>Manage Portfolio / Projects (Database Connected)</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Project Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <input type="text" placeholder="Project Link (URL)" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
        <button type="submit" className="btn-add">Add Project</button>
      </form>
      <div className="admin-list">
        {list.map(i => (
          <div key={i.id} className="admin-list-item">
            <div className="item-details">
              <strong>{i.title}</strong> <p>{i.description}</p>
              {i.link && <small style={{color: 'var(--primary)'}}>Link: {i.link}</small>}
            </div>
            <button onClick={() => remove(i.id)} className="btn-delete">Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactAdmin = () => {
  const defaultData = {
    title: "Let's talk about your next project.", subtitle: "Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    email: "hello@audrey.com", phone: "+62 812 3456 7890", linkedin: "https://linkedin.com", github: "https://github.com"
  };
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('portfolio_contact')) || defaultData);

  const save = () => {
    localStorage.setItem('portfolio_contact', JSON.stringify(data));
    alert('Contact section saved!');
  };

  return (
    <section className="admin-section">
      <h2>Edit Contact Section</h2>
      <div className="admin-form">
        <input type="text" placeholder="Contact Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
        <textarea placeholder="Contact Subtitle" value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})}></textarea>
        <input type="email" placeholder="Email Address" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
        <input type="text" placeholder="Phone Number" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
        <input type="text" placeholder="LinkedIn URL" value={data.linkedin} onChange={e => setData({...data, linkedin: e.target.value})} />
        <input type="text" placeholder="GitHub URL" value={data.github} onChange={e => setData({...data, github: e.target.value})} />
        <button className="btn-add" onClick={save}>Save Contact Data</button>
      </div>
    </section>
  );
};

export default Admin;
