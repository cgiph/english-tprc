import { useEffect, useState } from "react";
import { Users, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export function ActiveUsersBadge() {
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [loggedInUsers, setLoggedInUsers] = useState(0);
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    // Generate initial realistic numbers
    const initialVisitors = Math.floor(Math.random() * 40) + 12;
    setActiveVisitors(initialVisitors);
    setLoggedInUsers(Math.floor(initialVisitors * 0.4)); // roughly 40% are logged in

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    let interval: NodeJS.Timeout;

    if (isVisible) {
      interval = setInterval(() => {
        // Simulate data updates (slightly fluctuating numbers)
        setActiveVisitors(prev => Math.max(5, prev + (Math.floor(Math.random() * 5) - 2)));
        setLoggedInUsers(prev => Math.max(2, prev + (Math.floor(Math.random() * 3) - 1)));
      }, 10000); // Updates every 10 seconds
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (interval) clearInterval(interval);
    };
  }, [isVisible]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-auto"
    >
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-full px-4 py-2.5 flex items-center gap-4 hover:bg-white hover:shadow-xl transition-all cursor-default group">
        <div className="flex items-center gap-2" title="Active visitors in the last 5 minutes">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <Users className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
          <span className="text-sm font-bold text-slate-700">{activeVisitors}</span>
        </div>
        
        <div className="w-px h-4 bg-slate-200"></div>
        
        <div className="flex items-center gap-2" title="Logged-in users currently online">
          <UserCheck className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm font-bold text-blue-700">{loggedInUsers}</span>
        </div>
      </div>
    </motion.div>
  );
}
