import { useUsers } from "@/hooks/use-users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function Epargne() {
  const [, setLocation] = useLocation();
  const { data: users = [], isLoading } = useUsers();

  const points = users.filter((u: any) => u.role === 'carte_pointage' && !u.isSolded).map((u: any) => ({ ...u, type: 'carte-pointage' }));
  const accounts = users.filter((u: any) => u.role === 'compte_courant' && !u.isSolded).map((u: any) => {
    const initialMise = parseFloat(u.mise?.toString() || "0");
    const adjustedAmount = Math.max(0, initialMise - 5000);
    return { ...u, adjustedAmount, type: 'compte-courant' };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Custom Header */}
      <div className="bg-white px-4 h-14 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => setLocation("/")} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-xl font-bold">Épargne</h1>
      </div>

      <Tabs defaultValue="pointage" className="w-full">
        <TabsList className="w-full h-14 bg-white border-b rounded-none p-0 flex">
          <TabsTrigger 
            value="pointage" 
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-white text-slate-500 font-medium text-xs"
          >
            Carte de pointage
          </TabsTrigger>
          <TabsTrigger 
            value="courant" 
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-white text-slate-500 font-medium text-xs"
          >
            Compte courant
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="pointage" className="mt-0 space-y-0">
            {points.length === 0 ? (
              <div className="py-20 text-center text-slate-400">Aucune carte de pointage</div>
            ) : (
              points.map((user: any) => (
                <ClientItem key={user.id} id={user.id} name={`${user.name} ${user.firstName || ""}`} amount={user.mise} type={user.type} />
              ))
            )}
          </TabsContent>

          <TabsContent value="courant" className="mt-0 space-y-0">
            {accounts.length === 0 ? (
              <div className="py-20 text-center text-slate-400">Aucun compte courant</div>
            ) : (
              accounts.map((user: any) => (
                <ClientItem key={user.id} id={user.id} name={`${user.name} ${user.firstName || ""}`} amount={user.adjustedAmount} type={user.type} />
              ))
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ClientItem({ id, name, amount, type }: { id: string, name: string, amount: number, type: string }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const endpoint = type === 'carte-pointage' ? 'carte-pointages' : 'compte-courants';
      await apiRequest("DELETE", `/api/${endpoint}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/compte-courants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/carte-pointages"] });
      toast({ title: "Client supprimé" });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Voulez-vous vraiment supprimer le client ${name}?`)) {
      deleteMutation.mutate();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 py-6 border-b border-slate-100 last:border-0 cursor-pointer"
      onClick={() => setLocation(`/client/${type}/${id}`)}
    >
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
        <AlertCircle className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 flex justify-between items-center pr-4">
        <span className="text-lg font-medium text-slate-800">
          {name}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-slate-800">
            {amount > 0 ? amount.toLocaleString() : ""}
          </span>
          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-full transition-colors"
          >
            <AlertCircle className="w-6 h-6 text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
