import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, Users, FileText, HelpCircle, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitToolClick = () => {
    navigate('/submit-tool');
  };

  const footerSections = [
    {
      title: "About",
      icon: <Users className="w-4 h-4" />,
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Mission", href: "/about#mission" },
        { label: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      icon: <Shield className="w-4 h-4" />,
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "User Data Safety", href: "/data-safety" }
      ]
    },
    {
      title: "Platform",
      icon: <FileText className="w-4 h-4" />,
      links: [
        { label: "Discover AI Tools", href: "/" },
        { label: "Categories", href: "/categories" },
        { label: "Subscription Plans", href: "/subscription-plans" }
      ]
    },
    {
      title: "Support",
      icon: <HelpCircle className="w-4 h-4" />,
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Submit Your Tool", href: "/submit-tool", isSpecial: true },
        { label: "Community", href: "/community" }
      ]
    }
  ];

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/sochai-2025.firebasestorage.app/o/website-assets%2Fsochailogo.jpg?alt=media&token=3fda20fa-6dcd-41cc-b898-7b0e3f3c1ca7"
                alt="Soch AI Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">Soch AI</span>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                  Store
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              India's most reliable AI directory. We help creators, students, developers, and businesses 
              discover the right AI tools without confusion.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a 
                href="mailto:sochaicontact@gmail.com" 
                className="hover:text-primary transition-colors"
              >
                sochaicontact@gmail.com
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-primary">{section.icon}</div>
                <h3 className="font-semibold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.isSpecial ? (
                      <button 
                        onClick={handleSubmitToolClick}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link 
                        to={link.href} 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Soch AI Store. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground flex items-center gap-2">
                  <span>Made with</span>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/sochai-2025.firebasestorage.app/o/website-assets%2Fsochailogo.jpg?alt=media&token=3fda20fa-6dcd-41cc-b898-7b0e3f3c1ca7"
                    alt="Soch AI Logo"
                    className="w-4 h-4 inline-block rounded-sm"
                  />
                  <span>in India</span>
                </span>
                <span className="text-muted-foreground">•</span>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <span className="sr-only">Follow our socials</span>
                <a href="https://www.instagram.com/sochaistore?igsh=bjdqeWxia2J2aGoz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/share/16bFxc2ZTw" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://x.com/SochAistore/status/1952185899355410484" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/soch-ai-805759378" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground max-w-4xl mx-auto">
              <strong>Disclaimer:</strong> Soch AI Store is an independent directory platform. We do not own, control, 
              or manage the AI tools listed in our directory. Each tool belongs to its respective provider. 
              We provide a curated discovery platform to help users find and compare AI tools safely and efficiently.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};