"use client";

import { useState, useRef } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";

const info = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "(+63) 920 802 3514",
    href: "tel:+639208023514",
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "cpacaguas@mymail.mapua.edu.ph",
    href: "mailto:cpacaguas@mymail.mapua.edu.ph",
  },
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [selectedService, setSelectedService] = useState("");
  
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.2 });

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("service", selectedService);

    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message });
        form.reset();
        setSelectedService("");
      } else {
        setSubmitStatus({ type: "error", message: result.message });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 xl:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <form 
              className="glass-strong p-8 md:p-10 rounded-3xl border border-border/50 space-y-6" 
              onSubmit={handleSubmit}
            >
              <div className="space-y-2 mb-2">
                <h3 className="text-2xl font-bold">Send me a message</h3>
                <p className="text-muted-foreground">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </div>

              {/* Input fields with animated focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <Input
                    name="firstName"
                    placeholder="First name"
                    required
                    className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                  />
                </div>
                <div className="group">
                  <Input
                    name="lastName"
                    placeholder="Last name"
                    required
                    className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                  />
                </div>
                <div className="group">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                  />
                </div>
                <div className="group">
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    className="transition-all duration-300 focus:border-accent/50 focus:shadow-lg focus:shadow-accent/10"
                  />
                </div>
              </div>

              {/* Select with gradient border on focus */}
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-full transition-all duration-300 hover:border-primary/50">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="glass-strong border-primary/20">
                  <SelectGroup>
                    <SelectLabel>Select a service</SelectLabel>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Logo Design">Logo Design</SelectItem>
                    <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Textarea with gradient border */}
              <Textarea
                name="message"
                required
                className="min-h-[200px] transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 resize-none"
                placeholder="Tell me about your project..."
              />

              {/* Status message */}
              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border ${
                    submitStatus.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-500"
                      : "bg-red-500/10 border-red-500/30 text-red-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {submitStatus.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                    <p>{submitStatus.message}</p>
                  </div>
                </motion.div>
              )}

              {/* Submit button with animation */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[200px] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      Send message
                    </>
                  )}
                </span>
              </Button>
            </form>
          </motion.div>

          {/* Contact Info & Additional Options */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              {info.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="block group"
                >
                  <div className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 glass-strong rounded-xl flex items-center justify-center text-primary text-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground font-medium mb-1">
                          {item.title}
                        </p>
                        <h3 className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors">
                          {item.description}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Additional Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="glass-strong p-8 rounded-2xl border border-border/50"
            >
              <h4 className="text-xl font-bold mb-4">Why Work With Me?</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Fast response time within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Clean, modern, and responsive designs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Collaborative approach to every project</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Commitment to quality and deadlines</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
