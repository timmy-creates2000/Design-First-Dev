import { useListCareers } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Briefcase, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Careers() {
  const { data: careers, isLoading } = useListCareers();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const filteredCareers = careers?.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = ["All", ...Array.from(new Set(careers?.map(c => c.category).filter(Boolean)))];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Career Paths</h1>
          <p className="text-muted-foreground">Explore high-demand tech roles and find your fit.</p>
        </div>
        <Link href="/careers/recommendations">
          <Button className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Zap className="w-4 h-4" /> Get Recommendations
          </Button>
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search careers..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {categories.map(cat => (
            <Badge 
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm"
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
            <Card key={i} className="overflow-hidden">
              <div className="h-2 bg-muted w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, i) => (
            <motion.div 
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/careers/${career.id}`}>
                <Card className="h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="h-2 w-full bg-gradient-to-r from-primary/80 to-secondary/80" />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 font-medium">
                        {career.category || "Tech"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {career.difficultyLevel}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{career.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{career.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>Demand: <strong className="text-foreground">{career.demandLevel}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Remote: <strong className="text-foreground">{career.remotePotential}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mt-4 pt-4 border-t">
                        <span className="font-semibold text-foreground">
                          ₦{career.salaryMin.toLocaleString()} - ₦{career.salaryMax.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View details <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
          {filteredCareers.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No careers found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}