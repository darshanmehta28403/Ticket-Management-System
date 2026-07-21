export type Project = { id: string; name: string; description: string };

export type Ticket = {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project: { name: string };
  assignee: { name: string };
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string | { title: string };
  project: string | { name: string };
};
