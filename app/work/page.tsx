"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useState } from "react";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { ExternalLink, Github, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const projects = [
  {
    num: "01",
    category: "Full-Stack Project",
    title: "Womens Club",
    description: "The Women's Club web application streamlines member, event, and donation management. The platform enables efficient communication, transparent activity tracking, and resource management. Key features include member registration, event coordination, and donation tracking. Built with React, Chakra UI, Figma, and Firebase, and deployed on Vercel, it ensures a clean interface, secure data, and reliable performance.",
    stack: [{ name: "HTML" }, { name: "CSS" }, { name: "JavaScript" }],
    image: "/assets/work/thumb1.png",
    live: "https://womensclub.vercel.app/",
    github: "https://github.com/Dokkai-B/womens-club",
  },
  {
    num: "02",
    category: "Full-Stack Project",
    title: "SaveEat",
    description: "SaveEat is a mobile app that combines nutrition tracking with budget management, helping users make healthy dietary choices within financial limits. It features personalized meal plans, real-time spending and nutrition insights, and a user-friendly interface for logging meals and expenses. Developed with React Native, Android Studio, Firebase, and JavaScript, SaveEat scored 69.25 on the System Usability Scale (SUS), reflecting good usability with room for improvement",
    stack: [{ name: "Firebase" }, { name: "JavaScript" }, { name: "React Native" }],
    image: "/assets/work/thumb2.png",
    live: "/assets/research/SaveEat.pdf",
    github: "https://github.com/Dokkai-B/saveeat",
  },
  {
    num: "03",
    category: "Full-Stack Project",
    title: "Heart to Art",
    description: "Heart to Art is a mobile app that connects artists with clients, offering a platform to showcase art and manage commissions. It features an artist directory, commission requests, and a messaging system. Built with React Native and Firebase, the app provides a user-friendly experience, secure data, and real-time updates, enhancing visibility and opportunities for artists.",
    stack: [{ name: "React Native" }, { name: "Expo" }, { name: "Firebase" }],
    image: "/assets/work/thumb3.png",
    live: "/assets/research/HearttoArt.pdf",
    github: "https://github.com/vladasblood/SE_HeartToArt",
  },
  {
    num: "04",
    category: "Full-Stack Project",
    title: "Lost Paws",
    description: "LostPaws is a web platform that helps reunite lost pets with their owners and facilitates adoptions. Owners can post missing pet details, while finders report strays to partnered facilities. Unclaimed pets are listed for adoption, relying on community efforts and partnerships to care for the animals until they are reunited or adopted.",
    stack: [{ name: "PHP" }, { name: "MySQL" }],
    image: "/assets/work/thumb4.png",
    live: "/assets/research/LostPaws.pdf",
    github: "https://github.com/vladasblood/LostPaws",
  },
]

const Work = () => {
  const [filter, setFilter] = useState("all");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const categories = ["all", "Full-Stack Project"];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm mb-4">
            <Filter className="h-4 w-4" />
            <span>My Portfolio</span>
          </div>
          <h1 className="h1 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore my latest work in web development, mobile apps, and full-stack solutions
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-12 flex-wrap"
        >
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setFilter(category)}
              variant={filter === category ? "default" : "outline"}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.num}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="glass-strong rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500">
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Floating Number */}
                  <div className="absolute top-6 right-6">
                    <div className="text-6xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors">
                      {project.num}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent border border-accent/20">
                    {project.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.stack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-primary/5 text-primary border border-primary/10"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full group/btn">
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                        View Project
                      </Button>
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon" className="group/btn">
                        <Github className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Work;