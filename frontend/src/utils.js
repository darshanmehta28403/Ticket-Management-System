export function label(value = '') { return value.split('_').join(' '); }
export function roleName(role) { return typeof role === 'string' ? role : role?.title || ''; }
export function projectName(project) { return typeof project === 'string' ? project : project?.name || ''; }
export function formatDate(value) { return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }
export function message(error) { return error instanceof Error ? error.message : 'Something went wrong.'; }
