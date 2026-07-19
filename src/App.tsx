import { FormEvent, useEffect, useState } from 'react';
import { api } from './api';
import Login from './Login';
import type { Project, Ticket, User } from './types';

const emptyTicket = { title: '', description: '', priority: 'MEDIUM', status: 'TO_DO', projectId: '', assignedToId: '' };

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('flowbit_token') || '');
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('flowbit_user') || 'null'));
  const [page, setPage] = useState('Dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [ticketForm, setTicketForm] = useState(emptyTicket);

  async function loadData() {
    if (!token) return;
    setError('');
    try {
      const [ticketData, projectData, userData] = await Promise.all([
        api('/tickets?limit=50', token),
        api('/projects?limit=50', token),
        api('/users?limit=50', token),
      ]);
      setTickets(ticketData.tickets || []);
      setProjects(projectData.projects || []);
      setUsers(userData.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data.');
    }
  }

  useEffect(() => { loadData(); }, [token]);

  function login(nextToken: string, nextUser: User) {
    localStorage.setItem('flowbit_token', nextToken);
    localStorage.setItem('flowbit_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem('flowbit_token');
    localStorage.removeItem('flowbit_user');
    setToken('');
    setUser(null);
  }

  async function createTicket(event: FormEvent) {
    event.preventDefault();
    try {
      await api('/tickets', token, { method: 'POST', body: JSON.stringify(ticketForm) });
      setShowForm(false);
      setTicketForm(emptyTicket);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create ticket.');
    }
  }

  if (!token || !user) return <Login onLogin={login} />;

  const openTickets = tickets.filter((ticket) => ticket.status !== 'DONE').length;
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">flow<span>bit</span></div>
      {['Dashboard', 'Tickets', 'Projects', 'Users'].map((item) =>
        <button key={item} className={page === item ? 'nav-item active' : 'nav-item'} onClick={() => setPage(item)}>{item}</button>,
      )}
      <div className="sidebar-bottom"><strong>{user.name}</strong><small>{roleName(user.role)}</small><button className="logout" onClick={logout}>Sign out</button></div>
    </aside>
    <main className="content">
      <header><div><p className="eyebrow">WORKSPACE</p><h1>{page}</h1></div>{page === 'Tickets' && <button onClick={() => setShowForm(true)}>+ New ticket</button>}</header>
      {error && <p className="error banner">{error}</p>}
      {page === 'Dashboard' && <Dashboard tickets={tickets.length} openTickets={openTickets} projects={projects.length} />}
      {page === 'Tickets' && <Tickets tickets={tickets} />}
      {page === 'Projects' && <Projects projects={projects} />}
      {page === 'Users' && <Users users={users} />}
    </main>
    {showForm && <TicketForm form={ticketForm} projects={projects} users={users} onChange={setTicketForm} onClose={() => setShowForm(false)} onSubmit={createTicket} />}
  </div>;
}

function Dashboard({ tickets, openTickets, projects }: { tickets: number; openTickets: number; projects: number }) {
  return <><section className="stats"><Stat label="All tickets" value={tickets} /><Stat label="Open tickets" value={openTickets} /><Stat label="Projects" value={projects} /></section><section className="panel"><h2>Getting started</h2><p>Create projects, invite users, and keep all work visible through tickets. Use the Tickets page to add a new item.</p></section></>;
}
function Stat({ label, value }: { label: string; value: number }) { return <article className="stat"><p>{label}</p><strong>{value}</strong></article>; }
function Tickets({ tickets }: { tickets: Ticket[] }) { return <section className="panel table-wrap"><table><thead><tr><th>Ticket</th><th>Status</th><th>Priority</th><th>Project</th><th>Assignee</th></tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id}><td><strong>{ticket.ticketNumber}</strong><br /><span>{ticket.title}</span></td><td><Badge value={ticket.status} /></td><td><Badge value={ticket.priority} /></td><td>{ticket.project?.name}</td><td>{ticket.assignee?.name}</td></tr>)}{tickets.length === 0 && <tr><td colSpan={5}>No tickets yet.</td></tr>}</tbody></table></section>; }
function Projects({ projects }: { projects: Project[] }) { return <section className="cards">{projects.map((project) => <article className="panel" key={project.id}><h2>{project.name}</h2><p>{project.description || 'No description yet.'}</p></article>)}{projects.length === 0 && <p>No projects yet.</p>}</section>; }
function Users({ users }: { users: User[] }) { return <section className="panel table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Project</th></tr></thead><tbody>{users.map((member) => <tr key={member.id}><td>{member.name}</td><td>{member.email}</td><td><Badge value={roleName(member.role)} /></td><td>{projectName(member.project)}</td></tr>)}</tbody></table></section>; }
function Badge({ value }: { value: string }) { return <span className="badge">{value.split('_').join(' ')}</span>; }
function roleName(role: User['role']) { return typeof role === 'string' ? role : role.title; }
function projectName(project: User['project']) { return typeof project === 'string' ? project : project.name; }

function TicketForm({ form, projects, users, onChange, onClose, onSubmit }: { form: typeof emptyTicket; projects: Project[]; users: User[]; onChange: (form: typeof emptyTicket) => void; onClose: () => void; onSubmit: (event: FormEvent) => void }) {
  return <div className="modal-backdrop"><form className="modal" onSubmit={onSubmit}><div className="modal-header"><h2>New ticket</h2><button type="button" className="icon-button" onClick={onClose}>×</button></div><label>Title<input required value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} /></label><label>Description<textarea required value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} /></label><div className="form-grid"><label>Priority<select value={form.priority} onChange={(e) => onChange({ ...form, priority: e.target.value })}>{['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST'].map((value) => <option key={value}>{value}</option>)}</select></label><label>Status<select value={form.status} onChange={(e) => onChange({ ...form, status: e.target.value })}>{['TO_DO', 'IN_PROGRESS', 'NEED_INFORMATION', 'READY_FOR_UAT', 'READY_FOR_PROD', 'DEPLOYED', 'DONE', 'ON_HOLD', 'BACKLOG'].map((value) => <option key={value}>{value}</option>)}</select></label></div><label>Project<select required value={form.projectId} onChange={(e) => onChange({ ...form, projectId: e.target.value })}><option value="">Select a project</option>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label>Assignee<select required value={form.assignedToId} onChange={(e) => onChange({ ...form, assignedToId: e.target.value })}><option value="">Select an assignee</option>{users.map((member) => <option value={member.id} key={member.id}>{member.name}</option>)}</select></label><button>Create ticket</button></form></div>;
}
