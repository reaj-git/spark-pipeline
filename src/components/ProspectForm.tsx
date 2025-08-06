import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Phone, Building, FileText } from "lucide-react";

interface Prospect {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  pipeline_stage: "new" | "in_talks" | "closed";
  notes?: string;
  created_at: string;
}

interface ProspectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  prospect?: Prospect | null;
}

export const ProspectForm = ({
  isOpen,
  onClose,
  onSave,
  prospect,
}: ProspectFormProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  useEffect(() => {
    if (prospect) {
      setFormData({
        full_name: prospect.full_name,
        email: prospect.email,
        phone: prospect.phone || "",
        company: prospect.company || "",
        notes: prospect.notes || "",
      });
    } else {
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      });
    }
  }, [prospect, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      if (prospect) {
        // Update existing prospect
        const { error } = await supabase
          .from("prospects")
          .update(formData)
          .eq("id", prospect.id);

        if (error) throw error;

        toast({
          title: "Prospect updated",
          description: "Prospect information has been updated successfully.",
        });
      } else {
        // Create new prospect
        const { error } = await supabase.from("prospects").insert({
          ...formData,
          user_id: user.id,
          pipeline_stage: "new",
        });

        if (error) throw error;

        toast({
          title: "Prospect added",
          description: "New prospect has been added to your pipeline.",
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: prospect ? "Error updating prospect" : "Error adding prospect",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {prospect ? "Edit Prospect" : "Add New Prospect"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

   

<div className="space-y-2">
  <Label htmlFor="phone" className="flex items-center gap-2">
    <Phone className="w-4 h-4" />
    Phone
  </Label>
  <div className="react-phone-wrapper">
    <PhoneInput
      country={'us'}
      value={formData.phone}
      onChange={(value) => handleInputChange('phone', value)}
      inputProps={{
        name: 'phone',
        id: 'phone',
        required: false,
        autoComplete: 'off',
      }}
      enableSearch
      containerClass="w-full"
      inputClass="!w-full !py-2 !pl-12 !pr-3 !text-sm !border !rounded-md"
      buttonClass="!bg-white !border-r !border-gray-300"
    />
  </div>
</div>


          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Acme Inc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about this prospect..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : prospect ? "Update" : "Add Prospect"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
