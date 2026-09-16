const { TICKET_TYPES } = require("./_ticketTypes");

exports.handler = async () => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(TICKET_TYPES),
});
