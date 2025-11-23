import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coffee, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserTypeModal({ open, onOpenChange }: UserTypeModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-2">Who are you?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={() => {
              navigate("/customer");
              onOpenChange(false);
            }}
            className="h-24 text-lg flex flex-col gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Coffee className="w-8 h-8" />
            <span>Customer</span>
          </Button>
          <Button
            onClick={() => {
              navigate("/business/onboarding");
              onOpenChange(false);
            }}
            variant="outline"
            className="h-24 text-lg flex flex-col gap-2 border-2 hover:bg-secondary transition-all hover:scale-105"
          >
            <Store className="w-8 h-8" />
            <span>Business</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
