import React from "react";

interface TicketCardProps {
  ticketNo: string;
  link: string;
  assignedTo: string;
  time: string;
}

const TicketCard: React.FC<TicketCardProps> = React.memo(
  ({ ticketNo, link, assignedTo, time }) => (
    <div
      className="ticket-card bg-gray-800 p-4 rounded-lg cursor-pointer"
      onClick={() => window.open(link, "_blank")}
    >
      <div className="ticket-info mb-2">
        <div className="ticket-label text-gray-400">Ticket No:</div>
        <div className="ticket-value text-white">{ticketNo}</div>
      </div>
      <div className="ticket-info mb-2">
        <div className="ticket-label text-gray-400">Assigned To:</div>
        <div className="ticket-value text-white">{assignedTo}</div>
      </div>
      <div className="ticket-footer flex justify-between items-center">
        <div className="ticket-time text-gray-400">{time}</div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="view-ticket text-blue-400 hover:text-blue-300"
        >
          View Ticket
        </a>
      </div>
    </div>
  )
);

export default TicketCard;
