import { useUsers } from "@/hooks/use-users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function Solde() {
  const [, setLocation] = useLocation();
  const { data: users = [], isLoading } = useUsers();

  const creditSolded = users.filter((u: any) => u.role === 'client' && u.isSolded).map((u: any) => ({ ...u, type: 'credit' }));
  const epargneSolded = users.filter((u: any) => (u.role === 'compte_courant' || u.role === 'carte_pointage') && u.isSolded).map((u: any) => ({
    ...u,
    type: u.role === 'carte_pointage' ? 'carte-pointage' : 'compte-courant'
  }));

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
        <h1 className="text-xl font-bold">Soldé</h1>
      </div>

      <Tabs defaultValue="credit" className="w-full">
        <TabsList className="w-full h-14 bg-white border-b rounded-none p-0 flex">
          <TabsTrigger 
            value="credit" 
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-white text-slate-500 font-medium text-xs"
          >
            Crédit soldé
          </TabsTrigger>
          <TabsTrigger 
            value="epargne" 
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-white text-slate-500 font-medium text-xs"
          >
            Epargne soldé
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="credit" className="mt-0 space-y-0">
            {creditSolded.length === 0 ? (
              <div className="py-20 text-center text-slate-400">Aucun crédit soldé</div>
            ) : (
              creditSolded.map((user: any) => (
                <SoldedItem key={user.id} id={user.id} name={`${user.name} ${user.firstName || ""}`} amount={34100} type={user.type} />
              ))
            )}
          </TabsContent>

          <TabsContent value="epargne" className="mt-0 space-y-0">
            {epargneSolded.length === 0 ? (
              <div className="py-20 text-center text-slate-400">Aucune épargne soldée</div>
            ) : (
              epargneSolded.map((user: any) => (
                <SoldedItem key={user.id} id={user.id} name={`${user.name} ${user.firstName || ""}`} amount={parseFloat(user.mise?.toString() || "0")} type={user.type} />
              ))
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function SoldedItem({ id, name, amount, type }: { id: string, name: string, amount: number, type: string }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const endpoint = type === 'credit' ? 'credits' : (type === 'carte-pointage' ? 'carte-pointages' : 'compte-courants');
      await apiRequest("DELETE", `/api/${endpoint}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/compte-courants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/carte-pointages"] });
      toast({ title: "Client envoyé dans la corbeille" });
      setLocation("/corbeille");
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
      onClick={() => setLocation(`/client/${type}/${id}`)}
      className="flex items-center gap-4 py-6 border-b border-slate-100 last:border-0 cursor-pointer active:bg-slate-50 transition-colors"
    >
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
        <AlertCircle className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 flex justify-between items-center pr-4">
        <span className="text-lg font-bold text-slate-800 uppercase">
          {name}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-slate-800">
            {amount.toLocaleString()}
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
