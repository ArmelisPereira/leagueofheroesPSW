import "./Footer.css";

interface FooterProps {
  myName: string;
  projectName: string;
}

export default function Footer({ myName, projectName }: FooterProps) {
  return (
    <footer className="footer">
      {projectName} – Copyright © 2025 por {myName}
    </footer>
  );
}
