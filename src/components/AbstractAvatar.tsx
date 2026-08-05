import React from 'react';
import { User, Shield, Briefcase, Cpu } from 'lucide-react';

interface AbstractAvatarProps {
  role?: string;
  size?: number;
  className?: string;
}

const AbstractAvatar: React.FC<AbstractAvatarProps> = ({ role, size = 24, className = "" }) => {
  const getIcon = () => {
    const r = role?.toLowerCase() || "";
    if (r.includes('admin') || r.includes('oracle')) return <Shield size={size} />;
    if (r.includes('recruteur') || r.includes('hr')) return <Briefcase size={size} />;
    if (r.includes('sys') || r.includes('audit')) return <Cpu size={size} />;
    return <User size={size} />;
  };

  return (
    <div className={`flex items-center justify-center rounded-none border border-surface-border bg-surface-section text-text-dim p-1 ${className}`}>
      {getIcon()}
    </div>
  );
};

export default AbstractAvatar;
