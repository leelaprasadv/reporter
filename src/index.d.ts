export type ExtensionName = 'report-portal-analysis' | 'hyperlink';
export type Hook = 'start' | 'end';
export type Condition = 'pass' | 'fail' | 'passOrFail';

export interface ReportPortalAnalysisInputs {
  url: string;
  api_key: string;
  project: string;
  launch_id: string;
}

export interface HyperlinkInputs {
  links: Link[];
}

export interface Extension {
  name: ExtensionName;
  condition?: Condition;
  hook?: Hook;
  inputs?: ReportPortalAnalysisInputs | HyperlinkInputs;
}

export interface Link {
  text: string;
  url: string;
}

export type TargetName = 'slack' | 'teams' | 'custom';
export type PublishReportType = 'test-summary' | 'test-summary-slim' | 'failure-details';

export interface SlackInputs {
  url: string;
  publish?: PublishReportType;
  only_failures?: boolean;
  title?: string;
  title_suffix?: string;
}

export interface TeamsInputs {
  url: string;
  publish?: PublishReportType;
  only_failures?: boolean;
  title?: string;
  title_suffix?: string;
}

export interface Target {
  name: TargetName;
  condition: Condition;
  inputs: SlackInputs | TeamsInputs;
  extensions?: Extension[];
}

export interface PublishResult {
  type: string;
  files: string[];
}

export interface PublishReport {
  targets: Target[];
  results: PublishResult[];
}

export interface PublishConfig {
  reports: PublishReport[];
}

export interface PublishOptions {
  config: string | PublishConfig;
}

export function publish(options: PublishOptions): Promise<any>