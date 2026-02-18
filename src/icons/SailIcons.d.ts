import React from 'react';

export interface IconProps {
  name: string;
  size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  fill?: string;
  className?: string;
}

export const Icon: React.FC<IconProps>;
export const BrandIcon: React.FC<IconProps>;
export const FlagIcon: React.FC<IconProps>;
export const CardIcon: React.FC<IconProps>;
