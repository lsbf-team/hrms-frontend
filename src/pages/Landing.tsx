import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Comprehensive employee profiles, onboarding, and directory management.',
    },
    {
      icon: Calendar,
      title: 'Attendance Tracking',
      description: 'Real-time attendance marking with geolocation and detailed reporting.',
    },
    {
      icon: FileText,
      title: 'Leave Management',
      description: 'Streamlined leave requests and approval workflows with automatic notifications.',
    },
    {
      icon: DollarSign,
      title: 'Payroll Processing',
      description: 'Automated salary calculations and payslip generation with audit trails.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive insights with exportable reports and visual dashboards.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with JWT authentication, RBAC, and encrypted data.',
    },
  ];

  const benefits = [
    'Role-based access control for Employees and HR Admins',
    'Real-time notifications and updates',
    'Mobile-responsive design for on-the-go access',
    'Dark mode support for comfortable viewing',
    'Automated workflows to reduce manual work',
    'Detailed audit trails for compliance',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-grain"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-6xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              Human Resource Management, Perfected.
            </h1>
            <p className="text-3xl md:text-4xl mb-6 text-primary-foreground/90">
              Every workday, perfectly aligned.
            </p>
            <p className="text-xl mb-12 text-primary-foreground/70 max-w-2xl mx-auto">
              A production-ready Human Resource Management System built for enterprise security, premium UX, and real-world deployment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6 h-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Everything you need to manage your workforce
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for both employees and HR administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="mb-4 p-3 rounded-full bg-accent/10 w-fit">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                Built for modern workplaces
              </h2>
              <p className="text-xl text-muted-foreground">
                Designed with enterprise requirements and user experience in mind
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 p-1 rounded-full bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link to="/signup">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6 h-auto">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grain"></div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <Clock className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              Ready to streamline your HR operations?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/80">
              Join companies already using Dayflow to manage their workforce efficiently and securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6 h-auto">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
              Dayflow HRMS
            </p>
            <p className="text-sm">
              © 2025 Dayflow. All rights reserved.
            </p>
            <p className="text-xs mt-4">
              Built with enterprise security and premium UX in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
