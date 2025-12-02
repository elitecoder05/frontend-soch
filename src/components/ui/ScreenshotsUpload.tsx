import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { ImageUploadService, UploadProgress } from '@/lib/imageUpload';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ScreenshotsUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  initialUrls?: string[];
  disabled?: boolean;
  className?: string;
  maxImages?: number;
}

interface UploadingFile {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export const ScreenshotsUpload: React.FC<ScreenshotsUploadProps> = ({
  onUploadComplete,
  initialUrls = [],
  disabled = false,
  className,
  maxImages = 4
}) => {
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>(initialUrls);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = async (files: File[]) => {
    if (disabled) return;

    const remainingSlots = maxImages - screenshotUrls.length - uploadingFiles.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast({
        title: "Too many files",
        description: `You can only upload ${remainingSlots} more screenshot${remainingSlots !== 1 ? 's' : ''}.`,
        variant: "destructive",
      });
    }

    // Validate all files first
    const validFiles: File[] = [];
    for (const file of filesToUpload) {
      const validation = ImageUploadService.validateImageFile(file, 5); // 5MB max for screenshots
      if (!validation.isValid) {
        toast({
          title: `Invalid file: ${file.name}`,
          description: validation.error,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Initialize uploading state
    const initialUploadingFiles = validFiles.map(file => ({
      file,
      progress: 0,
    }));

    setUploadingFiles(prev => [...prev, ...initialUploadingFiles]);

    // Upload files
    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        // Resize image for screenshots
        const resizedFile = await ImageUploadService.resizeImage(file, 1200, 800, 0.8);

        return ImageUploadService.uploadImage(
          resizedFile,
          'model-screenshots',
          undefined,
          (progress: UploadProgress) => {
            setUploadingFiles(prev => {
              const newState = [...prev];
              const fileIndex = newState.findIndex(uf => uf.file === file);
              if (fileIndex !== -1) {
                newState[fileIndex] = {
                  ...newState[fileIndex],
                  progress: progress.progress,
                  error: progress.error,
                  url: progress.url,
                };
              }
              return newState;
            });
          }
        );
      });

      const urls = await Promise.all(uploadPromises);
      const newScreenshotUrls = [...screenshotUrls, ...urls];
      
      setScreenshotUrls(newScreenshotUrls);
      setUploadingFiles(prev => prev.filter(uf => !validFiles.includes(uf.file)));
      onUploadComplete?.(newScreenshotUrls);

      toast({
        title: "Screenshots uploaded",
        description: `${urls.length} screenshot${urls.length !== 1 ? 's' : ''} uploaded successfully.`,
      });
    } catch (error: any) {
      console.error('Screenshots upload error:', error);
      setUploadingFiles(prev => prev.filter(uf => !validFiles.includes(uf.file)));
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload screenshots. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveScreenshot = async (index: number) => {
    if (disabled) return;
    
    try {
      const urlToDelete = screenshotUrls[index];
      if (urlToDelete) {
        await ImageUploadService.deleteImage(urlToDelete);
      }
      
      const newUrls = screenshotUrls.filter((_, i) => i !== index);
      setScreenshotUrls(newUrls);
      onUploadComplete?.(newUrls);
      
      toast({
        title: "Screenshot removed",
        description: "Screenshot has been removed.",
      });
    } catch (error: any) {
      console.error('Error removing screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to remove screenshot. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(Array.from(files));
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canAddMore = screenshotUrls.length + uploadingFiles.length < maxImages && !disabled;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Model Screenshots</Label>
        <span className="text-sm text-muted-foreground">
          {screenshotUrls.length + uploadingFiles.length}/{maxImages}
        </span>
      </div>

      {/* Existing Screenshots Grid */}
      {screenshotUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {screenshotUrls.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <CardContent className="p-2">
                <div className="aspect-video rounded overflow-hidden bg-muted">
                  <img
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveScreenshot(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Uploading Files Progress */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-video rounded overflow-hidden bg-muted flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate">{uploadingFile.file.name}</span>
                    <span>{Math.round(uploadingFile.progress)}%</span>
                  </div>
                  <Progress value={uploadingFile.progress} className="h-1" />
                  {uploadingFile.error && (
                    <p className="text-xs text-destructive">{uploadingFile.error}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <Card className={cn(
          "transition-colors cursor-pointer",
          dragActive && "border-primary/50 bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <CardContent
            className="p-6"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className={cn(
              "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors",
              dragActive && "border-primary/50 bg-primary/5",
              disabled && "cursor-not-allowed hover:border-muted-foreground/25 hover:bg-transparent"
            )}>
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Drop screenshots here, or{' '}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WebP up to 5MB each • Up to {maxImages} images
                  </p>
                </div>
                {screenshotUrls.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Screenshots
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!canAddMore && screenshotUrls.length === 0 && uploadingFiles.length === 0 && (
        <Card className="opacity-50">
          <CardContent className="p-6 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Maximum number of screenshots reached
            </p>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || !canAddMore}
      />

      <p className="text-xs text-muted-foreground">
        Add screenshots to showcase your model's interface and capabilities. 
        These help users understand how your model works.
      </p>
    </div>
  );
};