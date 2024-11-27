import PasswordIcon from "../../assets/password.svg";
import TrackIcon from "../../assets/tracking.svg";
import TicketIcon from "../../assets/tickets.svg";
import { Input } from "../../components/ui/input";
import { MagnifyingGlass } from "@phosphor-icons/react";
import "../../App.css";

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
    <div className="w-full flex flex-col items-center h-screen p-6 bg-[#121212]">
      {/* Gradient Background Container */}
      <div className="garadientBG bg-cover bg-center justify-center w-full h-full items-center flex rounded-xl flex-col px-10">

      {/* <div className="w-full h-full bg-gradient-to-r from-[#0B0B0D] to-[#1E1E1E] flex flex-col rounded-lg shadow-lg p-8"> */}
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="text-white text-2xl font-semibold flex items-center gap-3">
            <img src={TicketIcon} alt="ticket" className="w-7 h-7" />
            Your Tickets
          </div>
          <div className="border-[#313131]">
             <Input
              type="text"
              placeholder="Search"
              icon={<MagnifyingGlass size={16} />}
              iconPosition="start"
              className="w-full"
            />
          </div>

          
        </div>

        {/* Table Section */}
        <div className="w-full overflow-hidden rounded-2xl border border-[#313131]">
          <table className="w-full table-auto">
          <thead className="bg-[#171717]">
  <tr>
    <th className="text-left px-6 py-3 text-sm text-gray-400">Subject</th>
    <th className="text-left px-6 py-3 text-sm text-gray-400">Ticket no.</th>
    <th className="text-left px-6 py-3 text-sm text-gray-400">Date and Time</th>
    <th className="text-left px-6 py-3 text-sm text-gray-400">Priority</th>
    <th className="text-left px-6 py-3 text-sm text-gray-400">Assign to</th>
    <th className="text-left px-6 py-3 text-sm text-gray-400">Status</th>
    <th className="px-6 py-3"></th>
  </tr>
</thead>
<tbody className="bg-[#1E1E1E] divide-y divide-[#292929]">
  {data.map((item, index) => (
    <tr key={index} className="hover:bg-[#292929]">
      <td className="px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#313131] rounded-full flex items-center justify-center">
          <img src={PasswordIcon} alt="password" className="w-4 h-4" />
        </div>
        <span className="text-white text-sm">{item.subject}</span>
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">{item.ticketNo}</td>
      <td className="px-6 py-4 text-gray-400 text-sm">{item.dateTime}</td>
      <td className="px-6 py-4">
        <span className="text-red-500 text-sm">{item.priority}</span>
      </td>
      <td className="px-6 py-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#3B3B3B] rounded-full flex items-center justify-center text-white">
          DR
        </div>
        <span className="text-gray-400 text-sm">{item.assignee}</span>
      </td>
      <td className="px-6 py-4">
        <button className="text-white bg-green-700 px-4 py-1 rounded-full text-sm">
          {item.status}
        </button>
      </td>
      <td className="px-6 py-4 text-center">
        <button>
          <img src={TrackIcon} alt="track" className="w-5 h-5 opacity-60" />
        </button>
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </div>
      </div>
    </div>
  );
}



// import PasswordIcon from "../../assets/password.svg";
// import TrackIcon from "../../assets/tracking.svg";
// import TicketIcon from "../../assets/tickets.svg";
// import { Input } from "../../components/ui/input";
// import { MagnifyingGlass } from "@phosphor-icons/react";
// import "../../App.css";
// interface TicketData {
//   subject: string;
//   ticketNo: string;
//   dateTime: string;
//   priority: string;
//   assignee: string;
//   status: string;
// }

// export default function TicketList() {
//   const data: TicketData[] = Array.from({ length: 7 }, () => ({
//     subject: "Password Recovery",
//     ticketNo: "#654345",
//     dateTime: "Jul 19, 06:30PM",
//     priority: "Urgent",
//     assignee: "Darlene Robertson",
//     status: "Active",
//   }));

//   return (
//     <div className="w-full justify-center items-center h-screen flex flex-col p-4 ">
//       <div className="garadientBG bg-cover bg-center justify-center w-full h-full items-center flex rounded-xl flex-col px-10">
//         <div className="flex justify-between w-[90%] m-6 items-center">
//           <div className="text-white text-2xl font-semibold  leading-[28.80px] flex gap-2">
//             <img src={TicketIcon} alt="ticket" className="w-6 h-6" />
//             Your Tickets{" "}
//           </div>
//           <div className="">
//             <Input
//               type="text"
//               placeholder="Search"
//               icon={<MagnifyingGlass size={16} />}
//               iconPosition="start"
//               className="w-full"
//             />
//           </div>
//         </div>

//         <div className="w-[90%]  m-6 rounded-lg ">
//           <table className="w-full rounded-lg table-fixed">
//             <thead className="bg-[#080808]">
//               <tr>
//                 <th className="w-[25%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
//                   Subject
//                 </th>
//                 <th className="w-[12%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
//                   Ticket no.
//                 </th>
//                 <th className="w-[15%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
//                   Date and Time
//                 </th>
//                 <th className="w-[12%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
//                   Priority
//                 </th>
//                 <th className="w-[20%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
//                   Assign to
//                 </th>
//                 <th className="w-[10%] text-left py-4 pl-16 opacity-60 text-white text-xs font-medium ">
//                   Status
//                 </th>
//                 <th className="w-[6%]"></th>
//               </tr>
//             </thead>
//             <tbody className="bg-[#1A1A1A] border border-[#313131]">
//               {data.map((item, index) => (
//                 <tr key={index} className="border border-[#313131]">
//                   <td className="w-[25%] py-4 pl-[52px]">
//                     <div className="flex items-center gap-2">
//                       <span className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center">
//                         <img
//                           src={PasswordIcon}
//                           alt="password"
//                           className="w-4 h-4"
//                         />
//                       </span>
//                       <span className=" text-white text-xs font-normal ">
//                         {item.subject}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="w-[12%] py-4 pl-[16px] opacity-60 text-white text-xs font-normal ">
//                     {item.ticketNo}
//                   </td>
//                   <td className="w-[15%] py-4 pl-[16px] opacity-60 text-white text-xs font-normal ">
//                     {item.dateTime}
//                   </td>
//                   <td className="w-[12%] py-4 pl-[16px]">
//                     <span className="text-[#eb4747] text-xs font-normal ">
//                       {item.priority}
//                     </span>
//                   </td>
//                   <td className="w-[20%] py-4 pl-[52px]">
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm">
//                         DR
//                       </div>
//                       <span className="opacity-60 text-white text-xs font-normal ">
//                         {item.assignee}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="w-[10%] py-4 pl-[16px]">
//                     <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="w-[6%] py-4 px-4">
//                     <button className="w-5 h-5 opacity-60 text-white text-xs font-normal ">
//                       <img src={TrackIcon} alt="track" className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
