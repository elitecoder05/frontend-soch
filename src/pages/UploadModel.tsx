// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Navbar } from "@/components/Navbar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Plus, X, Upload, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
// import { categories as defaultCategories } from "@/data/models";
// import type { Category } from "@/types/model";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/contexts/AuthContext";
// import { modelsAPI, ModelUploadData } from "@/api/api-methods";
// import { LogoUpload } from "@/components/ui/LogoUpload";
// import { ScreenshotsUpload } from "@/components/ui/ScreenshotsUpload";
// import { Footer } from "@/components/Footer";

// export default function UploadModel() {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAuthenticated, currentUser } = useAuth();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  
//   // Check if we're in edit mode
//   const editMode = location.state?.editMode || false;
//   const modelData = location.state?.modelData || null;

//   useEffect(() => {
//     // Fetch categories from backend and populate categoriesList
//     const fetchCategories = async () => {
//       try {
//         const res = await modelsAPI.getCategories();
//         if (res?.data?.categories) {
//           setCategoriesList(res.data.categories);
//         }
//       } catch (err) {
//         console.error('Failed to fetch categories', err);
//         // fallback to defaultCategories (empty array) will keep UI safe
//       }
//     };
//     fetchCategories();

//     if (!isAuthenticated) {
//       toast({
//         title: "Authentication Required",
//         description: "Please log in to upload a model.",
//         variant: "destructive",
//       });
//       navigate('/login', { state: { from: { pathname: '/upload-model' } } });
//       return;
//     }

//     // Check if user is a pro user
//     if (isAuthenticated && currentUser && !currentUser.isProUser) {
//       toast({
//         title: "Pro Subscription Required",
//         description: "You need to be a Pro user to upload models. Please upgrade your subscription to continue.",
//         variant: "destructive",
//       });
//       navigate('/pricing');
//     }
//   }, [isAuthenticated, currentUser, navigate, toast]);

//   // Populate form data when in edit mode
//   useEffect(() => {
//     if (editMode && modelData) {
//       setFormData({
//         name: modelData.name || "",
//         shortDescription: modelData.shortDescription || "",
//         longDescription: modelData.longDescription || "",
//         category: modelData.category || "",
//         provider: modelData.provider || "",
//         pricing: modelData.pricing || "freemium",
//         modelType: modelData.modelType || "",
//         externalUrl: modelData.externalUrl || "",
//         isApiAvailable: modelData.isApiAvailable || false,
//         isOpenSource: modelData.isOpenSource || false,
//       });
      
//       setTags(modelData.tags || []);
//       setCapabilities(modelData.capabilities || []);
//       setBestFor(modelData.bestFor || []);
//       setFeatures(modelData.features || []);
//       setExamplePrompts(modelData.examplePrompts || []);
//       setLogoUrl(modelData.iconUrl || "");
//       setScreenshotUrls(modelData.screenshots || []);
//     }
//   }, [editMode, modelData]);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     shortDescription: "",
//     longDescription: "",
//     category: "",
//     provider: "",
//     pricing: "freemium" as "free" | "freemium" | "paid",
//     modelType: "",
//     externalUrl: "",
//     isApiAvailable: false,
//     isOpenSource: false,
//   });

//   // Image upload states
//   const [logoUrl, setLogoUrl] = useState<string>("");
//   const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);

//   const [tags, setTags] = useState<string[]>([]);
//   const [newTag, setNewTag] = useState("");
//   const [capabilities, setCapabilities] = useState<string[]>([]);
//   const [bestFor, setBestFor] = useState<string[]>([]);
//   const [newBestFor, setNewBestFor] = useState("");
//   const [features, setFeatures] = useState<string[]>([]);
//   const [newFeature, setNewFeature] = useState("");
//   const [examplePrompts, setExamplePrompts] = useState<string[]>([]);
//   const [newPrompt, setNewPrompt] = useState("");

//   const capabilityOptions = ["text", "image", "audio", "video", "code", "agent"];
//   const pricingOptions = [
//     { value: "free", label: "Free" },
//     { value: "freemium", label: "Freemium" },
//     { value: "paid", label: "Paid" }
//   ];

//   const handleInputChange = (field: string, value: string | boolean) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const addTag = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags(prev => [...prev, newTag.trim()]);
//       setNewTag("");
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     setTags(prev => prev.filter(tag => tag !== tagToRemove));
//   };

//   const toggleCapability = (capability: string) => {
//     setCapabilities(prev => 
//       prev.includes(capability)
//         ? prev.filter(c => c !== capability)
//         : [...prev, capability]
//     );
//   };

//   const addBestFor = () => {
//     if (newBestFor.trim() && !bestFor.includes(newBestFor.trim())) {
//       setBestFor(prev => [...prev, newBestFor.trim()]);
//       setNewBestFor("");
//     }
//   };

//   const removeBestFor = (item: string) => {
//     setBestFor(prev => prev.filter(b => b !== item));
//   };

//   const addFeature = () => {
//     if (newFeature.trim() && !features.includes(newFeature.trim())) {
//       setFeatures(prev => [...prev, newFeature.trim()]);
//       setNewFeature("");
//     }
//   };

//   const removeFeature = (feature: string) => {
//     setFeatures(prev => prev.filter(f => f !== feature));
//   };

//   const addPrompt = () => {
//     if (newPrompt.trim() && !examplePrompts.includes(newPrompt.trim())) {
//       setExamplePrompts(prev => [...prev, newPrompt.trim()]);
//       setNewPrompt("");
//     }
//   };

//   const removePrompt = (prompt: string) => {
//     setExamplePrompts(prev => prev.filter(p => p !== prompt));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Check for authentication
//     if (!isAuthenticated) {
//       toast({
//         title: "Authentication Required",
//         description: "Please log in to upload a model.",
//         variant: "destructive",
//       });
//       navigate('/login', { state: { from: { pathname: '/upload-model' } } });
//       return;
//     }

//     // Check for pro subscription
//     if (!currentUser?.isProUser) {
//       toast({
//         title: "Pro Subscription Required",
//         description: "You need to be a Pro user to upload models. Please upgrade your subscription to continue.",
//         variant: "destructive",
//       });
//       navigate('/pricing');
//       return;
//     }
    
//     // Basic validation - show specific, actionable messages
//     const requiredFields = [
//       { key: 'name', label: 'Model Name' },
//       { key: 'provider', label: 'Provider' },
//       { key: 'shortDescription', label: 'Short Description' },
//       { key: 'category', label: 'Category' },
//     ];

//     const missing = requiredFields.filter(f => {
//       const value = (formData as any)[f.key];
//       return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
//     });

//     if (missing.length > 0) {
//       const description = missing.length === 1
//         ? `${missing[0].label} is required.`
//         : `Please fill: ${missing.map(m => m.label).join(', ')}.`;

//       toast({
//         title: "Missing required fields",
//         description,
//         variant: "destructive",
//       });

//       return;
//     }

//     setIsLoading(true);

//     try {
//       const modelDataPayload: ModelUploadData = {
//         ...formData,
//         tags,
//         capabilities,
//         bestFor,
//         features,
//         examplePrompts,
//         iconUrl: logoUrl,
//         screenshots: screenshotUrls,
//       };

//       let response;
//       if (editMode && modelData) {
//         response = await modelsAPI.updateModel(modelData._id, modelDataPayload);
//       } else {
//         response = await modelsAPI.uploadModel(modelDataPayload);
//       }
      
//       toast({
//         title: "Success!",
//         description: response.message || (editMode ? "Your AI model has been updated successfully." : "Your AI model has been submitted for review."),
//       });

//       if (!editMode) {
//         // Reset form only if not in edit mode
//         setFormData({
//           name: "",
//           shortDescription: "",
//           longDescription: "",
//           category: "",
//           provider: "",
//           pricing: "freemium",
//           modelType: "",
//           externalUrl: "",
//           isApiAvailable: false,
//           isOpenSource: false,
//         });
//         setTags([]);
//         setCapabilities([]);
//         setBestFor([]);
//         setFeatures([]);
//         setExamplePrompts([]);
//         setLogoUrl("");
//         setScreenshotUrls([]);
//       }

//       // Redirect to profile to see the uploaded/updated model
//       setTimeout(() => {
//         navigate('/profile');
//       }, 2000);

//     } catch (error: any) {
//       console.error(editMode ? 'Update error:' : 'Upload error:', error);

//       // Prefer server-provided validation errors when available
//       let message = error?.message || (editMode ? "Failed to update model. Please try again." : "Failed to upload model. Please try again.");
//       const details = (error as any)?.details;
//       if (details) {
//         if (details.errors) {
//           message = Array.isArray(details.errors) ? details.errors.join(', ') : String(details.errors);
//         } else if (details.message) {
//           message = details.message;
//         }
//       }

//       toast({
//         title: "Error",
//         description: message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
//       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
//       <div className="container mx-auto px-4 py-8 mt-16">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
//                 <Upload className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-3xl font-bold">
//                 {editMode ? "Edit Your AI Model" : "Upload Your AI Model"}
//               </h1>
//             </div>
//             <p className="text-muted-foreground max-w-2xl mx-auto">
//               {editMode 
//                 ? "Update your AI model details below. Changes will reset the model status to pending for review."
//                 : "Share your AI model with the community. Fill out the form below with detailed information about your model to help users discover and understand its capabilities."
//               }
//             </p>
//             {currentUser && (
//               <div className="mt-4 p-3 bg-muted/30 rounded-lg inline-flex items-center gap-2 text-sm">
//                 <span className="text-muted-foreground">Uploading as:</span>
//                 <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
//               </div>
//             )}
//             {editMode && modelData && (
//               <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-start gap-2 text-sm">
//                   <div className="text-blue-600">ℹ️</div>
//                   <div>
//                     <p className="font-medium text-blue-900">Editing Model: {modelData.name}</p>
//                     <p className="text-blue-700 mt-1">
//                       Note: You can edit any of your uploaded models. Changes to approved models will reset the status to "pending" for re-review.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="w-5 h-5" />
//                   Basic Information
//                 </CardTitle>
//                 <CardDescription>
//                   Provide the essential details about your AI model.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Model Name *</Label>
//                     <Input
//                       id="name"
//                       placeholder="e.g., GPT-4 Turbo"
//                       value={formData.name}
//                       onChange={(e) => handleInputChange("name", e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="provider">Provider *</Label>
//                     <Input
//                       id="provider"
//                       placeholder="e.g., OpenAI"
//                       value={formData.provider}
//                       onChange={(e) => handleInputChange("provider", e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="shortDescription">Short Description *</Label>
//                   <Input
//                     id="shortDescription"
//                     placeholder="Brief one-line description of your model"
//                     value={formData.shortDescription}
//                     onChange={(e) => handleInputChange("shortDescription", e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="longDescription">Long Description</Label>
//                   <Textarea
//                     id="longDescription"
//                     placeholder="Detailed description of your model's capabilities, use cases, and benefits"
//                     value={formData.longDescription}
//                     onChange={(e) => handleInputChange("longDescription", e.target.value)}
//                     rows={4}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="category">Category *</Label>
//                     <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {categoriesList.map((category) => (
//                           <SelectItem key={category.id} value={category.slug}>
//                             {category.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="pricing">Pricing Model</Label>
//                     <Select value={formData.pricing} onValueChange={(value: any) => handleInputChange("pricing", value)}>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {pricingOptions.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="modelType">Model Type</Label>
//                     <Input
//                       id="modelType"
//                       placeholder="e.g., LLM, Diffusion Model"
//                       value={formData.modelType}
//                       onChange={(e) => handleInputChange("modelType", e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="externalUrl">External URL</Label>
//                   <Input
//                     id="externalUrl"
//                     type="url"
//                     placeholder="https://your-model-website.com"
//                     value={formData.externalUrl}
//                     onChange={(e) => handleInputChange("externalUrl", e.target.value)}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ImageIcon className="w-5 h-5" />
//                   Model Assets
//                 </CardTitle>
//                 <CardDescription>
//                   Upload visual assets to showcase your model.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   <LogoUpload
//                     onUploadComplete={setLogoUrl}
//                     onRemove={() => setLogoUrl("")}
//                     initialUrl={logoUrl}
//                     disabled={isLoading}
//                   />
//                   <ScreenshotsUpload
//                     onUploadComplete={setScreenshotUrls}
//                     initialUrls={screenshotUrls}
//                     disabled={isLoading}
//                     maxImages={4}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Tags & Categories</CardTitle>
//                 <CardDescription>
//                   Add relevant tags to help users discover your model.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                   <Label>Tags</Label>
//                   <div className="flex gap-2 mb-2">
//                     <Input
//                       placeholder="Add a tag"
//                       value={newTag}
//                       onChange={(e) => setNewTag(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
//                     />
//                     <Button type="button" onClick={addTag} size="sm">
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {tags.map((tag) => (
//                       <Badge key={tag} variant="secondary" className="flex items-center gap-1">
//                         {tag}
//                         <X
//                           className="w-3 h-3 cursor-pointer"
//                           onClick={() => removeTag(tag)}
//                         />
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Capabilities</Label>
//                   <div className="flex flex-wrap gap-3">
//                     {capabilityOptions.map((capability) => (
//                       <div key={capability} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={capability}
//                           checked={capabilities.includes(capability)}
//                           onCheckedChange={() => toggleCapability(capability)}
//                         />
//                         <Label htmlFor={capability} className="capitalize">
//                           {capability}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Additional Details</CardTitle>
//                 <CardDescription>
//                   Provide more context about your model's use cases and features.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                   <Label>Best For</Label>
//                   <div className="flex gap-2 mb-2">
//                     <Input
//                       placeholder="e.g., Developers, Content Creators"
//                       value={newBestFor}
//                       onChange={(e) => setNewBestFor(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBestFor())}
//                     />
//                     <Button type="button" onClick={addBestFor} size="sm">
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {bestFor.map((item) => (
//                       <Badge key={item} variant="outline" className="flex items-center gap-1">
//                         {item}
//                         <X
//                           className="w-3 h-3 cursor-pointer"
//                           onClick={() => removeBestFor(item)}
//                         />
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Key Features</Label>
//                   <div className="flex gap-2 mb-2">
//                     <Input
//                       placeholder="e.g., Real-time processing, 100+ languages"
//                       value={newFeature}
//                       onChange={(e) => setNewFeature(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
//                     />
//                     <Button type="button" onClick={addFeature} size="sm">
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {features.map((feature) => (
//                       <Badge key={feature} variant="outline" className="flex items-center gap-1">
//                         {feature}
//                         <X
//                           className="w-3 h-3 cursor-pointer"
//                           onClick={() => removeFeature(feature)}
//                         />
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Example Prompts</Label>
//                   <div className="flex gap-2 mb-2">
//                     <Input
//                       placeholder="e.g., Write a Python function to sort an array"
//                       value={newPrompt}
//                       onChange={(e) => setNewPrompt(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrompt())}
//                     />
//                     <Button type="button" onClick={addPrompt} size="sm">
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <div className="space-y-2">
//                     {examplePrompts.map((prompt, index) => (
//                       <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
//                         <span className="flex-1 text-sm">{prompt}</span>
//                         <X
//                           className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
//                           onClick={() => removePrompt(prompt)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Model Properties</CardTitle>
//                 <CardDescription>
//                   Specify technical details about your model.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="flex flex-col sm:flex-row gap-6">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="isApiAvailable"
//                       checked={formData.isApiAvailable}
//                       onCheckedChange={(checked) => handleInputChange("isApiAvailable", checked as boolean)}
//                     />
//                     <Label htmlFor="isApiAvailable">API Available</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="isOpenSource"
//                       checked={formData.isOpenSource}
//                       onCheckedChange={(checked) => handleInputChange("isOpenSource", checked as boolean)}
//                     />
//                     <Label htmlFor="isOpenSource">Open Source</Label>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="flex gap-4 justify-end">
//               <Button type="button" variant="outline" disabled={isLoading}>
//                 Save as Draft
//               </Button>
//               <Button 
//                 type="submit" 
//                 className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     {editMode ? "Saving Changes..." : "Uploading..."}
//                   </>
//                 ) : (
//                   editMode ? "Save Changes" : "Submit for Review"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }



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
import { Plus, X, Upload, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { categories as defaultCategories } from "@/data/models";
import type { Category } from "@/types/model";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { modelsAPI, ModelUploadData } from "@/api/api-methods";
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
    // Fetch categories from backend and populate categoriesList
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

  // Populate form data when in edit mode
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
    }
  }, [editMode, modelData]);
  
  // Form state
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

  // Image upload states
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

  const addBestFor = () => {
    if (newBestFor.trim() && !bestFor.includes(newBestFor.trim())) {
      setBestFor(prev => [...prev, newBestFor.trim()]);
      setNewBestFor("");
    }
  };

  const removeBestFor = (item: string) => {
    setBestFor(prev => prev.filter(b => b !== item));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(prev => prev.filter(f => f !== feature));
  };

  const addPrompt = () => {
    if (newPrompt.trim() && !examplePrompts.includes(newPrompt.trim())) {
      setExamplePrompts(prev => [...prev, newPrompt.trim()]);
      setNewPrompt("");
    }
  };

  const removePrompt = (prompt: string) => {
    setExamplePrompts(prev => prev.filter(p => p !== prompt));
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
      toast({ title: "Error", description: error?.message || "Failed to save model.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* ✅ Responsive Padding & Margin */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 mt-16 sm:mt-24 mb-12">
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
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
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
                {/* Responsive Grid: 1 col mobile, 2 cols tablet+ */}
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

                {/* Responsive Grid for Selects: 1 col mobile, 3 cols tablet+ */}
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

            {/* 2. Visuals Card */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Visual Assets
                </CardTitle>
                <CardDescription>Logo and screenshots (Max 4).</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Stacks vertically on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <LogoUpload onUploadComplete={setLogoUrl} onRemove={() => setLogoUrl("")} initialUrl={logoUrl} disabled={isLoading} />
                  <ScreenshotsUpload onUploadComplete={setScreenshotUrls} initialUrls={screenshotUrls} disabled={isLoading} maxImages={4} />
                </div>
              </CardContent>
            </Card>

            {/* 3. Tags & Technical Card */}
            <Card className="border-muted/60 shadow-sm">
              <CardHeader>
                <CardTitle>Tags & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Tags Input */}
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

                {/* Capabilities Checkboxes */}
                <div className="space-y-3">
                  <Label>Capabilities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {capabilityOptions.map((cap) => (
                      <div key={cap} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50 transition-colors">
                        <Checkbox id={cap} checked={capabilities.includes(cap)} onCheckedChange={() => toggleCapability(cap)} />
                        <Label htmlFor={cap} className="capitalize cursor-pointer flex-1">{cap}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Boolean Toggles (API / Open Source) */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2">
                  <div className="flex items-center space-x-2 border p-3 rounded-lg w-full sm:w-auto">
                    <Checkbox id="isApiAvailable" checked={formData.isApiAvailable} onCheckedChange={(c) => handleInputChange("isApiAvailable", c as boolean)} />
                    <Label htmlFor="isApiAvailable" className="cursor-pointer">API Available</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg w-full sm:w-auto">
                    <Checkbox id="isOpenSource" checked={formData.isOpenSource} onCheckedChange={(c) => handleInputChange("isOpenSource", c as boolean)} />
                    <Label htmlFor="isOpenSource" className="cursor-pointer">Open Source</Label>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
              <Button type="button" variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                Save Draft
              </Button>
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