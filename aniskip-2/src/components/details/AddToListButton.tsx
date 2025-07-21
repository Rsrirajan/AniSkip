import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Anime } from '../../services/anilist';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface AddToListButtonProps {
  anime: Anime;
  userId: string;
  initialStatus?: string;
}

const AddToListButton: React.FC<AddToListButtonProps> = ({ anime, userId, initialStatus }) => {
  const [status, setStatus] = useState(initialStatus || 'Add to List');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const { error } = await supabase.from('user_anime_list').upsert({
      user_id: userId,
      anime_id: anime.id,
      status: newStatus,
      title: anime.title.romaji,
      image_url: anime.coverImage.large,
    }, { onConflict: 'user_id, anime_id' });

    if (!error) {
      setStatus(newStatus);
    } else {
      console.error('Error updating status:', error);
    }
    setLoading(false);
  };

  const statuses = ["Watching", "Completed", "Paused", "Dropped", "Plan to Watch"];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md">
          {status} <ChevronDown size={16} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-gray-800 text-white rounded-md shadow-lg">
        {statuses.map(s => (
          <DropdownMenu.Item
            key={s}
            onSelect={() => handleStatusChange(s)}
            className="px-4 py-2 hover:bg-blue-500 cursor-pointer"
          >
            {s}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AddToListButton;