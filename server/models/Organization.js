/**
 * Organization Canonical Multi-role Model
 * Standardized according to codex_fixed.txt Section V.
 */

import mongoose from 'mongoose';

export const ORGANIZATION_ROLES = [
  'BUYER',
  'SUPPLIER',
  'FACTORY',
  'INDUSTRIAL_PARK_OPERATOR',
  'ASSOCIATION',
  'SPONSOR',
  'FOUNDING_PARTNER',
  'DEVELOPMENT_PARTNER',
  'ADVISOR',
  'INVESTOR'
];

const organizationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  normalized_name: { type: String, required: true, index: true },
  tax_code: { type: String, default: null, index: { sparse: true } },
  roles: [{ 
    type: String, 
    enum: ORGANIZATION_ROLES,
    required: true,
    index: true 
  }],
  canonical_slug: { type: String, required: true, unique: true, index: true },
  alternate_slugs: [{ type: String, index: true }],
  status: { 
    type: String, 
    enum: ['PUBLISHED', 'DRAFT', 'ARCHIVED'], 
    default: 'PUBLISHED',
    index: true 
  },
  verification_status: { 
    type: String, 
    enum: ['VERIFIED', 'UNVERIFIED', 'PENDING'], 
    default: 'UNVERIFIED',
    index: true 
  },
  is_sponsored: { type: Boolean, default: false },
  profile_completeness: { type: Number, default: 50, min: 0, max: 100 },
  source_provenance: { type: String, default: 'migration' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Compound indexes for high-speed deterministic queries
organizationSchema.index({ status: 1, roles: 1 });
organizationSchema.index({ canonical_slug: 1, status: 1 });

export default mongoose.models.Organization || mongoose.model('Organization', organizationSchema);
