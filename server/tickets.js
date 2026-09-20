export const TICKET_TYPES = [
  {
    id: "stag",
    name: "Stag Pass",
    price: 149,
    description: "Single entry — access to the full Raas Rang Navratri night.",
  },
  {
    id: "couple",
    name: "Couple Pass",
    price: 248,
    description: "Entry for two — best value for duos.",
  },
  {
    id: "group",
    name: "Group Pass (4)",
    price: 546,
    description: "Entry for a group of four.",
  },
];

export function getTicketById(id) {
  return TICKET_TYPES.find((t) => t.id === id);
}
