import {
  getDashboardStats, getRevenue, getActivity,
  getProducts, createProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus,
  getConversations, getMessages, sendMessage,
  getIntegrations, toggleIntegration,
  getCurrentPlan, getPlans, getBillingHistory, upgradePlan,
  getRevenueData, getOrderStats, getTopProducts,
  getMerchantProfile, updateMerchantProfile,
  login, signup, forgotPassword,
  deployApp, getMyApp, getSetupData, setSetupData, setToken,
} from "./api";

export const ApiClient = {
  getManifest: getSetupData,
  getTheme: getSetupData,
  getNavigation: () => null,
  getScreen: () => null,
  getAssetUrl: (_tenantId, path) => path,
  getDashboardStats, getRevenue, getActivity,
  getProducts, createProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus,
  getConversations, getMessages, sendMessage,
  getIntegrations, toggleIntegration,
  getCurrentPlan, getPlans, getBillingHistory, upgradePlan,
  getRevenueData, getOrderStats, getTopProducts,
  getMerchantProfile, updateMerchantProfile,
  login, signup, forgotPassword,
  deployApp, getMyApp,
  getSetupData, setSetupData, setToken,
};

export default ApiClient;
