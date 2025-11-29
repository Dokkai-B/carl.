"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowUp } from "lucide-react";
import Social from "./Social";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: "Home", href: "/" },
      { name: "Services", href: "/services" },
      { name: "Resume", href: "/resume" },
      { name: "Work", href: "/work" },
      { name: "Contact", href: "/contact" },
    ],
  };

  return (
    <footer className="relative mt-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Link href="/">
              <h2 className="text-3xl font-bold">
                <span className="gradient-text">Carl</span>
                <span className="text-accent">.</span>
              </h2>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Aspiring Full-Stack Developer passionate about creating exceptional
              digital experiences.
            </p>
            <Social
              containerStyles="flex gap-3"
              iconStyles="w-10 h-10 border border-border rounded-full flex justify-center items-center text-foreground hover:text-primary hover:border-primary transition-all duration-300 hover:scale-110"
            />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[2px] bg-primary group-hover:w-4 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a
                  href="mailto:cpacaguas@mymail.mapua.edu.ph"
                  className="hover:text-primary transition-colors"
                >
                  cpacaguas@mymail.mapua.edu.ph
                </a>
              </li>
              <li>
                <a
                  href="tel:+639208023514"
                  className="hover:text-primary transition-colors"
                >
                  (+63) 920 802 3514
                </a>
              </li>
              <li className="text-sm">
                Sumatra, Filinvest East
                <br />
                Cainta, Rizal, Philippines
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Carl Patrick Adrian Aguas. Built with{" "}
            <Heart className="inline w-4 h-4 text-accent fill-accent animate-pulse" />{" "}
            using Next.js & Tailwind CSS
          </p>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            className="glass p-3 rounded-full border border-border/50 hover:border-primary/50 transition-all duration-300 group"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5 group-hover:text-primary transition-colors" />
          </motion.button>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
};

export default Footer;
