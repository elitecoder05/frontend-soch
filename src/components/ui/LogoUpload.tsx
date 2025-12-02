import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageUploadService, UploadProgress } from '@/lib/imageUpload';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  onUploadComplete?: (url: string) => void;
  onRemove?: () => void;
  initialUrl?: string;
  disabled?: boolean;
  className?: string;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  onUploadComplete,
  onRemove,
  initialUrl,
  disabled = false,
  className
}) => {
  const [logoUrl, setLogoUrl] = useState<string>(initialUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    // Validate file
    const validation = ImageUploadService.validateImageFile(file, 2); // 2MB max for logos
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Resize image for logo (smaller size)
      const resizedFile = await ImageUploadService.resizeImage(file, 400, 400, 0.9);

      // Upload to Firebase
      const url = await ImageUploadService.uploadImage(
        resizedFile,
        'model-logos',
        undefined,
        (progress: UploadProgress) => {
          setUploadProgress(progress.progress);
          if (progress.error) {
            toast({
              title: "Upload failed",
              description: progress.error,
              variant: "destructive",
            });
          }
        }
      );

      setLogoUrl(url);
      onUploadComplete?.(url);
      
      toast({
        title: "Logo uploaded successfully",
        description: "Your model logo has been uploaded.",
      });
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveLogo = async () => {
    if (disabled) return;
    
    try {
      if (logoUrl) {
        await ImageUploadService.deleteImage(logoUrl);
      }
      setLogoUrl('');
      onRemove?.();
      
      toast({
        title: "Logo removed",
        description: "Your model logo has been removed.",
      });
    } catch (error: any) {
      console.error('Error removing logo:', error);
      toast({
        title: "Error",
        description: "Failed to remove logo. Please try again.",
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
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Model Logo</Label>
      <Card className={cn(
        "relative overflow-hidden transition-colors",
        dragActive && "border-primary/50 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        <CardContent className="p-4">
          {logoUrl && !isUploading ? (
            // Show uploaded logo
            <div className="relative group">
              <div className="aspect-square w-32 mx-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={logoUrl}
                  alt="Model logo"
                  className="w-full h-full object-cover"
                />
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <p className="text-sm text-center text-muted-foreground mt-2">
                Click to replace logo
              </p>
              {!disabled && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={openFileDialog}
                >
                  Change Logo
                </Button>
              )}
            </div>
          ) : (
            // Show upload area
            <div
              className={cn(
                "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors",
                dragActive && "border-primary/50 bg-primary/5",
                disabled && "cursor-not-allowed hover:border-muted-foreground/25 hover:bg-transparent"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              {isUploading ? (
                <div className="space-y-3">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploading logo...</p>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(uploadProgress)}% complete
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Drop your logo here, or{' '}
                      <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP up to 2MB • 400x400px recommended
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </CardContent>
      </Card>
    </div>
  );
};