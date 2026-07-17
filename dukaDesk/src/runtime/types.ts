export type ActionType =
  /* Navigation */
  | "navigate" | "replace" | "push" | "pop"
  | "switch_screen" | "switch_tenant"
  /* Commerce */
  | "add_to_cart" | "remove_from_cart" | "update_cart_item"
  | "checkout" | "apply_coupon" | "remove_coupon"
  | "cancel_order" | "track_delivery"
  /* Communication */
  | "open_url" | "open_maps" | "call_phone" | "email" | "share" | "download"
  /* Data */
  | "api_request" | "submit_form" | "filter"
  | "data_load" | "data_refresh" | "data_create" | "data_update" | "data_delete"
  | "data_search" | "data_sort" | "data_export" | "data_import"
  /* Forms */
  | "form_validate" | "form_save_draft" | "form_reset" | "form_upload_file"
  /* Auth */
  | "logout"
  | "auth_login" | "auth_refresh_session" | "auth_verify_otp"
  | "auth_change_password" | "auth_request_reset"
  /* Booking */
  | "book_appointment" | "cancel_booking" | "reschedule"
  | "check_availability" | "assign_resource"
  /* Notifications */
  | "send_notification" | "mark_read" | "subscribe" | "unsubscribe"
  /* Device */
  | "capture_photo" | "scan_qr" | "get_location" | "record_audio"
  | "connect_bluetooth" | "read_nfc" | "authenticate_biometric"
  /* Runtime */
  | "runtime_initialize" | "runtime_sync" | "runtime_clear_cache"
  | "runtime_restart" | "runtime_get_status"
  /* Integration */
  | "webhook" | "api_call" | "process_payment"
  | "send_message" | "send_email" | "send_sms" | "send_push";

export interface ActionDef {
  type: ActionType;
  payload?: Record<string, unknown>;
  label?: string;
}

export interface RuntimeNode {
  type: string;
  key?: string;
  props?: Record<string, unknown>;
  actions?: Record<string, ActionDef>;
  children?: RuntimeNode[];
  layout?: LayoutNode;
  visibleWhen?: string;
}

export type LayoutKind = "column" | "row" | "scroll" | "stack" | "grid" | "section";

export interface LayoutNode {
  kind: LayoutKind;
  children?: RuntimeNode[];
  gap?: number;
  padding?: number;
  columns?: number;
  title?: string;
  style?: Record<string, unknown>;
}

export interface ScreenDefinition {
  id?: string;
  name: string;
  backgroundColor?: string;
  layout?: LayoutNode;
  children?: RuntimeNode[];
  bodySections?: SectionDefinition[];
}

export interface SectionDefinition {
  id?: string;
  type: string;
  name?: string;
  backgroundColor?: string;
  components?: RuntimeNode[];
  visibleWhen?: string;
}

export interface NavigationDefinition {
  initialScreen: string;
  tabs: TabDefinition[];
}

export interface TabDefinition {
  id?: string;
  label: string;
  icon?: string;
  screenId: string;
}

export interface ThemeDefinition {
  primaryColor: string;
  secondaryColor?: string;
  logo?: string | null;
  appName?: string;
  category?: string;
}

export interface ManifestDefinition {
  version: string;
  meta: ThemeDefinition;
  navigation: NavigationDefinition;
  shared: {
    header: SectionDefinition;
    footer: SectionDefinition;
  };
  screens: Record<string, ScreenDefinition>;
}

export interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
  fix?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface Release {
  id: string;
  version: string;
  timestamp: string;
  status: "published" | "rolled_back";
  project: ManifestDefinition;
  validationResult?: ValidationResult;
  environment: string;
}
