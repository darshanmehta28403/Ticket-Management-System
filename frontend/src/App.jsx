import { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import { EMPTY_TICKET } from './constants.js';
import { message } from './utils.js';
import Login from './components/Login.jsx';
import Layout from './components/Layout.jsx';
import TicketFilters from './components/TicketFilters.jsx';
import TicketTable, { Pagination } from './components/TicketTable.jsx';
import TicketForm from './components/TicketForm.jsx';
import TicketDetail from './components/TicketDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import RolesPage from './pages/RolesPage.jsx';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('flowbit_token') || '');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('flowbit_user') || 'null'));
  const [page, setPage] = useState('Dashboard');
  const [tickets, setTickets] = useState([]); const [projects, setProjects] = useState([]); const [users, setUsers] = useState([]); const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0); const [skip, setSkip] = useState(0); const [filters, setFilters] = useState({ search: '', status: '', priority: '', projectId: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [ticketForm, setTicketForm] = useState(EMPTY_TICKET); const [editingTicket, setEditingTicket] = useState(null); const [detail, setDetail] = useState(null);
  const limit = 10;
  const query = useMemo(() => new URLSearchParams({ limit: String(limit), skip: String(skip), ...(filters.search && { searchString: filters.search }), ...(filters.status && { status: filters.status }), ...(filters.priority && { priority: filters.priority }), ...(filters.projectId && { projectId: filters.projectId }) }).toString(), [skip, filters]);
  const report = value => setError(message(value));

  async function loadTickets() { if (!token) return; setLoading(true); try { const data = await api(`/tickets?${query}`, token); setTickets(data.tickets || []); setTotal(data.totalCount || 0); } catch (error) { report(error); } finally { setLoading(false); } }
  async function loadSupport() { if (!token) return; try { const [projectData, userData, roleData] = await Promise.all([api('/projects?limit=100', token), api('/users?limit=100', token), api('/roles?limit=100', token)]); setProjects(projectData.projects || []); setUsers(userData.users || []); setRoles(roleData.roles || []); } catch (error) { report(error); } }
  useEffect(() => { loadTickets(); }, [token, query]);
  useEffect(() => { loadSupport(); }, [token]);

  function login(nextToken, nextUser) { localStorage.setItem('flowbit_token', nextToken); localStorage.setItem('flowbit_user', JSON.stringify(nextUser)); setToken(nextToken); setUser(nextUser); }
  function logout() { localStorage.removeItem('flowbit_token'); localStorage.removeItem('flowbit_user'); setToken(''); setUser(null); }
  function openTicketForm(ticket) { setEditingTicket(ticket || null); setTicketForm(ticket ? { title: ticket.title, description: ticket.description, status: ticket.status, priority: ticket.priority, projectId: ticket.project.id, assignedToId: ticket.assignee.id } : { ...EMPTY_TICKET, projectId: projects[0]?.id || '', assignedToId: users[0]?.id || '' }); }
  function closeTicketForm() { setEditingTicket(null); setTicketForm(EMPTY_TICKET); }
  async function saveTicket(event) { event.preventDefault(); try { await api(editingTicket ? `/tickets/${editingTicket.id}` : '/tickets', token, { method: editingTicket ? 'PATCH' : 'POST', body: JSON.stringify(ticketForm) }); closeTicketForm(); await loadTickets(); } catch (error) { report(error); } }
  async function deleteTicket(ticket) { if (!window.confirm(`Delete ${ticket.ticketNumber}?`)) return; try { await api(`/tickets/${ticket.id}`, token, { method: 'DELETE' }); setDetail(null); await loadTickets(); } catch (error) { report(error); } }
  async function openDetail(ticket) { try { setDetail(await api(`/tickets/${ticket.id}`, token)); } catch (error) { report(error); } }
  function changeFilter(field, value) { setSkip(0); setFilters(current => ({ ...current, [field]: value })); }
  function resetFilters() { setSkip(0); setFilters({ search: '', status: '', priority: '', projectId: '' }); }

  if (!token || !user) return <Login onLogin={login} />;
  return <Layout page={page} setPage={setPage} user={user} logout={logout} onNewTicket={() => openTicketForm()}>{error && <p className="error banner">{error}<button className="text-button" onClick={() => setError('')}>Dismiss</button></p>}{page === 'Dashboard' && <Dashboard total={total} tickets={tickets} onTicket={openDetail} />}{page === 'Tickets' && <><TicketFilters filters={filters} projects={projects} change={changeFilter} reset={resetFilters} /><TicketTable tickets={tickets} loading={loading} open={openDetail} edit={openTicketForm} remove={deleteTicket} /><Pagination total={total} skip={skip} limit={limit} setSkip={setSkip} /></>}{page === 'Projects' && <ProjectsPage projects={projects} token={token} refresh={loadSupport} report={report} />}{page === 'Users' && <UsersPage users={users} projects={projects} roles={roles} token={token} refresh={loadSupport} report={report} />}{page === 'Roles' && <RolesPage roles={roles} token={token} refresh={loadSupport} report={report} />}{(editingTicket || ticketForm.projectId) && <TicketForm form={ticketForm} projects={projects} users={users} ticket={editingTicket} setForm={setTicketForm} submit={saveTicket} close={closeTicketForm} />}{detail && <TicketDetail ticket={detail} currentUser={user} token={token} close={() => setDetail(null)} refresh={openDetail} edit={() => { setDetail(null); openTicketForm(detail); }} remove={() => deleteTicket(detail)} report={report} />}</Layout>;
}
