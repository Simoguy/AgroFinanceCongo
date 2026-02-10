type Log = {
  date: string;
  user: string;
  type: "ACCES" | "ACTION" | "ADMIN";
  action: string;
};

const STORAGE_KEY = "security_logs";

// 🔹 Simulation d’un appel API
async function sendLogToApi(log: Log) {
  // PLUS TARD :
  // await fetch("/api/logs", { method: "POST", body: JSON.stringify(log) });

  console.log("📡 Log envoyé à l’API :", log);
}

// 🔹 Ajouter un log (centralisé)
export async function addSecurityLog(log: Log) {
  // 1. Sauvegarde locale
  const existing = localStorage.getItem(STORAGE_KEY);
  const logs: Log[] = existing ? JSON.parse(existing) : [];

  const updatedLogs = [log, ...logs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

  // 2. Envoi API (préparé)
  await sendLogToApi(log);

  return updatedLogs;
}

// 🔹 Récupérer les logs
export function getSecurityLogs(): Log[] {
  const logs = localStorage.getItem(STORAGE_KEY);
  return logs ? JSON.parse(logs) : [];
}

// 🔹 Supprimer les logs
export function clearSecurityLogs() {
  localStorage.removeItem(STORAGE_KEY);
}
