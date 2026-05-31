/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 120,
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Welcome Message",
      maxLength: 160,
    },
    {
      fieldName: "skyPalette",
      type: "object",
      required: false,
      label: "Sky Palette",
      fields: [
        { fieldName: "zenith", type: "color", required: false, label: "Zenith" },
        { fieldName: "mid", type: "color", required: false, label: "Mid" },
        { fieldName: "horizon", type: "color", required: false, label: "Horizon" },
        { fieldName: "sun", type: "color", required: false, label: "Sun Disc" },
        { fieldName: "fog", type: "color", required: false, label: "Fog Tint" },
      ],
    },
    {
      fieldName: "groundPalette",
      type: "object",
      required: false,
      label: "Ground Palette",
      fields: [
        { fieldName: "grass", type: "color", required: false, label: "Grass" },
        { fieldName: "grassShadow", type: "color", required: false, label: "Grass Shadow" },
        { fieldName: "dirtPath", type: "color", required: false, label: "Dirt Path" },
        { fieldName: "dirtUnderside", type: "color", required: false, label: "Dirt Underside" },
        { fieldName: "pondWater", type: "color", required: false, label: "Pond Water" },
        { fieldName: "rock", type: "color", required: false, label: "Rock" },
      ],
    },
    {
      fieldName: "magicPalette",
      type: "object",
      required: false,
      label: "Magic Palette",
      fields: [
        { fieldName: "crystal", type: "color", required: false, label: "Crystal" },
        { fieldName: "sparkles", type: "color", required: false, label: "Sparkles" },
        { fieldName: "fruit", type: "color", required: false, label: "Fruit" },
        { fieldName: "fruitHighlight", type: "color", required: false, label: "Fruit Highlight" },
      ],
    },
    {
      fieldName: "playerName",
      type: "string",
      required: false,
      label: "Player Name",
      maxLength: 40,
    },
    {
      fieldName: "villagerName",
      type: "string",
      required: false,
      label: "Villager Name",
      maxLength: 40,
    },
    {
      fieldName: "villagerDialogue",
      type: "string",
      required: false,
      label: "Villager Dialogue",
      maxLength: 280,
    },
    {
      fieldName: "mailboxNote",
      type: "string",
      required: false,
      label: "Mailbox Note",
      maxLength: 280,
    },
    {
      fieldName: "questSteps",
      type: "array",
      required: false,
      label: "Quest Steps",
      item: { type: "string", required: true },
    },
    {
      fieldName: "showControlsHint",
      type: "boolean",
      required: false,
      label: "Show Controls Hint",
    },
    {
      fieldName: "showQuestBubble",
      type: "boolean",
      required: false,
      label: "Show Quest Bubble",
    },
    {
      fieldName: "bloomIntensity",
      type: "number",
      required: false,
      label: "Bloom Intensity",
      min: 0,
      max: 3,
    },
    {
      fieldName: "sunIntensity",
      type: "number",
      required: false,
      label: "Sun Intensity",
      min: 0,
      max: 5,
    },
  ],
};
