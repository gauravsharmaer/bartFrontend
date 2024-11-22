import PasswordIcon from "../../assets/password.svg";
import TrackIcon from "../../assets/tracking.svg";
import TicketIcon from "../../assets/tickets.svg";
import { Input } from "../../components/ui/input";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface TicketData {
  subject: string;
  ticketNo: string;
  dateTime: string;
  priority: string;
  assignee: string;
  status: string;
}

export default function TicketList() {
  const data: TicketData[] = Array.from({ length: 7 }, () => ({
    subject: "Password Recovery",
    ticketNo: "#654345",
    dateTime: "Jul 19, 06:30PM",
    priority: "Urgent",
    assignee: "Darlene Robertson",
    status: "Active",
  }));

  return (
    <div className="w-full  h-screen flex flex-col m-6">
      <div className="flex justify-between w-[90%] m-6 items-center">
        <div className="text-white text-2xl font-semibold  leading-[28.80px] flex gap-2">
          <img src={TicketIcon} alt="ticket" className="w-6 h-6" />
          Your Tickets{" "}
        </div>
        <div className="">
          <Input
            type="text"
            placeholder="Search"
            icon={<MagnifyingGlass size={16} />}
            iconPosition="start"
            className="w-full"
          />
        </div>
      </div>

      <div className="w-[90%] garadientBG m-6 rounded-lg">
        <table className="w-full rounded-lg table-fixed">
          <thead className="bg-[#080808]">
            <tr>
              <th className="w-[25%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
                Subject
              </th>
              <th className="w-[12%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
                Ticket no.
              </th>
              <th className="w-[15%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
                Date and Time
              </th>
              <th className="w-[12%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
                Priority
              </th>
              <th className="w-[20%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
                Assign to
              </th>
              <th className="w-[10%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
                Status
              </th>
              <th className="w-[6%]"></th>
            </tr>
          </thead>
          <tbody className="bg-[#1A1A1A] border border-[#313131]">
            {data.map((item, index) => (
              <tr key={index} className="border border-[#313131]">
                <td className="w-[25%] py-4 pl-[52px]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center">
                      <img
                        src={PasswordIcon}
                        alt="password"
                        className="w-4 h-4"
                      />
                    </span>
                    <span className=" text-white text-xs font-normal ">
                      {item.subject}
                    </span>
                  </div>
                </td>
                <td className="w-[12%] py-4 pl-[16px] opacity-60 text-white text-xs font-normal ">
                  {item.ticketNo}
                </td>
                <td className="w-[15%] py-4 pl-[16px] opacity-60 text-white text-xs font-normal ">
                  {item.dateTime}
                </td>
                <td className="w-[12%] py-4 pl-[16px]">
                  <span className="text-[#eb4747] text-xs font-normal ">
                    {item.priority}
                  </span>
                </td>
                <td className="w-[20%] py-4 pl-[52px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                      DR
                    </div>
                    <span className="opacity-60 text-white text-xs font-normal ">
                      {item.assignee}
                    </span>
                  </div>
                </td>
                <td className="w-[10%] py-4 pl-[16px]">
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
                    {item.status}
                  </span>
                </td>
                <td className="w-[6%] py-4 px-4">
                  <button className="w-5 h-5 opacity-60 text-white text-xs font-normal ">
                    <img src={TrackIcon} alt="track" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
