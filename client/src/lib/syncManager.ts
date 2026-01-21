type SyncAction = {
  id: string;
  type: "CREATE_CREDIT" | "CREATE_COMPTE_COURANT" | "CREATE_CARTE_POINTAGE" | "UPDATE_STATUS";
  payload: any;
  timestamp: number;
};

export class SyncManager {
  private static QUEUE_KEY = "agro_finance_sync_queue";

  static getQueue(): SyncAction[] {
    const queue = localStorage.getItem(this.QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  }

  static addToQueue(action: Omit<SyncAction, "id" | "timestamp">) {
    const queue = this.getQueue();
    const newAction: SyncAction = {
      ...action,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    queue.push(newAction);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    console.log("Action added to sync queue:", newAction);
  }

  static async processQueue() {
    if (!navigator.onLine) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} pending sync actions...`);
    
    const remainingQueue: SyncAction[] = [];

    for (const action of queue) {
      try {
        let endpoint = "";
        switch (action.type) {
          case "CREATE_CREDIT": endpoint = "/api/credits"; break;
          case "CREATE_COMPTE_COURANT": endpoint = "/api/compte-courants"; break;
          case "CREATE_CARTE_POINTAGE": endpoint = "/api/carte-pointages"; break;
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload),
        });

        if (!res.ok) throw new Error("Sync failed");
        console.log(`Successfully synced action: ${action.id}`);
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        remainingQueue.push(action);
      }
    }

    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(remainingQueue));
  }
}
