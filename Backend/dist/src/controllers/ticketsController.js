"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postFile = exports.getFiles = exports.removeComment = exports.patchComment = exports.postComment = exports.getComments = exports.removeTicket = exports.patchTicket = exports.postTicket = exports.getTicket = exports.getAllTickets = void 0;
const ticketsService_1 = require("../service/ticketsService");
const getAllTickets = async (req, res) => {
    return await (0, ticketsService_1.getTickets)(req, res);
};
exports.getAllTickets = getAllTickets;
const getTicket = async (req, res) => {
    return await (0, ticketsService_1.getTicketById)(req, res);
};
exports.getTicket = getTicket;
const postTicket = async (req, res) => {
    return await (0, ticketsService_1.createTicket)(req, res);
};
exports.postTicket = postTicket;
const patchTicket = async (req, res) => {
    return await (0, ticketsService_1.updateTicket)(req, res);
};
exports.patchTicket = patchTicket;
const removeTicket = async (req, res) => {
    return await (0, ticketsService_1.deleteTicket)(req, res);
};
exports.removeTicket = removeTicket;
const getComments = async (req, res) => {
    return await (0, ticketsService_1.getTicketComments)(req, res);
};
exports.getComments = getComments;
const postComment = async (req, res) => {
    return await (0, ticketsService_1.createTicketComment)(req, res);
};
exports.postComment = postComment;
const patchComment = async (req, res) => (0, ticketsService_1.updateTicketComment)(req, res);
exports.patchComment = patchComment;
const removeComment = async (req, res) => (0, ticketsService_1.deleteTicketComment)(req, res);
exports.removeComment = removeComment;
const getFiles = async (req, res) => {
    return await (0, ticketsService_1.getTicketFiles)(req, res);
};
exports.getFiles = getFiles;
const postFile = async (req, res) => {
    return await (0, ticketsService_1.createTicketFile)(req, res);
};
exports.postFile = postFile;
