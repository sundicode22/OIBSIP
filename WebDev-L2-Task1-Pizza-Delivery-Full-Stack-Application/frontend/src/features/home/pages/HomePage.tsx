import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  UsersIcon,
  LockClosedIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

export function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Built with React Hook Form + Zod, 70% Dialog modal, minimized Sidebar-07, and Heroicons.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hook Form + Zod</CardTitle>
            <LockClosedIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Validated</div>
            <p className="text-xs text-muted-foreground">All auth & user dialog inputs typed with Zod</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Data Table & Form</CardTitle>
            <TableCellsIcon className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">shadcn Table</div>
            <p className="text-xs text-muted-foreground">Search, sorting & 70% dialog form</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Minimized Sidebar</CardTitle>
            <SparklesIcon className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sidebar-07</div>
            <p className="text-xs text-muted-foreground">Always starts compact with Heroicons</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admin Security</CardTitle>
            <ShieldCheckIcon className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Role Guard</div>
            <p className="text-xs text-muted-foreground">Admin-login & JWT token interceptors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auth & Navigation Shortcuts</CardTitle>
          <CardDescription>
            Direct links to test React Hook Form & Zod schema validation across all endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link to="/users">
              <UsersIcon className="h-4 w-4" />
              Open Users Table & Dialog
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/login">
              User Login Form
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/admin-login">
              Admin Login Form
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/register">
              Register Form
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/forgot-password">
              Forgot Password Form
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
