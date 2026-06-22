import { useState } from "react";
import { useListResources } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ExternalLink, PlayCircle, FileText, BookOpen, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function Resources() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const { data: resources, isLoading } = useListResources({});

  const filteredResources = resources?.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.relatedSkill.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = ["All", ...Array.from(new Set(resources?.map(r => r.category).filter(Boolean)))];

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'course': return <BookOpen className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Resource Library</h1>
        <p className="text-muted-foreground">Curated free and premium learning materials.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search by title or skill..." 
            className="pl-10 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none items-center">
          {categories.map(cat => (
            <Badge 
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
              onClick={() => setCategoryFilter(cat as string)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full flex flex-col hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      {resource.type}
                    </Badge>
                    {resource.isFree ? (
                      <Badge className="bg-green-500 hover:bg-green-600 border-none">Free</Badge>
                    ) : (
                      <Badge variant="outline">Paid</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2 leading-tight">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex gap-2">
                      {getIcon(resource.type)} {resource.title}
                    </a>
                  </CardTitle>
                  <CardDescription>{resource.provider}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" /> {resource.relatedSkill}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {resource.estimatedDuration}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Access Resource <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          {filteredResources.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}