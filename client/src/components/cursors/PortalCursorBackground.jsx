import React from 'react';
import { TubesCursorBg } from './TubesCursorBg';
import { DragonCursorBg } from './DragonCursorBg';
import { ScorpionCursorBg } from './ScorpionCursorBg';
import { SpiderCursorBg } from './SpiderCursorBg';

export const PortalCursorBackground = ({ role = 'restaurant' }) => {
  switch (role) {
    case 'ngo':
      return <DragonCursorBg />;
    case 'volunteer':
      return <ScorpionCursorBg />;
    case 'admin':
      return <SpiderCursorBg />;
    case 'restaurant':
    default:
      return <TubesCursorBg />;
  }
};

export default PortalCursorBackground;
