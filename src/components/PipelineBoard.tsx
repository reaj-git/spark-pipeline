import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  ChevronRight,
  Mail,
  Phone,
  Building,
  Plus,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface PipelineBoardProps {
  onAddProspect: () => void;
  onEditProspect: (prospect: Prospect) => void;
  refreshKey: number;
}

const STAGE_COLORS = {
  new: "bg-primary text-primary-foreground",
  in_talks: "bg-warning text-warning-foreground",
  closed: "bg-success text-success-foreground",
};

const STAGE_NAMES = {
  new: "New",
  in_talks: "In Talks",
  closed: "Closed",
};

export const PipelineBoard = ({
  onAddProspect,
  onEditProspect,
  refreshKey,
}: PipelineBoardProps) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProspects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProspects((data || []) as Prospect[]);
    } catch (error: any) {
      toast({
        title: "Error fetching prospects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, [user, refreshKey]);

  const updateProspectStage = async (
    prospectId: string,
    newStage: "new" | "in_talks" | "closed"
  ) => {
    try {
      const { error } = await supabase
        .from("prospects")
        .update({ pipeline_stage: newStage })
        .eq("id", prospectId);

      if (error) throw error;

      setProspects((prev) =>
        prev.map((prospect) =>
          prospect.id === prospectId
            ? { ...prospect, pipeline_stage: newStage }
            : prospect
        )
      );

      toast({
        title: "Stage updated",
        description: `Prospect moved to ${STAGE_NAMES[newStage]}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating stage",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteProspect = async (prospectId: string) => {
    try {
      const { error } = await supabase
        .from("prospects")
        .delete()
        .eq("id", prospectId);

      if (error) throw error;

      setProspects((prev) => prev.filter((p) => p.id !== prospectId));

      toast({
        title: "Prospect deleted",
        description: "Prospect has been removed from your pipeline",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting prospect",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getProspectsByStage = (stage: "new" | "in_talks" | "closed") => {
    return prospects.filter((prospect) => prospect.pipeline_stage === stage);
  };

  const PipelineColumn = ({
    stage,
    title,
  }: {
    stage: "new" | "in_talks" | "closed";
    title: string;
  }) => {
    const stageProspects = getProspectsByStage(stage);

    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary" className="text-sm">
            {stageProspects.length}
          </Badge>
        </div>

        <div className="space-y-3 min-h-[400px]">
          {stageProspects.map((prospect) => (
            <Card
              key={prospect.id}
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {prospect.full_name}
                    </h4>
                    {prospect.company && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Building className="w-3 h-3" />
                        {prospect.company}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {prospect.pipeline_stage !== "closed" && (
                        <DropdownMenuItem
                          onClick={() => onEditProspect(prospect)}
                        >
                          Edit
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() => deleteProspect(prospect.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {prospect.email}
                  </p>
                  {prospect.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {prospect.phone}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Badge className={STAGE_COLORS[stage]}>
                    {STAGE_NAMES[stage]}
                  </Badge>

                  <div className="flex gap-1">
                    {stage === "new" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          updateProspectStage(prospect.id, "in_talks")
                        }
                        className="h-7 px-2 text-xs"
                      >
                        Move to Talks <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                    {stage === "in_talks" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateProspectStage(prospect.id, "new")
                          }
                          className="h-7 px-2 text-xs"
                        >
                          ← Back
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateProspectStage(prospect.id, "closed")
                          }
                          className="h-7 px-2 text-xs"
                        >
                          Close <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </>
                    )}
                    {stage === "closed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          updateProspectStage(prospect.id, "in_talks")
                        }
                        className="h-7 px-2 text-xs"
                      >
                        ← Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {stage === "new" && (
            <Card
              className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={onAddProspect}
            >
              <CardContent className="p-4 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                Add new prospect
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PipelineColumn stage="new" title="New Prospects" />
      <PipelineColumn stage="in_talks" title="In Talks" />
      <PipelineColumn stage="closed" title="Closed Deals" />
    </div>
  );
};
