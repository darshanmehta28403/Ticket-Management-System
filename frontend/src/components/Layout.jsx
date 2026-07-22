import { PAGES } from '../constants.js';
import { roleName } from '../utils.js';

export default function Layout({ page, setPage, user, logout, children, onNewTicket }) {
  return <div className="app-shell"><aside className="sidebar"><div className="brand">flow<span>bit</span></div><p className="workspace-label">TICKET WORKSPACE</p>{PAGES.map(item => <button key={item} className={page === item ? 'nav-item active' : 'nav-item'} onClick={() => setPage(item)}>{item}</button>)}<div className="sidebar-bottom"><strong>{user.name}</strong><small>{roleName(user.role)}</small><button className="logout" onClick={logout}>Sign out</button></div></aside><main className="content"><header><div><p className="eyebrow">WORKSPACE</p><h1>{page}</h1></div>{page === 'Tickets' && <button onClick={onNewTicket}>+ New ticket</button>}</header>{children}</main></div>;
}
