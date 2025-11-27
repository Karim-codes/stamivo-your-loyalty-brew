import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, Trash2, Store, Clock, Coffee, Settings } from "lucide-react";
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
      // Fetch business details
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

      // Fetch loyalty program
      const { data: loyalty } = await supabase
        .from('loyalty_programs')
        .select('allow_multiple_scans, auto_verify')
        .eq('business_id', business.id)
        .single();

      if (loyalty) {
        setLoyaltySettings({
          allow_multiple_scans: loyalty.allow_multiple_scans ?? false,
          auto_verify: loyalty.auto_verify ?? true,
        });
      }

      // Fetch menu items
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
      // Update business
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

      // Update loyalty program
      const { error: loyaltyError } = await supabase
        .from('loyalty_programs')
        .update({
          allow_multiple_scans: loyaltySettings.allow_multiple_scans,
          auto_verify: loyaltySettings.auto_verify,
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

          {/* Loyalty Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Loyalty Program Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow multiple scans per visit</p>
                  <p className="text-sm text-muted-foreground">Customers can scan once per visit</p>
                </div>
                <Switch
                  checked={loyaltySettings.allow_multiple_scans}
                  onCheckedChange={(checked) => setLoyaltySettings(prev => ({ ...prev, allow_multiple_scans: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-verify reward redemptions</p>
                  <p className="text-sm text-muted-foreground">Automatically approve when customers redeem</p>
                </div>
                <Switch
                  checked={loyaltySettings.auto_verify}
                  onCheckedChange={(checked) => setLoyaltySettings(prev => ({ ...prev, auto_verify: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show shop publicly on the app</p>
                  <p className="text-sm text-muted-foreground">Let customers discover your shop</p>
                </div>
                <Switch
                  checked={businessSettings.is_public}
                  onCheckedChange={(checked) => setBusinessSettings(prev => ({ ...prev, is_public: checked }))}
                />
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
                      <p className="text-sm font-semibold text-primary">${item.price.toFixed(2)}</p>
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
