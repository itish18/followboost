import { Button } from "@/components/ui/button";
import { WaitlistForm } from "@/components/waitlist-form";
import { ArrowRightIcon, CheckCircle2, Clock, MailIcon, Zap } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Never Lose a Client Again
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI-Powered Follow-up Emails that Close More Deals
          </p>
          <div className="max-w-sm mx-auto mb-12">
            <WaitlistForm />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">
                Try Demo
                <ArrowRightIcon size={16} />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Features that Drive Results
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-blue-500" />} 
              title="Automatic Follow-ups" 
              description="Schedule personalized follow-up emails that get sent automatically after client meetings."
            />
            <FeatureCard 
              icon={<MailIcon className="h-10 w-10 text-purple-500" />} 
              title="AI Personalization" 
              description="Our AI analyzes your meeting context to create perfectly tailored follow-up emails."
            />
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-green-500" />} 
              title="Smart Scheduling" 
              description="Send follow-ups at the optimal time to maximize engagement and response rates."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose FollowBoost?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">For Sales Teams</h3>
              <ul className="space-y-3">
                <BenefitItem text="Close more deals with timely follow-ups" />
                <BenefitItem text="Save hours writing personalized emails" />
                <BenefitItem text="Never drop the ball on potential clients" />
                <BenefitItem text="Improve conversion rates by 35%" />
              </ul>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-3">
                <BenefitItem text="Look professional with every interaction" />
                <BenefitItem text="Focus on your work, not admin tasks" />
                <BenefitItem text="Build stronger client relationships" />
                <BenefitItem text="Grow your business with less effort" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card p-8 rounded-lg shadow-sm border transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}