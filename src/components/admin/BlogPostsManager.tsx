import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewsPost } from "@/types/database/news";
import { Pencil, Trash2, Eye, Search, Plus, AlertTriangle, Linkedin, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function BlogPostsManager() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [permissionError, setPermissionError] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        if (error.message.includes("row-level security policy")) {
          setPermissionError(true);
        }
        throw error;
      }

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Medienmitteilungen konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diese Medienmitteilung löschen möchten?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("news_posts")
        .delete()
        .eq("id", id);

      if (error) {
        if (error.message.includes("row-level security policy")) {
          setPermissionError(true);
          throw new Error("Fehlende Berechtigungen: Sie haben keine Berechtigung, Medienmitteilungen zu löschen.");
        }
        throw error;
      }

      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "Erfolg",
        description: "Medienmitteilung wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Medienmitteilung konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const editPost = (id: string) => {
    navigate(`/admin?tab=news&edit=${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-CH", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShareLinkedIn = (post: NewsPost) => {
    const url = `${window.location.origin}/news/${post.slug}`;
    const title = post.title;
    const summary = post.meta_description || '';
    
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=600');
    
    toast({
      title: "Geteilt",
      description: "Die Medienmitteilung wurde auf LinkedIn geteilt.",
    });
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.meta_keywords && post.meta_keywords.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://placehold.co/100x60?text=Kein+Bild";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alle Medienmitteilungen</h2>
        <Button
          onClick={() => navigate('/admin?tab=news')}
          className="bg-swiss-red hover:bg-swiss-red/90 flex items-center gap-2"
        >
          <Plus size={18} />
          Neue Medienmitteilung erstellen
        </Button>
      </div>

      {permissionError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Fehlende Berechtigungen</AlertTitle>
          <AlertDescription>
            Sie haben keine ausreichenden Berechtigungen, um Medienmitteilungen zu verwalten. 
            Bitte wenden Sie sich an den Administrator, um die erforderlichen Berechtigungen zu erhalten.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative w-full md:max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Medienmitteilungen durchsuchen..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swiss-red"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchQuery 
              ? `Keine Medienmitteilungen für "${searchQuery}" gefunden.` 
              : "Es wurden noch keine Medienmitteilungen erstellt."}
          </p>
          {permissionError && (
            <p className="text-orange-600 mt-2">
              Hinweis: Fehlende Berechtigungen können der Grund sein, warum keine Medienmitteilungen angezeigt werden.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veröffentlicht</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.image_url ? (
                        <img 
                          src={post.image_url} 
                          alt="" 
                          className="h-10 w-10 rounded object-cover mr-3"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No img</span>
                        </div>
                      )}
                      <div className="truncate max-w-xs">{post.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.published_at || post.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="truncate max-w-xs">{post.meta_keywords || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/news/${post.slug}`)}
                      title="Anzeigen"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareLinkedIn(post)}
                      title="Auf LinkedIn teilen"
                    >
                      <Linkedin className="h-4 w-4 text-[#0077b5]" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editPost(post.id)}
                      title="Bearbeiten"
                      disabled={permissionError}
                    >
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                      title="Löschen"
                      disabled={permissionError}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
