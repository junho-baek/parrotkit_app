export type TrackingAutoContext = {
  page_path?: string;
  auth_user_id?: string;
  landing_page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  first_touch_landing_page?: string;
  first_touch_referrer?: string;
  first_touch_utm_source?: string;
  first_touch_utm_medium?: string;
  first_touch_utm_campaign?: string;
  first_touch_utm_content?: string;
  first_touch_utm_term?: string;
  first_touch_gclid?: string;
  first_touch_fbclid?: string;
  first_touch_ttclid?: string;
};

type CommonPayload = {
  event_category?: string;
  event_label?: string;
};

type MoneyPayload = {
  plan_name?: string;
  plan_price?: number;
  value?: number;
  currency?: string;
};

export type ClientEventPayloadMap = {
  signup_start: CommonPayload;
  signup_success: { method: string };
  login: { method: string };
  onboarding_complete: CommonPayload & {
    interests_count: number;
    interests: string;
  };
  reference_submitted: CommonPayload & {
    source_url: string;
    platform?: string;
    video_id?: string;
  };
  recipe_generated: {
    source_url?: string;
    platform?: string;
    video_id?: string;
    scenes_count: number;
  };
  recipe_saved: {
    recipe_id: string;
    captured_count?: number;
  };
  view_pricing: CommonPayload & {
    page_title: string;
    plan_count: number;
  };
  begin_checkout: CommonPayload &
    MoneyPayload & {
      plan_name: string;
      plan_price: number;
      value: number;
      currency: string;
    };
  purchase_success: {
    plan_name: string;
    value: number;
    currency: string;
  };
  select_free_plan: CommonPayload &
    MoneyPayload & {
      plan_name: string;
      plan_price: number;
      value: number;
      currency: string;
    };
  select_interest: CommonPayload & { interest_name: string };
  deselect_interest: CommonPayload & { interest_name: string };
  tab_home_click: CommonPayload;
  tab_explore_click: CommonPayload;
  tab_paste_click: CommonPayload;
  tab_recipes_click: CommonPayload;
  tab_my_click: CommonPayload;
  view_home_tab: CommonPayload & { page_title: string };
  view_explore_tab: CommonPayload & { page_title: string };
  view_my_tab: CommonPayload & { page_title: string };
  view_recipes_tab: CommonPayload & { page_title: string };
  view_submit_video_page: CommonPayload & { page_title: string };
  view_interests_page: CommonPayload & { page_title: string };
  click_signin_home: CommonPayload;
  click_signup_home: CommonPayload;
  recipe_reopened: { recipe_id: string };
  like_trending_reference: CommonPayload & { reference_id: number };
  capture_uploaded: { recipe_id: string; scene_id: number };
  export_zip_success: { recipe_id: string };
  promo_modal_cta_click: CommonPayload & { discount_percentage: string };
  promo_modal_close: CommonPayload;
};

export type ClientEventName = keyof ClientEventPayloadMap;
export type ClientEventPayload<TEventName extends ClientEventName> = ClientEventPayloadMap[TEventName];
export type ClientEventPayloadWithContext<TEventName extends ClientEventName> =
  ClientEventPayloadMap[TEventName] & TrackingAutoContext;

export const STANDARD_EVENT_NAMES = [
  'signup_start',
  'signup_success',
  'login',
  'onboarding_complete',
  'reference_submitted',
  'recipe_generated',
  'recipe_saved',
  'view_pricing',
  'begin_checkout',
  'purchase_success',
  'select_free_plan',
  'select_interest',
  'deselect_interest',
  'tab_home_click',
  'tab_explore_click',
  'tab_paste_click',
  'tab_recipes_click',
  'tab_my_click',
  'view_home_tab',
  'view_explore_tab',
  'view_my_tab',
  'view_recipes_tab',
  'view_submit_video_page',
  'view_interests_page',
  'click_signin_home',
  'click_signup_home',
  'recipe_reopened',
  'like_trending_reference',
  'capture_uploaded',
  'export_zip_success',
  'promo_modal_cta_click',
  'promo_modal_close',
] as const satisfies readonly ClientEventName[];

export function isClientEventName(value: string): value is ClientEventName {
  return (STANDARD_EVENT_NAMES as readonly string[]).includes(value);
}
