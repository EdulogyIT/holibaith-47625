import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Users, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestsSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function GuestsSelector({ value, onChange, className }: GuestsSelectorProps) {
  const { t } = useLanguage();
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  // Parse the value string into guest counts
  useEffect(() => {
    if (!value) return;
    try {
      const parsed = JSON.parse(value);
      setGuests(parsed);
    } catch {
      // If it's just a number, treat it as total guests (adults)
      const num = parseInt(value);
      if (!isNaN(num)) {
        setGuests({ adults: num, children: 0, infants: 0, pets: 0 });
      }
    }
  }, [value]);

  const updateGuests = (type: keyof GuestCounts, delta: number) => {
    const newGuests = { ...guests, [type]: Math.max(0, guests[type] + delta) };
    setGuests(newGuests);
    onChange(JSON.stringify(newGuests));
  };

  const totalGuests = guests.adults + guests.children;
  
  const displayText = () => {
    if (totalGuests === 0 && guests.infants === 0 && guests.pets === 0) {
      return t('addGuests') || 'Add Guests';
    }
    const parts = [];
    if (totalGuests > 0) parts.push(`${totalGuests} ${totalGuests === 1 ? (t('guest') || 'guest') : (t('guests') || 'guests')}`);
    if (guests.infants > 0) parts.push(`${guests.infants} ${guests.infants === 1 ? (t('infant') || 'infant') : (t('infants') || 'infants')}`);
    if (guests.pets > 0) parts.push(`${guests.pets} ${guests.pets === 1 ? (t('pet') || 'pet') : (t('pets') || 'pets')}`);
    return parts.join(', ');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-inter bg-background border border-input',
            (!totalGuests && !guests.infants && !guests.pets) && 'text-muted-foreground',
            className
          )}
        >
          <Users className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{displayText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-background" align="start">
        <div className="p-4 space-y-4">
          {/* Adults */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">{t('adults') || 'Adults'}</p>
              <p className="text-sm text-muted-foreground">{t('ages13OrAbove') || 'Ages 13 or above'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('adults', -1)}
                disabled={guests.adults === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{guests.adults}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('adults', 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">{t('children') || 'Children'}</p>
              <p className="text-sm text-muted-foreground">{t('ages2To12') || 'Ages 2–12'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('children', -1)}
                disabled={guests.children === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{guests.children}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('children', 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">{t('infants') || 'Infants'}</p>
              <p className="text-sm text-muted-foreground">{t('under2') || 'Under 2'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('infants', -1)}
                disabled={guests.infants === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{guests.infants}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('infants', 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Pets */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">{t('pets') || 'Pets'}</p>
              <button className="text-sm text-muted-foreground underline hover:text-foreground">
                {t('bringingServiceAnimal') || 'Bringing a service animal?'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('pets', -1)}
                disabled={guests.pets === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{guests.pets}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('pets', 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
