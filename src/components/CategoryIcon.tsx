import React from "react";
import { 
  Home, 
  Zap, 
  Car, 
  ShoppingCart, 
  Utensils, 
  User, 
  HeartPulse, 
  Shield, 
  CreditCard, 
  PiggyBank, 
  Tv, 
  RefreshCw, 
  Shirt, 
  Package, 
  Gift, 
  Plane, 
  TrendingUp, 
  HelpCircle 
} from "lucide-react";

const IconMap: Record<string, React.ReactNode> = {
  "home": <Home size={18} />,
  "zap": <Zap size={18} />,
  "car": <Car size={18} />,
  "shopping-cart": <ShoppingCart size={18} />,
  "utensils": <Utensils size={18} />,
  "user": <User size={18} />,
  "heart-pulse": <HeartPulse size={18} />,
  "shield": <Shield size={18} />,
  "credit-card": <CreditCard size={18} />,
  "piggy-bank": <PiggyBank size={18} />,
  "tv": <Tv size={18} />,
  "refresh-cw": <RefreshCw size={18} />,
  "shirt": <Shirt size={18} />,
  "package": <Package size={18} />,
  "gift": <Gift size={18} />,
  "plane": <Plane size={18} />,
  "trending-up": <TrendingUp size={18} />,
  "help-circle": <HelpCircle size={18} />
};

interface Props {
  icon: string;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<Props> = ({ icon, size = 18, className }) => {
  const IconComponent = IconMap[icon] || <Package size={size} />;
  
  // If size is different from 18, we need to clone and override
  if (size !== 18) {
    return React.cloneElement(IconComponent as React.ReactElement, { size, className });
  }

  return <span className={className}>{IconComponent}</span>;
};
