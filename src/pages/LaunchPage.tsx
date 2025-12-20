
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../lib/api'; // Import your new helper
// import { Rocket, Type, FileText, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

// export const LaunchPage = () => {
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     tagline: '', // Maps to shortDescription backend field
//     url: '',     // Maps to externalUrl backend field
//     description: '', // Maps to longDescription
//     category: 'productivity',
//     pricing: 'freemium',
//     provider: 'Indie' // Default provider
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       let iconUrl = '';

//       // 1. Upload Image (if selected)
//       if (selectedFile) {
//         const imageFormData = new FormData();
//         imageFormData.append('image', selectedFile);
        
//         const uploadRes = await api.post('/upload/image', imageFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         iconUrl = uploadRes.data.url;
//       }

//       // 2. Submit Model Data
//       await api.post('/models', {
//         name: formData.name,
//         shortDescription: formData.tagline,
//         longDescription: formData.description,
//         category: formData.category,
//         externalUrl: formData.url,
//         pricing: formData.pricing,
//         provider: formData.provider,
//         iconUrl: iconUrl, // The URL we got from step 1
//         tags: [formData.category], 
//         capabilities: ['text'] // Default capability
//       });

//       alert('Tool submitted successfully!');
//       navigate('/'); 

//     } catch (error: any) {
//       console.error('Launch failed:', error);
//       alert(error.response?.data?.message || 'Something went wrong');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

// // import React, { useState } from 'react';
// // import { motion } from 'framer-motion';
// // import { Rocket, Link as LinkIcon, Type, FileText, CheckCircle } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';

// // export const LaunchPage = () => {
// //   const navigate = useNavigate();
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     tagline: '',
// //     url: '',
// //     description: '',
// //     category: 'Productivity'
// //   });

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
    
// //     // Simulate API call
// //     setTimeout(() => {
// //       console.log('Launched:', formData);
// //       setIsSubmitting(false);
// //       navigate('/'); // Redirect to home after success
// //     }, 1500);
// //   };

//   return (
//     <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
        
//         {/* Header Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-purple-500/10 rounded-full border border-purple-500/20">
//               <Rocket className="w-8 h-8 text-purple-400" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
//             Launch Your AI Tool
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Share your innovation with thousands of AI enthusiasts.
//           </p>
//         </motion.div>

//         {/* Form Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl"
//         >
//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* Product Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Type className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="block w-full pl-10 bg-gray-950 border border-gray-800 rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   placeholder="e.g. ChronoGuard AI"
//                 />
//               </div>
//             </div>

//             {/* Tagline */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">One-Liner Tagline</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FileText className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   name="tagline"
//                   required
//                   value={formData.tagline}
//                   onChange={handleChange}
//                   className="block w-full pl-10 bg-gray-950 border border-gray-800 rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   placeholder="e.g. Predict GNSS errors with Deep Learning"
//                 />
//               </div>
//             </div>

//             {/* URL */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <LinkIcon className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type="url"
//                   name="url"
//                   required
//                   value={formData.url}
//                   onChange={handleChange}
//                   className="block w-full pl-10 bg-gray-950 border border-gray-800 rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   placeholder="https://..."
//                 />
//               </div>
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="block w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//               >
//                 <option value="Productivity">Productivity</option>
//                 <option value="Development">Development</option>
//                 <option value="Design">Design</option>
//                 <option value="Marketing">Marketing</option>
//                 <option value="Finance">Finance</option>
//               </select>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
//               <textarea
//                 name="description"
//                 rows={4}
//                 required
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="block w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
//                 placeholder="Tell us about the features..."
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-md font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform active:scale-[0.98] ${
//                 isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {isSubmitting ? (
//                 <>Launching...</>
//               ) : (
//                 <>
//                   <Rocket className="w-5 h-5 mr-2" />
//                   Launch Product
//                 </>
//               )}
//             </button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// };


//   // ... rest of your JSX (render logic) ...
//   // Make sure to add the File Input field in your form:
//   /*
//     <div>
//       <label className="block text-sm font-medium text-gray-300 mb-2">Logo / Icon</label>
//       <div className="relative">
//          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//            <ImageIcon className="h-5 w-5 text-gray-500" />
//          </div>
//          <input 
//            type="file" 
//            accept="image/*"
//            onChange={handleFileChange}
//            className="block w-full pl-10 bg-gray-950 border border-gray-800 rounded-lg py-3 text-white" 
//          />
//       </div>
//     </div>
//   */




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // <--- THIS WAS MISSING
import { Rocket, Link as LinkIcon, Type, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../lib/api';

export const LaunchPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '', 
    url: '',     
    description: '', 
    category: 'productivity',
    pricing: 'freemium',
    provider: 'Indie' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let iconUrl = '';

      // 1. Upload Image (if selected)
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);
        
        const uploadRes = await api.post('/upload/image', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        iconUrl = uploadRes.data.url;
      }

      // 2. Submit Model Data
      await api.post('/models', {
        name: formData.name,
        shortDescription: formData.tagline,
        longDescription: formData.description,
        category: formData.category.toLowerCase(),
        externalUrl: formData.url,
        pricing: formData.pricing,
        provider: formData.provider,
        iconUrl: iconUrl,
        tags: [formData.category], 
        capabilities: ['text']
      });

      alert('Tool submitted successfully! It is now pending review.');
      navigate('/'); 

    } catch (error: any) {
      console.error('Launch failed:', error);
      alert(error.response?.data?.message || 'Something went wrong during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Rocket className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Launch Your AI Tool
          </h1>
          <p className="text-gray-400 text-lg">
            Share your innovation with thousands of AI enthusiasts.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo / Icon</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full pl-10 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer bg-gray-950 border border-gray-800 rounded-lg py-2" 
                />
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-950 border border-gray-800 rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g. ChronoGuard AI"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">One-Liner Tagline</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-950 border border-gray-800 rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g. Predict GNSS errors with Deep Learning"
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="url"
                  name="url"
                  required
                  value={formData.url}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-950 border border-gray-800 rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Category & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="productivity">Productivity</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="chatbots">Chatbots</option>
                  <option value="image">Image Generation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pricing Model</label>
                <select
                  name="pricing"
                  value={formData.pricing}
                  onChange={handleChange}
                  className="block w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="block w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about the features..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-md font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform active:scale-[0.98] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch Product
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};