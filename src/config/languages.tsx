import { SelectOption } from '@/components/Select/Select';
import {
    SiApache, SiCplusplus, SiSharp, SiCss3,
    SiDart, SiDocker, SiGo, SiGraphql,
    SiHtml5, SiJavascript, SiKotlin,
    SiLua, SiMarkdown, SiMysql, SiPhp,
    SiPython, SiReact, SiRuby, SiRust,
    SiSass, SiSwift, SiTypescript,
    SiVim, SiYaml
} from 'react-icons/si';
import { FaJava } from "react-icons/fa6";
import { IoTerminal } from "react-icons/io5";

export const languages: SelectOption[] = [
  // Web Development
  { value: 'javascript', label: 'JavaScript', icon: <SiJavascript /> },
  { value: 'typescript', label: 'TypeScript', icon: <SiTypescript /> },
  { value: 'jsx', label: 'JSX', icon: <SiReact /> },
  { value: 'tsx', label: 'TSX', icon: <SiReact /> },
  { value: 'html', label: 'HTML', icon: <SiHtml5 /> },
  { value: 'css', label: 'CSS', icon: <SiCss3 /> },
  { value: 'scss', label: 'SCSS', icon: <SiSass /> },

  // Backend Languages
  { value: 'python', label: 'Python', icon: <SiPython /> },
  { value: 'java', label: 'Java', icon: <FaJava  /> },
  { value: 'ruby', label: 'Ruby', icon: <SiRuby /> },
  { value: 'php', label: 'PHP', icon: <SiPhp /> },
  { value: 'go', label: 'Go', icon: <SiGo /> },
  { value: 'rust', label: 'Rust', icon: <SiRust /> },
  { value: 'kotlin', label: 'Kotlin', icon: <SiKotlin /> },
  { value: 'swift', label: 'Swift', icon: <SiSwift /> },
  { value: 'csharp', label: 'C#', icon: <SiSharp /> },
  { value: 'cpp', label: 'C++', icon: <SiCplusplus /> },
  { value: 'dart', label: 'Dart', icon: <SiDart /> },
  { value: 'lua', label: 'Lua', icon: <SiLua /> },

  // Query Languages
  { value: 'sql', label: 'SQL', icon: <SiMysql /> },
  { value: 'mysql', label: 'MySQL', icon: <SiMysql /> },
  { value: 'graphql', label: 'GraphQL', icon: <SiGraphql /> },

  // Configuration & Markup
  { value: 'yaml', label: 'YAML', icon: <SiYaml /> },
  { value: 'markdown', label: 'Markdown', icon: <SiMarkdown /> },
  { value: 'docker', label: 'Dockerfile', icon: <SiDocker /> },
  { value: 'apache', label: 'Apache', icon: <SiApache /> },
  
  // Shell Scripts
  { value: 'bash', label: 'Bash', icon: <IoTerminal /> },
  { value: 'shell', label: 'Shell', icon: <IoTerminal /> },
  { value: 'vim', label: 'Vim', icon: <SiVim /> },
];
