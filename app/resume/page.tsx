"use client";

import { FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs, FaFigma, FaJava, FaPython, FaPhp, FaWindows, FaAndroid, FaDatabase } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFirebase, SiMysql, SiCplusplus, SiCsharp, SiCanva, SiExpo } from 'react-icons/si';

// About data
const about = {
  title: "About Me",
  description: "I am Carl Patrick Adrian Aguas, an aspiring developer with a passion for creating innovative digital solutions. With over a year of experience, I have developed strong skills in both front-end and back-end development, complemented by my ability to communicate effectively in both English and Filipino. Currently available for freelance opportunities, I am eager to bring my creativity and technical expertise to new challenges.",
  info: [
    {
      fieldName: "Name",
      fieldValue: "Carl Patrick Adrian Aguas",
    },
    {
      fieldName: "Phone",
      fieldValue: "(+63) 920 802 3514)",
    },
    {
      fieldName: "Experience",
      fieldValue: "1+ Year",
    },
    {
      fieldName: "Nationality",
      fieldValue: "Filipino",
    },
    {
      fieldName: "Email",
      fieldValue: "cpacaguas@mymail.mapua.edu.ph",
    },
    {
      fieldName: "Freelance",
      fieldValue: "Available",
    },
    {
      fieldName: "Languages",
      fieldValue: "English, Filipino",
    },
  ]
};

// Experience data
const experience = {
  icon: "/assets/resume/badge.svg",
  title: "My Experience",
  description: "As an aspiring Full-Stack Developer and experienced Graphic Designer, I have developed a range of skills through various projects and freelance roles. My background includes creating engaging visuals, designing user interfaces, and contributing to web and mobile development projects. I am passionate about combining creativity with technical skills to build impactful digital solutions.",
  items: [
    {
      company: "Women's Club",
      position: "Full-Stack Developer",
      duration: "April 2024 - May 2024",
    },
    {
      company: "JZ Perfumery",
      position: "Freelance Graphic Designer",
      duration: "2021-2023",
    },
    {
      company: "Classic Watch MNL",
      position: "Freelance Logo Designer",
      duration: "February 2022",
    },
    {
      company: "Lufong",
      position: "Freelance Graphic Designer",
      duration: "December 2021 - January 2022",
    },
    {
      company: "Rocket Fuel",
      position: "Freelance Logo Designer",
      duration: "June 2021",
    },
    {
      company: "Next",
      position: "Freelance Video Editor",
      duration: "February 2020 - March 2020",
    },
  ]
};

// Education data
const education = {
  icon: "/assets/resume/cap.svg",
  title: "My Education",
  description: "I'm currently pursuing a Bachelor of Science in Computer Science at Mapúa University in Makati, where I am developing strong technical skills in software development, web development, and data management. This program has also helped me strengthen essential soft skills such as communication, teamwork, leadership, critical thinking, and time management, preparing me for a dynamic career in technology.",
  items: [
    {
      institution: "Mapúa University",
      degree: "Bachelor of Science in Computer Science",
      duration: "2021 - Present",
    },
    {
      institution: "Centro Escolar University",
      degree: "Senior Highschool (STEM strand)",
      duration: "2019 - 2021",
    },
    {
      institution: "College of San Benildo-Rizal",
      degree: "Grade 7 to Grade 10",
      duration: "2015 - 2019",
    },
  ]
};

// Skills data
const skills = {
  title: "My Skills",
  description: "I possess a versatile skill set in both front-end and back-end development, utilizing modern frameworks and programming languages. I am also experienced in design tools and have a solid foundation in database management, software development, and mobile app creation.",
  skillList: [
    {
      icon: <FaHtml5 />,
      name: "html 5",
    },
    {
      icon: <FaCss3 />,
      name: "css 3",
    },
    {
      icon: <FaJs />,
      name: "javascript",
    },
    {
      icon: <FaReact />,
      name: "react.js",
    },
    {
      icon: <SiNextdotjs />,
      name: "next.js",
    },
    {
      icon: <SiTailwindcss />,
      name: "tailwind css",
    },
    {
      icon: <FaNodeJs />,
      name: "node.js",
    },
    {
      icon: <FaFigma />,
      name: "figma",
    },
    {
      icon: <FaWindows />,
      name: "Windows",
    },
    {
      icon: <FaJava />,
      name: "Java",
    },
    {
      icon: <FaPython />,
      name: "Python",
    },
    {
      icon: <FaPhp />,
      name: "PHP",
    },
    {
      icon: <FaAndroid />,
      name: "Android Studio",
    },
    {
      icon: <SiFirebase />,
      name: "Firebase",
    },
    {
      icon: <SiMysql />,
      name: "MySQL",
    },
    {
      icon: <SiCplusplus />,
      name: "C++",
    },
    {
      icon: <SiCsharp />,
      name: "C#",
    },
    {
      icon: <SiCanva />,
      name: "Canva",
    },
    {
      icon: <SiExpo />,
      name: "Expo",
    },
  ]
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.2, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-screen py-12 xl:py-20"
    >
      <div className="container mx-auto px-4">
        <Tabs
          defaultValue="experience"
          className="flex flex-col xl:flex-row gap-12"
        >
          <TabsList className="flex flex-col w-full max-w-[280px] mx-auto xl:mx-0 gap-4 bg-card/40 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
            <TabsTrigger 
              value="experience"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all duration-300"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="education"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all duration-300"
            >
              Education
            </TabsTrigger>
            <TabsTrigger 
              value="skills"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all duration-300"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="about"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all duration-300"
            >
              About Me
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="flex-1 w-full">
            {/* Experience */}
            <TabsContent value="experience" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h3 className="h3 mb-4">{experience.title}</h3>
                  <p className="text-muted-foreground max-w-[700px]">
                    {experience.description}
                  </p>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="relative space-y-8">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-transparent hidden md:block" />
                    
                    {experience.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-0 md:pl-8 group"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-[-4px] top-6 w-[10px] h-[10px] rounded-full bg-primary border-4 border-background hidden md:block group-hover:scale-150 transition-transform" />
                        
                        <div className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                {item.duration}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <p className="text-muted-foreground">{item.company}</p>
                              </div>
                            </div>
                            <h4 className="text-xl font-bold">{item.position}</h4>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h3 className="h3 mb-4">{education.title}</h3>
                  <p className="text-muted-foreground max-w-[700px]">
                    {education.description}
                  </p>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="relative space-y-8">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent via-primary to-transparent hidden md:block" />
                    
                    {education.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-0 md:pl-8 group"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-[-4px] top-6 w-[10px] h-[10px] rounded-full bg-accent border-4 border-background hidden md:block group-hover:scale-150 transition-transform" />
                        
                        <div className="glass p-6 rounded-2xl border border-border/50 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02]">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                                {item.duration}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <p className="text-muted-foreground">{item.institution}</p>
                              </div>
                            </div>
                            <h4 className="text-xl font-bold">{item.degree}</h4>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h3 className="h3 mb-4">{skills.title}</h3>
                  <p className="text-muted-foreground max-w-[700px]">
                    {skills.description}
                  </p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  {skills.skillList.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger className="w-full aspect-square glass rounded-2xl flex justify-center items-center group border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110">
                            <div className="text-4xl md:text-5xl group-hover:text-primary transition-all duration-300 group-hover:scale-110">
                              {skill.icon}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="glass border-primary/50">
                            <p className="capitalize font-medium">{skill.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* About */}
            <TabsContent value="about" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h3 className="h3 mb-4">{about.title}</h3>
                  <p className="text-muted-foreground max-w-[700px] leading-relaxed">
                    {about.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px]">
                  {about.info.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm font-medium">
                          {item.fieldName}
                        </span>
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {item.fieldValue}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Resume;