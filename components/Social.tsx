import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaYoutube, FaTwitter } from "react-icons/fa";

const socials = [
  { icon: <FaGithub />, path: "https://github.com/Dokkai-B?tab=overview&from=2024-09-01&to=2024-09-08" },
  { icon: <FaLinkedinIn />, path: "https://www.linkedin.com/in/carlaguas" },
  // { icon: <FaYoutube />, path: "" },
  // { icon: <FaTwitter />, path: "" },
];

const Social = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => (
        <Link key={index} href={item.path} legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className={iconStyles}>
            {item.icon}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Social;