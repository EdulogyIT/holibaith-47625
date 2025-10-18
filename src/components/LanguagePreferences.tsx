import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AVAILABLE_LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'French', label: 'Français' },
  { id: 'Arabic', label: 'العربية' },
  { id: 'Spanish', label: 'Español' },
  { id: 'German', label: 'Deutsch' },
  { id: 'Italian', label: 'Italiano' },
  { id: 'Portuguese', label: 'Português' },
  { id: 'Chinese', label: '中文' },
  { id: 'Japanese', label: '日本語' },
  { id: 'Russian', label: 'Русский' },
  { id: 'Turkish', label: 'Türkçe' },
  { id: 'Dutch', label: 'Nederlands' },
  { id: 'Korean', label: '한국어' },
  { id: 'Polish', label: 'Polski' },
];

const LanguagePreferences = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Arabic']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, [user]);

  const fetchLanguages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('spoken_languages')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data?.spoken_languages) {
        setSelectedLanguages(data.spoken_languages as string[]);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (languageId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId)
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ spoken_languages: selectedLanguages })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success(t('languagesSaved') || 'Languages saved successfully!');
    } catch (error) {
      console.error('Error saving languages:', error);
      toast.error(t('errorSavingLanguages') || 'Failed to save languages');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('languagesYouSpeak')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {AVAILABLE_LANGUAGES.map((language) => (
            <div key={language.id} className="flex items-center space-x-2">
              <Checkbox
                id={language.id}
                checked={selectedLanguages.includes(language.id)}
                onCheckedChange={() => handleToggle(language.id)}
              />
              <label
                htmlFor={language.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {language.label}
              </label>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={saving || selectedLanguages.length === 0}
          className="w-full md:w-auto"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('saveLanguages')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LanguagePreferences;
