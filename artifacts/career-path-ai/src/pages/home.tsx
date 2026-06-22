import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/images/hero.png";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              C
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-primary">
              Career Path AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20">
              Built for Nigerian Students
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[1.1]">
              Find your path.<br />
              <span className="text-secondary">Build your future.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Stop guessing. Get a personalized roadmap, AI coaching, and curated resources to break into tech, finance, and beyond. Designed specifically for the Nigerian context.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video md:aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
              <img 
                src={heroImg} 
                alt="Nigerian students collaborating" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-multiply" />
            </div>
            {/* Floating badges */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <div className="text-sm font-semibold text-primary">Fit Score</div>
              <div className="text-3xl font-bold text-secondary">94%</div>
              <div className="text-xs text-muted-foreground">Frontend Developer</div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-24 mt-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Everything you need to land your first role
              </h2>
              <p className="text-muted-foreground text-lg">
                We've combined AI with localized data to give you practical, actionable advice that actually works in our market.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Matching",
                  description: "Take our interactive assessment to find careers that match your skills, interests, and budget constraints.",
                },
                {
                  title: "Personalized Roadmaps",
                  description: "Get a month-by-month plan showing you exactly what to learn, when to learn it, and free resources to use.",
                },
                {
                  title: "24/7 AI Coach",
                  description: "Stuck on a concept? Need interview tips? Chat with CareerBot anytime for instant, personalized guidance.",
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 text-xl font-bold">
                    0{i + 1}
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full filter blur-3xl opacity-20 -ml-20 -mb-20"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Ready to stop guessing?</h2>
              <p className="text-primary-foreground/80 text-lg mb-10">
                Join thousands of Nigerian students finding clarity and building their future with Career Path AI.
              </p>
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-base text-primary font-bold">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="font-heading font-bold text-primary mb-2">Career Path AI</p>
          <p className="text-sm">Empowering the next generation of African talent.</p>
        </div>
      </footer>
    </div>
  );
}