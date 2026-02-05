import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAllModels } from '@/hooks/useModels';
import { ModelCard } from '@/components/ModelCard';

export const LandingPage = () => {
  const navigate = useNavigate();

  // Fetch different sets of models for each section
  const { data: sponsoredData, isLoading: sponsoredLoading } = useAllModels({ 
    limit: 7,
    includePending: 'false'
  });
  
  const { data: latestData, isLoading: latestLoading } = useAllModels({ 
    limit: 7,
    includePending: 'false'
  });
  
  const { data: sochSelectionData, isLoading: sochSelectionLoading } = useAllModels({ 
    limit: 7,
    includePending: 'false',
    randomize: true
  });
  
  const { data: superToolsData, isLoading: superToolsLoading } = useAllModels({ 
    limit: 7,
    includePending: 'false'
  });
  
  const { data: chatbotsData, isLoading: chatbotsLoading } = useAllModels({ 
    category: 'chatbots',
    limit: 7,
    includePending: 'false'
  });

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">Soch AI Store</span>
        </div>
        <Button onClick={() => navigate('/')} className="rounded-full">
          Start Exploring <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-4 z-10 mt-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
          Promote your AI <br /> on Soch AI Store
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-12">
          The largest directory for the next generation of AI tools. Discover, Launch, and Scale your AI business today.
        </p>
      </main>

      {/* Fixed Tool Sections */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-16 z-10">
        {/* Sponsored Tools */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Sponsored Tools</h2>
            <Button variant="ghost" onClick={() => navigate('/explorer')}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          {sponsoredLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sponsoredData?.data?.models?.slice(0, 7).map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </section>

        {/* Latest Tools */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Latest Tools</h2>
            <Button variant="ghost" onClick={() => navigate('/explorer')}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          {latestLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {latestData?.data?.models?.slice(0, 7).map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </section>

        {/* Soch AI Selection */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Soch AI Selection</h2>
            <Button variant="ghost" onClick={() => navigate('/explorer')}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          {sochSelectionLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sochSelectionData?.data?.models?.slice(0, 7).map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </section>

        {/* Super Tools */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Super Tools</h2>
            <Button variant="ghost" onClick={() => navigate('/explorer')}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          {superToolsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {superToolsData?.data?.models?.slice(0, 7).map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </section>

        {/* AI Chatbots */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">AI Chatbots</h2>
            <Button variant="ghost" onClick={() => navigate('/explorer?category=chatbots')}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          {chatbotsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {chatbotsData?.data?.models?.slice(0, 7).map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};