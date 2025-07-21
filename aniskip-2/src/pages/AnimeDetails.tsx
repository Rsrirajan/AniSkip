import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeDetails, Anime } from "../services/anilist";
import { supabase } from "../lib/supabaseClient";
import AddToListButton from "../components/details/AddToListButton";
import EpisodeList from "../components/details/EpisodeList";

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialStatus, setInitialStatus] = useState<string | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (id) {
      getAnimeDetails(Number(id)).then(response => {
        setAnime(response.Media);
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    const fetchStatus = async () => {
      if (userId && anime) {
        const { data } = await supabase
          .from('user_anime_list')
          .select('status')
          .eq('user_id', userId)
          .eq('anime_id', anime.id)
          .single();
        if (data) {
          setInitialStatus(data.status);
        }
      }
    };
    fetchStatus();
  }, [userId, anime]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!anime) {
    return <div>Anime not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img src={anime.coverImage.large} alt={anime.title.romaji} className="rounded-lg shadow-lg" />
          </div>
          <div className="w-full md:w-2/3 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{anime.title.english || anime.title.romaji}</h1>
            <p className="text-lg text-slate-300 mb-4">{anime.title.native}</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="font-bold text-lg">{anime.format}</div>
              <div>{anime.episodes} episodes</div>
            </div>
            <p className="text-slate-400 mb-6" dangerouslySetInnerHTML={{ __html: anime.description }} />
            {userId && <AddToListButton anime={anime} userId={userId} initialStatus={initialStatus} />}
          </div>
        </div>
        {userId && <EpisodeList anime={anime} userId={userId} />}
      </div>
    </div>
  );
}