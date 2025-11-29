"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  index: number;
}

export function ProjectCard({
  title,
  category,
  description,
  image,
  stack,
  liveUrl,
  githubUrl,
  index,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </motion.div>
            
            {/* Category badge */}
            <div className="absolute top-4 right-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
              {category}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {stack.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
              {stack.length > 4 && (
                <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border">
                  +{stack.length - 4} more
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {liveUrl && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <ExternalLink className="h-4 w-4" />
                  <span>Live Demo</span>
                </div>
              )}
              {githubUrl && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Github className="h-4 w-4" />
                  <span>Source</span>
                </div>
              )}
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </motion.div>

      {/* Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-6 border border-border bg-card p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl max-h-[90vh] overflow-y-auto">
            <Dialog.Close className="absolute right-6 top-6 rounded-full p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            <div className="space-y-6">
              {/* Image */}
              <div className="relative h-96 overflow-hidden rounded-2xl">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  {category}
                </div>
              </div>

              {/* Title */}
              <div>
                <Dialog.Title className="text-4xl font-bold mb-2">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="text-lg text-muted-foreground">
                  {description}
                </Dialog.Description>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                {liveUrl && (
                  <Button asChild size="lg" className="flex-1">
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      View Live Project
                    </a>
                  </Button>
                )}
                {githubUrl && (
                  <Button asChild size="lg" variant="outline" className="flex-1">
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-5 w-5" />
                      View Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
