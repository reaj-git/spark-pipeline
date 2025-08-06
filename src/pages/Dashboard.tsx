import { useState } from 'react';
import { Header } from '@/components/Header';
import { PipelineBoard } from '@/components/PipelineBoard';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { ProspectForm } from '@/components/ProspectForm';

interface Prospect {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  pipeline_stage: 'new' | 'in_talks' | 'closed';
  notes?: string;
  created_at: string;
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'metrics'>('pipeline');
  const [showProspectForm, setShowProspectForm] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddProspect = () => {
    setEditingProspect(null);
    setShowProspectForm(true);
  };

  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect(prospect);
    setShowProspectForm(true);
  };

  const handleFormClose = () => {
    setShowProspectForm(false);
    setEditingProspect(null);
  };

  const handleFormSave = () => {
    setRefreshKey(prev => prev + 1);
    handleFormClose();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddProspect={handleAddProspect}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'pipeline' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">Sales Pipeline</h2>
              <p className="text-muted-foreground mt-2">
                Manage your prospects through the sales process
              </p>
            </div>
            
            <PipelineBoard
              onAddProspect={handleAddProspect}
              onEditProspect={handleEditProspect}
              refreshKey={refreshKey}
            />
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
              <p className="text-muted-foreground mt-2">
                Track your sales performance and conversion metrics
              </p>
            </div>
            
            <MetricsDashboard />
          </div>
        )}
      </main>

      <ProspectForm
        isOpen={showProspectForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
        prospect={editingProspect}
      />
    </div>
  );
};