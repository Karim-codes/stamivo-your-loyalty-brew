import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2, Store, Clock, Coffee, Settings, Shield, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface BusinessSettings {
  business_name: string;
  address: string;
  opening_hours: Record<string, { open: string; close: string; closed: boolean }>;
  is_public: boolean;
}

interface LoyaltySettings {
  allow_multiple_scans: boolean;
  auto_verify: boolean;
  min_scan_interval_minutes: number;
  max_scans_per_day: number;
  require_open_hours: boolean;
  redemption_mode: string;
  qr_expiry_seconds: number;
  pin_expiry_seconds: number;
  max_failed_attempts: number;
  lockout_duration_minutes: number;
}

const defaultHours = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "17:00", closed: false },
  saturday: { open: "10:00", close: "16:00", closed: false },
  sunday: { open: "10:00", close: "16:00", closed: true },
};

const intervalOptions = [
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "1440", label: "24 hours (once per day)" },
];

export default function BusinessProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    business_name: "",
    address: "",
    opening_hours: defaultHours,
    is_public: true,
  });
  
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>({
    allow_multiple_scans: false,
    auto_verify: true,
    min_scan_interval_minutes: 30,
    max_scans_per_day: 10,
    require_open_hours: false,
    redemption_mode: 'both',
    qr_expiry_seconds: 30,
    pin_expiry_seconds: 120,
    max_failed_attempts: 5,
    lockout_duration_minutes: 15,
  });
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", description: "", price: "", category: "Coffee" });

  useEffect(() => {
    if (user) {
      fetchBusinessData();
    }
  }, [user]);

  const fetchBusinessData = async () => {
    try {
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user!.id)
        .single();

      if (businessError) throw businessError;
      
      setBusinessId(business.id);
      setBusinessSettings({
        business_name: business.business_name || "",
        address: business.address || "",
        opening_hours: (business.opening_hours as any) || defaultHours,
        is_public: business.is_public ?? true,
      });

      const { data: loyalty } = await supabase
        .from('loyalty_programs')
        .select('allow_multiple_scans, auto_verify, min_scan_interval_minutes, max_scans_per_day, require_open_hours, redemption_mode, qr_expiry_seconds, pin_expiry_seconds, max_failed_attempts, lockout_duration_minutes')
        .eq('business_id', business.id)
        .single();

      if (loyalty) {
        setLoyaltySettings({
          allow_multiple_scans: loyalty.allow_multiple_scans ?? false,
          auto_verify: loyalty.auto_verify ?? true,
          min_scan_interval_minutes: loyalty.min_scan_interval_minutes ?? 30,
          max_scans_per_day: loyalty.max_scans_per_day ?? 10,
          require_open_hours: loyalty.require_open_hours ?? false,
          redemption_mode: loyalty.redemption_mode ?? 'both',
          qr_expiry_seconds: loyalty.qr_expiry_seconds ?? 30,
          pin_expiry_seconds: loyalty.pin_expiry_seconds ?? 120,
          max_failed_attempts: loyalty.max_failed_attempts ?? 5,
          lockout_duration_minutes: loyalty.lockout_duration_minutes ?? 15,
        });
      }

      const { data: menu } = await supabase
        .from('menu_items')
        .select('*')
        .eq('business_id', business.id)
        .order('display_order');

      if (menu) {
        setMenuItems(menu);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      toast.error("Failed to load business data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!businessId) return;
    
    setSaving(true);
    try {
      const { error: businessError } = await supabase
        .from('businesses')
        .update({
          business_name: businessSettings.business_name,
          address: businessSettings.address,
          opening_hours: businessSettings.opening_hours,
          is_public: businessSettings.is_public,
        })
        .eq('id', businessId);

      if (businessError) throw businessError;

      const { error: loyaltyError } = await supabase
        .from('loyalty_programs')
        .update({
          allow_multiple_scans: loyaltySettings.allow_multiple_scans,
          auto_verify: loyaltySettings.auto_verify,
          min_scan_interval_minutes: loyaltySettings.min_scan_interval_minutes,
          max_scans_per_day: loyaltySettings.max_scans_per_day,
          require_open_hours: loyaltySettings.require_open_hours,
          redemption_mode: loyaltySettings.redemption_mode,
          qr_expiry_seconds: loyaltySettings.qr_expiry_seconds,
          pin_expiry_seconds: loyaltySettings.pin_expiry_seconds,
          max_failed_attempts: loyaltySettings.max_failed_attempts,
          lockout_duration_minutes: loyaltySettings.lockout_duration_minutes,
        })
        .eq('business_id', businessId);

      if (loyaltyError) throw loyaltyError;

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMenuItem = async () => {
    if (!businessId || !newMenuItem.name || !newMenuItem.price) {
      toast.error("Please fill in item name and price");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          business_id: businessId,
          name: newMenuItem.name,
          description: newMenuItem.description,
          price: parseFloat(newMenuItem.price),
          category: newMenuItem.category,
        })
        .select()
        .single();

      if (error) throw error;

      setMenuItems([...menuItems, data]);
      setNewMenuItem({ name: "", description: "", price: "", category: "Coffee" });
      toast.success("Menu item added!");
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error("Failed to add menu item");
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setMenuItems(menuItems.filter(item => item.id !== itemId));
      toast.success("Menu item deleted");
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error("Failed to delete menu item");
    }
  };

  const handleToggleAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: isAvailable })
        .eq('id', itemId);

      if (error) throw error;

      setMenuItems(menuItems.map(item => 
        item.id === itemId ? { ...item, is_available: isAvailable } : item
      ));
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setBusinessSettings(prev => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day],
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/business/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Business Profile</h1>
            <p className="text-muted-foreground">Manage your shop settings</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Business Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Business Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={businessSettings.business_name}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Opening Hours */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Opening Hours</h2>
            </div>
            
            <div className="space-y-3">
              {Object.entries(businessSettings.opening_hours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 flex-wrap">
                  <span className="w-24 capitalize font-medium">{day}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) => updateOpeningHours(day, 'closed', !checked)}
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {hours.closed ? 'Closed' : 'Open'}
                    </span>
                  </div>
                  {!hours.closed && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateOpeningHours(day, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateOpeningHours(day, 'close', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Scan & Stamp Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Scan & Stamp Settings</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Configure how customers collect stamps at your shop
            </p>
            
            <div className="space-y-6">
              {/* Instant Stamps Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Instant Stamps</p>
                  <p className="text-sm text-muted-foreground">
                    Award stamps immediately when customers scan (no staff approval needed)
                  </p>
                </div>
                <Switch
                  checked={loyaltySettings.auto_verify}
                  onCheckedChange={(checked) => setLoyaltySettings(prev => ({ ...prev, auto_verify: checked }))}
                />
              </div>

              {/* Minimum Scan Interval */}
              <div className="space-y-2">
                <Label>Minimum time between scans</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Prevents customers from scanning multiple times in quick succession
                </p>
                <Select
                  value={String(loyaltySettings.min_scan_interval_minutes)}
                  onValueChange={(value) => setLoyaltySettings(prev => ({ 
                    ...prev, 
                    min_scan_interval_minutes: parseInt(value) 
                  }))}
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {intervalOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Max Scans Per Day */}
              <div className="space-y-2">
                <Label htmlFor="max_scans">Maximum stamps per day</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Limit how many stamps a customer can earn per day at your shop
                </p>
                <Input
                  id="max_scans"
                  type="number"
                  min={1}
                  max={50}
                  value={loyaltySettings.max_scans_per_day}
                  onChange={(e) => setLoyaltySettings(prev => ({ 
                    ...prev, 
                    max_scans_per_day: parseInt(e.target.value) || 10 
                  }))}
                  className="w-full md:w-64"
                />
              </div>

              {/* Opening Hours Restriction */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Only allow stamps during opening hours</p>
                  <p className="text-sm text-muted-foreground">
                    Customers can only collect stamps when your shop is open
                  </p>
                </div>
                <Switch
                  checked={loyaltySettings.require_open_hours}
                  onCheckedChange={(checked) => setLoyaltySettings(prev => ({ ...prev, require_open_hours: checked }))}
                />
              </div>
            </div>
          </Card>

          {/* Additional Loyalty Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Additional Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow multiple scans per visit</p>
                  <p className="text-sm text-muted-foreground">
                    Let customers earn multiple stamps in one visit (e.g., for multiple drinks)
                  </p>
                </div>
                <Switch
                  checked={loyaltySettings.allow_multiple_scans}
                  onCheckedChange={(checked) => setLoyaltySettings(prev => ({ ...prev, allow_multiple_scans: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show shop publicly</p>
                  <p className="text-sm text-muted-foreground">Let customers discover your shop in the app</p>
                </div>
                <Switch
                  checked={businessSettings.is_public}
                  onCheckedChange={(checked) => setBusinessSettings(prev => ({ ...prev, is_public: checked }))}
                />
              </div>
            </div>
          </Card>

          {/* Reward Redemption Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Reward Redemption</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Configure how customers redeem their rewards
            </p>
            
            <div className="space-y-6">
              {/* Redemption Mode */}
              <div className="space-y-2">
                <Label>Redemption Method</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  How customers verify their reward at checkout
                </p>
                <Select
                  value={loyaltySettings.redemption_mode}
                  onValueChange={(value) => setLoyaltySettings(prev => ({ 
                    ...prev, 
                    redemption_mode: value 
                  }))}
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">QR Code + PIN (Recommended)</SelectItem>
                    <SelectItem value="qr_only">QR Code Only</SelectItem>
                    <SelectItem value="pin_only">PIN Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* QR Expiry */}
              {(loyaltySettings.redemption_mode === 'qr_only' || loyaltySettings.redemption_mode === 'both') && (
                <div className="space-y-2">
                  <Label>QR Code Expiry Time</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How long the QR code remains valid (shorter = more secure)
                  </p>
                  <Select
                    value={String(loyaltySettings.qr_expiry_seconds)}
                    onValueChange={(value) => setLoyaltySettings(prev => ({ 
                      ...prev, 
                      qr_expiry_seconds: parseInt(value) 
                    }))}
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds (Recommended)</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="120">2 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* PIN Expiry */}
              {(loyaltySettings.redemption_mode === 'pin_only' || loyaltySettings.redemption_mode === 'both') && (
                <div className="space-y-2">
                  <Label>PIN Code Expiry Time</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    How long the PIN remains valid
                  </p>
                  <Select
                    value={String(loyaltySettings.pin_expiry_seconds)}
                    onValueChange={(value) => setLoyaltySettings(prev => ({ 
                      ...prev, 
                      pin_expiry_seconds: parseInt(value) 
                    }))}
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="120">2 minutes (Recommended)</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="600">10 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Security Settings */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium">Security Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Failed Attempts</Label>
                    <p className="text-sm text-muted-foreground">Before lockout</p>
                    <Input
                      type="number"
                      min={3}
                      max={10}
                      value={loyaltySettings.max_failed_attempts}
                      onChange={(e) => setLoyaltySettings(prev => ({ 
                        ...prev, 
                        max_failed_attempts: parseInt(e.target.value) || 5 
                      }))}
                      className="w-full md:w-32"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Lockout Duration</Label>
                    <p className="text-sm text-muted-foreground">Minutes after max attempts</p>
                    <Input
                      type="number"
                      min={5}
                      max={60}
                      value={loyaltySettings.lockout_duration_minutes}
                      onChange={(e) => setLoyaltySettings(prev => ({ 
                        ...prev, 
                        lockout_duration_minutes: parseInt(e.target.value) || 15 
                      }))}
                      className="w-full md:w-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Menu Items */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Menu Items</h2>
            </div>
            
            {/* Add new item */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
              <Input
                placeholder="Item name"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Description"
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Price"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
              />
              <Button onClick={handleAddMenuItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Menu list */}
            <div className="space-y-3">
              {menuItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No menu items yet</p>
              ) : (
                menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                      <p className="text-sm font-semibold text-primary">${(item.price ?? 0).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.is_available}
                          onCheckedChange={(checked) => handleToggleAvailability(item.id, checked)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saving} size="lg">
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}