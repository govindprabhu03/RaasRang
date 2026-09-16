const { getActiveTicketTypes } = require("./_ticketTypes");

module.exports = async (req, res) => {
  try {
    const ticketTypes = await getActiveTicketTypes();
    res.status(200).json(ticketTypes);
  } catch {
    res.status(500).json({ error: "Could not load ticket types" });
  }
};
