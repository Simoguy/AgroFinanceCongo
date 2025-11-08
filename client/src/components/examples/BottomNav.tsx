import { Router } from "wouter";
import BottomNav from "../BottomNav";

export default function BottomNavExample() {
  return (
    <Router>
      <div className="h-screen flex items-end">
        <BottomNav />
      </div>
    </Router>
  );
}
