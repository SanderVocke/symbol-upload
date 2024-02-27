import { OptionDefinition as ArgDefinition } from "command-line-args";
import { Section, OptionDefinition as UsageDefinition } from "command-line-usage";
export declare type CommandLineDefinition = ArgDefinition & UsageDefinition;
export declare const argDefinitions: Array<CommandLineDefinition>;
export declare const usageDefinitions: Array<Section>;
