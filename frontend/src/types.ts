export type Project = { id: string; name: string; description: string };

export type Ticket = {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  project: { id: string; name: string };
  assignee: { id: string; name: string };
  creator?: { id: string; name: string };
};

export type Comment = {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; name: string; email: string };
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string | { title: string };
  project: string | { name: string };
};
