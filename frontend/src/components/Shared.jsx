import { label } from '../utils.js';

export function Badge({ value }) { return <span className={`badge badge-${value.toLowerCase()}`}>{label(value)}</span>; }
export function Empty({ text }) { return <p className="empty">{text}</p>; }
export function Actions({ close, submit }) { return <div className="modal-actions"><button type="button" className="secondary" onClick={close}>Cancel</button><button>{submit}</button></div>; }
export function Select({ label: title, value, values, empty, onChange }) { return <label className={title ? '' : 'sr-only'}>{title}<select value={value} onChange={event => onChange(event.target.value)}>{empty && <option value="">{empty}</option>}{values.map(item => <option key={item} value={item}>{label(item)}</option>)}</select></label>; }
export function Modal({ title, children, close, wide = false }) { return <div className="modal-backdrop" role="presentation"><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><div className="modal-header"><h2>{title}</h2><button className="icon-button" aria-label="Close" onClick={close}>×</button></div>{children}</section></div>; }
