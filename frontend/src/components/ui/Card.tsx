import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${hoverable ? 'hover:shadow-xl transition-shadow duration-300 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 border-b border-gray-200 font-semibold ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 bg-gray-50 border-t border-gray-200 ${className}`}>{children}</div>;
}
