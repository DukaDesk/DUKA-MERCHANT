import * as mockApi from "./api";

export const ApiClient = {
  getManifest() {
    return mockApi.getSetupData();
  },

  getTheme() {
    return mockApi.getSetupData();
  },

  getNavigation() {
    return null;
  },

  getScreen() {
    return null;
  },

  getAssetUrl(_tenantId, path) {
    return path;
  },

  getDashboardStats() {
    return mockApi.getDashboardStats();
  },

  getRevenue() {
    return mockApi.getRevenue();
  },

  getActivity() {
    return mockApi.getActivity();
  },

  getProducts() {
    return mockApi.getProducts();
  },

  createProduct(body) {
    return mockApi.createProduct(body);
  },

  updateProduct(id, body) {
    return mockApi.updateProduct(id, body);
  },

  deleteProduct(id) {
    return mockApi.deleteProduct(id);
  },

  getOrders() {
    return mockApi.getOrders();
  },

  updateOrderStatus(id, status) {
    return mockApi.updateOrderStatus(id, status);
  },

  getConversations() {
    return mockApi.getConversations();
  },

  getMessages(conversationId) {
    return mockApi.getMessages(conversationId);
  },

  sendMessage(conversationId, text) {
    return mockApi.sendMessage(conversationId, text);
  },

  getIntegrations() {
    return mockApi.getIntegrations();
  },

  toggleIntegration(name) {
    return mockApi.toggleIntegration(name);
  },

  getCurrentPlan() {
    return mockApi.getCurrentPlan();
  },

  getPlans() {
    return mockApi.getPlans();
  },

  getBillingHistory() {
    return mockApi.getBillingHistory();
  },

  upgradePlan(body) {
    return mockApi.upgradePlan(body);
  },

  getRevenueData() {
    return mockApi.getRevenueData();
  },

  getOrderStats() {
    return mockApi.getOrderStats();
  },

  getScanData() {
    return mockApi.getScanData();
  },

  getTopProducts() {
    return mockApi.getTopProducts();
  },

  getCustomerSplit() {
    return mockApi.getCustomerSplit();
  },

  getMerchantProfile() {
    return mockApi.getMerchantProfile();
  },

  updateMerchantProfile(body) {
    return mockApi.updateMerchantProfile(body);
  },

  login(body) {
    return mockApi.login(body);
  },

  signup(body) {
    return mockApi.signup(body);
  },

  forgotPassword(body) {
    return mockApi.forgotPassword(body);
  },

  deployApp(appData) {
    return mockApi.deployApp(appData);
  },

  getMyApp() {
    return mockApi.getMyApp();
  },

  getSetupData() {
    return mockApi.getSetupData();
  },

  setSetupData(data) {
    return mockApi.setSetupData(data);
  },

  setToken(t) {
    return mockApi.setToken(t);
  },
};

export default ApiClient;
