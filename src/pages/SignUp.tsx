import { API_URL } from '@/config';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const passwordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;
    if (/\d/.test(pass)) strength += 25;
    if (/[^a-zA-Z\d]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthLabel = strength === 0 ? '' : strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong';
  const strengthColor = strength <= 25 ? 'bg-destructive' : strength <= 50 ? 'bg-warning' : strength <= 75 ? 'bg-info' : 'bg-success';

  const handleNext = () => {
    if (step === 1 && !username) {
      toast.error('Please enter your User Name ');
      return;
    }
    if (step === 2 && !email) {
      toast.error('Please enter your email');
      return;
    }
    if (step === 3 && (!password || strength < 50)) {
      toast.error('Please use a stronger password');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Account created! Please sign in.');
      navigate('/signin');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grain"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-primary-foreground">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              Dayflow
            </h1>
            <p className="text-2xl mb-4 text-primary-foreground/90">
              Join your team today.
            </p>
            <p className="text-lg text-primary-foreground/70">
              Get started with secure, efficient workforce management in minutes.
            </p>
          </div>
        </div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk' }}>
              Dayflow
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>
              Create your account
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-2">
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="e.g., john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact your HR admin if you don't have a User Name
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-2">
                  <Label htmlFor="password">Create password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Password strength</span>
                        <span className={`font-medium ${strength >= 75 ? 'text-success' : strength >= 50 ? 'text-info' : 'text-warning'}`}>
                          {strengthLabel}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strengthColor}`}
                          style={{ width: `${strength}%` }}
                        />
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {password.length >= 8 ? <Check className="h-3 w-3 text-success" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />}
                          <span>At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/[a-z]/.test(password) && /[A-Z]/.test(password) ? <Check className="h-3 w-3 text-success" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />}
                          <span>Uppercase and lowercase letters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/\d/.test(password) ? <Check className="h-3 w-3 text-success" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />}
                          <span>At least one number</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-3">
                  <Label>Select your role</Label>
                  <RadioGroup value={role} onValueChange={(v) => setRole(v as 'employee' | 'admin')}>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="employee" id="employee" />
                      <Label htmlFor="employee" className="flex-1 cursor-pointer">
                        <div className="font-medium">Employee</div>
                        <div className="text-sm text-muted-foreground">Access your profile, attendance, and leave management</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin" className="flex-1 cursor-pointer">
                        <div className="font-medium">HR Admin</div>
                        <div className="text-sm text-muted-foreground">Full access to employee management and analytics</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 h-12"
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 bg-accent hover:bg-accent/90"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 h-12 bg-accent hover:bg-accent/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
