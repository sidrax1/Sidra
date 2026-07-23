export interface SearchSuggestion {
  readonly id: string;

 readonly title: string;

 readonly type:
  | "product"
  | "studio"
  | "category"
  | "collection";

 readonly image?: string;

  readonly url: string;
}
