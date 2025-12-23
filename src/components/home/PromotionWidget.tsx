// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Star, Megaphone, Handshake } from "lucide-react";
// import { motion } from "framer-motion";

// export const PromotionWidget = () => {
//   const navigate = useNavigate();

//   const WidgetButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       className="flex flex-col items-center justify-center bg-[#1e1e2d] hover:bg-[#2d2d44] border border-white/5 rounded-2xl p-4 h-28 w-full transition-all duration-200 group cursor-pointer"
//     >
//       <div className="bg-white/5 p-2 rounded-full mb-2 group-hover:bg-white/10 transition-colors">
//         <Icon className="w-6 h-6 text-white" />
//       </div>
//       <span className="text-sm font-medium text-gray-200 text-center leading-tight">
//         {label}
//       </span>
//     </motion.button>
//   );

//   return (
//     <div className="w-full max-w-[350px] mx-auto">
//       <div className="bg-[#13131f] rounded-3xl p-5 border border-white/10 shadow-2xl">
        
//         <div className="mb-5">
//           <h2 className="text-xl font-bold text-white mb-2">
//             Promote your AI on <span className="text-primary">SochAI Store</span>
//           </h2>
//           <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
//             <div className="h-full w-1/3 bg-primary rounded-full"></div>
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => navigate('/profile')} 
//           className="w-full py-3 mb-5 bg-[#2a2a35] hover:bg-[#343442] text-gray-300 rounded-xl text-sm font-semibold transition-colors border border-white/5"
//         >
//           Manage my ads
//         </motion.button>

//         <div className="grid grid-cols-2 gap-3">
//           <WidgetButton 
//             icon={Plus} 
//             label="Launch tool" 
//             onClick={() => navigate('/launch')} 
//           />
//           <WidgetButton 
//             icon={Star} 
//             label="Get featured" 
//             onClick={() => navigate('/get-featured')} // Linked to new page
//           />
//           <WidgetButton 
//             icon={Megaphone} 
//             label="Custom campaign" 
//             onClick={() => navigate('/promote?type=campaign')} // Linked to new page
//           />
//           <WidgetButton 
//             icon={Handshake} 
//             label="Sponsorships" 
//             onClick={() => navigate('/promote?type=sponsorship')} // Linked to new page
//           />
//         </div>
//       </div>
//     </div>
//   );
// };







import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star } from "lucide-react";
import { motion } from "framer-motion";

export const PromotionWidget = () => {
  const navigate = useNavigate();

  const WidgetButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-[#1e1e2d] hover:bg-[#2d2d44] border border-white/5 rounded-2xl p-4 h-24 w-full transition-all duration-200 group cursor-pointer"
    >
      <div className="bg-white/5 p-2 rounded-full mb-2 group-hover:bg-white/10 transition-colors">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-200 text-center leading-tight">
        {label}
      </span>
    </motion.button>
  );

  return (
    <div className="w-full max-w-[350px] mx-auto">
      <div className="bg-[#13131f] rounded-3xl p-5 border border-white/10 shadow-2xl">
        
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white mb-2">
            Promote your AI on <span className="text-primary">SochAI Store</span>
          </h2>
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full"></div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/profile')} 
          className="w-full py-3 mb-5 bg-[#2a2a35] hover:bg-[#343442] text-gray-300 rounded-xl text-sm font-semibold transition-colors border border-white/5"
        >
          Manage my ads
        </motion.button>

        {/* Updated Grid: Only 2 options as requested */}
        <div className="grid grid-cols-2 gap-3">
          <WidgetButton 
            icon={Plus} 
            label="Launch tool" 
            onClick={() => navigate('/launch')} 
          />
          <WidgetButton 
            icon={Star} 
            label="Get Featured" 
            onClick={() => navigate('/get-featured')} 
          />
        </div>
      </div>
    </div>
  );
};