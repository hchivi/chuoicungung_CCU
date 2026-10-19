import React from 'react';
import { Link } from 'react-router-dom';
import AssistantDuoStage from './AssistantDuoStage';

export default function SuppiChainyConciseSection() {
  return <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-2 xl:px-4 2xl:px-8"><AssistantDuoStage linkComponent={Link} /></div>;
}
