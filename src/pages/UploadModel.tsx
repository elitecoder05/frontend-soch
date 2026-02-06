
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Sparkles, Loader2, Image as ImageIcon, CreditCard, HelpCircle, Trash2 } from "lucide-react";
import { categories as defaultCategories } from "@/data/models";
import type { Category } from "@/types/model";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { modelsAPI, ModelUploadData, PricingPlan, FAQ } from "@/api/api-methods";
import { LogoUpload } from "@/components/ui/LogoUpload";
import { ScreenshotsUpload } from "@/components/ui/ScreenshotsUpload";
import { Footer } from "@/components/Footer";

export default function UploadModel() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  
  // Check if we're in edit mode
  const editMode = location.state?.editMode || false;
  const modelData = location.state?.modelData || null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await modelsAPI.getCategories();
        if (res?.data?.categories) {
          setCategoriesList(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload a model.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: '/upload-model' } } });
      return;
    }

    if (isAuthenticated && currentUser && !currentUser.isProUser) {
      toast({
        title: "Pro Subscription Required",
        description: "You need to be a Pro user to upload models.",
        variant: "destructive",
      });
      navigate('/pricing');
    }
  }, [isAuthenticated, currentUser, navigate, toast]);

  useEffect(() => {
    if (editMode && modelData) {
      setFormData({
        name: modelData.name || "",
        shortDescription: modelData.shortDescription || "",
        longDescription: modelData.longDescription || "",
        category: modelData.category || "",
        provider: modelData.provider || "",
        pricing: modelData.pricing || "freemium",
        modelType: modelData.modelType || "",
        externalUrl: modelData.externalUrl || "",
        isApiAvailable: modelData.isApiAvailable || false,
        isOpenSource: modelData.isOpenSource || false,
      });
      
      setTags(modelData.tags || []);
      setCapabilities(modelData.capabilities || []);
      setBestFor(modelData.bestFor || []);
      setFeatures(modelData.features || []);
      setExamplePrompts(modelData.examplePrompts || []);
      setLogoUrl(modelData.iconUrl || "");
      setScreenshotUrls(modelData.screenshots || []);
      setPricingPlans(modelData.pricingPlans || []);
      setFaqs(modelData.faqs || []);
    }
  }, [editMode, modelData]);
  
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    category: "",
    provider: "",
    pricing: "freemium" as "free" | "freemium" | "paid",
    modelType: "",
    externalUrl: "",
    isApiAvailable: false,
    isOpenSource: false,
  });

  const [logoUrl, setLogoUrl] = useState<string>("");
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [bestFor, setBestFor] = useState<string[]>([]);
  const [newBestFor, setNewBestFor] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [examplePrompts, setExamplePrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState("");

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const capabilityOptions = ["text", "image", "audio", "video", "code", "agent"];
  const pricingOptions = [
    { value: "free", label: "Free" },
    { value: "freemium", label: "Freemium" },
    { value: "paid", label: "Paid" }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const toggleCapability = (capability: string) => {
    setCapabilities(prev => 
      prev.includes(capability)
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  const addPricingPlan = () => {
    setPricingPlans([...pricingPlans, { name: "", price: "", billingCycle: "monthly", features: [] }]);
  };

  const removePricingPlan = (index: number) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  const updatePricingPlan = (index: number, field: keyof PricingPlan, value: any) => {
    const updated = [...pricingPlans];
    updated[index] = { ...updated[index], [field]: value };
    setPricingPlans(updated);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({ title: "Authentication Required", description: "Please log in to upload a model.", variant: "destructive" });
      navigate('/login', { state: { from: { pathname: '/upload-model' } } });
      return;
    }

    if (!currentUser?.isProUser) {
      toast({ title: "Pro Subscription Required", description: "You need to be a Pro user to upload models.", variant: "destructive" });
      navigate('/pricing');
      return;
    }
    
    const requiredFields = [
      { key: 'name', label: 'Model Name' },
      { key: 'provider', label: 'Provider' },
      { key: 'shortDescription', label: 'Short Description' },
      { key: 'category', label: 'Category' },
    ];

    const missing = requiredFields.filter(f => {
      const value = (formData as any)[f.key];
      return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
    });

    if (missing.length > 0) {
      toast({ title: "Missing fields", description: `Please fill: ${missing.map(m => m.label).join(', ')}.`, variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const modelDataPayload: ModelUploadData = {
        ...formData,
        tags,
        capabilities,
        bestFor,
        features,
        examplePrompts,
        pricingPlans,
        faqs,
        iconUrl: logoUrl,
        screenshots: screenshotUrls,
      };

      let response;
      if (editMode && modelData) {
        response = await modelsAPI.updateModel(modelData._id, modelDataPayload);
      } else {
        response = await modelsAPI.uploadModel(modelDataPayload);
      }
      
      toast({
        title: "Success!",
        description: response.message || (editMode ? "Model updated successfully." : "Model submitted for review."),
      });

      if (!editMode) {
        setFormData({ name: "", shortDescription: "", longDescription: "", category: "", provider: "", pricing: "freemium", modelType: "", externalUrl: "", isApiAvailable: false, isOpenSource: false });
        setTags([]); setCapabilities([]); setBestFor([]); setFeatures([]); setExamplePrompts([]); setLogoUrl(""); setScreenshotUrls([]);
      }

      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error: any) {
      console.error(editMode ? 'Update error:' : 'Upload error:', error);
      const rawMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save model.";

      let friendlyMessage = "Something went wrong while saving your model. Please try again.";
      if (typeof rawMessage === 'string') {
        if (rawMessage.includes('pricingPlans') || rawMessage.includes('faqs')) {
          friendlyMessage = "Some pricing or FAQ details are invalid. Please review and try again.";
        } else if (rawMessage.toLowerCase().includes('pro subscription')) {
          friendlyMessage = "You need a Pro subscription to upload models.";
        } else if (rawMessage.toLowerCase().includes('login')) {
          friendlyMessage = "Please log in to upload a model.";
        } else if (rawMessage.toLowerCase().includes('category')) {
          friendlyMessage = "Please choose a valid category.";
        }
      }

      toast({ title: "Error", description: friendlyMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Responsive Container - Adjusts padding for mobile vs desktop */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 mt-20 sm:mt-24 mb-12">
        <div className="max-w-4xl mx-auto w-full">
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {editMode ? "Edit AI Model" : "Upload AI Model"}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              {editMode 
                ? "Update your tool details. Changes will require re-approval."
                : "Share your AI tool with the world. Fill in the details below."
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
            {/* 1. Basic Info Card */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential details about your AI tool.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Model Name *</Label>
                    <Input id="name" placeholder="e.g., GPT-4 Turbo" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider *</Label>
                    <Input id="provider" placeholder="e.g., OpenAI" value={formData.provider} onChange={(e) => handleInputChange("provider", e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input id="shortDescription" placeholder="Brief one-line description" value={formData.shortDescription} onChange={(e) => handleInputChange("shortDescription", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea id="longDescription" placeholder="Detailed capabilities & features..." value={formData.longDescription} onChange={(e) => handleInputChange("longDescription", e.target.value)} rows={4} className="min-h-[120px]" />
                </div>

                {/* Grid adjusts from 1 col (mobile) to 3 (desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categoriesList.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricing">Pricing</Label>
                    <Select value={formData.pricing} onValueChange={(value: any) => handleInputChange("pricing", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {pricingOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelType">Model Type</Label>
                    <Input id="modelType" placeholder="e.g., LLM" value={formData.modelType} onChange={(e) => handleInputChange("modelType", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalUrl">Website / Tool URL</Label>
                  <Input id="externalUrl" type="url" placeholder="https://..." value={formData.externalUrl} onChange={(e) => handleInputChange("externalUrl", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* 2. Pricing Plans Card */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">Pricing Plans</CardTitle>
                  <CardDescription>Optional: Add pricing tiers for your tool.</CardDescription>
                </div>
                <Button type="button" onClick={addPricingPlan} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Plan
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {pricingPlans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No pricing plans added yet. Click "Add Plan" to create one.</p>
                  </div>
                ) : (
                  pricingPlans.map((plan, index) => (
                    <Card key={index} className="p-4 border-muted">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Plan {index + 1}</h4>
                        <Button type="button" onClick={() => removePricingPlan(index)} variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Plan Name</Label>
                          <Input 
                            placeholder="e.g., Basic, Pro, Enterprise"
                            value={plan.name}
                            onChange={(e) => updatePricingPlan(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price</Label>
                          <Input 
                            placeholder="e.g., $9.99, Free"
                            value={plan.price}
                            onChange={(e) => updatePricingPlan(index, 'price', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Billing Cycle</Label>
                          <Select 
                            value={plan.billingCycle} 
                            onValueChange={(value: 'monthly' | 'annual' | 'one-time') => updatePricingPlan(index, 'billingCycle', value)}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                              <SelectItem value="one-time">One-time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label>Features (one per line)</Label>
                        <Textarea 
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                          value={plan.features.join('\n')}
                          onChange={(e) => updatePricingPlan(index, 'features', e.target.value.split('\n').filter(f => f.trim()))}
                          rows={4}
                        />
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* 3. FAQs Card */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">FAQs</CardTitle>
                  <CardDescription>Optional: Add frequently asked questions about your tool.</CardDescription>
                </div>
                <Button type="button" onClick={addFaq} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Add FAQ
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No FAQs added yet. Click "Add FAQ" to create one.</p>
                  </div>
                ) : (
                  faqs.map((faq, index) => (
                    <Card key={index} className="p-4 border-muted">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">FAQ {index + 1}</h4>
                        <Button type="button" onClick={() => removeFaq(index)} variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Input 
                            placeholder="What does this tool do?"
                            value={faq.question}
                            onChange={(e) => updateFaq(index, 'question', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Answer</Label>
                          <Textarea 
                            placeholder="This tool helps you..."
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* 4. Visuals Card */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Visual Assets
                </CardTitle>
                <CardDescription>Logo and screenshots (Max 4).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <LogoUpload onUploadComplete={setLogoUrl} onRemove={() => setLogoUrl("")} initialUrl={logoUrl} disabled={isLoading} />
                  <ScreenshotsUpload onUploadComplete={setScreenshotUrls} initialUrls={screenshotUrls} disabled={isLoading} maxImages={4} />
                </div>
              </CardContent>
            </Card>

            {/* 5. Tags & Technical Card */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader>
                <CardTitle>Tags & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Add tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                    <Button type="button" onClick={addTag} size="icon"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {tags.map(t => (
                      <Badge key={t} variant="secondary" className="gap-1 px-3 py-1">
                        {t} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(t)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Capabilities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {capabilityOptions.map((cap) => (
                      <div key={cap} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50 transition-colors">
                        <Checkbox id={cap} checked={capabilities.includes(cap)} onCheckedChange={() => toggleCapability(cap)} />
                        <Label htmlFor={cap} className="capitalize cursor-pointer flex-1 text-sm">{cap}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2">
                  <div className="flex items-center space-x-2 border p-3 rounded-lg w-full sm:w-auto">
                    <Checkbox id="isApiAvailable" checked={formData.isApiAvailable} onCheckedChange={(c) => handleInputChange("isApiAvailable", c as boolean)} />
                    <Label htmlFor="isApiAvailable" className="cursor-pointer text-sm">API Available</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg w-full sm:w-auto">
                    <Checkbox id="isOpenSource" checked={formData.isOpenSource} onCheckedChange={(c) => handleInputChange("isOpenSource", c as boolean)} />
                    <Label htmlFor="isOpenSource" className="cursor-pointer text-sm">Open Source</Label>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Action Buttons - Stack on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 pb-8">
              {/* <Button type="button" variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                Save Draft
              </Button> */}
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 min-w-[160px]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {editMode ? "Save Changes" : "Submit Model"}
              </Button>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}