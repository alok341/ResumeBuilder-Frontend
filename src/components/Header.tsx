import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { 
  FileText, 
  LogOut, 
  User, 
  Crown, 
  ChevronDown, 
  Settings as SettingsIcon,
  Sparkles,
  Menu,
  LayoutDashboard,
  CreditCard
} from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo with light blue from Login page */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg group-hover:shadow-primary/25">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
              Resume<span className="text-primary">Builder</span>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider">ATS-FRIENDLY BUILDER</span>
          </div>
        </Link>

        {/* Right side navigation */}
        <nav className="flex items-center gap-2">
          {/* Settings Icon - Only visible when NOT logged in */}
          {!user && (
            <Link to="/settings">
              <motion.div
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                  title="Settings"
                >
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          )}

          {/* Premium Badge - Only for premium users */}
          {user?.subscriptionPlan === "premium" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
              className="relative mr-1"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 blur-md opacity-50 animate-pulse" />
              <span className="relative flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                <Crown className="h-3 w-3" />
                PRO
                <Sparkles className="h-3 w-3" />
              </span>
            </motion.div>
          )}

          {user ? (
            <>
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-lg hover:bg-primary/10 hover:text-primary transition-all px-4"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-lg hover:bg-primary/10 hover:text-primary transition-all px-4"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pricing
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/pricing")}>
                      <CreditCard className="mr-2 h-4 w-4" /> Pricing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 p-1.5 pl-2 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                  >
                    <div className="relative">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt={user.name}
                          className="h-8 w-8 rounded-lg object-cover ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-md">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-medium text-foreground">{user.name?.split(' ')[0]}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b border-border/50 mb-1">
                    Signed in as
                  </div>
                  <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                    {user.name}
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> 
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" /> 
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> 
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-lg hover:bg-primary/10 hover:text-primary transition-all px-4"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="sm" 
                    className="relative overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all px-5"
                  >
                    <span className="relative z-10">Get Started</span>
                  </Button>
                </motion.div>
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
