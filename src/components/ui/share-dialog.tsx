import * as React from "react";
import { Share2, Copy, Twitter, Facebook, Mail, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  url: string;
  title?: string;
  children: React.ReactElement;
}

export const ShareDialog = ({ url, title = "Check this model", children }: ShareDialogProps) => {
  const [copied, setCopied] = React.useState(false);

  const text = title ? `${title} - ${url}` : url;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      try {
        void navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>Share this model with others using the options below.</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Input value={url} readOnly className="mb-3" />

          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied" : "Copy link"}
            </Button>

            <Button asChild size="sm">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </a>
            </Button>

            <Button asChild size="sm">
              <a href={twitterHref} target="_blank" rel="noreferrer">
                <Twitter className="w-4 h-4 mr-2" /> Twitter
              </a>
            </Button>

            <Button asChild size="sm">
              <a href={facebookHref} target="_blank" rel="noreferrer">
                <Facebook className="w-4 h-4 mr-2" /> Facebook
              </a>
            </Button>

            <Button asChild size="sm">
              <a href={mailHref} rel="noreferrer">
                <Mail className="w-4 h-4 mr-2" /> Email
              </a>
            </Button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
