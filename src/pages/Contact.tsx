import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Clock, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject || "Contact from Soch AI Store");
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:sochaicontact@gmail.com?subject=${subject}&body=${body}`;
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-blue-500" />,
      title: "Email Support",
      description: "Send us an email for any questions or support requests",
      contact: "sochaicontact@gmail.com",
      action: "Send Email"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: "Response Time",
      description: "We typically respond within 24-48 hours",
      contact: "Fast & Reliable",
      action: null
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-500" />,
      title: "Support Topics",
      description: "Platform questions, tool submissions, technical issues",
      contact: "All inquiries welcome",
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Contact Us</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              For any questions, support requests, or privacy concerns, you may contact us anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {method.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {method.contact}
                        </p>
                        {method.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => window.location.href = 'mailto:sochaicontact@gmail.com'}
                          >
                            {method.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Your Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What is this about?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you..."
                        className="min-h-[120px]"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground mb-1">📧 Email Response</h3>
                  <p className="text-sm">We'll respond to your email within 24-48 hours during business days.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">🎯 Personalized Support</h3>
                  <p className="text-sm">Each inquiry receives individual attention from our team.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">🚀 Quick Solutions</h3>
                  <p className="text-sm">We provide clear, actionable solutions to your questions.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground mb-1">🔧 Platform Support</h3>
                  <p className="text-sm">Account issues, subscription questions, technical problems</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">📤 Tool Submissions</h3>
                  <p className="text-sm">Add your AI tool to our directory, submission guidelines</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">🤝 Partnerships</h3>
                  <p className="text-sm">Business partnerships, collaborations, media inquiries</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;