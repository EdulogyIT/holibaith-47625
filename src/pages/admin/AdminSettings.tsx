import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import {
  Settings,
  Bell,
  Percent,
  Save
} from 'lucide-react';

export default function AdminSettings() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Platform settings
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'Holibayt',
    contactEmail: 'support@holibayt.com',
    defaultLanguage: 'en',
    enableRegistration: true,
    enablePropertySubmission: true,
    requireEmailVerification: true,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newPropertyAlerts: true,
    newUserAlerts: true,
    bookingAlerts: true,
    messageAlerts: true,
  });

  // Commission settings
  const [commissionSettings, setCommissionSettings] = useState({
    shortStayRate: 15,
    rentRate: 15,
    buyRate: 15,
  });
  const [loadingCommission, setLoadingCommission] = useState(false);

  useEffect(() => {
    fetchCommissionSettings();
  }, []);

  const fetchCommissionSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['short_stay_commission_rate', 'rent_commission_rate', 'buy_commission_rate']);

      if (error) throw error;

      if (data) {
        const settings: any = {
          shortStayRate: 15,
          rentRate: 15,
          buyRate: 15,
        };

        data.forEach((item: any) => {
          if (item.setting_key === 'short_stay_commission_rate' && item.setting_value?.rate) {
            settings.shortStayRate = item.setting_value.rate * 100;
          } else if (item.setting_key === 'rent_commission_rate' && item.setting_value?.rate) {
            settings.rentRate = item.setting_value.rate * 100;
          } else if (item.setting_key === 'buy_commission_rate' && item.setting_value?.rate) {
            settings.buyRate = item.setting_value.rate * 100;
          }
        });

        setCommissionSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching commission settings:', error);
    }
  };

  const handlePlatformSave = () => {
    // In a real app, this would save to database
    toast({
      title: 'Success',
      description: 'Platform settings saved successfully',
    });
  };

  const handleNotificationSave = () => {
    // In a real app, this would save to database
    toast({
      title: 'Success',
      description: 'Notification settings saved successfully',
    });
  };

  const handleCommissionSave = async () => {
    try {
      setLoadingCommission(true);

      const updates = [
        {
          setting_key: 'short_stay_commission_rate',
          setting_value: { rate: commissionSettings.shortStayRate / 100 },
        },
        {
          setting_key: 'rent_commission_rate',
          setting_value: { rate: commissionSettings.rentRate / 100 },
        },
        {
          setting_key: 'buy_commission_rate',
          setting_value: { rate: commissionSettings.buyRate / 100 },
        },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('platform_settings')
          .upsert(
            {
              setting_key: update.setting_key,
              setting_value: update.setting_value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'setting_key' }
          );

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Commission rates saved successfully',
      });
    } catch (error) {
      console.error('Error saving commission settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save commission settings',
        variant: 'destructive',
      });
    } finally {
      setLoadingCommission(false);
    }
  };

  return (
    <div className={cn("space-y-6", isMobile && "space-y-4")}>
      <div>
        <h1 className={cn("font-bold text-foreground", isMobile ? "text-2xl" : "text-3xl")}>
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage platform configuration and preferences
        </p>
      </div>

      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Platform Settings
          </CardTitle>
          <CardDescription>
            Configure general platform settings and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={platformSettings.siteName}
              onChange={(e) =>
                setPlatformSettings({ ...platformSettings, siteName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={platformSettings.contactEmail}
              onChange={(e) =>
                setPlatformSettings({ ...platformSettings, contactEmail: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <select
              id="defaultLanguage"
              value={platformSettings.defaultLanguage}
              onChange={(e) =>
                setPlatformSettings({ ...platformSettings, defaultLanguage: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register on the platform
                </p>
              </div>
              <Switch
                checked={platformSettings.enableRegistration}
                onCheckedChange={(checked) =>
                  setPlatformSettings({ ...platformSettings, enableRegistration: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Property Submission</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to submit properties
                </p>
              </div>
              <Switch
                checked={platformSettings.enablePropertySubmission}
                onCheckedChange={(checked) =>
                  setPlatformSettings({ ...platformSettings, enablePropertySubmission: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Users must verify email before accessing platform
                </p>
              </div>
              <Switch
                checked={platformSettings.requireEmailVerification}
                onCheckedChange={(checked) =>
                  setPlatformSettings({ ...platformSettings, requireEmailVerification: checked })
                }
              />
            </div>
          </div>

          <Button onClick={handlePlatformSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Platform Settings
          </Button>
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Percent className="h-5 w-5 mr-2" />
            Commission Rates
          </CardTitle>
          <CardDescription>
            Set platform commission rates for different property categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shortStayRate">Short-Stay Commission Rate (%)</Label>
            <Input
              id="shortStayRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={commissionSettings.shortStayRate}
              onChange={(e) =>
                setCommissionSettings({ ...commissionSettings, shortStayRate: parseFloat(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-muted-foreground">
              Commission rate for short-stay rental bookings
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rentRate">Long-Term Rent Commission Rate (%)</Label>
            <Input
              id="rentRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={commissionSettings.rentRate}
              onChange={(e) =>
                setCommissionSettings({ ...commissionSettings, rentRate: parseFloat(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-muted-foreground">
              Commission rate for long-term rental properties
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyRate">Property Purchase Commission Rate (%)</Label>
            <Input
              id="buyRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={commissionSettings.buyRate}
              onChange={(e) =>
                setCommissionSettings({ ...commissionSettings, buyRate: parseFloat(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-muted-foreground">
              Commission rate for property sales
            </p>
          </div>

          <Button onClick={handleCommissionSave} className="w-full" disabled={loadingCommission}>
            <Save className="h-4 w-4 mr-2" />
            {loadingCommission ? 'Saving...' : 'Save Commission Rates'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure admin notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for admin activities
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Property Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new properties are submitted
              </p>
            </div>
            <Switch
              checked={notificationSettings.newPropertyAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, newPropertyAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New User Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new users register
              </p>
            </div>
            <Switch
              checked={notificationSettings.newUserAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, newUserAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Booking Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new bookings
              </p>
            </div>
            <Switch
              checked={notificationSettings.bookingAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, bookingAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Message Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new messages
              </p>
            </div>
            <Switch
              checked={notificationSettings.messageAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, messageAlerts: checked })
              }
            />
          </div>

          <Button onClick={handleNotificationSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
