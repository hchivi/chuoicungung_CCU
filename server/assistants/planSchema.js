import { SUPPI_TOOLS } from '../suppi/toolRegistry.js';

// Constrain generation as well as validating it afterwards. JSON mode alone
// allows plausible but unsupported fields such as slots.unit.
export const ASSISTANT_PLAN_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['mode', 'slots', 'tool', 'answer'],
  properties: {
    mode: { type: 'string', enum: ['SUPPI', 'CHAINY'] },
    answer: { type: 'string', maxLength: 12000 },
    slots: {
      type: 'object', additionalProperties: false,
      description: 'Giữ tiêu chí đã biết. Số lượng kèm đơn vị nằm trong quantity; không thêm trường unit.',
      properties: Object.fromEntries(['query', 'category', 'product_service', 'location', 'quantity', 'deadline', 'specifications', 'certifications'].map(key => [key, { type: ['string', 'null'] }]))
    },
    tool: { anyOf: [
      { type: 'null' },
      ...SUPPI_TOOLS.map(tool => ({
        type: 'object', additionalProperties: false, required: ['name', 'arguments'],
        properties: { name: { type: 'string', enum: [tool.name] }, arguments: tool.parameters }
      }))
    ] }
  }
};
