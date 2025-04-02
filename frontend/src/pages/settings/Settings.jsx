// src/pages/settings/Settings.jsx
import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Store,
  CreditCard,
  Printer,
  Tag,
  Users,
  Bell,
  Mail,
  ShieldCheck,
  HelpCircle,
  Save,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { useSnackbar } from "notistack";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("store");
  const { enqueueSnackbar } = useSnackbar();

  // Store information settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: "My Retail Store",
    address: "123 Main Street, Anytown, USA",
    phone: "+1 (555) 123-4567",
    email: "contact@myretailstore.com",
    website: "www.myretailstore.com",
    taxRate: 8.5,
    currencySymbol: "$",
    timezone: "America/New_York",
    businessHours: "Mon-Fri: 9am-6pm, Sat: 10am-4pm, Sun: Closed",
    logo: null,
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCreditCard: true,
    acceptMobilePayment: true,
    creditCardProcessor: "Stripe",
    processingFees: true,
    requireSignature: true,
    signatureThreshold: 25,
    enableTipping: true,
    tipPercentages: [10, 15, 20],
  });

  // Receipt settings
  const [receiptSettings, setReceiptSettings] = useState({
    printAutomatically: true,
    includeStoreLogo: true,
    includeStoreInfo: true,
    includeTaxDetails: true,
    includeItemizedList: true,
    includePaymentDetails: true,
    includeReturn: true,
    returnPolicy: "Returns accepted within 30 days with receipt.",
    includeFooter: true,
    footerMessage: "Thank you for shopping with us!",
    emailReceipt: true,
  });

  // Discount settings
  const [discountSettings, setDiscountSettings] = useState({
    allowManualDiscounts: true,
    requireManagerApproval: true,
    managerApprovalThreshold: 20,
    enableCoupons: true,
    enablePromotions: true,
    stackableDiscounts: false,
  });

  // User settings
  const [userSettings, setUserSettings] = useState({
    requireCashierLogin: true,
    cashierIdleTimeout: 15,
    managerOverridePin: true,
    allowEditTransactions: false,
    allowVoidTransactions: true,
    requireReasonForVoid: true,
    recordUserActivity: true,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    lowStockThreshold: 10,
    endOfDayReports: true,
    customerBirthdayReminders: false,
    salesGoalAlerts: true,
  });

  const handleInputChange = (section, e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const inputValue =
      type === "checkbox"
        ? checked
        : type === "number"
        ? parseFloat(value)
        : value;

    // Update the appropriate settings object
    switch (section) {
      case "store":
        setStoreSettings((prev) => ({ ...prev, [name]: inputValue }));
        break;
      case "payment":
        setPaymentSettings((prev) => ({ ...prev, [name]: inputValue }));
        break;
      case "receipt":
        setReceiptSettings((prev) => ({ ...prev, [name]: inputValue }));
        break;
      case "discount":
        setDiscountSettings((prev) => ({ ...prev, [name]: inputValue }));
        break;
      case "user":
        setUserSettings((prev) => ({ ...prev, [name]: inputValue }));
        break;
      case "notification":
        setNotificationSettings((prev) => ({ ...prev, [name]: inputValue }));
        break;
      default:
        break;
    }
  };

  const handleSwitchChange = (section, name, checked) => {
    // Update the appropriate settings object
    switch (section) {
      case "store":
        setStoreSettings((prev) => ({ ...prev, [name]: checked }));
        break;
      case "payment":
        setPaymentSettings((prev) => ({ ...prev, [name]: checked }));
        break;
      case "receipt":
        setReceiptSettings((prev) => ({ ...prev, [name]: checked }));
        break;
      case "discount":
        setDiscountSettings((prev) => ({ ...prev, [name]: checked }));
        break;
      case "user":
        setUserSettings((prev) => ({ ...prev, [name]: checked }));
        break;
      case "notification":
        setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
        break;
      default:
        break;
    }
  };

  const handleSaveSettings = () => {
    // Here we would typically make an API call to save settings
    // For now, we'll just show a success notification
    enqueueSnackbar("Settings saved successfully", { variant: "success" });
  };

  // Setting group component
  const SettingGroup = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  // Setting item component for text/number inputs
  const SettingItem = ({
    label,
    name,
    value,
    type = "text",
    placeholder = "",
    section,
    required = false,
    helpText,
  }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => handleInputChange(section, e)}
        placeholder={placeholder}
        className="max-w-md"
        required={required}
      />
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );

  // Setting item component for toggle/switch inputs
  const ToggleSetting = ({ label, name, checked, section, helpText }) => (
    <div className="flex justify-between items-center">
      <div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {helpText && <p className="text-xs text-gray-500 mt-0.5">{helpText}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(checked) =>
          handleSwitchChange(section, name, checked)
        }
      />
    </div>
  );

  // Combined setting with toggle and conditional input
  const ConditionalSetting = ({
    toggleLabel,
    toggleName,
    toggleChecked,
    inputLabel,
    inputName,
    inputValue,
    inputType = "text",
    inputPlaceholder = "",
    section,
    helpText,
  }) => (
    <div className="space-y-2">
      <ToggleSetting
        label={toggleLabel}
        name={toggleName}
        checked={toggleChecked}
        section={section}
        helpText={helpText}
      />
      {toggleChecked && (
        <div className="ml-6 mt-2">
          <SettingItem
            label={inputLabel}
            name={inputName}
            value={inputValue}
            type={inputType}
            placeholder={inputPlaceholder}
            section={section}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Configure your POS system settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab("store")}
            className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "store"
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Store size={18} />
            <span>Store Information</span>
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "payment"
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <CreditCard size={18} />
            <span>Payment Methods</span>
          </button>

          <button
            onClick={() => setActiveTab("receipt")}
            className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "receipt"
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Printer size={18} />
            <span>Receipt Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("discount")}
            className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "discount"
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Tag size={18} />
            <span>Discounts & Promotions</span>
          </button>

          <button
            onClick={() => setActiveTab("user")}
            className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "user"
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Users size={18} />
            <span>User Permissions</span>
          </button>

          <button
            onClick={() => setActiveTab("notification")}
            className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "notification"
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border p-6">
          {/* Store Information Settings */}
          {activeTab === "store" && (
            <div>
              <div className="flex items-center mb-6">
                <Store size={20} className="text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  Store Information
                </h2>
              </div>

              <SettingGroup title="Business Details">
                <SettingItem
                  label="Store Name"
                  name="storeName"
                  value={storeSettings.storeName}
                  section="store"
                  required
                />

                <SettingItem
                  label="Address"
                  name="address"
                  value={storeSettings.address}
                  section="store"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingItem
                    label="Phone Number"
                    name="phone"
                    value={storeSettings.phone}
                    section="store"
                  />

                  <SettingItem
                    label="Email Address"
                    name="email"
                    type="email"
                    value={storeSettings.email}
                    section="store"
                  />
                </div>

                <SettingItem
                  label="Website"
                  name="website"
                  value={storeSettings.website}
                  section="store"
                />
              </SettingGroup>

              <SettingGroup title="Regional Settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingItem
                    label="Tax Rate (%)"
                    name="taxRate"
                    type="number"
                    value={storeSettings.taxRate}
                    section="store"
                    helpText="Default tax rate applied to sales"
                  />

                  <SettingItem
                    label="Currency Symbol"
                    name="currencySymbol"
                    value={storeSettings.currencySymbol}
                    section="store"
                  />
                </div>

                <SettingItem
                  label="Timezone"
                  name="timezone"
                  value={storeSettings.timezone}
                  section="store"
                />

                <SettingItem
                  label="Business Hours"
                  name="businessHours"
                  value={storeSettings.businessHours}
                  section="store"
                  helpText="Format: Mon-Fri: 9am-6pm, Sat: 10am-4pm, Sun: Closed"
                />
              </SettingGroup>

              <SettingGroup title="Store Branding">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      {storeSettings.logo ? (
                        <img
                          src={storeSettings.logo}
                          alt="Store logo"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Store size={32} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <button className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded text-sm hover:bg-primary-200">
                        Upload Logo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 200x200px. PNG or JPG format.
                      </p>
                    </div>
                  </div>
                </div>
              </SettingGroup>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div>
              <div className="flex items-center mb-6">
                <CreditCard size={20} className="text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Methods
                </h2>
              </div>

              <SettingGroup title="Accepted Payment Types">
                <ToggleSetting
                  label="Accept Cash Payments"
                  name="acceptCash"
                  checked={paymentSettings.acceptCash}
                  section="payment"
                />

                <ToggleSetting
                  label="Accept Credit/Debit Cards"
                  name="acceptCreditCard"
                  checked={paymentSettings.acceptCreditCard}
                  section="payment"
                />

                {paymentSettings.acceptCreditCard && (
                  <div className="ml-6 space-y-4 mt-2">
                    <SettingItem
                      label="Credit Card Processor"
                      name="creditCardProcessor"
                      value={paymentSettings.creditCardProcessor}
                      section="payment"
                      helpText="e.g., Stripe, Square, PayPal"
                    />

                    <ToggleSetting
                      label="Include Processing Fees"
                      name="processingFees"
                      checked={paymentSettings.processingFees}
                      section="payment"
                      helpText="Include credit card processing fees in reports"
                    />
                  </div>
                )}

                <ToggleSetting
                  label="Accept Mobile Payments"
                  name="acceptMobilePayment"
                  checked={paymentSettings.acceptMobilePayment}
                  section="payment"
                  helpText="Apple Pay, Google Pay, etc."
                />
              </SettingGroup>

              <SettingGroup title="Transaction Settings">
                <ConditionalSetting
                  toggleLabel="Require Signature"
                  toggleName="requireSignature"
                  toggleChecked={paymentSettings.requireSignature}
                  inputLabel="Signature Threshold ($)"
                  inputName="signatureThreshold"
                  inputValue={paymentSettings.signatureThreshold}
                  inputType="number"
                  section="payment"
                  helpText="Require signature for transactions above threshold"
                />

                <ConditionalSetting
                  toggleLabel="Enable Tipping"
                  toggleName="enableTipping"
                  toggleChecked={paymentSettings.enableTipping}
                  inputLabel="Default Tip Percentages"
                  inputName="tipPercentages"
                  inputValue={paymentSettings.tipPercentages.join(", ")}
                  section="payment"
                  helpText="Comma-separated list of percentages (e.g., 10, 15, 20)"
                />
              </SettingGroup>
            </div>
          )}

          {/* Receipt Settings */}
          {activeTab === "receipt" && (
            <div>
              <div className="flex items-center mb-6">
                <Printer size={20} className="text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  Receipt Settings
                </h2>
              </div>

              <SettingGroup title="Printing Options">
                <ToggleSetting
                  label="Print Receipt Automatically"
                  name="printAutomatically"
                  checked={receiptSettings.printAutomatically}
                  section="receipt"
                  helpText="Print receipt upon transaction completion"
                />

                <ToggleSetting
                  label="Send Email Receipt"
                  name="emailReceipt"
                  checked={receiptSettings.emailReceipt}
                  section="receipt"
                  helpText="Option to email receipt to customer"
                />
              </SettingGroup>

              <SettingGroup title="Receipt Content">
                <ToggleSetting
                  label="Include Store Logo"
                  name="includeStoreLogo"
                  checked={receiptSettings.includeStoreLogo}
                  section="receipt"
                />

                <ToggleSetting
                  label="Include Store Information"
                  name="includeStoreInfo"
                  checked={receiptSettings.includeStoreInfo}
                  section="receipt"
                  helpText="Show store name, address, phone, etc."
                />

                <ToggleSetting
                  label="Include Tax Details"
                  name="includeTaxDetails"
                  checked={receiptSettings.includeTaxDetails}
                  section="receipt"
                  helpText="Show breakdown of taxes applied"
                />

                <ToggleSetting
                  label="Include Itemized List"
                  name="includeItemizedList"
                  checked={receiptSettings.includeItemizedList}
                  section="receipt"
                  helpText="Show detailed list of all items purchased"
                />

                <ToggleSetting
                  label="Include Payment Details"
                  name="includePaymentDetails"
                  checked={receiptSettings.includePaymentDetails}
                  section="receipt"
                  helpText="Show method of payment and transaction details"
                />

                <ConditionalSetting
                  toggleLabel="Include Return Policy"
                  toggleName="includeReturn"
                  toggleChecked={receiptSettings.includeReturn}
                  inputLabel="Return Policy Text"
                  inputName="returnPolicy"
                  inputValue={receiptSettings.returnPolicy}
                  section="receipt"
                />

                <ConditionalSetting
                  toggleLabel="Include Footer Message"
                  toggleName="includeFooter"
                  toggleChecked={receiptSettings.includeFooter}
                  inputLabel="Footer Message"
                  inputName="footerMessage"
                  inputValue={receiptSettings.footerMessage}
                  section="receipt"
                />
              </SettingGroup>
            </div>
          )}

          {/* Discount Settings */}
          {activeTab === "discount" && (
            <div>
              <div className="flex items-center mb-6">
                <Tag size={20} className="text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  Discounts & Promotions
                </h2>
              </div>

              <SettingGroup title="Discount Options">
                <ConditionalSetting
                  toggleLabel="Allow Manual Discounts"
                  toggleName="allowManualDiscounts"
                  toggleChecked={discountSettings.allowManualDiscounts}
                  inputLabel="Manager Approval Threshold (%)"
                  inputName="managerApprovalThreshold"
                  inputValue={discountSettings.managerApprovalThreshold}
                  inputType="number"
                  section="discount"
                  helpText="Require manager approval for discounts above this percentage"
                />

                <ToggleSetting
                  label="Enable Coupon Codes"
                  name="enableCoupons"
                  checked={discountSettings.enableCoupons}
                  section="discount"
                  helpText="Allow coupon code entry at checkout"
                />

                <ToggleSetting
                  label="Enable Promotional Pricing"
                  name="enablePromotions"
                  checked={discountSettings.enablePromotions}
                  section="discount"
                  helpText="Support for time-based promotional prices"
                />

                <ToggleSetting
                  label="Allow Stackable Discounts"
                  name="stackableDiscounts"
                  checked={discountSettings.stackableDiscounts}
                  section="discount"
                  helpText="Allow multiple discounts to be applied to a single transaction"
                />
              </SettingGroup>
            </div>
          )}

          {/* User Settings */}
          {activeTab === "user" && (
            <div>
              <div className="flex items-center mb-6">
                <Users size={20} className="text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  User Permissions
                </h2>
              </div>

              <SettingGroup title="Access Controls">
                <ConditionalSetting
                  toggleLabel="Require Cashier Login"
                  toggleName="requireCashierLogin"
                  toggleChecked={userSettings.requireCashierLogin}
                  inputLabel="Idle Timeout (minutes)"
                  inputName="cashierIdleTimeout"
                  inputValue={userSettings.cashierIdleTimeout}
                  inputType="number"
                  section="user"
                  helpText="Auto-logout after inactivity"
                />

                <ToggleSetting
                  label="Require Manager PIN for Overrides"
                  name="managerOverridePin"
                  checked={userSettings.managerOverridePin}
                  section="user"
                  helpText="Require PIN entry for manager-level actions"
                />
              </SettingGroup>

              <SettingGroup title="Transaction Controls">
                <ToggleSetting
                  label="Allow Editing Completed Transactions"
                  name="allowEditTransactions"
                  checked={userSettings.allowEditTransactions}
                  section="user"
                  helpText="Enable modification of transactions after completion"
                />

                <ConditionalSetting
                  toggleLabel="Allow Voiding Transactions"
                  toggleName="allowVoidTransactions"
                  toggleChecked={userSettings.allowVoidTransactions}
                  inputLabel="Require Reason for Void"
                  inputName="requireReasonForVoid"
                  inputValue={userSettings.requireReasonForVoid}
                  inputType="checkbox"
                  section="user"
                />

                <ToggleSetting
                  label="Record User Activity Logs"
                  name="recordUserActivity"
                  checked={userSettings.recordUserActivity}
                  section="user"
                  helpText="Track all user actions for audit purposes"
                />
              </SettingGroup>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notification" && (
            <div>
              <div className="flex items-center mb-6">
                <Bell size={20} className="text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  Notifications
                </h2>
              </div>

              <SettingGroup title="Email Notifications">
                <ToggleSetting
                  label="Enable Email Notifications"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  section="notification"
                />

                <ToggleSetting
                  label="Send End-of-Day Reports"
                  name="endOfDayReports"
                  checked={notificationSettings.endOfDayReports}
                  section="notification"
                  helpText="Daily summary of sales and transactions"
                />
              </SettingGroup>

              <SettingGroup title="Inventory Alerts">
                <ConditionalSetting
                  toggleLabel="Low Stock Alerts"
                  toggleName="lowStockAlerts"
                  toggleChecked={notificationSettings.lowStockAlerts}
                  inputLabel="Low Stock Threshold"
                  inputName="lowStockThreshold"
                  inputValue={notificationSettings.lowStockThreshold}
                  inputType="number"
                  section="notification"
                  helpText="Notify when inventory drops below this level"
                />
              </SettingGroup>

              <SettingGroup title="Customer Notifications">
                <ToggleSetting
                  label="Customer Birthday Reminders"
                  name="customerBirthdayReminders"
                  checked={notificationSettings.customerBirthdayReminders}
                  section="notification"
                  helpText="Remind staff of customer birthdays"
                />

                <ToggleSetting
                  label="Sales Goal Alerts"
                  name="salesGoalAlerts"
                  checked={notificationSettings.salesGoalAlerts}
                  section="notification"
                  helpText="Notify when daily/weekly sales goals are met"
                />
              </SettingGroup>
            </div>
          )}

          {/* Save Button - Fixed at bottom */}
          <div className="border-t mt-8 pt-4 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save size={16} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
