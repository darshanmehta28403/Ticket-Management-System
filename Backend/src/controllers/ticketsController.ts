import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketComments,
  createTicketComment,
  updateTicketComment,
  deleteTicketComment,
  getTicketFiles,
  createTicketFile
} from "../service/ticketsService";

export const getAllTickets = async (req: any, res: any) => {
  return await getTickets(req, res);
};

export const getTicket = async (req: any, res: any) => {
  return await getTicketById(req, res);
};

export const postTicket = async (req: any, res: any) => {
  return await createTicket(req, res);
};

export const patchTicket = async (req: any, res: any) => {
  return await updateTicket(req, res);
};

export const removeTicket = async (req: any, res: any) => {
  return await deleteTicket(req, res);
};

export const getComments = async (req: any, res: any) => {
  return await getTicketComments(req, res);
};

export const postComment = async (req: any, res: any) => {
  return await createTicketComment(req, res);
};

export const patchComment = async (req: any, res: any) => updateTicketComment(req, res);
export const removeComment = async (req: any, res: any) => deleteTicketComment(req, res);

export const getFiles = async (req: any, res: any) => {
  return await getTicketFiles(req, res);
};

export const postFile = async (req: any, res: any) => {
  return await createTicketFile(req, res);
};
