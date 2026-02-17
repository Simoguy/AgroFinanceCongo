import { useUsers } from "@/hooks/use-users";
import { ArrowLeft, Scale, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function Contentieux() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: users = [], isLoading } = useUsers();

  const clients = users.filter((u: any) => u.isContencieux);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/credits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/compte-courants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/carte-pointages"] });
      toast({ title: "Client supprimé" });
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Voulez-vous vraiment supprimer le client ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28">
      <div className="bg-red-500 px-4 h-14 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => setLocation("/")} className="p-2 -ml-2 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Contentieux</h1>
      </div>

      <div className="p-4 space-y-0">
        {clients.length === 0 ? (
          <div className="py-20 text-center text-slate-400">Aucun client en contentieux</div>
        ) : (
          clients.map((user: any) => {
            const totalToRepay = (user.accountCount || 1) * 34100;
            return (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setLocation(`/client/credit/${user.id}`)}
                className="flex items-center gap-4 py-6 border-b border-slate-100 last:border-0 cursor-pointer active:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 flex justify-between items-center pr-4">
                  <span className="text-lg font-bold text-slate-800 uppercase">
                    {user.name} {user.firstName}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-slate-800">
                      {totalToRepay.toLocaleString()}
                    </span>
                    <button 
                      onClick={(e) => handleDelete(e, user.id, user.name)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
